from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class DocumentBase(BaseModel):
    parcel_id: Optional[str] = None
    ulpin: Optional[str] = None
    application_id: Optional[str] = None
    title: str
    doc_type: str
    file_url: str
    file_format: str = "PDF"
    file_size_kb: Optional[int] = None
    sha256_hash: Optional[str] = None
    is_verified: bool = True
    uploaded_by: str = "System"

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
