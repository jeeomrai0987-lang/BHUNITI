from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

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
    resolution_note: str

class DiscrepancyResponse(DiscrepancyBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_number: str
    resolution_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime
