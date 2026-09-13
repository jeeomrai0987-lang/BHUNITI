from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale, require_role
from app.core.database import get_db
from app.core.i18n import t
from app.models.encumbrance import Encumbrance
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.encumbrance import EncumbranceCreate, EncumbranceResponse, EncumbranceUpdate

router = APIRouter()

@router.get("/parcel/{ulpin}", response_model=List[EncumbranceResponse])
async def get_encumbrances_by_parcel(
    ulpin: str,
    active_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Retrieve all encumbrance records (mortgages, court stays, bank liens) for a parcel."""
    normalized = ulpin.strip()
    filters = [Encumbrance.ulpin == normalized]
    if active_only:
        filters.append(Encumbrance.status == "Active")

    result = await db.execute(
        select(Encumbrance).where(*filters).order_by(desc(Encumbrance.date))
    )
    return result.scalars().all()


@router.post("", response_model=EncumbranceResponse, status_code=status.HTTP_201_CREATED)
async def create_encumbrance(
    encumbrance_in: EncumbranceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Register a new encumbrance charge or lien against a parcel."""
    data = encumbrance_in.model_dump()
    if not data.get("parcel_id"):
        parcel = (
            await db.execute(select(Parcel).where(Parcel.ulpin == encumbrance_in.ulpin))
        ).scalars().first()
        if parcel:
            data["parcel_id"] = parcel.id
            # Also update parcel's top-level encumbrance_status if active
            if encumbrance_in.status == "Active":
                parcel.encumbrance_status = encumbrance_in.instrument_type

    encumbrance = Encumbrance(**data)
    db.add(encumbrance)
    await db.commit()
    await db.refresh(encumbrance)
    return encumbrance


@router.patch("/{encumbrance_id}/status", response_model=EncumbranceResponse)
async def update_encumbrance_status(
    encumbrance_id: str,
    update_in: EncumbranceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Update status of an existing encumbrance (e.g., mark as Discharged or Stayed)."""
    result = await db.execute(select(Encumbrance).where(Encumbrance.id == encumbrance_id))
    encumbrance = result.scalars().first()
    if not encumbrance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.not_found", locale, default="Encumbrance record not found"),
        )

    if update_in.status is not None:
        encumbrance.status = update_in.status
    if update_in.remarks is not None:
        encumbrance.remarks = update_in.remarks
    if update_in.expiry_date is not None:
        encumbrance.expiry_date = update_in.expiry_date

    # If all encumbrances for parcel are discharged, update parcel status
    if update_in.status == "Discharged":
        active_remaining = await db.scalar(
            select(Encumbrance.id)
            .where(Encumbrance.ulpin == encumbrance.ulpin, Encumbrance.status == "Active", Encumbrance.id != encumbrance.id)
        )
        if not active_remaining:
            parcel = (await db.execute(select(Parcel).where(Parcel.ulpin == encumbrance.ulpin))).scalars().first()
            if parcel:
                parcel.encumbrance_status = "Clean"

    await db.commit()
    await db.refresh(encumbrance)
    return encumbrance
