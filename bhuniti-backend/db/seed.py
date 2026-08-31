import asyncio
import json
import logging
import sys
from pathlib import Path
from datetime import datetime, timezone

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import AsyncSessionLocal, async_engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.parcel import Parcel
from app.models.application import Application
from app.models.mutation import Mutation
from app.models.discrepancy import Discrepancy
from app.models.survey import Survey
from app.models.document import Document
from app.models.audit import AuditLog

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")

async def seed_database():
    logger.info("Initializing tables...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        logger.info("Seeding demo users...")
        users = [
            User(
                username="citizen",
                email="citizen@bhuniti.gov.in",
                hashed_password=get_password_hash("1234"),
                role="citizen",
                full_name="Rahul Sharma",
                phone="+91 98111 22334",
                district="Ghaziabad",
                tehsil="Modinagar"
            ),
            User(
                username="revenue_officer",
                email="ro.modinagar@bhuniti.gov.in",
                hashed_password=get_password_hash("1234"),
                role="revenue_officer",
                full_name="Suresh Verma",
                designation="Revenue Officer (Kanungo)",
                phone="+91 98222 33445",
                district="Ghaziabad",
                tehsil="Modinagar"
            ),
            User(
                username="district_officer",
                email="dm.ghaziabad@bhuniti.gov.in",
                hashed_password=get_password_hash("1234"),
                role="district_officer",
                full_name="District Magistrate Office",
                designation="District Collector & DM",
                phone="+91 98333 44556",
                district="Ghaziabad",
                tehsil="Ghaziabad Sadar"
            )
        ]
        for u in users:
            session.add(u)

        logger.info("Seeding land parcels & GIS boundaries...")
        parcels = [
            Parcel(
                ulpin="09-XXXX-XXXX-1024",
                survey_number="142/B",
                khasra_number="412/1",
                khata_number="89",
                state="Uttar Pradesh",
                district="Ghaziabad",
                tehsil="Modinagar",
                village="Sikandrabad",
                pincode="201204",
                owner_name="Rahul Sharma",
                co_owners_json=json.dumps(["Sunita Sharma (Spouse - 50%)"]),
                land_type="Agricultural",
                area_ha=2.00,
                area_sqm=20000.0,
                valuation_inr=4800000.0,
                boundary_geojson=json.dumps({
                    "type": "Polygon",
                    "coordinates": [[[77.5830, 28.8340], [77.5860, 28.8342], [77.5865, 28.8365], [77.5832, 28.8368], [77.5830, 28.8340]]]
                }),
                centroid_lat=28.8354,
                centroid_lng=77.5843,
                verification_status="Verified",
                is_disputed=False,
                encumbrance_status="Clean",
                image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuAc62GgBhnA_gl-VEaDsXI5Hm8OzC-3Cixsx4ZTpqshVidHLud2VsQoUHnvMzrYugqpX67cyUhap74Jv0PW4T45aUG-Q6lIJZFWTQrV8M3HKGLfh3tq1-p6GVh8MTl9lY92ByC3518_Uo9fzRocJ9Kmq-tgFa_qVVPK5NAnL7DMa0eSGyzWhPuGPnBIMG1Zv7AKp3oJp21Dxo_7Fv7dmKR-F8RJiAMNYLStksTAbgpruTWb7d_qQbg"
            ),
            Parcel(
                ulpin="P-1024",
                survey_number="142/B",
                khasra_number="412/1",
                khata_number="89",
                state="Uttar Pradesh",
                district="Ghaziabad",
                tehsil="Modinagar",
                village="Sikandrabad",
                pincode="201204",
                owner_name="Rajesh Kumar",
                land_type="Agricultural",
                area_ha=14.68,
                area_sqm=146800.0,
                valuation_inr=22000000.0,
                boundary_geojson=json.dumps({
                    "type": "Polygon",
                    "coordinates": [[[77.5750, 28.8280], [77.5810, 28.8290], [77.5800, 28.8330], [77.5740, 28.8315], [77.5750, 28.8280]]]
                }),
                centroid_lat=28.8300,
                centroid_lng=77.5780,
                verification_status="Under Verification",
                is_disputed=True,
                dispute_reason="Claimed area 12.50 ha vs Registered RoR 14.68 ha (-2.18 ha mismatch)",
                encumbrance_status="Under Mutation"
            ),
            Parcel(
                ulpin="P-2048",
                survey_number="88/C",
                khasra_number="219/3",
                khata_number="45",
                state="Uttar Pradesh",
                district="Ghaziabad",
                tehsil="Loni",
                village="Behta",
                owner_name="Manoj Tyagi",
                land_type="Commercial",
                area_ha=3.40,
                area_sqm=34000.0,
                valuation_inr=18500000.0,
                centroid_lat=28.7500,
                centroid_lng=77.2800,
                verification_status="Disputed",
                is_disputed=True,
                dispute_reason="Northern boundary overlap of 1.2m with road reservation",
                encumbrance_status="Clean"
            )
        ]
        for p in parcels:
            session.add(p)

        logger.info("Seeding citizen applications...")
        apps = [
            Application(
                application_number="MUT-2023-8941",
                citizen_name="Priya Sharma",
                ulpin="09-XXXX-XXXX-1024",
                service_type="Title Transfer",
                status="Action Required",
                current_stage="Field Survey",
                submission_date="Oct 24, 2023",
                verified_date="Oct 28, 2023",
                survey_date="Nov 15, 2023",
                ro_review_date="Pending",
                completion_date="Pending",
                action_required="A field survey has been scheduled for Nov 15th. Please ensure access to the parcel.",
                survey_details="Surveyor: Ajay Tyagi (+91 98765 43210). GPS boundary validation.",
                notes="Title transfer requested under Registered Sale Deed #GR-2023-994."
            )
        ]
        for a in apps:
            session.add(a)

        logger.info("Seeding mutations...")
        mutations = [
            Mutation(
                mutation_number="M-2026-018",
                ulpin="P-1024",
                mutation_type="Sale Mutation",
                applicant_name="Rajesh Kumar",
                party_type="Transferee",
                submission_date="Oct 12, 2023",
                claimed_area_ha=12.50,
                record_area_ha=14.68,
                has_discrepancy=True,
                discrepancy_details="Area mismatch detected: Claimed 12.50 ha vs Registered Record 14.68 ha (-2.18 ha difference).",
                status="Pending",
                assigned_officer_id="revenue_officer"
            )
        ]
        for m in mutations:
            session.add(m)

        logger.info("Seeding discrepancy cases...")
        discrepancies = [
            Discrepancy(
                case_number="DISC-2026-042",
                ulpin="P-1024",
                district="Ghaziabad",
                tehsil="Modinagar",
                village="Sikandrabad",
                discrepancy_type="Area Mismatch",
                severity="High",
                description="Satellite parcel area (12.50 ha) does not match RoR record (14.68 ha). Discrepancy of 2.18 ha detected during AI reconciliation.",
                claimed_value="12.50 ha",
                record_value="14.68 ha",
                status="Open"
            ),
            Discrepancy(
                case_number="DISC-2026-043",
                ulpin="P-2048",
                district="Ghaziabad",
                tehsil="Loni",
                village="Behta",
                discrepancy_type="Boundary Overlap",
                severity="High",
                description="Northern boundary overlaps 1.2m with adjacent public road reserve buffer.",
                claimed_value="No overlap",
                record_value="1.2m overlap",
                status="In Review"
            )
        ]
        for d in discrepancies:
            session.add(d)

        logger.info("Seeding surveys, documents, and audit trail...")
        surveys = [
            Survey(
                survey_number="SURV-2026-089",
                ulpin="09-XXXX-XXXX-1024",
                surveyor_name="Ajay Tyagi (Field Inspector)",
                surveyor_phone="+91 98765 43210",
                scheduled_date="Nov 15, 2023",
                status="Scheduled",
                ground_truth_area_ha=2.01,
                survey_report_summary="DGPS boundary marker verification scheduled."
            )
        ]
        for s in surveys:
            session.add(s)

        docs = [
            Document(
                ulpin="09-XXXX-XXXX-1024",
                title="Record of Rights (RoR) - Form 7/12",
                doc_type="Record of Rights",
                file_url="https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800",
                file_format="PDF",
                file_size_kb=348,
                sha256_hash="a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
                is_verified=True,
                uploaded_by="Revenue Department"
            ),
            Document(
                ulpin="09-XXXX-XXXX-1024",
                title="Geo-referenced Cadastral Map",
                doc_type="Cadastral Map",
                file_url="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
                file_format="GeoTIFF/PDF",
                file_size_kb=2140,
                sha256_hash="b2c3d4e5f6a17890abcdef1234567890abcdef1234567890abcdef1234567891",
                is_verified=True,
                uploaded_by="GIS Division"
            )
        ]
        for doc in docs:
            session.add(doc)

        audits = [
            AuditLog(
                ulpin="09-XXXX-XXXX-1024",
                action_type="Field Survey Scheduled",
                actor_name="Ajay Tyagi (Field Inspector)",
                actor_role="Revenue Officer",
                details="Ground survey scheduled for Nov 15th with DGPS station setup.",
                tamper_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            ),
            AuditLog(
                ulpin="09-XXXX-XXXX-1024",
                action_type="Document Verified",
                actor_name="Suresh Verma (RO)",
                actor_role="Revenue Officer",
                details="RoR Form 7/12 cross-verified against State Revenue Database register.",
                tamper_hash="ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
            ),
            AuditLog(
                ulpin="09-XXXX-XXXX-1024",
                action_type="Title Transfer Application Filed",
                actor_name="Priya Sharma",
                actor_role="Citizen",
                details="Application MUT-2023-8941 registered online with attached sale deed.",
                tamper_hash="4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
            )
        ]
        for aud in audits:
            session.add(aud)

        await session.commit()
        logger.info("Database successfully seeded with realistic sample data!")

if __name__ == "__main__":
    asyncio.run(seed_database())
