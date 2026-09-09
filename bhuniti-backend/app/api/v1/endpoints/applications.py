"""Citizen applications and the stage tracker.

Notes on what changed: the ``DEFAULT_APP_8941`` demo row is gone (an empty
database now answers with an empty list, and ``db/seed.py`` supplies the demo
content), the workflow dates are real dates rather than display strings like
``"Oct 24, 2023"``/``"Pending"``, the tracker carries stable machine keys plus
translated labels, and confirming survey availability for an unknown
application returns a real 404 instead of a fake success.
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
from app.core.i18n import label, t
from app.core.localize import APPLICATION_LABELS, localize
from app.models.application import Application
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    SimpleMessage,
    StageProgress,
    SurveyAvailabilityRequest,
)

router = APIRouter()

# (machine key, stored English stage name, date attribute, icon)
STAGE_PLAN = (
    ("submitted", "Submitted", "submission_date", "check"),
    ("verified", "Verified", "verified_date", "check"),
    ("field_survey", "Field Survey", "survey_date", "location_searching"),
    ("ro_review", "RO Review", "ro_review_date", "person_search"),
    ("approved", "Approved", "completion_date", "task_alt"),
)

_STAGE_ORDER = [entry[1] for entry in STAGE_PLAN]


def _stage_state(application: Application, stage_name: str) -> str:
    """completed / in_progress / pending, derived from ``current_stage``.

    Previously each stage hardcoded its own comparison and fell back to the word
    "Completed" in the date field, so a stage with no date read as finished.
    """
    current = application.current_stage or _STAGE_ORDER[0]
    try:
        current_index = _STAGE_ORDER.index(current)
    except ValueError:
        current_index = 0
    index = _STAGE_ORDER.index(stage_name)

    if application.status in ("Approved", "Completed"):
        return "completed"
    if application.status == "Rejected":
        return "completed" if index < current_index else "pending"
    if index < current_index:
        return "completed"
    if index == current_index:
        return "in_progress"
    return "pending"


def format_stages(application: Application, locale: str) -> List[StageProgress]:
    stages = []
    for key, english_name, date_attr, icon in STAGE_PLAN:
        state = _stage_state(application, english_name)
        stages.append(
            StageProgress(
                key=key,
                name=label("stage", english_name, locale),
                date=getattr(application, date_attr, None),
                status=state,
                status_label=label("stage_state", state, locale),
                icon=icon,
            )
        )
    return stages


def _with_stages(application: Application, locale: str) -> ApplicationResponse:
    return localize(
        ApplicationResponse,
        application,
        locale,
        APPLICATION_LABELS,
        extra={"stages": format_stages(application, locale)},
    )


@router.get("/my", response_model=List[ApplicationResponse])
async def get_my_applications(
    response: Response,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Applications for the citizen portal, newest first."""
    total = await db.scalar(select(func.count(Application.id))) or 0
    rows = (
        (
            await db.execute(
                select(Application)
                .order_by(Application.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )
    response.headers["X-Total-Count"] = str(total)
    return [_with_stages(row, locale) for row in rows]


@router.get("/{app_num_or_id}", response_model=ApplicationResponse)
async def get_application(
    app_num_or_id: str,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    reference = app_num_or_id.strip()
    application = (
        (
            await db.execute(
                select(Application).where(
                    (Application.application_number == reference) | (Application.id == reference)
                )
            )
        )
        .scalars()
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.application_not_found", locale, reference=reference),
        )
    return _with_stages(application, locale)


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_in: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_user: Optional[User] = Depends(get_current_user),
) -> Any:
    """File a new service request against a parcel.

    The parcel must exist -- the old version accepted any ULPIN and created an
    orphan row.
    """
    ulpin = app_in.ulpin.strip()
    parcel = (await db.execute(select(Parcel).where(Parcel.ulpin == ulpin))).scalars().first()
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.parcel_not_found", locale, reference=ulpin),
        )

    now = datetime.now(timezone.utc)
    application = Application(
        application_number=f"MUT-{now.year}-{uuid.uuid4().hex[:4].upper()}",
        citizen_id=current_user.id if current_user else None,
        citizen_name=app_in.citizen_name,
        parcel_id=parcel.id,
        ulpin=parcel.ulpin,
        service_type=app_in.service_type,
        status="In Progress",
        current_stage="Submitted",
        submission_date=now.date(),
        notes=app_in.notes,
    )
    db.add(application)

    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Title Transfer Application Filed",
        actor_name=actor_name if current_user else app_in.citizen_name,
        actor_role=actor_role if current_user else "Citizen",
        details=t(
            "audit.application_filed",
            locale,
            number=application.application_number,
            ulpin=parcel.ulpin,
            service=label("service_type", application.service_type, locale),
        ),
        ulpin=parcel.ulpin,
        parcel_id=parcel.id,
        new_state={"status": application.status, "current_stage": application.current_stage},
    )

    await db.commit()
    await db.refresh(application)
    return _with_stages(application, locale)


@router.post("/{app_id}/confirm-availability", response_model=SimpleMessage)
async def confirm_survey_availability(
    app_id: str,
    payload: Optional[SurveyAvailabilityRequest] = None,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_user: Optional[User] = Depends(get_current_user),
) -> Any:
    """Citizen confirms the scheduled survey slot works for them."""
    reference = app_id.strip()
    application = (
        (
            await db.execute(
                select(Application).where(
                    (Application.id == reference) | (Application.application_number == reference)
                )
            )
        )
        .scalars()
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.application_not_found", locale, reference=reference),
        )

    old_state = {"status": application.status, "action_required": application.action_required}
    application.action_required = None
    application.status = "In Progress"
    if payload and payload.preferred_date:
        application.survey_date = payload.preferred_date

    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Survey Availability Confirmed",
        actor_name=actor_name if current_user else application.citizen_name,
        actor_role=actor_role if current_user else "Citizen",
        details=t("audit.availability_confirmed", locale, number=application.application_number),
        ulpin=application.ulpin,
        parcel_id=application.parcel_id,
        old_state=old_state,
        new_state={"status": application.status, "action_required": None},
    )

    await db.commit()
    return SimpleMessage(status="success", message=t("message.availability_confirmed", locale))
