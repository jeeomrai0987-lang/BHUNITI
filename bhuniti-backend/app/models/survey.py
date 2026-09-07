import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, String, Text

from app.core.database import Base


class Survey(Base):
    """A field survey visit scheduled against a parcel/application."""

    __tablename__ = "surveys"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    survey_number = Column(String(50), unique=True, index=True, nullable=False)

    parcel_id = Column(String(36), ForeignKey("parcels.id", ondelete="SET NULL"), index=True, nullable=True)
    ulpin = Column(String(50), index=True, nullable=False)
    application_id = Column(String(36), ForeignKey("applications.id", ondelete="SET NULL"), index=True, nullable=True)

    surveyor_name = Column(String(200), nullable=False)
    surveyor_phone = Column(String(20), nullable=True)

    scheduled_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    status = Column(String(50), default="Scheduled")  # Scheduled, In Progress, Completed, Rescheduled

    ground_truth_area_ha = Column(Float, nullable=True)
    waypoints_geojson = Column(Text, nullable=True)
    survey_report_summary = Column(Text, nullable=True)
    photographs_json = Column(Text, nullable=True)  # JSON array of photo URLs

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
