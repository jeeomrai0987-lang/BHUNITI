import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Encumbrance(Base):
    __tablename__ = "encumbrances"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id = Column(String(36), ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), index=True, nullable=False)
    holder = Column(String(200), nullable=False)  # e.g., "State Bank of India", "Civil Court Modinagar"
    amount = Column(Float, nullable=True)
    instrument_type = Column(String(100), nullable=False)  # Mortgage, Bank Charge, Court Injunction, Lease Deed
    date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=True)
    status = Column(String(50), default="Active", index=True, nullable=False)  # Active, Discharged, Stayed
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    parcel = relationship("Parcel", backref="encumbrances", lazy="selectin")
