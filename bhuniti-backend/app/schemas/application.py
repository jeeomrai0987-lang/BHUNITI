from datetime import date as dt_date, datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.common import coerce_date


class StageProgress(BaseModel):
    """One step of the citizen-facing tracker.

    ``key`` and ``status`` are stable machine values (``"submitted"``,
    ``"completed"``); ``name``/``status_label`` are already translated for the
    request locale, and ``date`` is ISO so the client can format it.
    """

    key: str
    name: str
    date: Optional[dt_date] = None
    status: str  # completed | current | pending
    status_label: Optional[str] = None
    icon: str

    @field_validator("date", mode="before")
    @classmethod
    def _parse_dates(cls, value):
        return coerce_date(value)


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

    # Translated siblings for the values stored in English.
    service_type_label: Optional[str] = None
    status_label: Optional[str] = None
    current_stage_label: Optional[str] = None

    submission_date: Optional[dt_date] = None
    verified_date: Optional[dt_date] = None
    survey_date: Optional[dt_date] = None
    ro_review_date: Optional[dt_date] = None
    completion_date: Optional[dt_date] = None

    action_required: Optional[str] = None
    survey_details: Optional[str] = None
    notes: Optional[str] = None
    stages: Optional[List[StageProgress]] = None

    created_at: datetime
    updated_at: datetime

    @field_validator(
        "submission_date",
        "verified_date",
        "survey_date",
        "ro_review_date",
        "completion_date",
        mode="before",
    )
    @classmethod
    def _parse_dates(cls, value):
        return coerce_date(value)


class SurveyAvailabilityRequest(BaseModel):
    """Body for "the slot works for me" / "please reschedule"."""

    available: bool = True
    preferred_date: Optional[dt_date] = None
    note: Optional[str] = None

    @field_validator("preferred_date", mode="before")
    @classmethod
    def _parse_dates(cls, value):
        return coerce_date(value)


class SimpleMessage(BaseModel):
    status: str
    message: str
