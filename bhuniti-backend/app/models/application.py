import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, ForeignKey, Index, String, Text

from app.core.database import Base


class Application(Base):
    """A citizen service request (mutation, demarcation, ...).

    The five workflow dates are real ``DATE`` columns. They used to be
    ``VARCHAR(50)`` holding display strings like ``"Oct 24, 2023"`` (and
    sometimes the word ``"Pending"``), which could not be sorted, filtered or
    translated; ``app.core.dates.parse_legacy_date`` converts the old values.
    """

    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_number = Column(String(50), unique=True, index=True, nullable=False)  # e.g. "MUT-2023-8941"

    # Relations / references
    citizen_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    citizen_name = Column(String(200), nullable=False)
    parcel_id = Column(String(36), ForeignKey("parcels.id", ondelete="SET NULL"), index=True, nullable=True)
    ulpin = Column(String(50), index=True, nullable=True)

    # Details. Stored in English and translated at read time (see app.core.i18n).
    service_type = Column(String(100), nullable=False, default="Title Transfer")
    status = Column(String(50), default="In Progress")  # In Progress, Action Required, Approved, Rejected
    current_stage = Column(String(50), default="Field Survey")  # Submitted, Verified, Field Survey, RO Review, Approved

    # Workflow stage dates
    submission_date = Column(Date, nullable=True)
    verified_date = Column(Date, nullable=True)
    survey_date = Column(Date, nullable=True)
    ro_review_date = Column(Date, nullable=True)
    completion_date = Column(Date, nullable=True)

    action_required = Column(String(500), nullable=True)
    survey_details = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Citizen dashboards list "my applications, newest first".
    __table_args__ = (Index("ix_applications_citizen_created", "citizen_id", "created_at"),)
