from typing import List, Optional
from pydantic import BaseModel

class TehsilSummary(BaseModel):
    name: str
    total_parcels: int
    verified_pct: float
    open_discrepancies: int
    pending_mutations: int
    reconciliation_rate: float

class OfficerMetric(BaseModel):
    name: str
    tehsil: str
    disposed_cases: int
    pending_cases: int
    avg_turnaround_days: float
    accuracy_score: float
    status: str

class DistrictOverviewResponse(BaseModel):
    district_name: str
    total_parcels: int
    verified_parcels: int
    verified_pct: float
    open_discrepancies: int
    high_priority_discrepancies: int
    pending_mutations: int
    scheduled_field_surveys: int
    active_revenue_officers: int
    tehsils: List[TehsilSummary]
