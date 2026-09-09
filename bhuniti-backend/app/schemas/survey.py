from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.common import coerce_date


class SurveyBase(BaseModel):
    ulpin: str
    application_id: Optional[str] = None
    surveyor_name: str
    surveyor_phone: Optional[str] = None
    scheduled_date: Optional[date] = None
    completed_date: Optional[date] = None
    status: str = "Scheduled"
    ground_truth_area_ha: Optional[float] = None
    waypoints_geojson: Optional[str] = None
    survey_report_summary: Optional[str] = None
    photographs_json: Optional[str] = None

    @field_validator("scheduled_date", "completed_date", mode="before")
    @classmethod
    def _parse_dates(cls, value):
        return coerce_date(value)


class SurveyCreate(SurveyBase):
    pass


class SurveyResponse(SurveyBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    survey_number: str
    parcel_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Translated sibling for the value stored in English.
    status_label: Optional[str] = None
