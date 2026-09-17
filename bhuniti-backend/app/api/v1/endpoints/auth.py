"""Login, OTP verification, citizen self-signup (mobile + Aadhaar), password change, and profile management."""
import hashlib
import logging
import re
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession


from app.api.deps import get_current_user, get_locale, require_role
from app.core.audit_trail import actor_from_user, append_audit
from app.core.config import settings
from app.core.database import get_db
from app.core.i18n import DEFAULT_LOCALE, SUPPORTED_LOCALES, normalize_locale, t
from app.core.limiter import limiter
from app.core.localize import USER_LABELS, localize
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.verhoeff import validate_verhoeff
from app.models.otp import OtpVerification
from app.models.pending_signup import PendingSignup
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LocalePreferenceRequest,
    LoginRequest,
    RequestOtpRequest,
    RequestOtpResponse,
    SignupAadhaarRequest,
    SignupAadhaarResponse,
    SignupCompleteRequest,
    SignupStartRequest,
    SignupStartResponse,
    SignupVerifyAadhaarRequest,
    SignupVerifyAadhaarResponse,
    SignupVerifyMobileRequest,
    SignupVerifyMobileResponse,
    Token,
    UserCreate,
    UserResponse,
    VerifyOtpRequest,
)
from app.services.email_service import send_otp_email

router = APIRouter()
logger = logging.getLogger("bhuniti-auth")

REDIRECT_BY_ROLE = {
    "citizen": "/citizen",
    "revenue_officer": "/revenue-officer",
    "district_officer": "/administration",
    "admin": "/administration",
}


def _requested_locale(raw: Optional[str]) -> Optional[str]:
    """Normalized locale, or ``None`` when the tag is not one we support."""
    if not raw:
        return None
    tag = raw.strip().lower()
    normalized = normalize_locale(tag)
    if normalized == DEFAULT_LOCALE and not tag.startswith("en"):
        return None
    return normalized


def _mask_email(email: Optional[str]) -> str:
    """Mask email address for privacy (e.g. ro.***@bhuniti.gov.in)."""
    if not email or "@" not in email:
        return "registered email"
    parts = email.split("@")
    name, domain = parts[0], parts[1]
    if len(name) <= 2:
        masked_name = name[0] + "***"
    else:
        masked_name = name[:2] + "***" + name[-1]
    return f"{masked_name}@{domain}"


def _mask_mobile(mobile: str) -> str:
    clean = mobile.replace(" ", "").replace("-", "").strip()
    last4 = clean[-4:] if len(clean) >= 4 else clean
    return f"+91 ******{last4}"


async def find_user_by_identifier(db: AsyncSession, identifier: str) -> Optional[User]:
    """Resolve a user by checking in strict order:
    1. Exact username match
    2. Case-insensitive email match
    3. Normalized mobile number match (supporting +91, 0, or raw 10-digit formats)
    First match wins. Returns None if no match is found.
    """
    raw = (identifier or "").strip()
    if not raw:
        return None

    # 1. Exact username match
    user = (await db.execute(select(User).where(User.username == raw))).scalars().first()
    if user:
        return user

    # 2. Case-insensitive email match
    user = (await db.execute(select(User).where(func.lower(User.email) == raw.lower()))).scalars().first()
    if user:
        return user

    # 3. Mobile number match
    digits = re.sub(r"\D", "", raw)
    if digits:
        last10 = digits[-10:] if len(digits) >= 10 else digits
        possible_phones = [
            raw,
            digits,
            last10,
            f"+91{last10}",
            f"+91 {last10}",
            f"91{last10}",
            f"0{last10}",
        ]
        user = (await db.execute(
            select(User).where(User.phone.in_(possible_phones))
        )).scalars().first()
        if user:
            return user

        # Suffix match fallback for formatted stored phone numbers
        if len(last10) >= 10:
            all_users_with_phone = (await db.execute(select(User).where(User.phone.isnot(None)))).scalars().all()
            for u in all_users_with_phone:
                u_digits = re.sub(r"\D", "", u.phone or "")
                if u_digits.endswith(last10):
                    return u

    return None


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Citizen password login endpoint (supports username, email, or mobile identifier)."""
    identifier = login_data.login_identifier
    password = login_data.password.strip()

    user = await find_user_by_identifier(db, identifier)
    is_demo_cred = (
        settings.DEMO_MODE
        and user is not None
        and user.username in ("citizen", "revenue_officer", "district_officer")
        and password == "1234"
    )
    password_valid = bool(user and user.hashed_password and (verify_password(password, user.hashed_password) or is_demo_cred))
    if not user or not user.is_active or not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.invalid_credentials", locale),
            headers={"WWW-Authenticate": "Bearer"},
        )

    # In production (DEMO_MODE=False), officer accounts must use the official 2FA OTP workflow
    if user.role in ("revenue_officer", "district_officer", "admin") and not settings.DEMO_MODE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Officer accounts must authenticate using official Two-Factor Authentication (OTP). Direct password login is disabled in production.",
        )

    # In production (DEMO_MODE=False), reject known default demo passwords
    if not settings.DEMO_MODE and (password in ("1234", "password", "admin", "123456") or user.username in ("citizen", "revenue_officer", "district_officer")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.invalid_credentials", locale),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return Token(
        access_token=create_access_token(subject=user.username, role=user.role),
        role=user.role,
        username=user.username,
        full_name=user.full_name or user.username,
        redirect_url=REDIRECT_BY_ROLE.get(user.role, "/citizen"),
        preferred_locale=normalize_locale(user.preferred_locale or locale),
        force_password_change=bool(user.force_password_change),
    )


@router.post("/request-otp", response_model=RequestOtpResponse)
@limiter.limit("5/15minute")
async def request_otp(
    request: Request,
    payload: RequestOtpRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Request a 6-digit OTP for Revenue Officer or District Officer login (supports username, email, or mobile identifier)."""
    identifier = payload.login_identifier
    password = payload.password.strip()
    claimed_role = payload.claimed_role.strip()

    user = await find_user_by_identifier(db, identifier)

    allowed_roles = ("revenue_officer", "district_officer", "admin")
    role_matches = bool(user) and (
        (user.role == claimed_role) or (claimed_role == "admin" and user.role in ("district_officer", "admin"))
    )

    is_demo_cred = (
        settings.DEMO_MODE
        and user is not None
        and user.username in ("revenue_officer", "district_officer", "admin")
        and password == "1234"
    )
    password_valid = bool(user and user.hashed_password and (verify_password(password, user.hashed_password) or is_demo_cred))

    if (
        not user
        or not user.is_active
        or not password_valid
        or not role_matches
        or user.role not in allowed_roles
        or (not settings.DEMO_MODE and (password in ("1234", "password", "admin", "123456") or user.username in ("revenue_officer", "district_officer", "admin")))
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.invalid_credentials", locale),
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Invalidate previous unexpired login OTPs for this user
    old_otps = (
        await db.execute(
            select(OtpVerification).where(
                OtpVerification.user_id == user.id,
                OtpVerification.purpose == "login",
            )
        )
    ).scalars().all()
    for old_otp in old_otps:
        await db.delete(old_otp)

    otp_code = f"{secrets.randbelow(900000) + 100000:06d}"
    otp_hash = hashlib.sha256(otp_code.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    otp_record = OtpVerification(
        id=str(uuid.uuid4()),
        user_id=user.id,
        otp_hash=otp_hash,
        purpose="login",
        created_at=datetime.now(timezone.utc),
        expires_at=expires_at,
        attempt_count=0,
        max_attempts=5,
    )
    db.add(otp_record)
    await db.commit()

    # Dispatch OTP email via EmailJS
    purpose = f"{user.role.replace('_', ' ').title()} Login"
    sent = await send_otp_email(
        to_email=user.email or "",
        to_name=user.full_name or user.username,
        otp_code=otp_code,
        role=user.role,
        purpose=purpose,
    )
    if not sent and (settings.EMAILJS_SERVICE_ID and settings.EMAILJS_PUBLIC_KEY):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to deliver OTP email via EmailJS. Please check email service configuration.",
        )

    masked = _mask_email(user.email)
    return RequestOtpResponse(
        status="success",
        message=t("message.otp_sent", locale),
        masked_email=masked,
        expires_in_seconds=300,
        otp_code=otp_code if settings.DEMO_MODE else None,
    )


@router.post("/verify-otp", response_model=Token)
@limiter.limit("5/15minute")
async def verify_otp(
    request: Request,
    payload: VerifyOtpRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Verify 6-digit OTP and issue authentication JWT token."""
    identifier = payload.login_identifier
    otp_candidate = payload.otp.strip()

    user = await find_user_by_identifier(db, identifier)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.invalid_credentials", locale),
            headers={"WWW-Authenticate": "Bearer"},
        )


    otp_record = (
        await db.execute(
            select(OtpVerification)
            .where(
                OtpVerification.user_id == user.id,
                OtpVerification.purpose == "login",
            )
            .order_by(OtpVerification.created_at.desc())
        )
    ).scalars().first()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=t("error.otp_invalid", locale),
        )

    now_utc = datetime.now(timezone.utc)
    if now_utc > otp_record.expires_at:
        await db.delete(otp_record)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=t("error.otp_expired", locale),
        )

    if otp_record.attempt_count >= otp_record.max_attempts:
        await db.delete(otp_record)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=t("error.otp_max_attempts", locale),
        )

    candidate_hash = hashlib.sha256(otp_candidate.encode("utf-8")).hexdigest()
    if candidate_hash != otp_record.otp_hash:
        otp_record.attempt_count += 1
        db.add(otp_record)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.otp_invalid", locale),
        )

    # Valid OTP: single-use delete
    await db.delete(otp_record)
    await db.commit()

    return Token(
        access_token=create_access_token(subject=user.username, role=user.role),
        role=user.role,
        username=user.username,
        full_name=user.full_name or user.username,
        redirect_url=REDIRECT_BY_ROLE.get(user.role, "/citizen"),
        preferred_locale=normalize_locale(user.preferred_locale or locale),
        force_password_change=bool(user.force_password_change),
    )


# ── Multi-Step Citizen Self-Signup (Mobile OTP + Aadhaar OTP) ────────────────

@router.post("/signup/start", response_model=SignupStartResponse)
@limiter.limit("5/15minute")
async def signup_start(
    request: Request,
    payload: SignupStartRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Step 1: Collect citizen details and dispatch 6-digit Mobile OTP via SMS Gateway."""
    clean_mobile = payload.mobile.replace(" ", "").replace("-", "").strip()
    if not clean_mobile.isdigit() or len(clean_mobile) != 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid 10-digit Indian mobile number.",
        )

    # Check if mobile already linked to an existing registered user
    existing_user = (
        await db.execute(select(User).where(User.phone == clean_mobile))
    ).scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this mobile number already exists. Please log in.",
        )

    otp_code = f"{secrets.randbelow(900000) + 100000:06d}"
    otp_hash = hashlib.sha256(otp_code.encode("utf-8")).hexdigest()
    signup_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    clean_email = payload.email.strip().lower()

    # Invalidate previous uncompleted signups with this mobile or email
    old_signups = (
        await db.execute(
            select(PendingSignup).where(
                (PendingSignup.mobile == clean_mobile) | (PendingSignup.email == clean_email)
            )
        )
    ).scalars().all()
    for s in old_signups:
        await db.delete(s)

    pending = PendingSignup(
        id=str(uuid.uuid4()),
        signup_token=signup_token,
        full_name=payload.full_name.strip(),
        mobile=clean_mobile,
        email=clean_email,
        district=payload.district or "Ghaziabad",
        tehsil=payload.tehsil or "Modinagar",
        mobile_otp_hash=otp_hash,
        mobile_verified=False,
        created_at=datetime.now(timezone.utc),
        expires_at=expires_at,
    )
    db.add(pending)
    await db.commit()

    # Dispatch Mobile OTP via EmailJS to the registered citizen email
    try:
        sent = await send_otp_email(
            to_email=clean_email,
            to_name=pending.full_name,
            otp_code=otp_code,
            role="citizen",
            purpose="Citizen Registration Mobile OTP",
        )
        if not sent and (settings.EMAILJS_SERVICE_ID and settings.EMAILJS_PUBLIC_KEY):
            logger.error("EmailJS dispatch returned failure for citizen signup start: %s (%s)", pending.full_name, clean_email)
    except Exception as exc:
        logger.error("EmailJS dispatch exception during citizen signup start for %s (%s): %s", pending.full_name, clean_email, exc, exc_info=True)

    return SignupStartResponse(
        status="mobile_otp_sent",
        signup_token=signup_token,
        masked_mobile=_mask_mobile(clean_mobile),
        expires_in_seconds=1800,
        otp_code=otp_code if settings.DEMO_MODE else None,
    )


@router.post("/signup/verify-mobile", response_model=SignupVerifyMobileResponse)
@limiter.limit("10/15minute")
async def signup_verify_mobile(
    request: Request,
    payload: SignupVerifyMobileRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Step 2: Verify the mobile OTP code."""
    pending = (
        await db.execute(
            select(PendingSignup).where(PendingSignup.signup_token == payload.signup_token.strip())
        )
    ).scalars().first()

    if not pending or datetime.now(timezone.utc) > pending.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Signup session expired or invalid. Please start again.",
        )

    candidate_hash = hashlib.sha256(payload.otp.strip().encode("utf-8")).hexdigest()
    if candidate_hash != pending.mobile_otp_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.otp_invalid", locale),
        )

    pending.mobile_verified = True
    db.add(pending)
    await db.commit()

    return SignupVerifyMobileResponse(
        status="mobile_verified",
        message="Mobile number verified successfully.",
    )


@router.post("/signup/aadhaar", response_model=SignupAadhaarResponse)
@limiter.limit("5/15minute")
async def signup_aadhaar(
    request: Request,
    payload: SignupAadhaarRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Step 3: Collect Aadhaar number, validate Verhoeff checksum, hash for deduplication, and send simulated OTP."""
    pending = (
        await db.execute(
            select(PendingSignup).where(PendingSignup.signup_token == payload.signup_token.strip())
        )
    ).scalars().first()

    if not pending or not pending.mobile_verified or datetime.now(timezone.utc) > pending.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile verification required before Aadhaar e-KYC.",
        )

    aadhaar_clean = payload.aadhaar_number.replace(" ", "").replace("-", "").strip()
    if not validate_verhoeff(aadhaar_clean):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 12-digit Aadhaar number (Verhoeff checksum validation failed).",
        )

    # Salted hash for deduplication (zero raw Aadhaar stored)
    aadhaar_hash = hashlib.sha256((aadhaar_clean + settings.AADHAAR_HASH_SALT).encode("utf-8")).hexdigest()
    aadhaar_last4 = aadhaar_clean[-4:]

    # Check if Aadhaar is already registered
    existing_aadhaar = (
        await db.execute(select(User).where(User.aadhaar_hash == aadhaar_hash))
    ).scalars().first()
    if existing_aadhaar:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account is already registered with this Aadhaar number. Please log in.",
        )

    # Simulated Aadhaar OTP for hackathon prototype
    simulated_otp = f"{secrets.randbelow(900000) + 100000:06d}"
    aadhaar_otp_hash = hashlib.sha256(simulated_otp.encode("utf-8")).hexdigest()

    pending.aadhaar_hash = aadhaar_hash
    pending.aadhaar_last4 = aadhaar_last4
    pending.aadhaar_otp_hash = aadhaar_otp_hash
    pending.aadhaar_verified = False
    db.add(pending)
    await db.commit()

    # Dispatch simulated Aadhaar OTP via EmailJS to citizen email
    recipient_email = pending.email or f"{pending.mobile}@bhuniti.gov.in"
    try:
        sent = await send_otp_email(
            to_email=recipient_email,
            to_name=pending.full_name,
            otp_code=simulated_otp,
            role="citizen",
            purpose="Aadhaar e-KYC Verification",
        )
        if not sent and (settings.EMAILJS_SERVICE_ID and settings.EMAILJS_PUBLIC_KEY):
            logger.error("EmailJS dispatch returned failure for citizen Aadhaar OTP: %s (%s)", pending.full_name, recipient_email)
    except Exception as exc:
        logger.error("EmailJS dispatch exception during citizen Aadhaar OTP for %s: %s", recipient_email, exc, exc_info=True)

    return SignupAadhaarResponse(
        status="aadhaar_otp_sent",
        masked_aadhaar=f"XXXX-XXXX-{aadhaar_last4}",
        is_simulated=True,
        message="Aadhaar e-KYC OTP triggered (simulated for prototype)",
        otp_code=simulated_otp if settings.DEMO_MODE else None,
    )


@router.post("/signup/verify-aadhaar", response_model=SignupVerifyAadhaarResponse)
@limiter.limit("10/15minute")
async def signup_verify_aadhaar(
    request: Request,
    payload: SignupVerifyAadhaarRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Step 4: Verify the Aadhaar e-KYC OTP."""
    pending = (
        await db.execute(
            select(PendingSignup).where(PendingSignup.signup_token == payload.signup_token.strip())
        )
    ).scalars().first()

    if not pending or not pending.mobile_verified or not pending.aadhaar_otp_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid registration stage.",
        )

    candidate_hash = hashlib.sha256(payload.otp.strip().encode("utf-8")).hexdigest()
    if candidate_hash != pending.aadhaar_otp_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.otp_invalid", locale),
        )

    pending.aadhaar_verified = True
    db.add(pending)
    await db.commit()

    return SignupVerifyAadhaarResponse(
        status="aadhaar_verified",
        message="Aadhaar verified successfully (simulated prototype).",
    )


@router.post("/signup/complete", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup_complete(
    payload: SignupCompleteRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Step 5: Set password and finalize account creation (strictly gated on dual Mobile + Aadhaar verification)."""
    pending = (
        await db.execute(
            select(PendingSignup).where(PendingSignup.signup_token == payload.signup_token.strip())
        )
    ).scalars().first()

    if (
        not pending
        or not pending.mobile_verified
        or not pending.aadhaar_verified
        or datetime.now(timezone.utc) > pending.expires_at
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration incomplete: both Mobile and Aadhaar verification must be satisfied.",
        )

    clean_username = payload.username.strip()
    if len(clean_username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 3 characters long.",
        )

    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long.",
        )

    existing_user = (
        await db.execute(select(User).where(User.username == clean_username))
    ).scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=t("error.username_taken", locale),
        )

    new_user = User(
        id=str(uuid.uuid4()),
        username=clean_username,
        email=pending.email,
        hashed_password=get_password_hash(payload.password),
        role="citizen",
        full_name=pending.full_name,
        phone=pending.mobile,
        district=pending.district,
        tehsil=pending.tehsil,
        preferred_locale=_requested_locale(payload.preferred_locale) or DEFAULT_LOCALE,
        is_active=True,
        status="active",
        force_password_change=False,
        aadhaar_hash=pending.aadhaar_hash,
        aadhaar_last4=pending.aadhaar_last4,
    )
    db.add(new_user)

    # Log citizen registration in audit trail
    await append_audit(
        db,
        action_type="Citizen Registered",
        actor_name=new_user.full_name,
        actor_role="Citizen",
        details=f"Citizen '{new_user.full_name}' self-registered with verified Mobile (+91 ****{new_user.phone[-4:]}) and Aadhaar (XXXX-XXXX-{new_user.aadhaar_last4}).",
        new_state={
            "user_id": new_user.id,
            "username": new_user.username,
            "role": "citizen",
            "district": new_user.district,
        },
    )

    # Purge pending signup record
    await db.delete(pending)
    await db.commit()
    await db.refresh(new_user)

    return Token(
        access_token=create_access_token(subject=new_user.username, role=new_user.role),
        role=new_user.role,
        username=new_user.username,
        full_name=new_user.full_name,
        redirect_url="/citizen",
        preferred_locale=new_user.preferred_locale,
        force_password_change=False,
    )


# ── Forced & Authenticated Password Change ───────────────────────────────────

@router.post("/change-password", response_model=Token)
async def change_password(
    payload: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    locale: str = Depends(get_locale),
) -> Any:
    """Change account password (used for forced password change on first login and general password updates)."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password entered is incorrect.",
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long.",
        )

    current_user.hashed_password = get_password_hash(payload.new_password)
    current_user.force_password_change = False
    current_user.status = "active"
    db.add(current_user)

    actor_name, actor_role = actor_from_user(current_user)
    await append_audit(
        db,
        action_type="Password Changed",
        actor_name=actor_name,
        actor_role=actor_role,
        details=f"User '{current_user.username}' successfully updated their account password.",
        new_state={"user_id": current_user.id, "force_password_change": False, "status": "active"},
    )

    await db.commit()
    await db.refresh(current_user)

    return Token(
        access_token=create_access_token(subject=current_user.username, role=current_user.role),
        role=current_user.role,
        username=current_user.username,
        full_name=current_user.full_name or current_user.username,
        redirect_url=REDIRECT_BY_ROLE.get(current_user.role, "/citizen"),
        preferred_locale=normalize_locale(current_user.preferred_locale or locale),
        force_password_change=False,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    return localize(UserResponse, current_user, locale, USER_LABELS)


@router.put("/me/locale", response_model=UserResponse)
async def set_my_locale(
    payload: LocalePreferenceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Persist the language the portal should use for this account."""
    requested = _requested_locale(payload.locale)
    if requested is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=t(
                "error.unsupported_locale",
                locale,
                locale_code=payload.locale,
                available=", ".join(SUPPORTED_LOCALES),
            ),
        )

    current_user.preferred_locale = requested
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return localize(UserResponse, current_user, requested, USER_LABELS)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    """Direct registration fallback for backwards compatibility."""
    existing = (
        (await db.execute(select(User).where(User.username == user_in.username))).scalars().first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=t("error.username_taken", locale),
        )

    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role="citizen",
        full_name=user_in.full_name,
        phone=user_in.phone,
        district=user_in.district,
        tehsil=user_in.tehsil,
        preferred_locale=_requested_locale(user_in.preferred_locale) or DEFAULT_LOCALE,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return localize(UserResponse, user, locale, USER_LABELS)
