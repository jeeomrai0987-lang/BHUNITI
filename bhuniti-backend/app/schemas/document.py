from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DocumentBase(BaseModel):
    parcel_id: Optional[str] = None
    ulpin: Optional[str] = None
    application_id: Optional[str] = None
    title: str = Field(min_length=1, max_length=200)
    doc_type: str
    file_url: str
    file_format: str = "PDF"
    file_size_kb: Optional[int] = Field(default=None, ge=0)
    sha256_hash: Optional[str] = None
    is_verified: bool = True
    uploaded_by: str = "System"


class DocumentCreate(DocumentBase):
    pass


class DocumentResponse(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime

    # Translated sibling for the value stored in English.
    doc_type_label: Optional[str] = None
