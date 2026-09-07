"""Language discovery and catalog delivery for the frontend.

The React app ships its own UI strings, but domain values (statuses, stages,
document types) and place names live server-side. These two endpoints let the
portal fetch the same catalog the API translates with, so a value the backend
knows about never renders untranslated in the browser.
"""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_locale
from app.core.database import get_db
from app.core.i18n import available_locales, bundle, normalize_locale
from app.core.ref_data import place_names
from app.models.parcel import Parcel

router = APIRouter()

# Cached by the browser for an hour: catalogs only change on deploy.
_CACHE_CONTROL = "public, max-age=3600"


@router.get("/locales")
async def list_locales() -> Any:
    """``[{"code": "hi", "name": "हिन्दी"}, ...]`` for the language switcher."""
    return {"default": "en", "locales": available_locales()}


@router.get("/catalog")
async def get_catalog(
    response: Response,
    sections: Optional[str] = Query(
        None, description="Comma-separated subset of 'messages,labels'. Defaults to both."
    ),
    locale: str = Depends(get_locale),
) -> Any:
    """The message + label catalog for one locale, English-merged."""
    wanted = [part.strip() for part in (sections or "messages,labels").split(",") if part.strip()]
    allowed = [part for part in wanted if part in ("messages", "labels")] or ["messages", "labels"]
    response.headers["Cache-Control"] = _CACHE_CONTROL
    return {"locale": normalize_locale(locale), "sections": allowed, **bundle(locale, allowed)}


@router.get("/place-names")
async def get_place_names(
    entity_type: str = Query("tehsil", pattern="^(state|district|tehsil|village)$"),
    locale: str = Depends(get_locale),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Localized district/tehsil/village names, plus the English keys in use.

    ``known`` lists the values that actually appear on parcels, so the portal can
    tell an untranslated place from a misspelt one.
    """
    column = {
        "state": Parcel.state,
        "district": Parcel.district,
        "tehsil": Parcel.tehsil,
        "village": Parcel.village,
    }[entity_type]

    known: List[str] = [
        value
        for (value,) in (
            await db.execute(select(column).where(column.isnot(None)).distinct().order_by(column))
        ).all()
        if value
    ]
    translations: Dict[str, str] = await place_names(db, entity_type, locale, known)
    return {
        "locale": normalize_locale(locale),
        "entity_type": entity_type,
        "known": known,
        "translations": translations,
    }
