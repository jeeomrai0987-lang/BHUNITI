"""Shared schema pieces: date coercion and pagination metadata."""
from __future__ import annotations

from datetime import date
from typing import Any, Optional

from pydantic import BaseModel, Field

from app.core.dates import parse_legacy_date


def coerce_date(value: Any) -> Optional[date]:
    """Validator body for date fields.

    Accepts ISO ``YYYY-MM-DD`` plus the legacy display strings the prototype
    sent (``"Oct 24, 2023"``) and the placeholder words it used for "no date
    yet" (``"Pending"``, ``"-"``, ``""``), which become ``None``.
    """
    if value is None or isinstance(value, date):
        return value
    return parse_legacy_date(value)


class PageMeta(BaseModel):
    """Echoed by list endpoints in the ``X-Total-Count`` header too."""

    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class ChainVerification(BaseModel):
    """Result of re-hashing the audit trail (see app.core.audit_trail)."""

    intact: bool
    entries_checked: int
    broken_at_position: Optional[int] = None
    broken_entry_id: Optional[str] = None
    reason: Optional[str] = None
    message: Optional[str] = None
