import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "MUT-2023-8941"
    
    # Relations / References
    citizen_id = Column(String(36), nullable=True)
    citizen_name = Column(String(200), nullable=False)
    parcel_id = Column(String(36), nullable=True)
    ulpin = Column(String(50), index=True, nullable=True)

    # Details
    service_type = Column(String(100), nullable=False, default="Title Transfer")  # Title Transfer, Demarcation, etc.
    status = Column(String(50), default="In Progress")  # In Progress, Action Required, Approved, Rejected
    current_stage = Column(String(50), default="Field Survey")  # Submitted, Verified, Field Survey, RO Review, Approved
    
    # Workflow Stage Dates
    submission_date = Column(String(50), nullable=True)
    verified_date = Column(String(50), nullable=True)
    survey_date = Column(String(50), nullable=True)
    ro_review_date = Column(String(50), nullable=True)
    completion_date = Column(String(50), nullable=True)

    action_required = Column(String(500), nullable=True)
    survey_details = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
