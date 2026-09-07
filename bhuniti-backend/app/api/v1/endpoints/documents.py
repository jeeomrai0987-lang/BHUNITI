"""Documents and evidence attached to parcels/applications.

``DEFAULT_DOCUMENTS`` no longer fills in for an empty table. The upload handler
no longer crashes on a missing filename (``file.filename.split(".")`` raised
``AttributeError`` when the multipart part carried no name) and an empty body is
rejected with a translated 400 instead of storing a 0 KB record.
"""
import hashlib
from datetime import datetime, timezone
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale
from app.core.audit_trail import actor_from_user, append_audit
from app.core.database import get_db, get_supabase
from app.core.i18n import t
from app.core.localize import DOCUMENT_LABELS, localize, localize_many
from app.models.document import Document
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentResponse

router = APIRouter()


def _extension(filename: Optional[str]) -> str:
    """Uppercase extension, or ``PDF`` when the part has no usable name."""
    name = (filename or "").strip()
    if "." in name:
        suffix = name.rsplit(".", 1)[-1].strip()
        if suffix:
            return suffix.upper()[:20]
    return "PDF"


@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    response: Response,
    ulpin: Optional[str] = None,
    doc_type: Optional[str] = None,
    application_id: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    filters = []
    if ulpin:
        filters.append(Document.ulpin.ilike(f"%{ulpin.strip()}%"))
    if doc_type:
        filters.append(Document.doc_type.ilike(f"%{doc_type.strip()}%"))
    if application_id:
        filters.append(Document.application_id == application_id.strip())

    total = await db.scalar(select(func.count(Document.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(Document)
                .where(*filters)
                .order_by(Document.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return localize_many(DocumentResponse, rows, locale, DOCUMENT_LABELS)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    doc_in: DocumentCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    doc = Document(**doc_in.model_dump())
    if not doc.sha256_hash:
        seed = f"{doc.title}:{doc.file_url}:{datetime.now(timezone.utc).isoformat()}"
        doc.sha256_hash = hashlib.sha256(seed.encode("utf-8")).hexdigest()

    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return localize(DocumentResponse, doc, locale, DOCUMENT_LABELS)


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    ulpin: str = Form(...),
    doc_type: str = Form("Record of Rights"),
    title: Optional[str] = Form(None),
    application_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_user: Optional[User] = Depends(get_current_user),
) -> Any:
    """Attach a file to a parcel and record it in the audit trail."""
    reference = (ulpin or "").strip()
    parcel = (await db.execute(select(Parcel).where(Parcel.ulpin == reference))).scalars().first()
    if not parcel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.parcel_not_found", locale, reference=reference),
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=t("error.empty_upload", locale),
        )

    file_hash = hashlib.sha256(content).hexdigest()
    file_size_kb = max(1, len(content) // 1024)
    stored_name = (file.filename or f"{file_hash[:12]}.pdf").strip()
    file_url = f"https://bhuniti-storage.local/uploads/{stored_name}"

    # When Supabase Storage is configured, keep the returned public URL.
    supabase = get_supabase()
    if supabase:
        try:
            supabase.storage.from_("bhuniti-docs").upload(
                stored_name,
                content,
                {"content-type": file.content_type or "application/octet-stream"},
            )
            file_url = supabase.storage.from_("bhuniti-docs").get_public_url(stored_name)
        except Exception:
            # Storage is optional in local/demo runs; keep the placeholder URL.
            pass

    document = Document(
        parcel_id=parcel.id,
        ulpin=parcel.ulpin,
        application_id=application_id or None,
        title=(title or stored_name)[:200],
        doc_type=doc_type,
        file_url=file_url,
        file_format=_extension(stored_name),
        file_size_kb=file_size_kb,
        sha256_hash=file_hash,
        is_verified=False,
        uploaded_by=(current_user.full_name or current_user.username) if current_user else "User Upload",
    )
    db.add(document)

    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Document Uploaded",
        actor_name=actor_name,
        actor_role=actor_role,
        details=t("audit.document_uploaded", locale, title=document.title, ulpin=parcel.ulpin),
        ulpin=parcel.ulpin,
        parcel_id=parcel.id,
        new_state={"document": document.title, "sha256": file_hash},
    )

    await db.commit()
    await db.refresh(document)
    return localize(DocumentResponse, document, locale, DOCUMENT_LABELS)
