"""Seed the BHUNITI registry with the demo records the UI expects.

What changed from the prototype seeder
--------------------------------------
* It is idempotent. Every insert is guarded by a natural-key lookup, so running
  it twice no longer duplicates the demo parcels (and then fails on the unique
  index half way through, leaving the database part-seeded).
* Foreign keys are real. ``assigned_officer_id`` used to be the string
  ``"revenue_officer"`` -- a username, not a row id -- which now violates the
  foreign key the models declare. Applications, mutations, surveys, documents
  and audit entries are linked to the rows they belong to, which is also what
  makes the district analytics able to group mutations by tehsil.
* Dates are dates. ``submission_date="Oct 24, 2023"`` and
  ``ro_review_date="Pending"`` went into DATE columns; stages that have not
  happened yet are NULL now.
* The audit trail is really chained. The three entries carried fake tamper
  hashes (they were the SHA-256 of "", "a" and "foo") and no ``prev_hash``, so
  ``/audit/verify`` reported the trail as broken on a freshly seeded database.
  They go through ``append_audit`` now, with believable historical timestamps.
* It seeds ``ref_translations`` so village and tehsil names can be shown in
  Hindi. Only Hindi is populated: those are the names the registry data
  actually carries. For a locale with no rows the API falls back to the stored
  English name rather than inventing a transliteration.

Usage
-----
    python db/seed.py                  # insert whatever is missing
    python db/seed.py --ref-only       # only the place-name translations
    python db/seed.py --fresh --yes    # DESTRUCTIVE: delete demo rows, reseed
"""
import argparse
import asyncio
import json
import logging
import sys
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Dict, Optional, Sequence

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import delete, func, select  # noqa: E402

from app.core.audit_trail import append_audit, verify_chain  # noqa: E402
from app.core.database import AsyncSessionLocal, init_models  # noqa: E402
from app.core.security import get_password_hash  # noqa: E402
from app.models import (  # noqa: E402
    Application,
    AuditLog,
    Discrepancy,
    Document,
    Encumbrance,
    Mutation,
    Notification,
    Parcel,
    RefTranslation,
    RegistrationRecord,
    Survey,
    User,
)

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("seed")

# Hindi names for the administrative divisions the frontend already ships in
# src/data/administrativeDivisions.js. entity_key is the canonical English
# spelling stored on the parcel rows.
PLACE_NAMES_HI: Sequence[tuple] = (
    ("state", "Uttar Pradesh", "उत्तर प्रदेश"),
    ("district", "Ghaziabad", "गाज़ियाबाद"),
    ("tehsil", "Modinagar", "मोदीनगर"),
    ("tehsil", "Loni", "लोनी"),
    ("tehsil", "Ghaziabad Sadar", "गाज़ियाबाद सदर"),
    ("tehsil", "Muradnagar", "मुरादनगर"),
    ("tehsil", "Dhaulana", "धौलाना"),
    ("village", "Sikandrabad", "सिकंदराबाद"),
    ("village", "Begumabad", "बेगुमाबाद"),
    ("village", "Bhojpur", "भोजपुर"),
    ("village", "Faridnagar", "फरीदनगर"),
    ("village", "Niwari", "निवाड़ी"),
    ("village", "Patla", "पतला"),
    ("village", "Dharampur", "धरमपुर"),
    ("village", "Tibra", "तिबरा"),
    ("village", "Dostpur", "दोस्तपुर"),
    ("village", "Behta Hajipur", "बेहटा हाजीपुर"),
    ("village", "Banthla", "बंथला"),
    ("village", "Chirori", "चिरोड़ी"),
    ("village", "Mandola", "मंडोला"),
    ("village", "Teela Shahbazpur", "टीला शाहबाज़पुर"),
    ("village", "Pavi Sadakpur", "पावी सादकपुर"),
    ("village", "Nanu", "नानू"),
    ("village", "Razapur", "रजापुर"),
    ("village", "Duhai", "दुहाई"),
    ("village", "Morta", "मोरटा"),
    ("village", "Shahpur Bamheta", "शाहपुर बम्हेटा"),
    ("village", "Kaila", "कैला"),
    ("village", "Mehrauli", "महरौली"),
    ("village", "Dasna", "डासना"),
    ("village", "Arthala", "अर्थला"),
    ("village", "Muradnagar Rural", "मुरादनगर ग्रामीण"),
    ("village", "Abupur", "आबूपुर"),
    ("village", "Surana", "सुराणा"),
    ("village", "Jalalabad", "जलालाबाद"),
    ("village", "Ravli", "रावली"),
    ("village", "Asalatpur", "असालतपुर"),
    ("village", "Dhaulana", "धौलाना"),
    ("village", "Sikandarpur Kakrana", "सिकंदरपुर काकराना"),
    ("village", "Gulaothi Rural", "गुलावठी ग्रामीण"),
    ("village", "Nandpur", "नंदपुर"),
    ("village", "Dehra", "देहरा"),
)

# Children before parents, so --fresh does not trip a foreign key.
PURGE_ORDER = (
    Notification,
    RegistrationRecord,
    Encumbrance,
    AuditLog,
    Document,
    Survey,
    Discrepancy,
    Mutation,
    Application,
    Parcel,
    User,
)

class Report:
    """Counts what was inserted so the run ends with one honest summary."""

    def __init__(self) -> None:
        self.inserted: Dict[str, int] = {}
        self.skipped: Dict[str, int] = {}

    def add(self, label: str, created: bool) -> None:
        target = self.inserted if created else self.skipped
        target[label] = target.get(label, 0) + 1

    def print(self) -> None:
        if self.inserted:
            for label in sorted(self.inserted):
                logger.info("  inserted %-16s %d", label, self.inserted[label])
        if self.skipped:
            total = sum(self.skipped.values())
            logger.info("  left %d existing row(s) untouched", total)
        if not self.inserted:
            logger.info("  nothing to insert -- the demo data is already there")


async def _find(session, model, **filters):
    """First row matching ``filters``, or None."""
    statement = select(model).filter_by(**filters).limit(1)
    return (await session.execute(statement)).scalars().first()


async def _ensure(session, report: Report, model, key: Dict, **values):
    """Insert ``model(**key, **values)`` unless a row matching ``key`` exists."""
    existing = await _find(session, model, **key)
    label = model.__tablename__
    if existing is not None:
        report.add(label, created=False)
        return existing
    row = model(**key, **values)
    session.add(row)
    await session.flush()  # assign the primary key so children can reference it
    report.add(label, created=True)
    return row


async def seed_reference(session, report: Report) -> None:
    """Localized place names. Safe to re-run; new names get added."""
    for entity_type, key, value in PLACE_NAMES_HI:
        await _ensure(
            session,
            report,
            RefTranslation,
            {"entity_type": entity_type, "entity_key": key, "locale": "hi"},
            value=value,
        )

async def seed_users(session, report: Report) -> Dict[str, User]:
    """The three demo logins. Passwords stay as the prototype shipped them."""
    people = (
        {
            "username": "citizen",
            "email": "citizen@bhuniti.gov.in",
            "role": "citizen",
            "full_name": "Rahul Sharma",
            "phone": "+91 98111 22334",
            "district": "Ghaziabad",
            "tehsil": "Modinagar",
            "preferred_locale": "en",
        },
        {
            "username": "revenue_officer",
            "email": "ro.modinagar@bhuniti.gov.in",
            "role": "revenue_officer",
            "full_name": "Suresh Verma",
            "designation": "Revenue Officer (Kanungo)",
            "phone": "+91 98222 33445",
            "district": "Ghaziabad",
            "tehsil": "Modinagar",
            "preferred_locale": "hi",
        },
        {
            "username": "district_officer",
            "email": "dm.ghaziabad@bhuniti.gov.in",
            "role": "district_officer",
            "full_name": "District Magistrate Office",
            "designation": "District Collector & DM",
            "phone": "+91 98333 44556",
            "district": "Ghaziabad",
            "tehsil": "Ghaziabad Sadar",
            "preferred_locale": "en",
        },
    )
    users: Dict[str, User] = {}
    for person in people:
        username = person.pop("username")
        users[username] = await _ensure(
            session,
            report,
            User,
            {"username": username},
            hashed_password=get_password_hash("@12345"),
            is_active=True,
            **person,
        )
    return users

async def seed_parcels(session, report: Report) -> Dict[str, Parcel]:
    """Three parcels: one clean, one under mutation, one with a boundary case."""
    records = (
        {
            "ulpin": "09-XXXX-XXXX-1024",
            "survey_number": "142/B",
            "khasra_number": "412/1",
            "khata_number": "89",
            "tehsil": "Modinagar",
            "village": "Sikandrabad",
            "pincode": "201204",
            "owner_name": "Rahul Sharma",
            "co_owners_json": json.dumps(["Sunita Sharma (Spouse - 50%)"]),
            "land_type": "Agricultural",
            "area_ha": 2.0,
            "area_sqm": 20000.0,
            "valuation_inr": 4800000.0,
            "boundary_geojson": json.dumps(
                {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [77.5830, 28.8340],
                            [77.5860, 28.8342],
                            [77.5865, 28.8365],
                            [77.5832, 28.8368],
                            [77.5830, 28.8340],
                        ]
                    ],
                }
            ),
            "centroid_lat": 28.8354,
            "centroid_lng": 77.5843,
            "verification_status": "Verified",
            "is_disputed": False,
            "encumbrance_status": "Clean",
            # The prototype pointed at a googleusercontent.com AI-preview URL
            # that expires. This is the same image the frontend's own offline
            # parcel data already uses, so the demo looks unchanged.
            "image_url": (
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                "?auto=format&fit=crop&q=80&w=800"
            ),
        },
        {
            "ulpin": "P-1024",
            "survey_number": "142/B",
            "khasra_number": "412/1",
            "khata_number": "89",
            "tehsil": "Modinagar",
            "village": "Sikandrabad",
            "pincode": "201204",
            "owner_name": "Rajesh Kumar",
            "land_type": "Agricultural",
            "area_ha": 14.68,
            "area_sqm": 146800.0,
            "valuation_inr": 22000000.0,
            "boundary_geojson": json.dumps(
                {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [77.5750, 28.8280],
                            [77.5810, 28.8290],
                            [77.5800, 28.8330],
                            [77.5740, 28.8315],
                            [77.5750, 28.8280],
                        ]
                    ],
                }
            ),
            "centroid_lat": 28.8300,
            "centroid_lng": 77.5780,
            "verification_status": "Under Verification",
            "is_disputed": True,
            "dispute_reason": (
                "Claimed area 12.50 ha vs registered RoR 14.68 ha (-2.18 ha mismatch)"
            ),
            "encumbrance_status": "Under Mutation",
            "image_url": (
                "https://images.unsplash.com/photo-1524661135-423995f22d0b"
                "?auto=format&fit=crop&q=80&w=800"
            ),
        },
        {
            "ulpin": "P-2048",
            "survey_number": "88/C",
            "khasra_number": "219/3",
            "khata_number": "45",
            "tehsil": "Loni",
            # The prototype stored "Behta", which matches no village in
            # administrativeDivisions.js, so the Hindi name never resolved.
            "village": "Behta Hajipur",
            "owner_name": "Manoj Tyagi",
            "land_type": "Commercial",
            "area_ha": 3.4,
            "area_sqm": 34000.0,
            "valuation_inr": 18500000.0,
            "centroid_lat": 28.7500,
            "centroid_lng": 77.2800,
            "verification_status": "Disputed",
            "is_disputed": True,
            "dispute_reason": "Northern boundary overlap of 1.2m with road reservation",
            "encumbrance_status": "Clean",
            "image_url": (
                "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"
                "?auto=format&fit=crop&q=80&w=800"
            ),
        },
    )
    parcels: Dict[str, Parcel] = {}
    for record in records:
        ulpin = record.pop("ulpin")
        parcels[ulpin] = await _ensure(
            session,
            report,
            Parcel,
            {"ulpin": ulpin},
            state="Uttar Pradesh",
            district="Ghaziabad",
            **record,
        )
    return parcels

async def seed_case_file(
    session,
    report: Report,
    users: Dict[str, User],
    parcels: Dict[str, Parcel],
) -> Optional[Application]:
    """The one open application, plus the survey, mutation, cases and documents
    that hang off it. Everything is linked by row id, not by name."""
    home = parcels["09-XXXX-XXXX-1024"]
    disputed = parcels["P-1024"]
    overlap = parcels["P-2048"]

    application = await _ensure(
        session,
        report,
        Application,
        {"application_number": "MUT-2023-8941"},
        # Filed from the demo citizen account, so the citizen portal has
        # something to show after logging in; citizen_name stays as the record
        # was filed.
        citizen_id=users["citizen"].id,
        citizen_name="Priya Sharma",
        parcel_id=home.id,
        ulpin=home.ulpin,
        service_type="Title Transfer",
        status="Action Required",
        current_stage="Field Survey",
        submission_date=date(2023, 10, 24),
        verified_date=date(2023, 10, 28),
        survey_date=date(2023, 11, 15),
        # RO review and completion have not happened: NULL, not "Pending".
        ro_review_date=None,
        completion_date=None,
        action_required=(
            "A field survey has been scheduled for Nov 15th. Please ensure access "
            "to the parcel."
        ),
        survey_details="Surveyor: Ajay Tyagi (+91 98765 43210). GPS boundary validation.",
        notes="Title transfer requested under registered sale deed #GR-2023-994.",
    )

    await _ensure(
        session,
        report,
        Survey,
        {"survey_number": "SURV-2026-089"},
        parcel_id=home.id,
        ulpin=home.ulpin,
        application_id=application.id,
        surveyor_name="Ajay Tyagi (Field Inspector)",
        surveyor_phone="+91 98765 43210",
        scheduled_date=date(2023, 11, 15),
        completed_date=None,
        status="Scheduled",
        ground_truth_area_ha=2.01,
        survey_report_summary="DGPS boundary marker verification scheduled.",
    )

    await _ensure(
        session,
        report,
        Mutation,
        {"mutation_number": "M-2026-018"},
        parcel_id=disputed.id,
        ulpin=disputed.ulpin,
        mutation_type="Sale Mutation",
        applicant_name="Rajesh Kumar",
        party_type="Transferee",
        submission_date=date(2023, 10, 12),
        claimed_area_ha=12.50,
        record_area_ha=14.68,
        has_discrepancy=True,
        discrepancy_details=(
            "Area mismatch detected: claimed 12.50 ha vs registered record 14.68 ha "
            "(-2.18 ha difference)."
        ),
        status="Pending",
        # Was the string "revenue_officer" -- a username in a column that
        # references users.id.
        assigned_officer_id=users["revenue_officer"].id,
    )

    await _ensure(
        session,
        report,
        Discrepancy,
        {"case_number": "DISC-2026-042"},
        parcel_id=disputed.id,
        ulpin=disputed.ulpin,
        district="Ghaziabad",
        tehsil="Modinagar",
        village="Sikandrabad",
        discrepancy_type="Area Mismatch",
        severity="High",
        description=(
            "Satellite parcel area (12.50 ha) does not match the RoR record (14.68 ha). "
            "Discrepancy of 2.18 ha detected during reconciliation."
        ),
        claimed_value="12.50 ha",
        record_value="14.68 ha",
        status="Open",
    )
    await _ensure(
        session,
        report,
        Discrepancy,
        {"case_number": "DISC-2026-043"},
        parcel_id=overlap.id,
        ulpin=overlap.ulpin,
        district="Ghaziabad",
        tehsil="Loni",
        village="Behta Hajipur",
        discrepancy_type="Boundary Overlap",
        severity="High",
        description="Northern boundary overlaps 1.2m with the adjacent public road reserve buffer.",
        claimed_value="No overlap",
        record_value="1.2m overlap",
        status="In Review",
    )

    documents = (
        {
            "title": "Record of Rights (RoR) - Form 7/12",
            "doc_type": "Record of Rights",
            "file_url": (
                "https://images.unsplash.com/photo-1568667256549-094345857637"
                "?auto=format&fit=crop&q=80&w=800"
            ),
            "file_format": "PDF",
            "file_size_kb": 348,
            "sha256_hash": "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
            "uploaded_by": "Revenue Department",
        },
        {
            "title": "Geo-referenced Cadastral Map",
            "doc_type": "Cadastral Map",
            "file_url": (
                "https://images.unsplash.com/photo-1524661135-423995f22d0b"
                "?auto=format&fit=crop&q=80&w=800"
            ),
            "file_format": "GeoTIFF/PDF",
            "file_size_kb": 2140,
            "sha256_hash": "b2c3d4e5f6a17890abcdef1234567890abcdef1234567890abcdef1234567891",
            "uploaded_by": "GIS Division",
        },
    )
    for document in documents:
        await _ensure(
            session,
            report,
            Document,
            {"title": document.pop("title"), "ulpin": home.ulpin},
            parcel_id=home.id,
            application_id=application.id,
            is_verified=True,
            **document,
        )
    return application

async def seed_audit_trail(session, report: Report, parcels: Dict[str, Parcel]) -> None:
    """Three chained entries, in the order the events actually happened.

    The prototype stored made-up tamper hashes and no prev_hash, so a freshly
    seeded database reported its own audit trail as broken. These go through
    ``append_audit``, which links each entry to the tip of the chain.

    They carry 2023 dates, and ``verify_chain`` orders the chain by timestamp, so
    they can only be appended while the chain is still empty or still older than
    them. If something newer is already there (``db/seed_10_parcels.py`` writes
    "now"-dated provenance entries), inserting these would create a link that
    reads as a break, so the trail is left alone and the reason is logged.
    """
    home = parcels["09-XXXX-XXXX-1024"]
    if await _find(session, AuditLog, ulpin=home.ulpin) is not None:
        report.add("audit_logs", created=False)
        return

    first_timestamp = datetime(2023, 10, 24, 10, 12, tzinfo=timezone.utc)
    newest = await session.scalar(select(func.max(AuditLog.timestamp)))
    if newest is not None:
        if newest.tzinfo is None:  # SQLite hands back naive datetimes
            newest = newest.replace(tzinfo=timezone.utc)
        if newest >= first_timestamp:
            logger.info(
                "  skipping the historical audit trail: the chain already has an "
                "entry dated %s, and these entries are dated 2023. Re-seed on an "
                "empty audit_logs table (--fresh) to get them.",
                newest.date(),
            )
            report.add("audit_logs", created=False)
            return

    entries = (
        {
            "timestamp": first_timestamp,
            "action_type": "Title Transfer Application Filed",
            "actor_name": "Priya Sharma",
            "actor_role": "Citizen",
            "details": "Application MUT-2023-8941 registered online with the sale deed attached.",
        },
        {
            "timestamp": datetime(2023, 10, 28, 9, 40, tzinfo=timezone.utc),
            "action_type": "Document Verified",
            "actor_name": "Suresh Verma (RO)",
            "actor_role": "Revenue Officer",
            "details": "RoR Form 7/12 cross-verified against the state revenue register.",
        },
        {
            "timestamp": datetime(2023, 11, 2, 15, 5, tzinfo=timezone.utc),
            "action_type": "Field Survey Scheduled",
            "actor_name": "Ajay Tyagi (Field Inspector)",
            "actor_role": "Revenue Officer",
            "details": "Ground survey scheduled for Nov 15th with a DGPS station setup.",
        },
    )
    for entry in entries:
        await append_audit(session, ulpin=home.ulpin, parcel_id=home.id, **entry)
        report.add("audit_logs", created=True)


async def seed_notifications(session, report: Report, users: Dict[str, User]) -> None:
    """Seed sample notifications for citizen, revenue officer, and district admin."""
    notifications_data = [
        {
            "user_id": users["citizen"].id,
            "ulpin": "09-0824-0014-1024",
            "message": "Field survey successfully conducted for application MUT-2023-8941.",
            "type": "survey_scheduled",
            "read_status": False,
        },
        {
            "user_id": users["citizen"].id,
            "ulpin": "09-0824-0014-1024",
            "message": "Cadastral land record verified for Khasra 412/1 (Ghaziabad).",
            "type": "mutation_update",
            "read_status": True,
        },
        {
            "user_id": users["revenue_officer"].id,
            "ulpin": "09-0824-0014-1026",
            "message": "New mutation case M-2026-018 assigned for verification.",
            "type": "mutation_update",
            "read_status": False,
        },
        {
            "user_id": users["revenue_officer"].id,
            "ulpin": "09-0824-0014-1027",
            "message": "Boundary overlap notice issued for Khasra 414 (Road Overlap).",
            "type": "discrepancy_alert",
            "read_status": False,
        },
        {
            "user_id": users["district_officer"].id,
            "ulpin": None,
            "message": "Monthly cadastral reconciliation completed with 94.2% parcel verification.",
            "type": "system",
            "read_status": True,
        },
    ]

    for item in notifications_data:
        await _ensure(
            session,
            report,
            Notification,
            {"user_id": item["user_id"], "message": item["message"]},
            ulpin=item.get("ulpin"),
            type=item.get("type", "system"),
            read_status=item.get("read_status", False),
        )


async def seed_registrations_and_encumbrances(session, report: Report, parcels: Dict[str, Parcel]) -> None:
    """Seed structured deed registrations and legal encumbrances for cadastral parcels."""
    if "09-XXXX-XXXX-1024" in parcels:
        p1 = parcels["09-XXXX-XXXX-1024"]
        await _ensure(
            session,
            report,
            RegistrationRecord,
            {"deed_number": "DEED-GZB-2022-4121"},
            parcel_id=p1.id,
            ulpin=p1.ulpin,
            registration_date=date(2022, 4, 15),
            sub_registrar_office="Sub-Registrar Office Modinagar",
            stamp_duty=288000.0,
            market_value=4800000.0,
            consideration_amount=4800000.0,
            buyer_name="Rahul Sharma",
            seller_name="Devi Prasad Sharma",
            document_url="/documents/deed_412_1.pdf",
        )

        await _ensure(
            session,
            report,
            Encumbrance,
            {"ulpin": p1.ulpin, "holder": "Punjab National Bank (Modinagar Branch)"},
            parcel_id=p1.id,
            amount=500000.0,
            instrument_type="Bank Charge",
            date=date(2019, 3, 10),
            expiry_date=date(2024, 3, 10),
            status="Discharged",
            remarks="Agricultural crop loan fully repaid. NOC issued.",
        )


async def purge(session) -> None:
    """--fresh: delete the rows this script manages, children first.

    ``ref_translations`` is left in place; it is reference data, not demo data,
    and ``seed_reference`` re-inserts anything missing anyway.
    """
    for model in PURGE_ORDER:
        result = await session.execute(delete(model))
        count = result.rowcount or 0
        if count:
            logger.info("  deleted %-16s %d", model.__tablename__, count)


async def run(args: argparse.Namespace) -> int:
    logger.info("Creating any missing tables...")
    await init_models()

    report = Report()
    async with AsyncSessionLocal() as session:
        if args.fresh:
            logger.info("Deleting existing demo rows (--fresh)...")
            await purge(session)

        logger.info("Seeding place-name translations...")
        await seed_reference(session, report)

        if not args.ref_only:
            logger.info("Seeding users, parcels and the open case file...")
            users = await seed_users(session, report)
            parcels = await seed_parcels(session, report)
            await seed_case_file(session, report, users, parcels)
            await seed_audit_trail(session, report, parcels)
            await seed_notifications(session, report, users)
            await seed_registrations_and_encumbrances(session, report, parcels)

        await session.commit()

        report.print()

        if not args.ref_only:
            result = await verify_chain(session)
            if result["intact"]:
                logger.info(
                    "Audit chain verified: %d entry/entries, no breaks.",
                    result["entries_checked"],
                )
            else:
                logger.warning(
                    "Audit chain reports a break at position %s (%s). Rows written "
                    "before the chain existed keep their original hashes; run "
                    "db/migrate.py --seal-audit to re-chain them.",
                    result["broken_at_position"],
                    result["reason"],
                )
    return 0


def main(argv: Sequence[str]) -> int:
    parser = argparse.ArgumentParser(description="Seed the BHUNITI demo registry.")
    parser.add_argument(
        "--ref-only",
        action="store_true",
        help="only seed ref_translations (localized village/tehsil names)",
    )
    parser.add_argument(
        "--fresh",
        action="store_true",
        help="DESTRUCTIVE: delete the demo rows first, including the audit trail",
    )
    parser.add_argument("--yes", action="store_true", help="confirm --fresh")
    args = parser.parse_args(argv)

    if args.fresh and not args.yes:
        logger.error(
            "--fresh deletes every row in users, parcels, applications, mutations, "
            "surveys, discrepancies, documents and audit_logs. Re-run with "
            "--fresh --yes if that is what you want."
        )
        return 2
    try:
        return asyncio.run(run(args))
    except KeyboardInterrupt:
        logger.error("Interrupted; the transaction was rolled back.")
        return 130


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))







