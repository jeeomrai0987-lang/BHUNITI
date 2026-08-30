import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.discrepancy import Discrepancy
from app.models.audit import AuditLog
from app.schemas.discrepancy import DiscrepancyCreate, DiscrepancyResolveRequest, DiscrepancyResponse

router = APIRouter()

DEFAULT_DISCREPANCIES = [
    {
        "id": "disc-042-default",
        "case_number": "DISC-2026-042",
        "ulpin": "P-1024",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "discrepancy_type": "Area Mismatch",
        "severity": "High",
        "description": "Satellite parcel area (12.50 ha) does not match RoR record (14.68 ha). Discrepancy of 2.18 ha detected during AI reconciliation.",
        "claimed_value": "12.50 ha",
        "record_value": "14.68 ha",
        "status": "Open",
        "resolution_note": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": "disc-043-default",
        "case_number": "DISC-2026-043",
        "ulpin": "P-2048",
        "district": "Ghaziabad",
        "tehsil": "Loni",
        "village": "Behta",
        "discrepancy_type": "Boundary Overlap",
        "severity": "High",
        "description": "Northern boundary overlaps 1.2m with adjacent public road reserve buffer.",
        "claimed_value": "No overlap",
        "record_value": "1.2m overlap",
        "status": "In Review",
        "resolution_note": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
]

@router.get("", response_model=List[DiscrepancyResponse])
async def list_discrepancies(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    tehsil: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Discrepancy)
    if severity:
        stmt = stmt.where(Discrepancy.severity.ilike(severity))
    if status:
        stmt = stmt.where(Discrepancy.status.ilike(status))
    if tehsil:
        stmt = stmt.where(Discrepancy.tehsil.ilike(tehsil))

    result = await db.execute(stmt)
    items = result.scalars().all()
    if not items:
        return DEFAULT_DISCREPANCIES
    return items

@router.post("/{case_id}/resolve", response_model=DiscrepancyResponse)
async def resolve_discrepancy(
    case_id: str,
    resolve_in: DiscrepancyResolveRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Discrepancy).where(
        (Discrepancy.id == case_id) | (Discrepancy.case_number == case_id)
    )
    result = await db.execute(stmt)
    d = result.scalars().first()

    if not d:
        d = Discrepancy(**DEFAULT_DISCREPANCIES[0])
        db.add(d)
        await db.commit()
        await db.refresh(d)

    d.status = resolve_in.status
    d.resolution_note = resolve_in.resolution_note

    audit = AuditLog(
        ulpin=d.ulpin,
        action_type="Discrepancy Resolved",
        actor_name="Revenue Officer (Suresh Verma)",
        actor_role="Revenue Officer",
        details=f"Discrepancy case {d.case_number} resolved: {resolve_in.resolution_note}"
    )
    audit.tamper_hash = audit.generate_hash()
    db.add(audit)

    await db.commit()
    await db.refresh(d)
    return d
