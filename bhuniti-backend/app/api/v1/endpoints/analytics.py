"""District analytics for the administration portal.

Every number here is now computed from the tables. The previous version returned
``DEFAULT_TEHSILS``/``DEFAULT_OFFICERS`` verbatim and padded the district totals
with ``or 124580`` style fallbacks, so a database holding 12 parcels reported
124,580 and the tehsil table never changed no matter what was in the registry.

Two metrics have no column of their own and are derived, documented here so the
dashboard can be read honestly:

* ``reconciliation_rate`` -- share of a tehsil's discrepancy cases that reached
  Resolved/Dismissed. With no cases recorded it reports 100.0 (nothing to
  reconcile) rather than 0.
* ``accuracy_score`` -- share of an officer's decided mutations where the claimed
  area matched the record area (``has_discrepancy`` false).

``pending_mutations`` and ``open_discrepancies`` also count every undecided state
(``Pending``/``Under Verification``/``Awaiting Docs``, and anything not
Resolved/Dismissed) rather than only the literal ``"Pending"`` row, which used to
hide cases the moment an officer opened them.
"""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale, require_role
from app.core.database import get_db
from app.core.i18n import label
from app.core.ref_data import place_name, place_names
from app.models.discrepancy import Discrepancy
from app.models.mutation import Mutation
from app.models.parcel import Parcel
from app.models.survey import Survey
from app.models.user import User
from app.schemas.analytics import DistrictOverviewResponse, OfficerMetric, TehsilSummary

router = APIRouter()

DISTRICT_NAME = "Ghaziabad"

# Mutation states, split into "still on someone's desk" and "decided".
OPEN_MUTATION_STATES = ("Pending", "Under Verification", "Awaiting Docs")
DECIDED_MUTATION_STATES = ("Approved", "Rejected")
CLOSED_DISCREPANCY_STATES = ("Resolved", "Dismissed")


def _percentage(part: int, whole: int, default: float = 0.0) -> float:
    if not whole:
        return default
    return round(part / whole * 100, 1)


def _officer_status(pending_cases: int, avg_turnaround_days: float) -> str:
    """Bucket an officer's workload into the ``officer_status`` label domain."""
    if pending_cases >= 40:
        return "Overloaded"
    if pending_cases >= 20 or avg_turnaround_days > 5:
        return "Action Needed"
    return "Optimal"


async def _tehsil_summaries(db: AsyncSession, locale: str) -> List[TehsilSummary]:
    """One row per tehsil that actually has parcels, ordered by size."""
    parcel_rows = (
        await db.execute(
            select(
                Parcel.tehsil,
                func.count(Parcel.id),
                func.sum(case((Parcel.verification_status == "Verified", 1), else_=0)),
            )
            .where(Parcel.tehsil.isnot(None))
            .group_by(Parcel.tehsil)
        )
    ).all()
    if not parcel_rows:
        return []

    open_cases: Dict[str, int] = dict(
        (
            await db.execute(
                select(Discrepancy.tehsil, func.count(Discrepancy.id))
                .where(Discrepancy.status.notin_(CLOSED_DISCREPANCY_STATES))
                .group_by(Discrepancy.tehsil)
            )
        ).all()
    )
    all_cases: Dict[str, int] = dict(
        (
            await db.execute(
                select(Discrepancy.tehsil, func.count(Discrepancy.id)).group_by(Discrepancy.tehsil)
            )
        ).all()
    )
    pending_mutations: Dict[str, int] = dict(
        (
            await db.execute(
                select(Parcel.tehsil, func.count(Mutation.id))
                .join(Parcel, Mutation.parcel_id == Parcel.id)
                .where(Mutation.status.in_(OPEN_MUTATION_STATES))
                .group_by(Parcel.tehsil)
            )
        ).all()
    )

    names = await place_names(db, "tehsil", locale, [row[0] for row in parcel_rows])

    summaries: List[TehsilSummary] = []
    for tehsil, total, verified in sorted(parcel_rows, key=lambda row: row[1], reverse=True):
        total = int(total or 0)
        verified = int(verified or 0)
        cases = int(all_cases.get(tehsil, 0))
        open_count = int(open_cases.get(tehsil, 0))
        summaries.append(
            TehsilSummary(
                name=tehsil,
                name_local=names.get(tehsil),
                total_parcels=total,
                verified_pct=_percentage(verified, total),
                open_discrepancies=open_count,
                pending_mutations=int(pending_mutations.get(tehsil, 0)),
                reconciliation_rate=_percentage(cases - open_count, cases, default=100.0),
            )
        )
    return summaries


@router.get("/district-overview", response_model=DistrictOverviewResponse)
async def get_district_overview(
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_officer: User = Depends(require_role(["district_officer", "revenue_officer"])),
) -> Any:
    total_parcels = await db.scalar(select(func.count(Parcel.id))) or 0
    verified_parcels = (
        await db.scalar(
            select(func.count(Parcel.id)).where(Parcel.verification_status == "Verified")
        )
        or 0
    )
    open_discrepancies = (
        await db.scalar(
            select(func.count(Discrepancy.id)).where(
                Discrepancy.status.notin_(CLOSED_DISCREPANCY_STATES)
            )
        )
        or 0
    )
    high_priority = (
        await db.scalar(
            select(func.count(Discrepancy.id)).where(
                Discrepancy.severity == "High",
                Discrepancy.status.notin_(CLOSED_DISCREPANCY_STATES),
            )
        )
        or 0
    )
    pending_mutations = (
        await db.scalar(
            select(func.count(Mutation.id)).where(Mutation.status.in_(OPEN_MUTATION_STATES))
        )
        or 0
    )
    scheduled_surveys = (
        await db.scalar(select(func.count(Survey.id)).where(Survey.status == "Scheduled")) or 0
    )
    active_officers = (
        await db.scalar(
            select(func.count(User.id)).where(
                User.role.in_(("revenue_officer", "district_officer")),
                User.is_active.is_(True),
            )
        )
        or 0
    )

    return DistrictOverviewResponse(
        district_name=DISTRICT_NAME,
        district_name_local=await place_name(db, "district", DISTRICT_NAME, locale),
        total_parcels=total_parcels,
        verified_parcels=verified_parcels,
        verified_pct=_percentage(verified_parcels, total_parcels),
        open_discrepancies=open_discrepancies,
        high_priority_discrepancies=high_priority,
        pending_mutations=pending_mutations,
        scheduled_field_surveys=scheduled_surveys,
        active_revenue_officers=active_officers,
        tehsils=await _tehsil_summaries(db, locale),
    )


@router.get("/tehsil-breakdown", response_model=List[TehsilSummary])
async def get_tehsil_breakdown(
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_officer: User = Depends(require_role(["district_officer", "revenue_officer"])),
) -> Any:
    return await _tehsil_summaries(db, locale)


@router.get("/officer-performance", response_model=List[OfficerMetric])
async def get_officer_performance(
    tehsil: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_officer: User = Depends(require_role(["district_officer", "revenue_officer"])),
) -> Any:
    """Per-officer caseload, built from the mutations assigned to each officer."""
    filters = [User.role.in_(("revenue_officer", "district_officer"))]
    if tehsil:
        filters.append(User.tehsil.ilike(tehsil.strip()))

    officers = (
        (await db.execute(select(User).where(*filters).order_by(User.full_name).limit(limit)))
        .scalars()
        .all()
    )
    if not officers:
        return []

    officer_ids = [officer.id for officer in officers]
    rows = (
        await db.execute(
            select(
                Mutation.assigned_officer_id,
                Mutation.status,
                Mutation.has_discrepancy,
                Mutation.submission_date,
                Mutation.decision_date,
            ).where(Mutation.assigned_officer_id.in_(officer_ids))
        )
    ).all()

    # officer_id -> {disposed, pending, clean, turnaround_days[]}
    tally: Dict[str, Dict[str, Any]] = {
        officer_id: {"disposed": 0, "pending": 0, "clean": 0, "days": []}
        for officer_id in officer_ids
    }
    for officer_id, status_value, has_discrepancy, submitted, decided in rows:
        bucket = tally.get(officer_id)
        if bucket is None:
            continue
        if status_value in DECIDED_MUTATION_STATES:
            bucket["disposed"] += 1
            if not has_discrepancy:
                bucket["clean"] += 1
            if submitted and decided:
                bucket["days"].append(max(0, (decided.date() - submitted).days))
        elif status_value in OPEN_MUTATION_STATES:
            bucket["pending"] += 1

    names = await place_names(db, "tehsil", locale, [officer.tehsil for officer in officers])

    metrics: List[OfficerMetric] = []
    for officer in officers:
        bucket = tally[officer.id]
        days = bucket["days"]
        turnaround = round(sum(days) / len(days), 1) if days else 0.0
        status_value = _officer_status(bucket["pending"], turnaround)
        metrics.append(
            OfficerMetric(
                name=officer.full_name or officer.username,
                tehsil=officer.tehsil or "",
                tehsil_local=names.get(officer.tehsil or ""),
                disposed_cases=bucket["disposed"],
                pending_cases=bucket["pending"],
                avg_turnaround_days=turnaround,
                accuracy_score=_percentage(bucket["clean"], bucket["disposed"], default=100.0),
                status=status_value,
                status_label=label("officer_status", status_value, locale),
            )
        )
    metrics.sort(key=lambda metric: metric.disposed_cases, reverse=True)
    return metrics
