"""Admin endpoints for Officer management (District Officer / Admin only)."""
import hashlib
import secrets
import string
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale, require_role
from app.core.audit_trail import actor_from_user, append_audit
from app.core.config import settings
from app.core.database import get_db
from app.core.i18n import t
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import OfficerCreateRequest, OfficerCreateResponse
from app.services.email_service import send_officer_credentials_email

router = APIRouter()


def _generate_temp_password(length: int = 12) -> str:
    """Generate a high-entropy temporary password containing uppercase, lowercase, digits, and symbols."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    while True:
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        if (
            any(c.islower() for c in password)
            and any(c.isupper() for c in password)
            and any(c.isdigit() for c in password)
            and any(c in "!@#$%^&*" for c in password)
        ):
            return password


@router.post("/officers", response_model=OfficerCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_revenue_officer(
    payload: OfficerCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Admin-only creation of new Revenue Officer account.

    Generates a secure temporary password, hashes government ID references at rest (zero raw PII),
    sets force_password_change=True, and emails credentials via EmailJS.
    """
    clean_username = payload.username.strip()
    clean_email = payload.email.strip().lower()

    # Check for existing username or email
    existing_user = (
        await db.execute(
            select(User).where((User.username == clean_username) | (User.email == clean_email))
        )
    ).scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this username or email already exists.",
        )

    temp_password = _generate_temp_password(12)
    gov_id_clean = payload.gov_id_number.replace(" ", "").replace("-", "").strip()
    gov_id_hash = hashlib.sha256((gov_id_clean + settings.AADHAAR_HASH_SALT).encode("utf-8")).hexdigest()
    gov_id_last4 = gov_id_clean[-4:] if len(gov_id_clean) >= 4 else gov_id_clean

    new_officer = User(
        id=str(uuid.uuid4()),
        username=clean_username,
        email=clean_email,
        hashed_password=get_password_hash(temp_password),
        role="revenue_officer",
        full_name=payload.full_name.strip(),
        phone=payload.phone.strip(),
        designation=payload.designation or "Revenue Officer",
        district=payload.district or "Ghaziabad",
        tehsil=payload.tehsil or "Modinagar",
        preferred_locale="en",
        is_active=True,
        status="pending",
        force_password_change=True,
        gov_id_type=payload.gov_id_type.strip(),
        gov_id_hash=gov_id_hash,
        gov_id_last4=gov_id_last4,
    )
    db.add(new_officer)

    # Log action in cryptographic audit trail
    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Officer Account Created",
        actor_name=actor_name,
        actor_role=actor_role,
        details=f"Created Revenue Officer account for '{new_officer.full_name}' (username: {new_officer.username}, tehsil: {new_officer.tehsil}) with Gov ID reference ({new_officer.gov_id_type} ****{new_officer.gov_id_last4}).",
        new_state={
            "officer_id": new_officer.id,
            "username": new_officer.username,
            "role": new_officer.role,
            "tehsil": new_officer.tehsil,
            "force_password_change": True,
        },
    )

    await db.commit()
    await db.refresh(new_officer)

    # Email temporary credentials via EmailJS
    await send_officer_credentials_email(
        to_email=new_officer.email,
        to_name=new_officer.full_name,
        username=new_officer.username,
        temp_password=temp_password,
        role="revenue_officer",
    )

    return OfficerCreateResponse(
        id=new_officer.id,
        username=new_officer.username,
        email=new_officer.email,
        role=new_officer.role,
        full_name=new_officer.full_name,
        designation=new_officer.designation,
        district=new_officer.district,
        tehsil=new_officer.tehsil,
        gov_id_type=new_officer.gov_id_type,
        gov_id_last4=new_officer.gov_id_last4,
        status=new_officer.status,
        message="Officer account created successfully and credentials dispatched via email.",
    )
