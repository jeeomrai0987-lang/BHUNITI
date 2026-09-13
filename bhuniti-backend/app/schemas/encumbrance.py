from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class EncumbranceBase(BaseModel):
    parcel_id: Optional[str] = None
    ulpin: str
    holder: str
    amount: Optional[float] = Field(default=None, ge=0)
    instrument_type: str = "Mortgage"
    date: date
    expiry_date: Optional[date] = None
    status: str = "Active"
    remarks: Optional[str] = None

class EncumbranceCreate(EncumbranceBase):
    pass

class EncumbranceUpdate(BaseModel):
    status: Optional[str] = None
    remarks: Optional[str] = None
    expiry_date: Optional[date] = None

class EncumbranceResponse(EncumbranceBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
