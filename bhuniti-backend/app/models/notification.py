import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    ulpin = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system", nullable=False)  # mutation_update, survey_scheduled, discrepancy_alert, system
    read_status = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="notifications", lazy="selectin")
