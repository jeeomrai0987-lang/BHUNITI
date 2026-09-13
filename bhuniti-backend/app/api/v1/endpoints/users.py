"""Admin user management endpoints for role elevation and user administration."""
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale, require_role
from app.core.audit_trail import actor_from_user, append_audit
from app.core.database import get_db
from app.core.i18n import label, t
from app.core.localize import USER_LABELS, localize, localize_many
from app.models.user import User
from app.schemas.user import (
    UserAdminResponse,
    UserRoleUpdateRequest,
    UserStatusUpdateRequest,
)

router = APIRouter()


@router.get("", response_model=List[UserAdminResponse])
async def list_users(
    response: Response,
    query: Optional[str] = Query(None, description="Search by username, full name, or email"),
    role: Optional[str] = Query(None, description="Filter by role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    district: Optional[str] = None,
    tehsil: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_admin: User = Depends(require_role(["district_officer"])),
) -> Any:
    """List registered users. Accessible only by District Officers (Administrators)."""
    filters = []
    if query:
        pattern = f"%{query.strip()}%"
        filters.append(
            or_(
                User.username.ilike(pattern),
                User.full_name.ilike(pattern),
                User.email.ilike(pattern),
            )
        )
    if role:
        filters.append(User.role == role.strip())
    if is_active is not None:
        filters.append(User.is_active == is_active)
    if district:
        filters.append(User.district == district.strip())
    if tehsil:
        filters.append(User.tehsil == tehsil.strip())

    total = await db.scalar(select(func.count(User.id)).where(*filters)) or 0
    rows = (
        (
            await db.execute(
                select(User).where(*filters).order_by(User.created_at.desc()).limit(limit).offset(offset)
            )
        )
        .scalars()
        .all()
    )

    response.headers["X-Total-Count"] = str(total)
    return localize_many(UserAdminResponse, rows, locale, USER_LABELS)


@router.get("/{user_id}", response_model=UserAdminResponse)
async def get_user_by_id(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_admin: User = Depends(require_role(["district_officer"])),
) -> Any:
    """Retrieve user details by ID or username."""
    ref = user_id.strip()
    user = (
        (
            await db.execute(
                select(User).where((User.id == ref) | (User.username == ref))
            )
        )
        .scalars()
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.user_not_found", locale),
        )
    return localize(UserAdminResponse, user, locale, USER_LABELS)


@router.patch("/{user_id}/role", response_model=UserAdminResponse)
async def update_user_role(
    user_id: str,
    role_in: UserRoleUpdateRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_admin: User = Depends(require_role(["district_officer"])),
) -> Any:
    """Elevate or change a user's role. Restricted to District Officer administrators."""
    ref = user_id.strip()
    user = (
        (
            await db.execute(
                select(User).where((User.id == ref) | (User.username == ref))
            )
        )
        .scalars()
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.user_not_found", locale),
        )

    old_role = user.role
    new_role = role_in.role
    user.role = new_role

    actor_name, actor_role = actor_from_user(current_admin)
    await append_audit(
        db,
        action_type="User Role Elevated",
        actor_name=actor_name,
        actor_role=actor_role,
        details=f"Admin {actor_name} changed role for user '{user.username}' from '{old_role}' to '{new_role}'.",
        old_state={"user": user.username, "role": old_role},
        new_state={"user": user.username, "role": new_role},
    )

    await db.commit()
    await db.refresh(user)
    return localize(UserAdminResponse, user, locale, USER_LABELS)


@router.patch("/{user_id}/status", response_model=UserAdminResponse)
async def update_user_status(
    user_id: str,
    status_in: UserStatusUpdateRequest,
    db: AsyncSession = Depends(get_db),
    locale: str = Depends(get_locale),
    current_admin: User = Depends(require_role(["district_officer"])),
) -> Any:
    """Activate or deactivate a user account."""
    ref = user_id.strip()
    user = (
        (
            await db.execute(
                select(User).where((User.id == ref) | (User.username == ref))
            )
        )
        .scalars()
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.user_not_found", locale),
        )

    old_status = user.is_active
    user.is_active = status_in.is_active

    actor_name, actor_role = actor_from_user(current_admin)
    await append_audit(
        db,
        action_type="User Status Changed",
        actor_name=actor_name,
        actor_role=actor_role,
        details=f"Admin {actor_name} set is_active={user.is_active} for user '{user.username}'.",
        old_state={"user": user.username, "is_active": old_status},
        new_state={"user": user.username, "is_active": user.is_active},
    )

    await db.commit()
    await db.refresh(user)
    return localize(UserAdminResponse, user, locale, USER_LABELS)
