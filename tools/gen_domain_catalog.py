#!/usr/bin/env python3
"""Generate src/i18n/{en,hi}/domain.js from the backend label catalogs.

The frontend needs the same domain-value labels the backend serves, because
every page falls back to bundled demo fixtures when the API is unreachable --
and those fixtures hold raw English values with no `*_label` sibling. Typing
109 labels twice by hand would guarantee drift, so they are generated from
bhuniti-backend/app/i18n/locales/*.json, which stays the single source of truth.

Run from anywhere: python3 tools/gen_domain_catalog.py
"""
from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
BACKEND = ROOT / "bhuniti-backend" / "app" / "i18n" / "locales"
FRONTEND = ROOT / "bhuniti-react" / "src" / "i18n"

# Values that only ever appear in the frontend's offline fixtures, so they have
# no place in the backend catalog (nothing stores them) but still need a Hindi
# rendering when the demo data is on screen.
FIXTURE_ONLY = {
    "encumbrance_status": {
        "Protected Public Asset": {
            "en": "Protected Public Asset",
            "hi": "संरक्षित सार्वजनिक संपत्ति",
        },
        "Inalienable Gram Sabha Land": {
            "en": "Inalienable Gram Sabha Land",
            "hi": "अहस्तांतरणीय ग्राम सभा भूमि",
        },
    },
    "verification_status": {
        "Requires Verification": {
            "en": "Requires Verification",
            "hi": "सत्यापन आवश्यक",
        },
        "Pending Field Verification": {
            "en": "Pending Field Verification",
            "hi": "क्षेत्र सत्यापन लंबित",
        },
    },
    # The discrepancy register stores a free-text type and status (see
    # bhuniti-backend/db/schema.sql:159), so the demo caseload on the
    # Discrepancy Cases screen carries a few states the backend catalog never
    # had a reason to name.
    "discrepancy_type": {
        "Missing Survey Point": {
            "en": "Missing Survey Point",
            "hi": "सर्वेक्षण बिंदु अनुपलब्ध",
        },
    },
    "discrepancy_status": {
        "Pending Evidence": {
            "en": "Pending Evidence",
            "hi": "साक्ष्य अपेक्षित",
        },
        "Legal Hold": {
            "en": "Legal Hold",
            "hi": "विधिक रोक",
        },
        "Assigned Surveyor": {
            "en": "Assigned Surveyor",
            "hi": "सर्वेक्षक आवंटित",
        },
    },
    # The evidence repository holds a court order among the deeds and maps; the
    # backend catalog only names the document types the upload endpoint
    # defaults to, and nothing files a court order through that route yet.
    "doc_type": {
        "Court Order": {
            "en": "Court Order",
            "hi": "न्यायालय आदेश",
        },
    },
    # The officer dashboard's activity log shows the moment a reconciliation run
    # raises a case, which is one step earlier than the backend's
    # "Discrepancy Resolved" audit action.
    "action_type": {
        "Discrepancy Flagged": {
            "en": "Discrepancy Flagged",
            "hi": "विसंगति चिह्नित",
        },
    },
}

HEADER = """/*
 * Domain-value labels -- GENERATED, do not edit by hand.
 *
 * Source: bhuniti-backend/app/i18n/locales/{locale}.json (the `labels` block),
 * regenerated with tools/gen_domain_catalog.py.
 *
 * The backend already returns translated `*_label` fields next to every stored
 * English value, and those win when present. This catalog covers the other
 * case: a page that fell back to its bundled offline fixtures, where the raw
 * English value is all there is. Keys are the exact strings stored in the
 * database, so they must not be prettified.
 */

const domain = """

FOOTER = """;

export default domain;
"""


def build(locale: str) -> str:
    labels = json.loads((BACKEND / f"{locale}.json").read_text("utf-8"))["labels"]
    merged: dict[str, dict[str, str]] = {d: dict(v) for d, v in labels.items()}
    for domain_name, extras in FIXTURE_ONLY.items():
        target = merged.setdefault(domain_name, {})
        for value, per_locale in extras.items():
            target[value] = per_locale[locale]
    body = json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=False)
    return HEADER.replace("{locale}", locale) + body + FOOTER


def main() -> int:
    for locale in ("en", "hi"):
        out = FRONTEND / locale / "domain.js"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build(locale), "utf-8")
        count = sum(len(v) for v in json.loads(
            (BACKEND / f"{locale}.json").read_text("utf-8"))["labels"].values())
        extra = sum(len(v) for v in FIXTURE_ONLY.values())
        print(f"{out.relative_to(ROOT)}: {count} backend + {extra} fixture-only labels")
    return 0


if __name__ == "__main__":
    sys.exit(main())
