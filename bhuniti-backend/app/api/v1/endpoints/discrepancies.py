"""Discrepancy (reconciliation) cases.

``DEFAULT_DISCREPANCIES`` used to stand in for an empty table, and resolving an
unknown case inserted that first demo row -- which then failed with an
IntegrityError on the next attempt because ``case_number`` is unique. Both are
gone: the list is honest and resolve returns a real 404.
"""
from datetime import datetime, timezone
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale, require_role
from app.core.audit_trail import actor_from_user, append_audit
from app.core.database import get_db
from app.core.i18n import label, t
from app.core.localize import DISCREPANCY_LABELS, localize, localize_many
from app.models.discrepancy import Discrepancy
from app.models.notification import Notification
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.discrepancy import (
    DiscrepancyCreate,
    DiscrepancyResolveRequest,
    DiscrepancyResponse,
)

router = APIRouter()

# Highest severity first, so the district queue opens on what matters.
_SEVERITY_RANK = {"High": 0, "Medium": 1, "Low": 2}


@router.get("", response_model=List[DiscrepancyResponse])
async def list_discrepancies(
    response: Response,
    severity: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    tehsil: Optional[str] = None,
    ulpin: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_officer: User = Depends(require_role(["revenue_officer", "district_officer"])),
) -> Any:
    filters = []
    if severity:
        filters.append(Discrepancy.severity.ilike(severity.strip()))
    if status_filter:
        filters.append(Discrepancy.status.ilike(status_filter.strip()))
    if tehsil:
        filters.append(Discrepancy.tehsil.ilike(tehsil.strip()))
    if ulpin:
        filters.append(Discrepancy.ulpin == ulpin.strip())

    total = await db.scalar(select(func.count(Discrepancy.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(Discrepancy)
                .where(*filters)
                .order_by(Discrepancy.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )
    rows = sorted(rows, key=lambda row: _SEVERITY_RANK.get(row.severity, 9))

    response.headers["X-Total-Count"] = str(total)
    return localize_many(DiscrepancyResponse, rows, locale, DISCREPANCY_LABELS)


@router.post("", response_model=DiscrepancyResponse, status_code=status.HTTP_201_CREATED)
async def create_discrepancy(
    case_in: DiscrepancyCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_officer: User = Depends(require_role(["revenue_officer", "district_officer"])),
) -> Any:
    year = datetime.now(timezone.utc).year
    sequence = (await db.scalar(select(func.count(Discrepancy.id))) or 0) + 1
    case_number = f"DISC-{year}-{sequence:03d}"
    while await db.scalar(select(Discrepancy.id).where(Discrepancy.case_number == case_number)):
        sequence += 1
        case_number = f"DISC-{year}-{sequence:03d}"

    case = Discrepancy(case_number=case_number, **case_in.model_dump())
    db.add(case)

    # Find citizen owner of parcel if registered
    target_user_id = None
    if case.ulpin:
        parcel = (await db.execute(select(Parcel).where(Parcel.ulpin == case.ulpin))).scalars().first()
        if parcel and parcel.owner_name:
            owner_user = (
                await db.execute(
                    select(User).where(
                        (User.full_name == parcel.owner_name) | (User.username == parcel.owner_name)
                    )
                )
            ).scalars().first()
            if owner_user:
                target_user_id = owner_user.id

    notif = Notification(
        user_id=target_user_id,
        ulpin=case.ulpin,
        type="discrepancy_alert",
        message=f"Discrepancy flagged on parcel {case.ulpin}: {case.discrepancy_type} (Severity: {case.severity})",
        read_status=False,
    )
    db.add(notif)

    await db.commit()
    await db.refresh(case)
    return localize(DiscrepancyResponse, case, locale, DISCREPANCY_LABELS)


@router.post("/{case_id}/resolve", response_model=DiscrepancyResponse)
async def resolve_discrepancy(
    case_id: str,
    resolve_in: DiscrepancyResolveRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_user: User = Depends(require_role(["district_officer", "revenue_officer"])),
) -> Any:
    reference = case_id.strip()
    case = (
        (
            await db.execute(
                select(Discrepancy).where(
                    (Discrepancy.id == reference) | (Discrepancy.case_number == reference)
                )
            )
        )
        .scalars()
        .first()
    )
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.discrepancy_not_found", locale, reference=reference),
        )

    old_status = case.status
    case.status = resolve_in.status
    case.resolution_note = resolve_in.resolution_note

    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Discrepancy Resolved",
        actor_name=actor_name,
        actor_role=actor_role,
        details=t(
            "audit.discrepancy_resolved",
            locale,
            number=case.case_number,
            status=label("discrepancy_status", case.status, locale),
            note=case.resolution_note,
        ),
        ulpin=case.ulpin,
        parcel_id=case.parcel_id,
        old_state={"status": old_status},
        new_state={"status": case.status, "resolution_note": case.resolution_note},
    )

    # Notify of resolution
    notif = Notification(
        ulpin=case.ulpin,
        type="discrepancy_alert",
        message=f"Discrepancy case {case.case_number} on parcel {case.ulpin} has been resolved ({case.status}).",
        read_status=False,
    )
    db.add(notif)

    await db.commit()
    await db.refresh(case)
    return localize(DiscrepancyResponse, case, locale, DISCREPANCY_LABELS)
