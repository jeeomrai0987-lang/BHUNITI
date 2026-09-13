from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class NotificationBase(BaseModel):
    user_id: Optional[str] = None
    ulpin: Optional[str] = None
    message: str
    type: str = "system"
    read_status: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    read_status: Optional[bool] = None

class NotificationResponse(NotificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
