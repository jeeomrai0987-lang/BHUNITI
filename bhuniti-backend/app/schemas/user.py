from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class UserRoleUpdateRequest(BaseModel):
    role: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        valid_roles = {"citizen", "revenue_officer", "district_officer"}
        normalized = v.strip().lower()
        if normalized not in valid_roles:
            raise ValueError(f"Invalid role '{v}'. Must be one of: {', '.join(sorted(valid_roles))}")
        return normalized


class UserStatusUpdateRequest(BaseModel):
    is_active: bool


class OfficerCreateRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    username: str
    designation: Optional[str] = "Revenue Officer"
    district: Optional[str] = "Ghaziabad"
    tehsil: Optional[str] = "Modinagar"
    gov_id_type: str  # e.g. "Employee ID", "Aadhaar", "PAN"
    gov_id_number: str


class OfficerCreateResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    full_name: str
    designation: Optional[str] = None
    district: Optional[str] = None
    tehsil: Optional[str] = None
    gov_id_type: str
    gov_id_last4: str
    status: str
    message: str


class UserAdminResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    email: Optional[str] = None
    role: str
    role_label: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    district: Optional[str] = None
    tehsil: Optional[str] = None
    preferred_locale: str = "en"
    is_active: bool
    status: Optional[str] = "active"
    force_password_change: bool = False
    gov_id_type: Optional[str] = None
    gov_id_last4: Optional[str] = None
    aadhaar_last4: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
