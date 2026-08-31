import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, Text, DateTime
from app.core.database import Base

class Mutation(Base):
    __tablename__ = "mutations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    mutation_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "M-2026-018"
    
    parcel_id = Column(String(36), nullable=True)
    ulpin = Column(String(50), index=True, nullable=False)  # e.g., "P-1024"
    application_id = Column(String(36), nullable=True)
    
    mutation_type = Column(String(100), default="Sale Mutation")  # Sale Mutation, Inheritance, Partition
    applicant_name = Column(String(200), nullable=False)
    party_type = Column(String(100), default="Transferee")
    
    submission_date = Column(String(50), nullable=True)
    claimed_area_ha = Column(Float, nullable=False)
    record_area_ha = Column(Float, nullable=False)
    
    has_discrepancy = Column(Boolean, default=False)
    discrepancy_details = Column(Text, nullable=True)
    
    status = Column(String(50), default="Pending")  # Pending, Under Verification, Awaiting Docs, Approved, Rejected
    assigned_officer_id = Column(String(36), nullable=True)
    decision_note = Column(Text, nullable=True)
    decision_date = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
