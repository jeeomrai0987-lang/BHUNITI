import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime
from app.core.database import Base

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    survey_number = Column(String(50), unique=True, index=True, nullable=False)
    
    parcel_id = Column(String(36), nullable=True)
    ulpin = Column(String(50), index=True, nullable=False)
    application_id = Column(String(36), nullable=True)

    surveyor_name = Column(String(200), nullable=False)
    surveyor_phone = Column(String(20), nullable=True)
    
    scheduled_date = Column(String(50), nullable=True)
    completed_date = Column(String(50), nullable=True)
    status = Column(String(50), default="Scheduled")  # Scheduled, In Progress, Completed, Rescheduled

    ground_truth_area_ha = Column(Float, nullable=True)
    waypoints_geojson = Column(Text, nullable=True)
    survey_report_summary = Column(Text, nullable=True)
    photographs_json = Column(Text, nullable=True)  # JSON array of photo URLs

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
