import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class RegistrationRecord(Base):
    __tablename__ = "registration_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id = Column(String(36), ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True, index=True)
    ulpin = Column(String(50), index=True, nullable=False)
    deed_number = Column(String(100), unique=True, index=True, nullable=False)
    registration_date = Column(Date, nullable=False)
    sub_registrar_office = Column(String(200), nullable=False)
    stamp_duty = Column(Float, nullable=False)
    market_value = Column(Float, nullable=True)
    consideration_amount = Column(Float, nullable=True)
    buyer_name = Column(String(200), nullable=True)
    seller_name = Column(String(200), nullable=True)
    document_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    parcel = relationship("Parcel", backref="registration_records", lazy="selectin")
