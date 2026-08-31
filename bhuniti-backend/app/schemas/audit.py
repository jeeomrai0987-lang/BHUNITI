from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    parcel_id: Optional[str] = None
    ulpin: Optional[str] = None
    action_type: str
    actor_name: str
    actor_role: str
    details: str
    old_state_json: Optional[str] = None
    new_state_json: Optional[str] = None
    tamper_hash: Optional[str] = None
    timestamp: datetime
