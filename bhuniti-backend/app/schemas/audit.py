from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    """One link of the hash chain.

    ``action_type``/``actor_role`` stay in canonical English so entries written
    in different languages remain comparable; the ``*_label`` siblings carry the
    translation for the request locale.
    """

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
    prev_hash: Optional[str] = None
    tamper_hash: Optional[str] = None
    timestamp: datetime

    action_type_label: Optional[str] = None
    actor_role_label: Optional[str] = None
