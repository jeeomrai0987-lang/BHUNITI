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
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
