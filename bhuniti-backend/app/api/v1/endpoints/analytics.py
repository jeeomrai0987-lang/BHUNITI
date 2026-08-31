from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.parcel import Parcel
from app.models.mutation import Mutation
from app.models.discrepancy import Discrepancy
from app.models.survey import Survey
from app.schemas.analytics import DistrictOverviewResponse, TehsilSummary, OfficerMetric

router = APIRouter()

DEFAULT_TEHSILS = [
    TehsilSummary(
        name="Modinagar",
        total_parcels=48210,
        verified_pct=94.5,
        open_discrepancies=542,
        pending_mutations=820,
        reconciliation_rate=96.2
    ),
    TehsilSummary(
        name="Loni",
        total_parcels=39120,
        verified_pct=91.8,
        open_discrepancies=780,
        pending_mutations=940,
        reconciliation_rate=92.4
    ),
    TehsilSummary(
        name="Ghaziabad Sadar",
        total_parcels=37250,
        verified_pct=95.1,
        open_discrepancies=520,
        pending_mutations=656,
        reconciliation_rate=97.0
    )
]

DEFAULT_OFFICERS = [
    OfficerMetric(
        name="Suresh Verma",
        tehsil="Modinagar",
        disposed_cases=312,
        pending_cases=18,
        avg_turnaround_days=3.2,
        accuracy_score=98.4,
        status="Optimal"
    ),
    OfficerMetric(
        name="Anil Chaudhary",
        tehsil="Loni",
        disposed_cases=240,
        pending_cases=45,
        avg_turnaround_days=5.8,
        accuracy_score=94.1,
        status="Action Needed"
    ),
    OfficerMetric(
        name="Meenakshi Singh",
        tehsil="Ghaziabad Sadar",
        disposed_cases=298,
        pending_cases=22,
        avg_turnaround_days=3.9,
        accuracy_score=97.6,
        status="Optimal"
    )
]

@router.get("/district-overview", response_model=DistrictOverviewResponse)
async def get_district_overview(
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Query database totals or fall back to high-fidelity demo numbers
    total_parcels = await db.scalar(select(func.count(Parcel.id))) or 124580
    verified_parcels = await db.scalar(select(func.count(Parcel.id)).where(Parcel.verification_status == "Verified")) or 116820
    open_disc = await db.scalar(select(func.count(Discrepancy.id)).where(Discrepancy.status == "Open")) or 1842
    high_disc = await db.scalar(select(func.count(Discrepancy.id)).where(Discrepancy.severity == "High")) or 126
    pending_mut = await db.scalar(select(func.count(Mutation.id)).where(Mutation.status == "Pending")) or 2416
    surveys = await db.scalar(select(func.count(Survey.id)).where(Survey.status == "Scheduled")) or 284

    pct = round((verified_parcels / total_parcels * 100), 1) if total_parcels > 0 else 93.8

    return DistrictOverviewResponse(
        district_name="Ghaziabad",
        total_parcels=total_parcels,
        verified_parcels=verified_parcels,
        verified_pct=pct,
        open_discrepancies=open_disc,
        high_priority_discrepancies=high_disc,
        pending_mutations=pending_mut,
        scheduled_field_surveys=surveys,
        active_revenue_officers=42,
        tehsils=DEFAULT_TEHSILS
    )

@router.get("/tehsil-breakdown", response_model=List[TehsilSummary])
async def get_tehsil_breakdown() -> Any:
    return DEFAULT_TEHSILS

@router.get("/officer-performance", response_model=List[OfficerMetric])
async def get_officer_performance() -> Any:
    return DEFAULT_OFFICERS
