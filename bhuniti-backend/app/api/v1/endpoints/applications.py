import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.application import Application
from app.models.audit import AuditLog
from app.schemas.application import ApplicationCreate, ApplicationResponse, StageProgress

router = APIRouter()

DEFAULT_APP_8941 = {
    "id": "app-8941-default",
    "application_number": "MUT-2023-8941",
    "citizen_id": "citizen-user-1",
    "citizen_name": "Priya Sharma",
    "parcel_id": "p-1024-default",
    "ulpin": "09-XXXX-XXXX-1024",
    "service_type": "Title Transfer",
    "status": "Action Required",
    "current_stage": "Field Survey",
    "submission_date": "Oct 24, 2023",
    "verified_date": "Oct 28, 2023",
    "survey_date": "Nov 15, 2023",
    "ro_review_date": "Pending",
    "completion_date": "Pending",
    "action_required": "A field survey has been scheduled for Nov 15th. Please ensure access to the parcel.",
    "survey_details": "Surveyor: Ajay Tyagi (Contact: +91 98765 43210). GPS coordinates verification.",
    "notes": "Mutation requested following legal sale deed registration #GR-2023-994.",
    "stages": [
        {"name": "Submitted", "date": "Oct 24", "status": "completed", "icon": "check"},
        {"name": "Verified", "date": "Oct 28", "status": "completed", "icon": "check"},
        {"name": "Field Survey", "date": "In Progress", "status": "in_progress", "icon": "location_searching"},
        {"name": "RO Review", "date": "Pending", "status": "pending", "icon": "person_search"},
        {"name": "Approved", "date": "Pending", "status": "pending", "icon": "task_alt"}
    ],
    "created_at": datetime.now(timezone.utc),
    "updated_at": datetime.now(timezone.utc)
}

def format_stages(app: Application) -> List[StageProgress]:
    return [
        StageProgress(name="Submitted", date=app.submission_date or "Completed", status="completed", icon="check"),
        StageProgress(name="Verified", date=app.verified_date or "Completed", status="completed" if app.verified_date else "pending", icon="check"),
        StageProgress(name="Field Survey", date=app.survey_date or "In Progress", status="in_progress" if app.current_stage == "Field Survey" else ("completed" if app.current_stage in ["RO Review", "Approved"] else "pending"), icon="location_searching"),
        StageProgress(name="RO Review", date=app.ro_review_date or "Pending", status="in_progress" if app.current_stage == "RO Review" else ("completed" if app.current_stage == "Approved" else "pending"), icon="person_search"),
        StageProgress(name="Approved", date=app.completion_date or "Pending", status="completed" if app.status == "Approved" else "pending", icon="task_alt")
    ]

@router.get("/my", response_model=List[ApplicationResponse])
async def get_my_applications(
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(Application))
    apps = result.scalars().all()
    if not apps:
        return [DEFAULT_APP_8941]

    response = []
    for a in apps:
        d = ApplicationResponse.model_validate(a)
        d.stages = format_stages(a)
        response.append(d)
    return response

@router.get("/{app_num_or_id}", response_model=ApplicationResponse)
async def get_application(
    app_num_or_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Application).where(
        (Application.application_number == app_num_or_id) | (Application.id == app_num_or_id)
    )
    result = await db.execute(stmt)
    app = result.scalars().first()

    if app:
        res = ApplicationResponse.model_validate(app)
        res.stages = format_stages(app)
        return res

    if "8941" in app_num_or_id:
        return DEFAULT_APP_8941

    raise HTTPException(status_code=404, detail="Application not found")

@router.post("", response_model=ApplicationResponse)
async def create_application(
    app_in: ApplicationCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    app_num = f"MUT-2026-{uuid.uuid4().hex[:4].upper()}"
    new_app = Application(
        application_number=app_num,
        citizen_name=app_in.citizen_name,
        ulpin=app_in.ulpin,
        service_type=app_in.service_type,
        status="In Progress",
        current_stage="Submitted",
        submission_date=datetime.now(timezone.utc).strftime("%b %d, %Y"),
        notes=app_in.notes
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)

    res = ApplicationResponse.model_validate(new_app)
    res.stages = format_stages(new_app)
    return res

@router.post("/{app_id}/confirm-availability")
async def confirm_survey_availability(
    app_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Application).where((Application.id == app_id) | (Application.application_number == app_id))
    result = await db.execute(stmt)
    app = result.scalars().first()
    if app:
        app.action_required = None
        app.status = "In Progress"
        
        # Log to audit trail
        audit = AuditLog(
            ulpin=app.ulpin,
            action_type="Survey Availability Confirmed",
            actor_name=app.citizen_name,
            actor_role="Citizen",
            details=f"Citizen confirmed availability for field survey on application {app.application_number}."
        )
        db.add(audit)
        await db.commit()
        return {"status": "success", "message": "Survey availability confirmed"}
    return {"status": "success", "message": "Demo availability confirmed"}
