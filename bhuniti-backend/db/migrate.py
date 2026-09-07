"""Additive schema migrations for BHUNITI -- safe on Postgres and on SQLite.

The previous version dropped every table (``DROP TABLE ... CASCADE``) before
applying ``schema.sql``, so running it against a populated registry destroyed the
data, including the append-only audit trail. This one is additive: it creates
what is missing, adds the columns the models gained, creates missing indexes,
normalises the legacy display-string dates ("Oct 24, 2023", "Pending") into real
dates, and only drops anything when you explicitly pass ``--fresh --yes``.

Usage
-----
    python db/migrate.py                 # apply pending changes
    python db/migrate.py --dry-run       # print the plan, change nothing
    python db/migrate.py --seal-audit    # re-chain pre-existing audit rows
    python db/migrate.py --fresh --yes    # DESTRUCTIVE: drop and recreate
"""
import argparse
import asyncio
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import inspect, text  # noqa: E402
from sqlalchemy.schema import CreateIndex  # noqa: E402

import app.models  # noqa: F401,E402  (registers every table on Base.metadata)
from app.core.config import settings  # noqa: E402
from app.core.database import IS_SQLITE, Base, async_engine  # noqa: E402
from app.core.dates import parse_legacy_date  # noqa: E402
from app.models.audit import GENESIS_HASH, AuditLog  # noqa: E402

# Columns that held display strings ("Oct 24, 2023") in the prototype.
LEGACY_DATE_COLUMNS: Dict[str, Tuple[str, ...]] = {
    "applications": (
        "submission_date",
        "verified_date",
        "survey_date",
        "ro_review_date",
        "completion_date",
    ),
    "mutations": ("submission_date",),
    "surveys": ("scheduled_date", "completed_date"),
}

# Drop order for --fresh (children before parents).
DROP_ORDER: Sequence[str] = (
    "audit_logs",
    "documents",
    "surveys",
    "discrepancies",
    "mutations",
    "applications",
    "ref_translations",
    "parcels",
    "users",
)


class Plan:
    """Collects what happened (or would happen) so the run prints one summary."""

    def __init__(self, dry_run: bool) -> None:
        self.dry_run = dry_run
        self.steps: List[str] = []

    def record(self, message: str) -> None:
        self.steps.append(message)
        print(("  would " if self.dry_run else "  ") + message)

    def report(self) -> None:
        print()
        if not self.steps:
            print("Nothing to do -- the schema already matches the models.")
        elif self.dry_run:
            print(f"{len(self.steps)} change(s) pending. Re-run without --dry-run to apply.")
        else:
            print(f"Applied {len(self.steps)} change(s).")


def _quote(name: str) -> str:
    return f'"{name}"'


def _literal(value) -> str:
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def _default_sql(column) -> str:
    """SQL literal for a column default, or ``""`` when there is none."""
    if column.server_default is not None:
        arg = column.server_default.arg
        raw = str(getattr(arg, "text", arg))
        stripped = raw.strip()
        if stripped.startswith("'") or stripped.upper() in ("TRUE", "FALSE", "NULL"):
            return stripped
        try:
            float(stripped)
            return stripped
        except ValueError:
            return _literal(stripped)
    default = column.default
    if default is not None and not default.is_callable and default.arg is not None:
        return _literal(default.arg)
    return ""


async def _row_count(conn, table: str) -> int:
    return int(await conn.scalar(text(f"SELECT COUNT(*) FROM {_quote(table)}")) or 0)


async def create_missing_tables(conn, plan: Plan) -> None:
    existing = set(await conn.run_sync(lambda sync_conn: inspect(sync_conn).get_table_names()))
    missing = [name for name in Base.metadata.tables if name not in existing]
    for name in missing:
        plan.record(f"create table {name}")
    if missing and not plan.dry_run:
        await conn.run_sync(Base.metadata.create_all)


async def add_missing_columns(conn, plan: Plan) -> None:
    """``ALTER TABLE ... ADD COLUMN`` for every column the models gained."""
    inspector_tables = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    for name, table in Base.metadata.tables.items():
        if name not in inspector_tables:
            continue
        present = {
            column["name"]
            for column in await conn.run_sync(lambda c, n=name: inspect(c).get_columns(n))
        }
        for column in table.columns:
            if column.name in present:
                continue
            type_sql = column.type.compile(dialect=conn.dialect)
            default_sql = _default_sql(column)
            clause = f"{_quote(column.name)} {type_sql}"
            if default_sql:
                clause += f" DEFAULT {default_sql}"
            if not column.nullable:
                if default_sql or await _row_count(conn, name) == 0:
                    clause += " NOT NULL"
                else:
                    plan.record(
                        f"add {name}.{column.name} as NULLable (no default available for a "
                        f"NOT NULL column on a table that already has rows)"
                    )
            plan.record(f"add column {name}.{column.name} ({type_sql})")
            if not plan.dry_run:
                await conn.execute(text(f"ALTER TABLE {_quote(name)} ADD COLUMN {clause}"))


async def create_missing_indexes(conn, plan: Plan) -> None:
    """``create_all`` skips existing tables, so new indexes need doing by hand."""
    table_names = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    for name, table in Base.metadata.tables.items():
        if name not in table_names or not table.indexes:
            continue
        existing = {
            index["name"]
            for index in await conn.run_sync(lambda c, n=name: inspect(c).get_indexes(n))
        }
        columns = {
            column["name"]
            for column in await conn.run_sync(lambda c, n=name: inspect(c).get_columns(n))
        }
        for index in table.indexes:
            if index.name in existing:
                continue
            if not {column.name for column in index.columns} <= columns:
                continue  # the column add above was skipped; nothing to index yet
            plan.record(f"create index {index.name} on {name}")
            if not plan.dry_run:
                await conn.execute(CreateIndex(index))


async def normalise_date_values(conn, plan: Plan) -> None:
    """Rewrite legacy date strings as ISO dates, and placeholders as NULL."""
    table_names = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    for table, columns in LEGACY_DATE_COLUMNS.items():
        if table not in table_names:
            continue
        present = {
            column["name"]: column["type"]
            for column in await conn.run_sync(lambda c, n=table: inspect(c).get_columns(n))
        }
        for column in columns:
            if column not in present:
                continue
            if "DATE" in str(present[column]).upper() and "CHAR" not in str(present[column]).upper():
                continue  # already a real date column
            rows = (
                await conn.execute(
                    text(
                        f"SELECT id, {_quote(column)} FROM {_quote(table)} "
                        f"WHERE {_quote(column)} IS NOT NULL"
                    )
                )
            ).all()
            changes = []
            for row_id, raw in rows:
                parsed = parse_legacy_date(raw)
                iso = parsed.isoformat() if parsed else None
                if iso != (str(raw) if raw is not None else None):
                    changes.append({"row_id": row_id, "value": iso})
            if not changes:
                continue
            plan.record(f"normalise {len(changes)} value(s) in {table}.{column}")
            if plan.dry_run:
                continue
            for change in changes:
                await conn.execute(
                    text(
                        f"UPDATE {_quote(table)} SET {_quote(column)} = :value WHERE id = :row_id"
                    ),
                    change,
                )


async def tighten_date_types(conn, plan: Plan) -> None:
    """Postgres only: turn the normalised VARCHAR columns into real ``date``.

    SQLite is left alone on purpose. Its column types are advisory (type
    affinity), the values are already ISO after ``normalise_date_values``, and
    SQLAlchemy hands back ``datetime.date`` for them, so a full table rebuild
    would buy nothing.
    """
    if IS_SQLITE:
        return
    table_names = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    for table, columns in LEGACY_DATE_COLUMNS.items():
        if table not in table_names:
            continue
        present = {
            column["name"]: str(column["type"]).upper()
            for column in await conn.run_sync(lambda c, n=table: inspect(c).get_columns(n))
        }
        for column in columns:
            type_name = present.get(column)
            if type_name is None or "CHAR" not in type_name:
                continue
            plan.record(f"convert {table}.{column} from {type_name.lower()} to date")
            if plan.dry_run:
                continue
            await conn.execute(
                text(
                    f"ALTER TABLE {_quote(table)} ALTER COLUMN {_quote(column)} "
                    f"TYPE date USING NULLIF(TRIM({_quote(column)}), '')::date"
                )
            )


def _as_datetime(value):
    """SQLite hands timestamps back as strings; the hash needs a real datetime."""
    if isinstance(value, datetime) or value is None:
        return value
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


AUDIT_HASH_FIELDS = (
    "id",
    "parcel_id",
    "ulpin",
    "action_type",
    "actor_name",
    "actor_role",
    "details",
    "old_state_json",
    "new_state_json",
    "timestamp",
)


async def seal_audit_chain(conn, plan: Plan) -> None:
    """Re-chain rows written before the hash chain existed. Opt-in only.

    Rows inserted by the prototype have no ``prev_hash``/``tamper_hash``, so
    ``/audit/verify`` reports a break at the first of them -- which is the
    honest answer: nothing proves those rows are untouched. Sealing them makes
    the chain verify again, so it is deliberately *not* part of a normal run;
    you have to ask for it with ``--seal-audit``.
    """
    table_names = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    if "audit_logs" not in table_names:
        return
    columns = ", ".join(_quote(name) for name in AUDIT_HASH_FIELDS)
    rows = (
        await conn.execute(
            text(
                f"SELECT {columns}, prev_hash, tamper_hash FROM audit_logs "
                f"ORDER BY timestamp ASC, id ASC"
            )
        )
    ).all()
    prev_hash = GENESIS_HASH
    resealed = 0
    for row in rows:
        entry = AuditLog()
        for index, field in enumerate(AUDIT_HASH_FIELDS):
            setattr(entry, field, _as_datetime(row[index]) if field == "timestamp" else row[index])
        expected = entry.compute_hash(prev_hash)
        if row.prev_hash != prev_hash or row.tamper_hash != expected:
            resealed += 1
            if not plan.dry_run:
                await conn.execute(
                    text(
                        "UPDATE audit_logs SET prev_hash = :prev, tamper_hash = :hash "
                        "WHERE id = :row_id"
                    ),
                    {"prev": prev_hash, "hash": expected, "row_id": entry.id},
                )
        prev_hash = expected
    if resealed:
        plan.record(f"re-chain {resealed} of {len(rows)} audit row(s)")


async def drop_all(conn, plan: Plan) -> None:
    """The old behaviour, now behind ``--fresh --yes``. Destroys the audit trail."""
    existing = set(await conn.run_sync(lambda c: inspect(c).get_table_names()))
    for table in DROP_ORDER:
        if table not in existing:
            continue
        plan.record(f"DROP TABLE {table}")
        if plan.dry_run:
            continue
        suffix = "" if IS_SQLITE else " CASCADE"
        await conn.execute(text(f"DROP TABLE IF EXISTS {_quote(table)}{suffix}"))
    for table in sorted(existing - set(DROP_ORDER)):
        print(f"  leaving unmanaged table {table} alone")


async def run(args: argparse.Namespace) -> int:
    plan = Plan(args.dry_run)
    backend = "SQLite" if IS_SQLITE else "PostgreSQL"
    print(f"BHUNITI schema migration -- {backend} ({settings.ENVIRONMENT})")
    if args.dry_run:
        print("Dry run: nothing will be written.\n")
    else:
        print()

    async with async_engine.begin() as conn:
        if args.fresh:
            await drop_all(conn, plan)
        await create_missing_tables(conn, plan)
        await add_missing_columns(conn, plan)
        await create_missing_indexes(conn, plan)
        await normalise_date_values(conn, plan)
        await tighten_date_types(conn, plan)
        if args.seal_audit:
            await seal_audit_chain(conn, plan)

    plan.report()
    if not args.fresh and not args.seal_audit:
        print(
            "Pre-existing audit rows keep their original (missing) hashes, so "
            "/audit/verify will report a break before the first chained entry. "
            "Run with --seal-audit to re-chain them."
        )
    await async_engine.dispose()
    return 0


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Apply additive schema changes to the BHUNITI database.",
        epilog="Without --fresh this never drops a table and never deletes a row.",
    )
    parser.add_argument("--dry-run", action="store_true", help="print the plan, change nothing")
    parser.add_argument(
        "--seal-audit",
        action="store_true",
        help="re-hash pre-existing audit rows so the chain verifies (see the docstring)",
    )
    parser.add_argument(
        "--fresh",
        action="store_true",
        help="DESTRUCTIVE: drop every managed table first (requires --yes)",
    )
    parser.add_argument("--yes", action="store_true", help="confirm --fresh")
    return parser.parse_args(argv)


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    if args.fresh and not (args.yes or args.dry_run):
        print(
            "--fresh drops every table, including the append-only audit trail. "
            "Re-run with --fresh --yes if that is really what you want, or use "
            "--fresh --dry-run to see the list first.",
            file=sys.stderr,
        )
        return 2
    try:
        return asyncio.run(run(args))
    except KeyboardInterrupt:
        print("\nInterrupted; the open transaction was rolled back.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))






