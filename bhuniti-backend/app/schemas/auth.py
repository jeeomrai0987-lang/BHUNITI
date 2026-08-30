from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    full_name: Optional[str] = None
    redirect_url: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None
    role: str = "citizen"
    full_name: Optional[str] = None
    phone: Optional[str] = None
    district: Optional[str] = "Ghaziabad"
    tehsil: Optional[str] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    email: Optional[str] = None
    role: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    district: Optional[str] = None
    tehsil: Optional[str] = None
    is_active: bool
