"""OTP verification model for multi-factor authentication."""
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from app.core.database import Base

class OtpVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    otp_hash = Column(String(64), nullable=False, index=True)
    purpose = Column(String(32), nullable=False, default="login")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    expires_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc) + timedelta(minutes=5),
        nullable=False,
        index=True
    )
    attempt_count = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=5, nullable=False)
