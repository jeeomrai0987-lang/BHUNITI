from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DiscrepancyBase(BaseModel):
    ulpin: str
    district: str = "Ghaziabad"
    tehsil: str = "Modinagar"
    village: Optional[str] = None
    discrepancy_type: str
    severity: str = "High"
    description: str
    claimed_value: Optional[str] = None
    record_value: Optional[str] = None
    status: str = "Open"


class DiscrepancyCreate(DiscrepancyBase):
    pass


class DiscrepancyResolveRequest(BaseModel):
    status: str = "Resolved"
    resolution_note: str = Field(min_length=1)


class DiscrepancyResponse(DiscrepancyBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_number: str
    parcel_id: Optional[str] = None
    resolution_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Translated siblings for the values stored in English.
    status_label: Optional[str] = None
    severity_label: Optional[str] = None
    discrepancy_type_label: Optional[str] = None
