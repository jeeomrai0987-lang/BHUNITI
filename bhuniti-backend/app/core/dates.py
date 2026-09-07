"""Date parsing/formatting helpers.

Workflow dates used to be stored as English display strings (``"Oct 24, 2023"``,
and sometimes the word ``"Pending"``), which made them impossible to sort, filter
or translate. They are real ``DATE`` columns now; these helpers convert the old
values during migration and keep any string input the API still receives usable.
"""
from __future__ import annotations

from datetime import date, datetime
from typing import Optional, Union

# Values the prototype used in date columns to mean "nothing yet".
_NULL_TOKENS = {"", "-", "--", "—", "n/a", "na", "none", "null", "pending", "in progress", "tbd", "not scheduled"}

_FORMATS = (
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%b %d, %Y",
    "%B %d, %Y",
    "%d %b %Y",
    "%d %B %Y",
    "%b %d %Y",
    "%Y/%m/%d",
    "%d.%m.%Y",
)


def parse_legacy_date(value: Union[str, date, datetime, None]) -> Optional[date]:
    """Best-effort conversion of a legacy date value to a real ``date``.

    Returns ``None`` for empty values and for the placeholder words the
    prototype stored in date columns, so "Pending" becomes an absent date
    rather than an unparseable string.
    """
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value

    text = str(value).strip()
    if not text or text.lower() in _NULL_TOKENS:
        return None

    for fmt in _FORMATS:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue

    # Last resort: ISO-ish strings with a time component.
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00")).date()
    except ValueError:
        return None


def to_iso(value: Union[str, date, datetime, None]) -> Optional[str]:
    """ISO-8601 ``YYYY-MM-DD``, which every locale can format client-side."""
    parsed = parse_legacy_date(value)
    return parsed.isoformat() if parsed else None
