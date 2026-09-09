"""Locale resolution and message/label translation for the BHUNITI API.

Design notes
------------
* Domain values (``status``, ``severity``, ``land_type`` ...) stay in the database
  exactly as they are today -- English display text such as ``"In Progress"``.
  Nothing here rewrites stored data. Instead every response that carries such a
  value also carries a sibling ``*_label`` field holding the translation for the
  caller's locale, so filters and queries keep working unchanged.
* Locale comes from ``?lang=`` (wins) or the ``Accept-Language`` header, and
  falls back to English. Unknown locales never raise -- they degrade to English.
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Iterable, Optional

SUPPORTED_LOCALES: tuple[str, ...] = ("en", "hi", "mr", "bn", "ta")
DEFAULT_LOCALE = "en"

LOCALE_NAMES: Dict[str, str] = {
    "en": "English",
    "hi": "हिन्दी",
    "mr": "मराठी",
    "bn": "বাংলা",
    "ta": "தமிழ்",
}

_LOCALE_DIR = Path(__file__).resolve().parent.parent / "i18n" / "locales"


def normalize_locale(value: Optional[str]) -> str:
    """Map anything user-supplied onto a supported locale code."""
    if not value:
        return DEFAULT_LOCALE
    tag = value.strip().lower().replace("_", "-")
    if tag in SUPPORTED_LOCALES:
        return tag
    primary = tag.split("-", 1)[0]
    if primary in SUPPORTED_LOCALES:
        return primary
    return DEFAULT_LOCALE


def parse_accept_language(header: Optional[str]) -> str:
    """Pick the best supported locale out of an ``Accept-Language`` header."""
    if not header:
        return DEFAULT_LOCALE
    candidates: list[tuple[float, str]] = []
    for part in header.split(","):
        piece = part.strip()
        if not piece:
            continue
        tag, _, params = piece.partition(";")
        quality = 1.0
        if params.strip().startswith("q="):
            try:
                quality = float(params.strip()[2:])
            except ValueError:
                quality = 0.0
        tag = tag.strip().lower().replace("_", "-")
        primary = tag.split("-", 1)[0]
        if tag in SUPPORTED_LOCALES:
            candidates.append((quality, tag))
        elif primary in SUPPORTED_LOCALES:
            candidates.append((quality, primary))
    if not candidates:
        return DEFAULT_LOCALE
    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]


def resolve_locale(lang: Optional[str] = None, accept_language: Optional[str] = None) -> str:
    """``?lang=`` beats ``Accept-Language`` beats English."""
    if lang:
        normalized = normalize_locale(lang)
        if normalized != DEFAULT_LOCALE or lang.strip().lower().startswith("en"):
            return normalized
    return parse_accept_language(accept_language)


@lru_cache(maxsize=None)
def _catalog(locale: str) -> Dict[str, Any]:
    path = _LOCALE_DIR / f"{locale}.json"
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _lookup(locale: str, section: str, key: str) -> Optional[str]:
    value = _catalog(locale).get(section, {}).get(key)
    return value if isinstance(value, str) else None


def t(key: str, locale: str = DEFAULT_LOCALE, **params: Any) -> str:
    """Translate a message key, falling back to English then to the key itself."""
    locale = normalize_locale(locale)
    template = _lookup(locale, "messages", key)
    if template is None and locale != DEFAULT_LOCALE:
        template = _lookup(DEFAULT_LOCALE, "messages", key)
    if template is None:
        template = key
    if not params:
        return template
    try:
        return template.format(**params)
    except (KeyError, IndexError, ValueError):
        return template


def label(domain: str, value: Optional[str], locale: str = DEFAULT_LOCALE) -> Optional[str]:
    """Translate a stored English domain value (``status``, ``severity`` ...).

    Returns the original value when no translation exists, so a newly invented
    status shows up verbatim instead of disappearing.
    """
    if value is None:
        return None
    locale = normalize_locale(locale)
    domains = _catalog(locale).get("labels", {})
    translated = domains.get(domain, {}).get(value)
    if translated is None and locale != DEFAULT_LOCALE:
        translated = _catalog(DEFAULT_LOCALE).get("labels", {}).get(domain, {}).get(value)
    return translated or value


def label_domain(domain: str, locale: str = DEFAULT_LOCALE) -> Dict[str, str]:
    """Every known value of one domain mapped to its translation."""
    locale = normalize_locale(locale)
    english = _catalog(DEFAULT_LOCALE).get("labels", {}).get(domain, {})
    localized = _catalog(locale).get("labels", {}).get(domain, {})
    return {value: localized.get(value, value) for value in english}


def bundle(locale: str = DEFAULT_LOCALE, sections: Iterable[str] = ("messages", "labels")) -> Dict[str, Any]:
    """Whole catalog for a locale, English-merged, for the ``/i18n`` endpoint."""
    locale = normalize_locale(locale)
    base = _catalog(DEFAULT_LOCALE)
    override = _catalog(locale)
    out: Dict[str, Any] = {}
    for section in sections:
        merged: Dict[str, Any] = {}
        for key, value in base.get(section, {}).items():
            if isinstance(value, dict):
                merged[key] = {**value, **override.get(section, {}).get(key, {})}
            else:
                merged[key] = override.get(section, {}).get(key, value)
        out[section] = merged
    return out


def available_locales() -> list[dict[str, str]]:
    return [{"code": code, "name": LOCALE_NAMES[code]} for code in SUPPORTED_LOCALES]
