"""Login, the current user, registration and the language preference.

Deliberately unchanged here (outside the approved fix scope): the demo ``1234``
credential fallback, the plaintext comparison inside ``core.security`` and the
``role`` field accepted by ``/register``. What changed is honesty and language:
messages come from the catalogs, the response carries ``preferred_locale`` so a
fresh login reopens the portal in the user's language, a duplicate username
answers 409 instead of 400, and ``PUT /me/locale`` persists a language choice.
"""
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale, require_role
from app.core.database import get_db
from app.core.i18n import DEFAULT_LOCALE, SUPPORTED_LOCALES, normalize_locale, t
from app.core.localize import USER_LABELS, localize
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import (
    LocalePreferenceRequest,
    LoginRequest,
    Token,
    UserCreate,
    UserResponse,
)

router = APIRouter()

# Landing route per role, used by the portal after a successful login.
REDIRECT_BY_ROLE = {
    "citizen": "/citizen",
    "revenue_officer": "/revenue-officer",
    "district_officer": "/administration",
}

# Demo credentials kept for the hackathon walkthrough (password "1234").
DEMO_USERS = {
    "citizen": {"role": "citizen", "name": "Rahul Sharma"},
    "revenue_officer": {"role": "revenue_officer", "name": "Suresh Verma (RO)"},
    "district_officer": {"role": "district_officer", "name": "District Magistrate Office"},
}


def _requested_locale(raw: Optional[str]) -> Optional[str]:
    """Normalized locale, or ``None`` when the tag is not one we support.

    ``hi-IN`` narrows to ``hi``; ``fr`` returns ``None`` rather than silently
    becoming English.
    """
    if not raw:
        return None
    tag = raw.strip().lower()
    normalized = normalize_locale(tag)
    if normalized == DEFAULT_LOCALE and not tag.startswith("en"):
        return None
    return normalized


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
) -> Any:
    username = login_data.username.strip()
    password = login_data.password.strip()

    user = (await db.execute(select(User).where(User.username == username))).scalars().first()
    if user and verify_password(password, user.hashed_password):
        return Token(
            access_token=create_access_token(subject=user.username, role=user.role),
            role=user.role,
            username=user.username,
            full_name=user.full_name or user.username,
            redirect_url=REDIRECT_BY_ROLE.get(user.role, "/citizen"),
            preferred_locale=normalize_locale(user.preferred_locale or locale),
        )

    if username in DEMO_USERS and password == "1234":
        demo = DEMO_USERS[username]
        return Token(
            access_token=create_access_token(subject=username, role=demo["role"]),
            role=demo["role"],
            username=username,
            full_name=demo["name"],
            redirect_url=REDIRECT_BY_ROLE[demo["role"]],
            preferred_locale=locale,
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=t("error.invalid_credentials", locale),
        headers={"WWW-Authenticate": "Bearer"},
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
    existing = (
        (await db.execute(select(User).where(User.username == user_in.username))).scalars().first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=t("error.username_taken", locale),
        )

    # Self-registration is strictly locked down to the "citizen" role.
    # Role elevation must be performed by an admin through PATCH /api/v1/users/{id}/role.
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
