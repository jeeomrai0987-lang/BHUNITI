from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale, require_role
from app.core.database import get_db
from app.core.i18n import t
from app.models.parcel import Parcel
from app.models.registration_record import RegistrationRecord
from app.models.user import User
from app.schemas.registration_record import RegistrationRecordCreate, RegistrationRecordResponse

router = APIRouter()

@router.get("/parcel/{ulpin}", response_model=List[RegistrationRecordResponse])
async def get_registrations_by_parcel(
    ulpin: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Retrieve all official deed registration records for a given ULPIN."""
    normalized = ulpin.strip()
    result = await db.execute(
        select(RegistrationRecord)
        .where(RegistrationRecord.ulpin == normalized)
        .order_by(desc(RegistrationRecord.registration_date))
    )
    records = result.scalars().all()
    return records


@router.get("/{deed_number}", response_model=RegistrationRecordResponse)
async def get_registration_by_deed(
    deed_number: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Retrieve an official registration deed by its unique deed number."""
    normalized = deed_number.strip()
    result = await db.execute(
        select(RegistrationRecord).where(RegistrationRecord.deed_number == normalized)
    )
    record = result.scalars().first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.not_found", locale, default="Registration deed record not found"),
        )
    return record


@router.post("", response_model=RegistrationRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_registration_record(
    record_in: RegistrationRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Record a new official land registry deed."""
    existing = await db.scalar(
        select(RegistrationRecord.id).where(RegistrationRecord.deed_number == record_in.deed_number)
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=t("error.already_exists", locale, default="Registration deed already exists"),
        )

    # Link parcel_id if not explicitly provided
    record_data = record_in.model_dump()
    if not record_data.get("parcel_id"):
        parcel_id = await db.scalar(
            select(Parcel.id).where(Parcel.ulpin == record_in.ulpin)
        )
        if parcel_id:
            record_data["parcel_id"] = parcel_id

    record = RegistrationRecord(**record_data)
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record
