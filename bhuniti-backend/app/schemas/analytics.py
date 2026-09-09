from typing import List, Optional

from pydantic import BaseModel, Field


class TehsilSummary(BaseModel):
    name: str
    # Localised place name (from the ref_translations table), when one exists.
    name_local: Optional[str] = None
    total_parcels: int = Field(ge=0)
    verified_pct: float = Field(ge=0, le=100)
    open_discrepancies: int = Field(ge=0)
    pending_mutations: int = Field(ge=0)
    reconciliation_rate: float = Field(ge=0, le=100)


class OfficerMetric(BaseModel):
    name: str
    tehsil: str
    tehsil_local: Optional[str] = None
    disposed_cases: int = Field(ge=0)
    pending_cases: int = Field(ge=0)
    avg_turnaround_days: float = Field(ge=0)
    accuracy_score: float = Field(ge=0, le=100)
    status: str  # Optimal | Action Needed | Overloaded (see the officer_status labels)
    status_label: Optional[str] = None


class DistrictOverviewResponse(BaseModel):
    district_name: str
    district_name_local: Optional[str] = None
    total_parcels: int = Field(ge=0)
    verified_parcels: int = Field(ge=0)
    verified_pct: float = Field(ge=0, le=100)
    open_discrepancies: int = Field(ge=0)
    high_priority_discrepancies: int = Field(ge=0)
    pending_mutations: int = Field(ge=0)
    scheduled_field_surveys: int = Field(ge=0)
    active_revenue_officers: int = Field(ge=0)
    tehsils: List[TehsilSummary] = []
