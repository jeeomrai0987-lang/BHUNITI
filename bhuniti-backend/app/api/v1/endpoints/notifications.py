from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_locale, require_role
from app.core.database import get_db
from app.core.i18n import t
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationCreate, NotificationResponse, NotificationUpdate

router = APIRouter()

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    user_id: Optional[str] = Query(None, description="Filter by user ID (Officers only)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Retrieve notifications for the current authenticated user or district oversight for officers."""
    filters = []
    if current_user.role in ("revenue_officer", "district_officer"):
        if user_id:
            filters.append((Notification.user_id == user_id) | (Notification.user_id.is_(None)))
    else:
        filters.append(
            (Notification.user_id == current_user.id) | (Notification.user_id.is_(None))
        )
    if unread_only:
        filters.append(Notification.read_status.is_(False))

    query = select(Notification).order_by(desc(Notification.created_at)).limit(limit)
    if filters:
        query = query.where(*filters)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification_in: NotificationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Create a new notification entry (officer only)."""
    notification = Notification(**notification_in.model_dump())
    if not notification.user_id:
        notification.user_id = current_user.id

    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    update_in: Optional[NotificationUpdate] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["citizen", "revenue_officer", "district_officer"])),
    locale: str = Depends(get_locale),
) -> Any:
    """Mark a notification as read/unread."""
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=t("error.not_found", locale, default="Notification not found"),
        )

    if update_in and update_in.read_status is not None:
        notification.read_status = update_in.read_status
    else:
        notification.read_status = True

    await db.commit()
    await db.refresh(notification)
    return notification
