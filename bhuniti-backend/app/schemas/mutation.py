from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MutationBase(BaseModel):
    ulpin: str
    mutation_type: str = "Sale Mutation"
    applicant_name: str
    party_type: str = "Transferee"
    submission_date: Optional[str] = None
    claimed_area_ha: float
    record_area_ha: float
    has_discrepancy: bool = False
    discrepancy_details: Optional[str] = None
    status: str = "Pending"

class MutationCreate(MutationBase):
    pass

class MutationActionRequest(BaseModel):
    action: str
    note: Optional[str] = None

class MutationResponse(MutationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    mutation_number: str
    assigned_officer_id: Optional[str] = None
    decision_note: Optional[str] = None
    decision_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class MutationStatsResponse(BaseModel):
    pending_count: int
    under_verification_count: int
    awaiting_docs_count: int
    approved_today_count: int
