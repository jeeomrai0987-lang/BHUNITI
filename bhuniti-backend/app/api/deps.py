from typing import Optional

from fastapi import Depends, Header, HTTPException, Query, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.i18n import normalize_locale, resolve_locale, t
from app.models.user import User
from app.schemas.auth import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False
)


async def get_locale(
    lang: Optional[str] = Query(
        default=None,
        description="Language override: en, hi, mr, bn or ta. Falls back to Accept-Language.",
    ),
    accept_language: Optional[str] = Header(default=None, alias="Accept-Language"),
) -> str:
    """Locale for this request: ``?lang=`` wins, then ``Accept-Language``, then English.

    Declared as a dependency so every endpoint can translate its messages and
    labels without reading the raw request.
    """
    return resolve_locale(lang, accept_language)


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
    locale: str = Depends(get_locale),
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        token_data = TokenPayload(sub=username, role=payload.get("role"))
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.could_not_validate", locale),
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(User).where(User.username == token_data.sub))
    user = result.scalars().first()
    if user is None:
        # The token is well-formed but the account is gone: that is an auth
        # failure, not a missing page.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=t("error.user_not_found", locale),
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_effective_locale(
    locale: str = Depends(get_locale),
    current_user: Optional[User] = Depends(get_current_user),
) -> str:
    """Same as :func:`get_locale`, but a signed-in user's saved preference is
    used when the request itself does not ask for a language."""
    if current_user is not None and getattr(current_user, "preferred_locale", None):
        # An explicit ?lang=/Accept-Language choice still wins over the profile.
        return locale if locale != "en" else normalize_locale(current_user.preferred_locale)
    return locale


def require_role(allowed_roles: list[str]):
    async def role_checker(
        current_user: Optional[User] = Depends(get_current_user),
        locale: str = Depends(get_locale),
    ) -> User:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=t("error.auth_required", locale),
            )
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=t("error.insufficient_permissions", locale),
            )
        return current_user
    return role_checker
