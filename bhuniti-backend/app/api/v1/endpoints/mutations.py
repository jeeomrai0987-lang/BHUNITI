"""Revenue-officer mutation queue.

The demo fallback (``DEFAULT_MUTATION_018``) is gone. It did three harmful
things: it made an empty queue look busy, the stats endpoint padded real counts
with ``or 142``/``or 87`` so a genuine zero was reported as 142, and taking an
action on a missing case inserted the fallback row -- which raised an
IntegrityError the second time because ``mutation_number`` is unique. Actions
now 404 honestly and the demo rows come from ``db/seed.py``.
"""
from datetime import datetime, time, timezone
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale
from app.core.audit_trail import actor_from_user, append_audit
from app.core.database import get_db
from app.core.i18n import label, t
from app.core.localize import MUTATION_LABELS, localize, localize_many
from app.models.mutation import Mutation
from app.models.user import User
from app.schemas.mutation import (
    MutationActionRequest,
    MutationCreate,
    MutationResponse,
    MutationStatsResponse,
)

router = APIRouter()

# action verb -> (stored English status, canonical audit action_type)
ACTION_MAP = {
    "approve": ("Approved", "Mutation Approved"),
    "reject": ("Rejected", "Mutation Rejected"),
    "clarify": ("Awaiting Docs", "Clarification Requested"),
}


async def _count(db: AsyncSession, status_value: str) -> int:
    return await db.scalar(select(func.count(Mutation.id)).where(Mutation.status == status_value)) or 0


async def _next_mutation_number(db: AsyncSession) -> str:
    """``M-<year>-<seq>``, skipping numbers already taken."""
    year = datetime.now(timezone.utc).year
    sequence = (await db.scalar(select(func.count(Mutation.id))) or 0) + 1
    for _ in range(100):
        candidate = f"M-{year}-{sequence:03d}"
        taken = await db.scalar(select(Mutation.id).where(Mutation.mutation_number == candidate))
        if not taken:
            return candidate
        sequence += 1
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Could not allocate a free mutation number",
    )


@router.get("/stats", response_model=MutationStatsResponse)
async def get_mutation_stats(db: AsyncSession = Depends(get_db)) -> Any:
    """Live counts. Zero means zero -- nothing is padded with demo numbers."""
    midnight = datetime.combine(datetime.now(timezone.utc).date(), time.min, tzinfo=timezone.utc)
    approved_today = (
        await db.scalar(
            select(func.count(Mutation.id)).where(
                Mutation.status == "Approved",
                Mutation.decision_date.is_not(None),
                Mutation.decision_date >= midnight,
            )
        )
        or 0
    )
    return MutationStatsResponse(
        pending_count=await _count(db, "Pending"),
        under_verification_count=await _count(db, "Under Verification"),
        awaiting_docs_count=await _count(db, "Awaiting Docs"),
        approved_today_count=approved_today,
    )


@router.get("", response_model=List[MutationResponse])
async def list_mutations(
    response: Response,
    status_filter: Optional[str] = Query(None, alias="status"),
    ulpin: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    filters = []
    if status_filter:
        filters.append(Mutation.status.ilike(status_filter.strip()))
    if ulpin:
        filters.append(Mutation.ulpin == ulpin.strip())

    total = await db.scalar(select(func.count(Mutation.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(Mutation)
                .where(*filters)
                .order_by(Mutation.submission_date.desc().nullslast(), Mutation.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return localize_many(MutationResponse, rows, locale, MUTATION_LABELS)


@router.post("", response_model=MutationResponse, status_code=status.HTTP_201_CREATED)
async def create_mutation(
    mutation_in: MutationCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    sequence = await _next_mutation_number(db)
    mutation = Mutation(
        mutation_number=sequence,
        **mutation_in.model_dump(),
    )
    db.add(mutation)
    await db.commit()
    await db.refresh(mutation)
    return localize(MutationResponse, mutation, locale, MUTATION_LABELS)


@router.get("/{mutation_num_or_id}", response_model=MutationResponse)
async def get_mutation(
    mutation_num_or_id: str,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    reference = mutation_num_or_id.strip()
    mutation = (
        (
            await db.execute(
                select(Mutation).where(
                    (Mutation.mutation_number == reference) | (Mutation.id == reference)
                )
            )
        )
        .scalars()
        .first()
    )
    if not mutation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.mutation_not_found", locale, reference=reference),
        )
    return localize(MutationResponse, mutation, locale, MUTATION_LABELS)


@router.post("/{mutation_id}/action", response_model=MutationResponse)
async def take_mutation_action(
    mutation_id: str,
    action_in: MutationActionRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_user: Optional[User] = Depends(get_current_user),
) -> Any:
    """Approve / reject / request clarification, and append one audit entry.

    The audit row is written through ``append_audit`` so it is linked into the
    hash chain (the old code hashed an unflushed ``id`` and always used the
    genesis ``prev_hash``, so nothing was actually chained).
    """
    reference = mutation_id.strip()
    if action_in.action not in ACTION_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=t("error.invalid_mutation_action", locale),
        )

    mutation = (
        (
            await db.execute(
                select(Mutation).where((Mutation.id == reference) | (Mutation.mutation_number == reference))
            )
        )
        .scalars()
        .first()
    )
    if not mutation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.mutation_not_found", locale, reference=reference),
        )

    new_status, action_type = ACTION_MAP[action_in.action]
    old_status = mutation.status
    actor_name, actor_role = actor_from_user(current_user)

    mutation.status = new_status
    mutation.decision_note = action_in.note or t(
        "audit.mutation_note_default", locale, action=action_in.action, actor=actor_name
    )
    mutation.decision_date = datetime.now(timezone.utc)
    if current_user is not None:
        mutation.assigned_officer_id = mutation.assigned_officer_id or current_user.id

    await append_audit(
        db,
        action_type=action_type,
        actor_name=actor_name,
        actor_role=actor_role,
        details=t(
            "audit.mutation_action",
            locale,
            number=mutation.mutation_number,
            ulpin=mutation.ulpin,
            status=label("mutation_status", new_status, locale),
            note=mutation.decision_note,
        ),
        ulpin=mutation.ulpin,
        parcel_id=mutation.parcel_id,
        old_state={"status": old_status},
        new_state={"status": new_status},
    )

    await db.commit()
    await db.refresh(mutation)
    return localize(MutationResponse, mutation, locale, MUTATION_LABELS)
