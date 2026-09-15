from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    full_name: Optional[str] = None
    redirect_url: str
    preferred_locale: str = "en"
    force_password_change: bool = False


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None


class LoginRequest(BaseModel):
    identifier: Optional[str] = None
    username: Optional[str] = None
    password: str

    @property
    def login_identifier(self) -> str:
        return (self.identifier or self.username or "").strip()


class RequestOtpRequest(BaseModel):
    identifier: Optional[str] = None
    username: Optional[str] = None
    password: str
    claimed_role: str  # "revenue_officer" | "district_officer"

    @property
    def login_identifier(self) -> str:
        return (self.identifier or self.username or "").strip()


class RequestOtpResponse(BaseModel):
    status: str = "success"
    message: str
    masked_email: str
    expires_in_seconds: int = 300
    otp_code: Optional[str] = None


class VerifyOtpRequest(BaseModel):
    identifier: Optional[str] = None
    username: Optional[str] = None
    otp: str

    @property
    def login_identifier(self) -> str:
        return (self.identifier or self.username or "").strip()



# --- Multi-Step Citizen Signup Schemas ---

class SignupStartRequest(BaseModel):
    full_name: str
    mobile: str
    email: EmailStr
    district: Optional[str] = "Ghaziabad"
    tehsil: Optional[str] = None


class SignupStartResponse(BaseModel):
    status: str = "mobile_otp_sent"
    signup_token: str
    masked_mobile: str
    expires_in_seconds: int = 1800
    otp_code: Optional[str] = None


class SignupVerifyMobileRequest(BaseModel):
    signup_token: str
    otp: str


class SignupVerifyMobileResponse(BaseModel):
    status: str = "mobile_verified"
    message: str


class SignupAadhaarRequest(BaseModel):
    signup_token: str
    aadhaar_number: str


class SignupAadhaarResponse(BaseModel):
    status: str = "aadhaar_otp_sent"
    masked_aadhaar: str
    is_simulated: bool = True
    message: str = "Aadhaar e-KYC OTP triggered (simulated for prototype)"
    otp_code: Optional[str] = None


class SignupVerifyAadhaarRequest(BaseModel):
    signup_token: str
    otp: str


class SignupVerifyAadhaarResponse(BaseModel):
    status: str = "aadhaar_verified"
    message: str


class SignupCompleteRequest(BaseModel):
    signup_token: str
    username: str
    password: str
    preferred_locale: Optional[str] = "en"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None
    role: str = "citizen"
    full_name: Optional[str] = None
    phone: Optional[str] = None
    district: Optional[str] = "Ghaziabad"
    tehsil: Optional[str] = None
    preferred_locale: str = "en"


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
    preferred_locale: str = "en"
    is_active: bool
    status: Optional[str] = "active"
    force_password_change: bool = False
    aadhaar_last4: Optional[str] = None
    gov_id_type: Optional[str] = None
    gov_id_last4: Optional[str] = None

    # Translated sibling for the value stored in English.
    role_label: Optional[str] = None


class LocalePreferenceRequest(BaseModel):
    """Body for ``PUT /auth/me/locale``."""

    locale: str
