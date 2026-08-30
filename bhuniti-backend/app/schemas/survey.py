from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class SurveyBase(BaseModel):
    ulpin: str
    application_id: Optional[str] = None
    surveyor_name: str
    surveyor_phone: Optional[str] = None
    scheduled_date: Optional[str] = None
    completed_date: Optional[str] = None
    status: str = "Scheduled"
    ground_truth_area_ha: Optional[float] = None
    waypoints_geojson: Optional[str] = None
    survey_report_summary: Optional[str] = None
    photographs_json: Optional[str] = None

class SurveyCreate(SurveyBase):
    pass

class SurveyResponse(SurveyBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    survey_number: str
    created_at: datetime
    updated_at: datetime
