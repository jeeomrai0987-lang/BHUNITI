"""Field surveys.

``DEFAULT_SURVEY`` no longer masks an empty table, the audit entry is written
through the hash chain (``append_audit``) rather than ``generate_hash()`` on an
unflushed row, and the scheduled date is a real date so it can be sorted and
formatted per locale.
"""
import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale
from app.core.audit_trail import actor_from_user, append_audit
from app.core.database import get_db
from app.core.i18n import t
from app.core.localize import SURVEY_LABELS, localize, localize_many
from app.models.application import Application
from app.models.parcel import Parcel
from app.models.survey import Survey
from app.models.user import User
from app.schemas.survey import SurveyCreate, SurveyResponse

router = APIRouter()


@router.get("", response_model=List[SurveyResponse])
async def list_surveys(
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
        filters.append(Survey.status.ilike(status_filter.strip()))
    if ulpin:
        filters.append(Survey.ulpin == ulpin.strip())

    total = await db.scalar(select(func.count(Survey.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(Survey)
                .where(*filters)
                .order_by(Survey.scheduled_date.desc().nullslast(), Survey.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return localize_many(SurveyResponse, rows, locale, SURVEY_LABELS)


@router.get("/{survey_num_or_id}", response_model=SurveyResponse)
async def get_survey(
    survey_num_or_id: str,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    reference = survey_num_or_id.strip()
    survey = (
        (
            await db.execute(
                select(Survey).where((Survey.survey_number == reference) | (Survey.id == reference))
            )
        )
        .scalars()
        .first()
    )
    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.survey_not_found", locale, reference=reference),
        )
    return localize(SurveyResponse, survey, locale, SURVEY_LABELS)


@router.post("", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
async def schedule_survey(
    survey_in: SurveyCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_user: Optional[User] = Depends(get_current_user),
) -> Any:
    payload = survey_in.model_dump()
    ulpin = (payload.get("ulpin") or "").strip()
    parcel = (await db.execute(select(Parcel).where(Parcel.ulpin == ulpin))).scalars().first()
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.parcel_not_found", locale, reference=ulpin),
        )

    payload["ulpin"] = parcel.ulpin
    # Drop an application reference that does not exist rather than tripping the
    # foreign key with a 500.
    if payload.get("application_id"):
        linked = await db.scalar(
            select(Application.id).where(Application.id == payload["application_id"])
        )
        payload["application_id"] = linked or None

    survey = Survey(
        survey_number=f"SURV-{datetime.now(timezone.utc).year}-{uuid.uuid4().hex[:4].upper()}",
        parcel_id=parcel.id,
        **payload,
    )
    db.add(survey)

    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Field Survey Scheduled",
        actor_name=actor_name if current_user else survey.surveyor_name,
        actor_role=actor_role if current_user else "Revenue Officer",
        details=t(
            "audit.survey_scheduled",
            locale,
            number=survey.survey_number,
            date=survey.scheduled_date.isoformat() if survey.scheduled_date else "-",
            ulpin=survey.ulpin,
        ),
        ulpin=survey.ulpin,
        parcel_id=parcel.id,
        new_state={"status": survey.status, "scheduled_date": (
            survey.scheduled_date.isoformat() if survey.scheduled_date else None
        )},
    )

    await db.commit()
    await db.refresh(survey)
    return localize(SurveyResponse, survey, locale, SURVEY_LABELS)
