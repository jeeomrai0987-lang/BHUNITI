import uuid
import hashlib
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id = Column(String(36), nullable=True)
    ulpin = Column(String(50), index=True, nullable=True)

    action_type = Column(String(100), nullable=False)  # Mutation Approved, Survey Completed, Discrepancy Flagged
    actor_name = Column(String(200), nullable=False)
    actor_role = Column(String(50), nullable=False)    # Revenue Officer, Citizen, District Officer, System
    
    details = Column(Text, nullable=False)
    old_state_json = Column(Text, nullable=True)
    new_state_json = Column(Text, nullable=True)

    tamper_hash = Column(String(64), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    def generate_hash(self, prev_hash: str = "0" * 64) -> str:
        payload = f"{self.id}:{self.ulpin}:{self.action_type}:{self.actor_name}:{self.details}:{prev_hash}"
        return hashlib.sha256(payload.encode()).hexdigest()
