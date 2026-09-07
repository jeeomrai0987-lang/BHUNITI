"""Load the ten contiguous Modinagar cadastral parcels the GIS screens plot.

These are the parcels ``bhuniti-react/src/components/ParcelMapViewer.jsx`` draws
as a Bhunaksha-style sheet (ULPIN ``09-0824-0014-1024`` .. ``-1033``). They are a
separate demo surface from the three-parcel open case file in ``db/seed.py``, so
both scripts can be run, in either order, against the same database.

Fixed here relative to the prototype version of this file:

  * It never called ``init_models()``, so running it first against a fresh
    database (or the SQLite fallback) failed on a missing ``parcels`` table.
  * It never disposed the engine, leaving the asyncpg pool to be torn down by
    interpreter shutdown.
  * A re-run logged "Updated existing parcel" for all ten rows even when nothing
    had changed, which made it impossible to see what a run actually did.
  * ``encumbrance_status`` was ``"Title Transfer Pending (MUT-2023-8941)"`` -- a
    case number inside a status value, so it could never be a translatable
    label. The status is now ``"Title Transfer Pending"``; the case number lives
    on the linked application, where it belongs.
  * Ten rows entered the registry with no audit provenance at all. Every insert
    and every field change now appends a hash-chained entry via
    ``append_audit``.
  * ``datetime``, ``timezone``, ``Base`` and ``async_engine`` were imported and
    never used (``async_engine`` is used now, to dispose it).

Usage
-----
    python db/seed_10_parcels.py              # insert or update, then report
    python db/seed_10_parcels.py --dry-run    # print the plan, write nothing
"""
import argparse
import asyncio
import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Sequence

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import func, select  # noqa: E402

from app.core.audit_trail import append_audit  # noqa: E402
from app.core.database import AsyncSessionLocal, async_engine, init_models  # noqa: E402
from app.models.audit import AuditLog  # noqa: E402
from app.models.parcel import Parcel  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("seed_10_parcels")

# Fields quoted in the audit entry, so the trail says what changed without
# carrying a copy of every polygon coordinate.
AUDITED_FIELDS: Sequence[str] = (
    "owner_name",
    "area_ha",
    "land_type",
    "verification_status",
    "encumbrance_status",
)

# 10 contiguous Ghaziabad (Modinagar / Sikandrabad) cadastral parcels.
# land_type / verification_status / encumbrance_status are stored in English and
# translated at read time (app/i18n/locales/*.json), so every value used here
# has to exist in the matching label catalog.
GHAZIABAD_10_PARCELS: Sequence[Dict[str, Any]] = [
    {
        "ulpin": "09-0824-0014-1024",
        "survey_number": "142/B",
        "khasra_number": "412/1",
        "khata_number": "89",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Rahul Sharma",
        "co_owners_json": json.dumps(["Sunita Sharma (Spouse - 50%)"]),
        "land_type": "Agricultural (Zamin)",
        "area_ha": 2.00,
        "area_sqm": 20000.0,
        "valuation_inr": 4800000.0,
        "centroid_lat": 28.8350,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8340], [77.5840, 28.8340], [77.5840, 28.8360], [77.5810, 28.8360], [77.5810, 28.8340]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1025",
        "survey_number": "142/C",
        "khasra_number": "412/2",
        "khata_number": "90",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Sunita Devi & Ramesh Chand",
        "co_owners_json": json.dumps(["Ramesh Chand (Brother)"]),
        "land_type": "Agricultural (Zamin)",
        "area_ha": 1.45,
        "area_sqm": 14500.0,
        "valuation_inr": 3480000.0,
        "centroid_lat": 28.8350,
        "centroid_lng": 77.5852,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8340], [77.5865, 28.8340], [77.5865, 28.8360], [77.5840, 28.8360], [77.5840, 28.8340]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1026",
        "survey_number": "143/A",
        "khasra_number": "413",
        "khata_number": "91",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Rajesh Kumar",
        "co_owners_json": json.dumps(["Vikas Kumar (Son)"]),
        "land_type": "Agricultural (Fasli)",
        "area_ha": 14.68,
        "area_sqm": 146800.0,
        "valuation_inr": 22000000.0,
        "centroid_lat": 28.8327,
        "centroid_lng": 77.5837,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8315], [77.5865, 28.8315], [77.5865, 28.8340], [77.5810, 28.8340], [77.5810, 28.8315]]]
        }),
        "verification_status": "Under Verification",
        "is_disputed": True,
        "dispute_reason": "Claimed 12.50 ha vs Registered RoR 14.68 ha (-2.18 ha mismatch under Case M-2026-018)",
        "encumbrance_status": "Under Mutation Review",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1027",
        "survey_number": "144/1",
        "khasra_number": "414",
        "khata_number": "92",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Manoj Tyagi",
        "co_owners_json": json.dumps([]),
        "land_type": "Commercial / Warehouse",
        "area_ha": 3.40,
        "area_sqm": 34000.0,
        "valuation_inr": 18500000.0,
        "centroid_lat": 28.8372,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8360], [77.5840, 28.8360], [77.5840, 28.8385], [77.5810, 28.8385], [77.5810, 28.8360]]]
        }),
        "verification_status": "Disputed",
        "is_disputed": True,
        "dispute_reason": "Northern boundary overlap of 1.2m with public road reservation buffer",
        "encumbrance_status": "Boundary Notice Issued",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1028",
        "survey_number": "145/GS",
        "khasra_number": "415/1",
        "khata_number": "1",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Gram Sabha (Government Land)",
        "co_owners_json": json.dumps(["Revenue Department, UP"]),
        "land_type": "Pasture / Charnot (Public)",
        "area_ha": 5.80,
        "area_sqm": 58000.0,
        "valuation_inr": 31000000.0,
        "centroid_lat": 28.8375,
        "centroid_lng": 77.5860,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8360], [77.5880, 28.8360], [77.5880, 28.8390], [77.5840, 28.8390], [77.5840, 28.8360]]]
        }),
        "verification_status": "Verified (Govt)",
        "is_disputed": False,
        "encumbrance_status": "Protected State Land",
        "image_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1029",
        "survey_number": "146/AB",
        "khasra_number": "415/2",
        "khata_number": "104",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Dr. Arvind Mishra",
        "co_owners_json": json.dumps(["Pooja Mishra (Co-owner)"]),
        "land_type": "Residential / Abadi",
        "area_ha": 0.85,
        "area_sqm": 8500.0,
        "valuation_inr": 12750000.0,
        "centroid_lat": 28.8395,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8385], [77.5840, 28.8385], [77.5840, 28.8405], [77.5810, 28.8405], [77.5810, 28.8385]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1030",
        "survey_number": "147/W",
        "khasra_number": "416",
        "khata_number": "2",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Irrigation Canal & Water Reserve",
        "co_owners_json": json.dumps(["UP Irrigation Department"]),
        "land_type": "Water Body / Canal Nala",
        "area_ha": 1.20,
        "area_sqm": 12000.0,
        "valuation_inr": 6000000.0,
        "centroid_lat": 28.8337,
        "centroid_lng": 77.5872,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5865, 28.8315], [77.5880, 28.8315], [77.5880, 28.8360], [77.5865, 28.8360], [77.5865, 28.8315]]]
        }),
        "verification_status": "Verified (Govt)",
        "is_disputed": False,
        "encumbrance_status": "Protected Water Reserve",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1031",
        "survey_number": "148/1",
        "khasra_number": "417",
        "khata_number": "118",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Amit Choudhary & Brothers",
        "co_owners_json": json.dumps(["Deepak Choudhary (33%)", "Rohit Choudhary (33%)"]),
        "land_type": "Agricultural (Fasli)",
        "area_ha": 4.10,
        "area_sqm": 41000.0,
        "valuation_inr": 9840000.0,
        "centroid_lat": 28.8402,
        "centroid_lng": 77.5860,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8390], [77.5880, 28.8390], [77.5880, 28.8415], [77.5840, 28.8415], [77.5840, 28.8390]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1032",
        "survey_number": "149/B",
        "khasra_number": "418",
        "khata_number": "125",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Balram Singh",
        "co_owners_json": json.dumps([]),
        "land_type": "Horticulture / Bagh (Mango Orchard)",
        "area_ha": 2.75,
        "area_sqm": 27500.0,
        "valuation_inr": 7425000.0,
        "centroid_lat": 28.8415,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8405], [77.5840, 28.8405], [77.5840, 28.8425], [77.5810, 28.8425], [77.5810, 28.8405]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1033",
        "survey_number": "150/1",
        "khasra_number": "419",
        "khata_number": "132",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Priya Sharma (Transferee)",
        "co_owners_json": json.dumps([]),
        "land_type": "Agricultural (Zamin)",
        "area_ha": 1.95,
        "area_sqm": 19500.0,
        "valuation_inr": 4680000.0,
        "centroid_lat": 28.8425,
        "centroid_lng": 77.5860,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8415], [77.5880, 28.8415], [77.5880, 28.8435], [77.5840, 28.8435], [77.5840, 28.8415]]]
        }),
        "verification_status": "Action Required (Mutation)",
        "is_disputed": False,
        # The prototype stored "Title Transfer Pending (MUT-2023-8941)" here. The
        # case number is on the application; a status value has to stay a status
        # value or it can never be looked up in a label catalog.
        "encumbrance_status": "Title Transfer Pending",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
]

def _changed_fields(existing: Parcel, record: Dict[str, Any]) -> Dict[str, tuple]:
    """``{field: (old, new)}`` for the values that differ from the row on disk.

    Floats are compared with a tolerance because a round trip through Postgres
    ``double precision`` (or SQLite's REAL) can come back as 2.0000000000000004,
    which would otherwise report a change on every run forever.
    """
    changes: Dict[str, tuple] = {}
    for field, new_value in record.items():
        old_value = getattr(existing, field, None)
        if isinstance(new_value, float) and isinstance(old_value, (int, float)):
            if abs(float(old_value) - new_value) <= 1e-9 * max(1.0, abs(new_value)):
                continue
        elif old_value == new_value:
            continue
        changes[field] = (old_value, new_value)
    return changes


def _audit_state(source: Any) -> Dict[str, Any]:
    """The handful of fields worth quoting in the audit entry."""
    if isinstance(source, dict):
        return {field: source.get(field) for field in AUDITED_FIELDS}
    return {field: getattr(source, field, None) for field in AUDITED_FIELDS}


async def _chain_timestamp(session, offset: int) -> datetime:
    """A timestamp guaranteed to sit at or after the tip of the audit chain.

    ``verify_chain`` orders entries by timestamp, so an entry written *before* an
    existing one would be reported as a broken link even though nothing was
    tampered with. ``db/seed.py`` deliberately writes a 2023-dated trail for its
    case file, so this script -- which may run either before or after it -- takes
    the later of "now" and "one second past the newest entry".
    """
    newest = await session.scalar(select(func.max(AuditLog.timestamp)))
    now = datetime.now(timezone.utc)
    if newest is not None:
        if newest.tzinfo is None:  # SQLite hands back naive datetimes
            newest = newest.replace(tzinfo=timezone.utc)
        now = max(now, newest + timedelta(seconds=1))
    return now + timedelta(microseconds=offset)


class Report:
    """Counts what a run did, so a second run visibly does nothing."""

    def __init__(self) -> None:
        self.inserted: List[str] = []
        self.updated: List[str] = []
        self.unchanged: List[str] = []

    def print(self, dry_run: bool) -> None:
        verb = "would be" if dry_run else ""
        logger.info("")
        logger.info("  inserted  %2d %s", len(self.inserted), verb)
        logger.info("  updated   %2d %s", len(self.updated), verb)
        logger.info("  unchanged %2d", len(self.unchanged))
        if self.inserted:
            logger.info("  new: %s", ", ".join(self.inserted))
        for line in self.updated:
            logger.info("  changed: %s", line)


async def seed_parcels(session, report: Report, dry_run: bool) -> None:
    """Insert or update the ten parcels, keyed on ULPIN, and audit every write."""
    audit_offset = 0
    for record in GHAZIABAD_10_PARCELS:
        record = dict(record)
        ulpin = record["ulpin"]
        existing = (
            await session.execute(select(Parcel).where(Parcel.ulpin == ulpin))
        ).scalars().first()

        if existing is None:
            parcel = Parcel(**record)
            report.inserted.append(f"{ulpin} (Khasra {record['khasra_number']})")
            if dry_run:
                continue
            session.add(parcel)
            await session.flush()  # assigns parcel.id for the audit entry
            await append_audit(
                session,
                action_type="Record Digitized",
                actor_name="Cadastral Bulk Import",
                actor_role="System",
                details=(
                    f"Parcel {ulpin} (Khasra {record['khasra_number']}, "
                    f"{record['area_ha']} ha) loaded from the {record['village']} "
                    f"cadastral sheet."
                ),
                ulpin=ulpin,
                parcel_id=parcel.id,
                new_state=_audit_state(record),
                timestamp=await _chain_timestamp(session, audit_offset),
            )
            audit_offset += 1
            continue

        changes = _changed_fields(existing, record)
        if not changes:
            report.unchanged.append(ulpin)
            continue

        report.updated.append(f"{ulpin}: {', '.join(sorted(changes))}")
        if dry_run:
            continue
        old_state = _audit_state(existing)
        for field, (_, new_value) in changes.items():
            setattr(existing, field, new_value)
        await append_audit(
            session,
            action_type="Record Corrected",
            actor_name="Cadastral Bulk Import",
            actor_role="System",
            details=(
                f"Parcel {ulpin} reconciled against the cadastral sheet; "
                f"updated {', '.join(sorted(changes))}."
            ),
            ulpin=ulpin,
            parcel_id=existing.id,
            old_state=old_state,
            new_state=_audit_state(existing),
            timestamp=await _chain_timestamp(session, audit_offset),
        )
        audit_offset += 1


async def run(args: argparse.Namespace) -> int:
    if args.dry_run:
        logger.info("Dry run: nothing will be written.")
    else:
        logger.info("Creating any missing tables...")
        await init_models()

    report = Report()
    try:
        async with AsyncSessionLocal() as session:
            await seed_parcels(session, report, args.dry_run)
            if args.dry_run:
                await session.rollback()
            else:
                await session.commit()
        report.print(args.dry_run)
    finally:
        await async_engine.dispose()

    if args.dry_run and (report.inserted or report.updated):
        logger.info("")
        logger.info("Re-run without --dry-run to apply.")
    return 0


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Seed the ten Modinagar cadastral parcels used by the GIS screens.",
        epilog="Keyed on ULPIN, so re-running only writes rows that actually differ.",
    )
    parser.add_argument("--dry-run", action="store_true", help="print the plan, write nothing")
    return parser.parse_args(argv)


def main(argv: Sequence[str]) -> int:
    try:
        return asyncio.run(run(parse_args(argv)))
    except KeyboardInterrupt:
        logger.info("Interrupted; the open transaction was rolled back.")
        return 130


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
