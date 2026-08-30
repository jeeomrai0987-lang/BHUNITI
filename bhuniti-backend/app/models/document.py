import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parcel_id = Column(String(36), nullable=True)
    ulpin = Column(String(50), index=True, nullable=True)
    application_id = Column(String(36), nullable=True)

    title = Column(String(200), nullable=False)
    doc_type = Column(String(100), nullable=False)  # RoR (Form 7/12), Cadastral Map, Sale Deed, Survey Report
    file_url = Column(Text, nullable=False)
    file_format = Column(String(20), default="PDF")
    file_size_kb = Column(Integer, nullable=True)
    
    sha256_hash = Column(String(64), nullable=True)  # Tamper-proofing / integrity hash
    is_verified = Column(Boolean, default=True)
    uploaded_by = Column(String(100), default="System")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
