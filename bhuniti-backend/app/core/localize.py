"""Turn ORM rows into response models with translated ``*_label`` siblings.

Stored domain values stay English (that is what the filters and the audit trail
compare against); every response adds a ``<field>_label`` for the caller's
locale. ``LABEL_DOMAINS`` is the single place that says which field belongs to
which translation domain.
"""
from __future__ import annotations

from typing import Any, Dict, Iterable, List, Mapping, Optional, Type, TypeVar

from pydantic import BaseModel

from app.core.i18n import DEFAULT_LOCALE, label

ModelT = TypeVar("ModelT", bound=BaseModel)

# field name on the ORM object -> domain key in app/i18n/locales/*.json
PARCEL_LABELS: Dict[str, str] = {
    "land_type": "land_type",
    "verification_status": "verification_status",
    "encumbrance_status": "encumbrance_status",
}

APPLICATION_LABELS: Dict[str, str] = {
    "status": "application_status",
    "current_stage": "stage",
    "service_type": "service_type",
}

MUTATION_LABELS: Dict[str, str] = {
    "status": "mutation_status",
    "mutation_type": "mutation_type",
    "party_type": "party_type",
}

DISCREPANCY_LABELS: Dict[str, str] = {
    "status": "discrepancy_status",
    "severity": "severity",
    "discrepancy_type": "discrepancy_type",
}

SURVEY_LABELS: Dict[str, str] = {"status": "survey_status"}

DOCUMENT_LABELS: Dict[str, str] = {"doc_type": "doc_type"}

AUDIT_LABELS: Dict[str, str] = {
    "action_type": "action_type",
    "actor_role": "actor_role",
}

USER_LABELS: Dict[str, str] = {"role": "role"}


def label_updates(source: Any, domains: Mapping[str, str], locale: str = DEFAULT_LOCALE) -> Dict[str, Optional[str]]:
    """``{"status_label": "स्वीकृत", ...}`` for the fields present on ``source``."""
    updates: Dict[str, Optional[str]] = {}
    getter = source.get if isinstance(source, Mapping) else lambda name: getattr(source, name, None)
    for field, domain in domains.items():
        value = getter(field)
        if value is not None:
            updates[f"{field}_label"] = label(domain, value, locale)
    return updates


def localize(
    model_cls: Type[ModelT],
    source: Any,
    locale: str = DEFAULT_LOCALE,
    domains: Optional[Mapping[str, str]] = None,
    extra: Optional[Mapping[str, Any]] = None,
) -> ModelT:
    """Validate ``source`` into ``model_cls`` and attach translated labels."""
    payload = model_cls.model_validate(source)
    updates: Dict[str, Any] = {}
    if domains:
        updates.update(label_updates(source, domains, locale))
    if extra:
        updates.update(extra)
    return payload.model_copy(update=updates) if updates else payload


def localize_many(
    model_cls: Type[ModelT],
    rows: Iterable[Any],
    locale: str = DEFAULT_LOCALE,
    domains: Optional[Mapping[str, str]] = None,
) -> List[ModelT]:
    return [localize(model_cls, row, locale, domains) for row in rows]
