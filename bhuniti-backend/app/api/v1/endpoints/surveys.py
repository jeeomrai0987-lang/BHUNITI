import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.survey import Survey
from app.models.audit import AuditLog
from app.schemas.survey import SurveyCreate, SurveyResponse

router = APIRouter()

DEFAULT_SURVEY = {
    "id": "surv-089-default",
    "survey_number": "SURV-2026-089",
    "ulpin": "09-XXXX-XXXX-1024",
    "application_id": "app-8941-default",
    "surveyor_name": "Ajay Tyagi (Field Inspector)",
    "surveyor_phone": "+91 98765 43210",
    "scheduled_date": "Nov 15, 2023",
    "completed_date": None,
    "status": "Scheduled",
    "ground_truth_area_ha": 2.01,
    "waypoints_geojson": '{"type": "MultiPoint", "coordinates": [[77.5830, 28.8340], [77.5860, 28.8342], [77.5865, 28.8365], [77.5832, 28.8368]]}',
    "survey_report_summary": "DGPS boundary marker verification scheduled with handheld GNSS receiver.",
    "photographs_json": "[]",
    "created_at": datetime.now(timezone.utc),
    "updated_at": datetime.now(timezone.utc)
}

@router.get("", response_model=List[SurveyResponse])
async def list_surveys(
    status: Optional[str] = None,
    ulpin: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Survey)
    if status:
        stmt = stmt.where(Survey.status.ilike(status))
    if ulpin:
        stmt = stmt.where(Survey.ulpin == ulpin)

    result = await db.execute(stmt)
    items = result.scalars().all()
    if not items:
        return [DEFAULT_SURVEY]
    return items

@router.post("", response_model=SurveyResponse)
async def schedule_survey(
    survey_in: SurveyCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    s_num = f"SURV-2026-{uuid.uuid4().hex[:4].upper()}"
    new_survey = Survey(
        survey_number=s_num,
        **survey_in.model_dump()
    )
    db.add(new_survey)

    audit = AuditLog(
        ulpin=new_survey.ulpin,
        action_type="Field Survey Scheduled",
        actor_name=new_survey.surveyor_name,
        actor_role="Revenue Officer",
        details=f"Survey {s_num} scheduled for {new_survey.scheduled_date} on parcel {new_survey.ulpin}."
    )
    audit.tamper_hash = audit.generate_hash()
    db.add(audit)

    await db.commit()
    await db.refresh(new_survey)
    return new_survey
