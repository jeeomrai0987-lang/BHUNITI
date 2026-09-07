import hashlib
import json
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String, Text

from app.core.database import Base

GENESIS_HASH = "0" * 64


class AuditLog(Base):
    """Append-only trail. Each row hashes the row *before* it, so a deleted or
    edited entry breaks every hash after it (see ``app.core.audit_trail``)."""

    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id = Column(String(36), ForeignKey("parcels.id", ondelete="SET NULL"), nullable=True)
    ulpin = Column(String(50), index=True, nullable=True)

    action_type = Column(String(100), nullable=False)  # Mutation Approved, Survey Completed, ...
    actor_name = Column(String(200), nullable=False)
    actor_role = Column(String(50), nullable=False)    # Revenue Officer, Citizen, District Officer, System

    details = Column(Text, nullable=False)
    old_state_json = Column(Text, nullable=True)
    new_state_json = Column(Text, nullable=True)

    # Hash chain: prev_hash is the tamper_hash of the preceding entry.
    prev_hash = Column(String(64), nullable=False, default=GENESIS_HASH)
    tamper_hash = Column(String(64), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    def canonical_payload(self, prev_hash: str) -> str:
        """Stable, key-sorted representation of everything the hash covers."""
        timestamp = self.timestamp
        return json.dumps(
            {
                "id": self.id,
                "ulpin": self.ulpin,
                "parcel_id": self.parcel_id,
                "action_type": self.action_type,
                "actor_name": self.actor_name,
                "actor_role": self.actor_role,
                "details": self.details,
                "old_state_json": self.old_state_json,
                "new_state_json": self.new_state_json,
                "timestamp": timestamp.isoformat() if isinstance(timestamp, datetime) else None,
                "prev_hash": prev_hash,
            },
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=False,
        )

    def compute_hash(self, prev_hash: str = GENESIS_HASH) -> str:
        return hashlib.sha256(self.canonical_payload(prev_hash).encode("utf-8")).hexdigest()

    def generate_hash(self, prev_hash: str = GENESIS_HASH) -> str:
        """Deprecated alias kept so older scripts keep working."""
        return self.compute_hash(prev_hash)

