"""Hash-chained audit trail helpers.

The previous implementation hashed ``self.id`` before the row was flushed (so it
hashed ``None``) and always used a genesis ``prev_hash``, which meant the
"tamper-proof" trail was neither chained nor reproducible. Everything that
writes an audit entry now goes through :func:`append_audit`, and
:func:`verify_chain` can re-derive the whole chain to prove nothing was edited.
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import GENESIS_HASH, AuditLog

# Rows are chained in this order; ``id`` breaks timestamp ties deterministically.
_CHAIN_ORDER = (AuditLog.timestamp, AuditLog.id)

# Account role -> canonical English actor_role stored in the trail.
_ROLE_TO_ACTOR_ROLE = {
    "citizen": "Citizen",
    "revenue_officer": "Revenue Officer",
    "district_officer": "District Officer",
    "surveyor": "Surveyor",
}


def actor_from_user(user: Any) -> tuple:
    """``(actor_name, actor_role)`` for the signed-in account.

    Falls back to ``("System", "System")`` for anonymous calls instead of the
    hardcoded officer name the endpoints used to write into every entry.
    """
    if user is None:
        return "System", "System"
    name = getattr(user, "full_name", None) or getattr(user, "username", None) or "System"
    role = _ROLE_TO_ACTOR_ROLE.get(getattr(user, "role", "") or "", "System")
    return name, role


def _as_json(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, str):
        return value
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


async def _last_hash(db: AsyncSession) -> str:
    for obj in reversed(list(db.new)):
        if isinstance(obj, AuditLog) and getattr(obj, "tamper_hash", None):
            return obj.tamper_hash

    stmt = select(AuditLog.tamper_hash).order_by(*(column.desc() for column in _CHAIN_ORDER)).limit(1)
    previous = await db.scalar(stmt)
    return previous or GENESIS_HASH


async def append_audit(
    db: AsyncSession,
    *,
    action_type: str,
    actor_name: str,
    actor_role: str,
    details: str,
    ulpin: Optional[str] = None,
    parcel_id: Optional[str] = None,
    old_state: Any = None,
    new_state: Any = None,
    timestamp: Optional[datetime] = None,
) -> AuditLog:
    """Append one entry, linked to the current tip of the chain.

    ``action_type``/``actor_role`` are stored in English (the canonical values in
    ``app/i18n/locales/en.json``) and translated at read time, so the stored
    trail stays comparable no matter which language wrote it.

    ``timestamp`` defaults to now and only exists for the seeder, which needs to
    write a trail with believable historical dates. Pass increasing values: the
    chain is ordered by timestamp, so an out-of-order entry would make
    :func:`verify_chain` report a break that is not really tampering.
    """
    entry = AuditLog(
        id=str(uuid.uuid4()),
        parcel_id=parcel_id,
        ulpin=ulpin,
        action_type=action_type,
        actor_name=actor_name,
        actor_role=actor_role,
        details=details,
        old_state_json=_as_json(old_state),
        new_state_json=_as_json(new_state),
        timestamp=timestamp or datetime.now(timezone.utc),
    )
    prev_hash = await _last_hash(db)
    entry.prev_hash = prev_hash
    entry.tamper_hash = entry.compute_hash(prev_hash)
    db.add(entry)
    return entry


async def verify_chain(db: AsyncSession, limit: Optional[int] = None) -> dict:
    """Recompute every hash and report the first entry that does not match."""
    stmt = select(AuditLog).order_by(*_CHAIN_ORDER)
    if limit:
        stmt = stmt.limit(limit)
    entries = (await db.execute(stmt)).scalars().all()

    expected_prev = GENESIS_HASH
    for position, entry in enumerate(entries, start=1):
        recomputed = entry.compute_hash(entry.prev_hash or GENESIS_HASH)
        broken_link = (entry.prev_hash or GENESIS_HASH) != expected_prev
        if entry.tamper_hash != recomputed or broken_link:
            return {
                "intact": False,
                "entries_checked": len(entries),
                "broken_at_position": position,
                "broken_entry_id": entry.id,
                "reason": "prev_hash does not match the preceding entry"
                if broken_link
                else "stored tamper_hash does not match recomputed hash",
            }
        expected_prev = entry.tamper_hash or GENESIS_HASH

    return {
        "intact": True,
        "entries_checked": len(entries),
        "broken_at_position": None,
        "broken_entry_id": None,
        "reason": None,
    }
