"""Localized names for reference data (districts, tehsils, villages, land types).

Domain *values* stay English in their own tables and are translated from the JSON
catalogs (see ``app.core.i18n``). Place names cannot live in those catalogs -- new
villages get added by the registry, not by a developer -- so they are translated
through this table instead. ``app.core.ref_data`` reads it and degrades to the
English name when a row is missing.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Index, String, UniqueConstraint

from app.core.database import Base


class RefTranslation(Base):
    __tablename__ = "ref_translations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # "state" | "district" | "tehsil" | "village"
    entity_type = Column(String(50), nullable=False)
    # The canonical English name as stored on parcels/users, e.g. "Modinagar".
    entity_key = Column(String(200), nullable=False)
    locale = Column(String(5), nullable=False)
    value = Column(String(200), nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("entity_type", "entity_key", "locale", name="uq_ref_translation"),
        Index("ix_ref_translations_lookup", "entity_type", "locale"),
    )
