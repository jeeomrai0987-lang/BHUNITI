from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.common import coerce_date


class MutationBase(BaseModel):
    ulpin: str
    mutation_type: str = "Sale Mutation"
    applicant_name: str
    party_type: str = "Transferee"
    submission_date: Optional[date] = None
    claimed_area_ha: float = Field(ge=0)
    record_area_ha: float = Field(ge=0)
    has_discrepancy: bool = False
    discrepancy_details: Optional[str] = None
    status: str = "Pending"

    @field_validator("submission_date", mode="before")
    @classmethod
    def _parse_dates(cls, value):
        return coerce_date(value)


class MutationCreate(MutationBase):
    pass


class MutationActionRequest(BaseModel):
    """``approve`` | ``reject`` | ``clarify``.

    Case and surrounding space are normalised here; an unknown verb is rejected
    by the endpoint with a translated 400 rather than a raw 422, so the portal
    can show the message as-is.
    """

    action: str = Field(min_length=1)
    note: Optional[str] = None

    @field_validator("action", mode="before")
    @classmethod
    def _normalise_action(cls, value):
        return value.strip().lower() if isinstance(value, str) else value


class MutationResponse(MutationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    mutation_number: str
    parcel_id: Optional[str] = None
    application_id: Optional[str] = None
    assigned_officer_id: Optional[str] = None
    decision_note: Optional[str] = None
    decision_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    # Translated siblings for the values stored in English.
    status_label: Optional[str] = None
    mutation_type_label: Optional[str] = None
    party_type_label: Optional[str] = None


class MutationStatsResponse(BaseModel):
    pending_count: int = Field(ge=0)
    under_verification_count: int = Field(ge=0)
    awaiting_docs_count: int = Field(ge=0)
    approved_today_count: int = Field(ge=0)
