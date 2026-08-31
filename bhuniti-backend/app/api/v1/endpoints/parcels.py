import json
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.database import get_db
from app.models.parcel import Parcel
from app.schemas.parcel import ParcelCreate, ParcelResponse, ParcelGISResponse

router = APIRouter()

# Default fallback parcel for testing / demo
DEFAULT_PARCEL_1024 = {
    "id": "p-1024-default",
    "ulpin": "09-XXXX-XXXX-1024",
    "survey_number": "142/B",
    "khasra_number": "412/1",
    "khata_number": "89",
    "state": "Uttar Pradesh",
    "district": "Ghaziabad",
    "tehsil": "Modinagar",
    "village": "Sikandrabad",
    "owner_name": "Rahul Sharma",
    "land_type": "Agricultural",
    "area_ha": 2.00,
    "area_sqm": 20000.0,
    "valuation_inr": 4800000.0,
    "verification_status": "Verified",
    "is_disputed": False,
    "encumbrance_status": "Clean",
    "centroid_lat": 28.8354,
    "centroid_lng": 77.5843,
    "boundary_geojson": json.dumps({
        "type": "Polygon",
        "coordinates": [[[77.5830, 28.8340], [77.5860, 28.8342], [77.5865, 28.8365], [77.5832, 28.8368], [77.5830, 28.8340]]]
    }),
    "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAc62GgBhnA_gl-VEaDsXI5Hm8OzC-3Cixsx4ZTpqshVidHLud2VsQoUHnvMzrYugqpX67cyUhap74Jv0PW4T45aUG-Q6lIJZFWTQrV8M3HKGLfh3tq1-p6GVh8MTl9lY92ByC3518_Uo9fzRocJ9Kmq-tgFa_qVVPK5NAnL7DMa0eSGyzWhPuGPnBIMG1Zv7AKp3oJp21Dxo_7Fv7dmKR-F8RJiAMNYLStksTAbgpruTWb7d_qQbg"
}

@router.get("/search", response_model=List[ParcelResponse])
async def search_parcels(
    query: Optional[str] = Query(None, description="Search by ULPIN, Khasra, Survey or Owner"),
    district: Optional[str] = None,
    tehsil: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Parcel)
    if query:
        q = f"%{query.strip()}%"
        stmt = stmt.where(
            or_(
                Parcel.ulpin.ilike(q),
                Parcel.khasra_number.ilike(q),
                Parcel.survey_number.ilike(q),
                Parcel.owner_name.ilike(q)
            )
        )
    if district:
        stmt = stmt.where(Parcel.district == district)
    if tehsil:
        stmt = stmt.where(Parcel.tehsil == tehsil)

    result = await db.execute(stmt)
    parcels = result.scalars().all()
    
    if not parcels and (not query or "1024" in str(query) or "rahul" in str(query).lower()):
        # Return fallback mock if DB empty
        return [DEFAULT_PARCEL_1024]

    return parcels

@router.get("/gis/all", response_model=List[ParcelGISResponse])
async def get_all_gis_parcels(
    district: Optional[str] = None,
    tehsil: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Parcel)
    if district:
        stmt = stmt.where(Parcel.district == district)
    if tehsil:
        stmt = stmt.where(Parcel.tehsil == tehsil)
    result = await db.execute(stmt)
    parcels = result.scalars().all()

    if not parcels:
        return [{
            "id": DEFAULT_PARCEL_1024["id"],
            "ulpin": DEFAULT_PARCEL_1024["ulpin"],
            "owner_name": DEFAULT_PARCEL_1024["owner_name"],
            "area_ha": DEFAULT_PARCEL_1024["area_ha"],
            "land_type": DEFAULT_PARCEL_1024["land_type"],
            "verification_status": DEFAULT_PARCEL_1024["verification_status"],
            "is_disputed": DEFAULT_PARCEL_1024["is_disputed"],
            "centroid_lat": DEFAULT_PARCEL_1024["centroid_lat"],
            "centroid_lng": DEFAULT_PARCEL_1024["centroid_lng"],
            "boundary_geojson": DEFAULT_PARCEL_1024["boundary_geojson"],
            "tehsil": DEFAULT_PARCEL_1024["tehsil"],
            "village": DEFAULT_PARCEL_1024["village"]
        }]

    gis_list = []
    for p in parcels:
        gis_list.append({
            "id": p.id,
            "ulpin": p.ulpin,
            "owner_name": p.owner_name,
            "area_ha": p.area_ha,
            "land_type": p.land_type,
            "verification_status": p.verification_status,
            "is_disputed": p.is_disputed,
            "centroid_lat": p.centroid_lat,
            "centroid_lng": p.centroid_lng,
            "boundary_geojson": p.boundary_geojson,
            "tehsil": p.tehsil,
            "village": p.village
        })
    return gis_list

@router.get("/{ulpin}", response_model=ParcelResponse)
async def get_parcel_by_ulpin(
    ulpin: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Normalize query (handle "P-1024" or "09-XXXX-XXXX-1024")
    normalized = ulpin.strip()
    result = await db.execute(
        select(Parcel).where(
            or_(
                Parcel.ulpin == normalized,
                Parcel.ulpin.ilike(f"%{normalized}%"),
                Parcel.survey_number == normalized
            )
        )
    )
    parcel = result.scalars().first()
    if parcel:
        return parcel

    if "1024" in normalized or normalized.upper() == "P-1024":
        return DEFAULT_PARCEL_1024

    raise HTTPException(status_code=404, detail=f"Parcel with ULPIN '{ulpin}' not found")

@router.post("", response_model=ParcelResponse)
async def create_parcel(
    parcel_in: ParcelCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    existing = await db.execute(select(Parcel).where(Parcel.ulpin == parcel_in.ulpin))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Parcel with this ULPIN already exists")

    parcel = Parcel(**parcel_in.model_dump())
    db.add(parcel)
    await db.commit()
    await db.refresh(parcel)
    return parcel
