from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class RegistrationRecordBase(BaseModel):
    parcel_id: Optional[str] = None
    ulpin: str
    deed_number: str
    registration_date: date
    sub_registrar_office: str
    stamp_duty: float = Field(ge=0)
    market_value: Optional[float] = Field(default=None, ge=0)
    consideration_amount: Optional[float] = Field(default=None, ge=0)
    buyer_name: Optional[str] = None
    seller_name: Optional[str] = None
    document_url: Optional[str] = None

class RegistrationRecordCreate(RegistrationRecordBase):
    pass

class RegistrationRecordResponse(RegistrationRecordBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
