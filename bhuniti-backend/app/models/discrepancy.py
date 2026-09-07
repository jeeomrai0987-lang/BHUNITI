import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Index, String, Text

from app.core.database import Base


class Discrepancy(Base):
    """An area/boundary/registry mismatch flagged for district review."""

    __tablename__ = "discrepancies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String(50), unique=True, index=True, nullable=False)

    parcel_id = Column(String(36), ForeignKey("parcels.id", ondelete="SET NULL"), index=True, nullable=True)
    ulpin = Column(String(50), index=True, nullable=False)
    district = Column(String(100), default="Ghaziabad")
    tehsil = Column(String(100), default="Modinagar", index=True)
    village = Column(String(100), nullable=True)

    discrepancy_type = Column(String(100), nullable=False)  # Area Mismatch, Boundary Overlap, Registry Mismatch
    severity = Column(String(50), default="High")  # High, Medium, Low
    description = Column(Text, nullable=False)

    claimed_value = Column(String(100), nullable=True)
    record_value = Column(String(100), nullable=True)

    status = Column(String(50), default="Open")  # Open, In Review, Resolved, Dismissed
    resolution_note = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # The district queue filters open cases by severity.
    __table_args__ = (Index("ix_discrepancies_status_severity", "status", "severity"),)
