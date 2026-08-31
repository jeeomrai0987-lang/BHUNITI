from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class StageProgress(BaseModel):
    name: str
    date: Optional[str] = None
    status: str
    icon: str

class ApplicationCreate(BaseModel):
    ulpin: str
    service_type: str = "Title Transfer"
    citizen_name: str
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    application_number: str
    citizen_id: Optional[str] = None
    citizen_name: str
    parcel_id: Optional[str] = None
    ulpin: Optional[str] = None
    service_type: str
    status: str
    current_stage: str
    submission_date: Optional[str] = None
    verified_date: Optional[str] = None
    survey_date: Optional[str] = None
    ro_review_date: Optional[str] = None
    completion_date: Optional[str] = None
    action_required: Optional[str] = None
    survey_details: Optional[str] = None
    notes: Optional[str] = None
    stages: Optional[List[StageProgress]] = None
    created_at: datetime
    updated_at: datetime
