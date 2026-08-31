import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from app.core.database import Base

class Discrepancy(Base):
    __tablename__ = "discrepancies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String(50), unique=True, index=True, nullable=False)
    
    parcel_id = Column(String(36), nullable=True)
    ulpin = Column(String(50), index=True, nullable=False)
    district = Column(String(100), default="Ghaziabad")
    tehsil = Column(String(100), default="Modinagar")
    village = Column(String(100), nullable=True)

    discrepancy_type = Column(String(100), nullable=False)  # Area Mismatch, Boundary Overlap, Registry Mismatch
    severity = Column(String(50), default="High")          # High, Medium, Low
    description = Column(Text, nullable=False)
    
    claimed_value = Column(String(100), nullable=True)
    record_value = Column(String(100), nullable=True)
    
    status = Column(String(50), default="Open")            # Open, In Review, Resolved, Dismissed
    resolution_note = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
