"""Land parcel lookup, search and the GIS layer feed.

The demo fallbacks that used to live here (``DEFAULT_PARCEL_1024``) are gone:
they made an empty database look populated, and the dict was missing
``created_at``/``updated_at`` so ``ParcelResponse`` raised a 500 whenever it was
returned. Demo content now lives in ``db/seed.py`` instead -- run that and the
screens fill up honestly.
"""
import json
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale, require_role
from app.core.database import get_db
from app.core.i18n import t
from app.core.localize import PARCEL_LABELS, label_updates, localize, localize_many
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.parcel import ParcelCreate, ParcelGISResponse, ParcelResponse

router = APIRouter()

GIS_LABELS = {"land_type": "land_type", "verification_status": "verification_status"}


def _parse_boundary(raw: Optional[str]) -> Optional[Any]:
    """The column stores GeoJSON as text; hand the client real JSON."""
    if not raw:
        return None
    try:
        return json.loads(raw)
    except (TypeError, ValueError):
        return None


@router.get("/search", response_model=List[ParcelResponse])
async def search_parcels(
    response: Response,
    query: Optional[str] = Query(None, description="Search by ULPIN, Khasra, Survey or Owner"),
    district: Optional[str] = None,
    tehsil: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Paginated search. The total match count comes back in ``X-Total-Count``."""
    filters = []
    if query:
        pattern = f"%{query.strip()}%"
        filters.append(
            or_(
                Parcel.ulpin.ilike(pattern),
                Parcel.khasra_number.ilike(pattern),
                Parcel.survey_number.ilike(pattern),
                Parcel.owner_name.ilike(pattern),
            )
        )
    if district:
        filters.append(Parcel.district == district)
    if tehsil:
        filters.append(Parcel.tehsil == tehsil)

    total = await db.scalar(select(func.count(Parcel.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(Parcel).where(*filters).order_by(Parcel.ulpin).limit(limit).offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return localize_many(ParcelResponse, rows, locale, PARCEL_LABELS)


@router.get("/gis/all", response_model=List[ParcelGISResponse])
async def get_all_gis_parcels(
    response: Response,
    district: Optional[str] = None,
    tehsil: Optional[str] = None,
    limit: int = Query(500, ge=1, le=2000),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Trimmed parcel list for the map layers, boundaries already parsed."""
    filters = []
    if district:
        filters.append(Parcel.district == district)
    if tehsil:
        filters.append(Parcel.tehsil == tehsil)

    total = await db.scalar(select(func.count(Parcel.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(Parcel).where(*filters).order_by(Parcel.ulpin).limit(limit).offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return [
        ParcelGISResponse(
            id=row.id,
            ulpin=row.ulpin,
            owner_name=row.owner_name,
            area_ha=row.area_ha,
            land_type=row.land_type,
            verification_status=row.verification_status,
            is_disputed=bool(row.is_disputed),
            centroid_lat=row.centroid_lat,
            centroid_lng=row.centroid_lng,
            boundary_geojson=_parse_boundary(row.boundary_geojson),
            tehsil=row.tehsil,
            village=row.village,
            **label_updates(row, GIS_LABELS, locale),
        )
        for row in rows
    ]


@router.get("/{ulpin}", response_model=ParcelResponse)
async def get_parcel_by_ulpin(
    ulpin: str,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Exact ULPIN or survey number first, then a contains-match on the ULPIN."""
    normalized = ulpin.strip()
    parcel = (
        (
            await db.execute(
                select(Parcel)
                .where(
                    or_(
                        Parcel.ulpin == normalized,
                        Parcel.survey_number == normalized,
                        Parcel.ulpin.ilike(f"%{normalized}%"),
                    )
                )
                .order_by(func.length(Parcel.ulpin))
            )
        )
        .scalars()
        .first()
    )
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.parcel_not_found", locale, reference=normalized),
        )
    return localize(ParcelResponse, parcel, locale, PARCEL_LABELS)


@router.post("", response_model=ParcelResponse, status_code=status.HTTP_201_CREATED)
async def create_parcel(
    parcel_in: ParcelCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_officer: User = Depends(require_role(["revenue_officer", "district_officer"])),
) -> Any:
    existing = await db.scalar(select(Parcel.id).where(Parcel.ulpin == parcel_in.ulpin))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=t("error.parcel_exists", locale),
        )

    parcel = Parcel(**parcel_in.model_dump())
    db.add(parcel)
    await db.commit()
    await db.refresh(parcel)
    return localize(ParcelResponse, parcel, locale, PARCEL_LABELS)
