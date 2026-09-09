"""Reading localized place names out of ``ref_translations``.

Every helper here is failure-tolerant on purpose: a database created before this
table existed (or a locale with no rows seeded) must not turn a dashboard request
into a 500. In that case the caller gets ``None``/``{}`` and keeps showing the
English name it already has.
"""
from __future__ import annotations

import logging
from typing import Dict, Iterable, Optional

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.i18n import DEFAULT_LOCALE, normalize_locale
from app.models.ref_translation import RefTranslation

logger = logging.getLogger(__name__)


async def place_names(
    db: AsyncSession,
    entity_type: str,
    locale: str,
    keys: Optional[Iterable[str]] = None,
) -> Dict[str, str]:
    """``{"Modinagar": "मोदीनगर", ...}`` for one entity type, or ``{}``."""
    locale = normalize_locale(locale)
    if locale == DEFAULT_LOCALE:
        return {}

    statement = select(RefTranslation.entity_key, RefTranslation.value).where(
        RefTranslation.entity_type == entity_type,
        RefTranslation.locale == locale,
    )
    wanted = [key for key in (keys or []) if key]
    if wanted:
        statement = statement.where(RefTranslation.entity_key.in_(wanted))

    try:
        rows = (await db.execute(statement)).all()
    except SQLAlchemyError as exc:  # table missing / not migrated yet
        logger.debug("ref_translations unavailable (%s); falling back to English names", exc)
        await db.rollback()
        return {}
    return {key: value for key, value in rows if key and value}


async def place_name(
    db: AsyncSession, entity_type: str, key: Optional[str], locale: str
) -> Optional[str]:
    """Localized name for a single place, or ``None`` when there is no row."""
    if not key:
        return None
    return (await place_names(db, entity_type, locale, [key])).get(key)
