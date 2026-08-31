import uuid
import hashlib
from datetime import datetime, timezone
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db, get_supabase
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentResponse

router = APIRouter()

DEFAULT_DOCUMENTS = [
    {
        "id": "doc-ror-001",
        "parcel_id": "p-1024-default",
        "ulpin": "09-XXXX-XXXX-1024",
        "application_id": "app-8941-default",
        "title": "Record of Rights (RoR) - Form 7/12",
        "doc_type": "Record of Rights",
        "file_url": "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
        "file_format": "PDF",
        "file_size_kb": 348,
        "sha256_hash": "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
        "is_verified": True,
        "uploaded_by": "Revenue Department",
        "created_at": datetime.now(timezone.utc)
    },
    {
        "id": "doc-map-002",
        "parcel_id": "p-1024-default",
        "ulpin": "09-XXXX-XXXX-1024",
        "application_id": "app-8941-default",
        "title": "Geo-referenced Cadastral Map",
        "doc_type": "Cadastral Map",
        "file_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
        "file_format": "GeoTIFF/PDF",
        "file_size_kb": 2140,
        "sha256_hash": "b2c3d4e5f6a17890abcdef1234567890abcdef1234567890abcdef1234567891",
        "is_verified": True,
        "uploaded_by": "GIS Division",
        "created_at": datetime.now(timezone.utc)
    }
]

@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    ulpin: Optional[str] = None,
    doc_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    stmt = select(Document)
    if ulpin:
        stmt = stmt.where(Document.ulpin.ilike(f"%{ulpin}%"))
    if doc_type:
        stmt = stmt.where(Document.doc_type.ilike(f"%{doc_type}%"))

    result = await db.execute(stmt)
    docs = result.scalars().all()
    if not docs:
        return DEFAULT_DOCUMENTS
    return docs

@router.post("", response_model=DocumentResponse)
async def create_document(
    doc_in: DocumentCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    doc = Document(**doc_in.model_dump())
    if not doc.sha256_hash:
        doc.sha256_hash = hashlib.sha256(f"{doc.title}:{datetime.now().isoformat()}".encode()).hexdigest()
    
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc

@router.post("/upload", response_model=DocumentResponse)
async def upload_file(
    file: UploadFile = File(...),
    ulpin: str = Form("09-XXXX-XXXX-1024"),
    doc_type: str = Form("Record of Rights"),
    title: str = Form("Uploaded Document"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    file_size = len(content) // 1024

    file_url = f"https://bhuniti-storage.local/uploads/{file.filename}"
    
    # If Supabase client configured, upload to Supabase Storage bucket 'bhuniti-docs'
    supabase = get_supabase()
    if supabase:
        try:
            res = supabase.storage.from_("bhuniti-docs").upload(
                file.filename,
                content,
                {"content-type": file.content_type}
            )
            file_url = supabase.storage.from_("bhuniti-docs").get_public_url(file.filename)
        except Exception:
            pass

    new_doc = Document(
        ulpin=ulpin,
        title=title or file.filename,
        doc_type=doc_type,
        file_url=file_url,
        file_format=file.filename.split(".")[-1].upper() if "." in file.filename else "PDF",
        file_size_kb=file_size,
        sha256_hash=file_hash,
        is_verified=True,
        uploaded_by="User Upload"
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    return new_doc
