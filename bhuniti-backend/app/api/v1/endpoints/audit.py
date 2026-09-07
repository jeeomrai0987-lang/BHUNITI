"""Read-only audit trail plus chain verification.

``DEFAULT_AUDIT_LOGS`` (three fabricated entries with copy-pasted hashes) is
gone -- an empty trail now reads as empty. ``limit`` gained a lower bound
(``limit=0`` used to return nothing at all and ``limit=-1`` raised), and
``/verify`` re-hashes the chain so the "tamper-proof" claim is checkable.
"""
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale
from app.core.audit_trail import verify_chain
from app.core.database import get_db
from app.core.i18n import t
from app.core.localize import AUDIT_LABELS, localize_many
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse
from app.schemas.common import ChainVerification

router = APIRouter()


@router.get("", response_model=List[AuditLogResponse])
async def get_audit_trail(
    response: Response,
    ulpin: Optional[str] = None,
    action_type: Optional[str] = None,
    actor_role: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    filters = []
    if ulpin:
        filters.append(AuditLog.ulpin.ilike(f"%{ulpin.strip()}%"))
    if action_type:
        filters.append(AuditLog.action_type.ilike(f"%{action_type.strip()}%"))
    if actor_role:
        filters.append(AuditLog.actor_role.ilike(actor_role.strip()))

    total = await db.scalar(select(func.count(AuditLog.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(AuditLog)
                .where(*filters)
                .order_by(desc(AuditLog.timestamp), desc(AuditLog.id))
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return localize_many(AuditLogResponse, rows, locale, AUDIT_LABELS)


@router.get("/verify", response_model=ChainVerification)
async def verify_audit_chain(
    limit: Optional[int] = Query(None, ge=1, le=5000),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Recompute every hash from the genesis entry forward.

    ``intact: false`` names the first entry whose stored hash or ``prev_hash``
    link does not match, which is what makes an edited or deleted row visible.
    """
    result = await verify_chain(db, limit)
    if result["intact"]:
        message = t("message.chain_intact", locale, count=result["entries_checked"])
    else:
        message = t(
            "message.chain_broken",
            locale,
            position=result["broken_at_position"],
            entry_id=result["broken_entry_id"],
        )
    return ChainVerification(**result, message=message)
