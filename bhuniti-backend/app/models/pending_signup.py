"""Pending Signup model for multi-step Citizen verification (Mobile OTP + Aadhaar OTP)."""
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import Boolean, Column, DateTime, String
from app.core.database import Base


class PendingSignup(Base):
    __tablename__ = "pending_signups"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    signup_token = Column(String(64), unique=True, index=True, nullable=False)
    full_name = Column(String(200), nullable=False)
    mobile = Column(String(20), index=True, nullable=False)
    email = Column(String(255), nullable=True)
    district = Column(String(100), default="Ghaziabad")
    tehsil = Column(String(100), nullable=True)

    mobile_otp_hash = Column(String(64), nullable=True)
    mobile_verified = Column(Boolean, default=False, nullable=False)

    # Salted hash & last 4 digits only (zero raw Aadhaar storage)
    aadhaar_hash = Column(String(64), nullable=True)
    aadhaar_last4 = Column(String(4), nullable=True)
    aadhaar_otp_hash = Column(String(64), nullable=True)
    aadhaar_verified = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc) + timedelta(minutes=30),
        nullable=False,
        index=True,
    )
