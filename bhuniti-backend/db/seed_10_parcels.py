import asyncio
import json
import logging
import sys
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import AsyncSessionLocal, async_engine, Base
from app.models.parcel import Parcel
from sqlalchemy import select

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_10_parcels")

# 10 Contiguous Ghaziabad (Modinagar / Sikandrabad) Cadastral Parcels
GHAZIABAD_10_PARCELS = [
    {
        "ulpin": "09-0824-0014-1024",
        "survey_number": "142/B",
        "khasra_number": "412/1",
        "khata_number": "89",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Rahul Sharma",
        "co_owners_json": json.dumps(["Sunita Sharma (Spouse - 50%)"]),
        "land_type": "Agricultural (Zamin)",
        "area_ha": 2.00,
        "area_sqm": 20000.0,
        "valuation_inr": 4800000.0,
        "centroid_lat": 28.8350,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8340], [77.5840, 28.8340], [77.5840, 28.8360], [77.5810, 28.8360], [77.5810, 28.8340]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1025",
        "survey_number": "142/C",
        "khasra_number": "412/2",
        "khata_number": "90",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Sunita Devi & Ramesh Chand",
        "co_owners_json": json.dumps(["Ramesh Chand (Brother)"]),
        "land_type": "Agricultural (Zamin)",
        "area_ha": 1.45,
        "area_sqm": 14500.0,
        "valuation_inr": 3480000.0,
        "centroid_lat": 28.8350,
        "centroid_lng": 77.5852,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8340], [77.5865, 28.8340], [77.5865, 28.8360], [77.5840, 28.8360], [77.5840, 28.8340]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1026",
        "survey_number": "143/A",
        "khasra_number": "413",
        "khata_number": "91",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Rajesh Kumar",
        "co_owners_json": json.dumps(["Vikas Kumar (Son)"]),
        "land_type": "Agricultural (Fasli)",
        "area_ha": 14.68,
        "area_sqm": 146800.0,
        "valuation_inr": 22000000.0,
        "centroid_lat": 28.8327,
        "centroid_lng": 77.5837,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8315], [77.5865, 28.8315], [77.5865, 28.8340], [77.5810, 28.8340], [77.5810, 28.8315]]]
        }),
        "verification_status": "Under Verification",
        "is_disputed": True,
        "dispute_reason": "Claimed 12.50 ha vs Registered RoR 14.68 ha (-2.18 ha mismatch under Case M-2026-018)",
        "encumbrance_status": "Under Mutation Review",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1027",
        "survey_number": "144/1",
        "khasra_number": "414",
        "khata_number": "92",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Manoj Tyagi",
        "co_owners_json": json.dumps([]),
        "land_type": "Commercial / Warehouse",
        "area_ha": 3.40,
        "area_sqm": 34000.0,
        "valuation_inr": 18500000.0,
        "centroid_lat": 28.8372,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8360], [77.5840, 28.8360], [77.5840, 28.8385], [77.5810, 28.8385], [77.5810, 28.8360]]]
        }),
        "verification_status": "Disputed",
        "is_disputed": True,
        "dispute_reason": "Northern boundary overlap of 1.2m with public road reservation buffer",
        "encumbrance_status": "Boundary Notice Issued",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1028",
        "survey_number": "145/GS",
        "khasra_number": "415/1",
        "khata_number": "1",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Gram Sabha (Government Land)",
        "co_owners_json": json.dumps(["Revenue Department, UP"]),
        "land_type": "Pasture / Charnot (Public)",
        "area_ha": 5.80,
        "area_sqm": 58000.0,
        "valuation_inr": 31000000.0,
        "centroid_lat": 28.8375,
        "centroid_lng": 77.5860,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8360], [77.5880, 28.8360], [77.5880, 28.8390], [77.5840, 28.8390], [77.5840, 28.8360]]]
        }),
        "verification_status": "Verified (Govt)",
        "is_disputed": False,
        "encumbrance_status": "Protected State Land",
        "image_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1029",
        "survey_number": "146/AB",
        "khasra_number": "415/2",
        "khata_number": "104",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Dr. Arvind Mishra",
        "co_owners_json": json.dumps(["Pooja Mishra (Co-owner)"]),
        "land_type": "Residential / Abadi",
        "area_ha": 0.85,
        "area_sqm": 8500.0,
        "valuation_inr": 12750000.0,
        "centroid_lat": 28.8395,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8385], [77.5840, 28.8385], [77.5840, 28.8405], [77.5810, 28.8405], [77.5810, 28.8385]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1030",
        "survey_number": "147/W",
        "khasra_number": "416",
        "khata_number": "2",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Irrigation Canal & Water Reserve",
        "co_owners_json": json.dumps(["UP Irrigation Department"]),
        "land_type": "Water Body / Canal Nala",
        "area_ha": 1.20,
        "area_sqm": 12000.0,
        "valuation_inr": 6000000.0,
        "centroid_lat": 28.8337,
        "centroid_lng": 77.5872,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5865, 28.8315], [77.5880, 28.8315], [77.5880, 28.8360], [77.5865, 28.8360], [77.5865, 28.8315]]]
        }),
        "verification_status": "Verified (Govt)",
        "is_disputed": False,
        "encumbrance_status": "Protected Water Reserve",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1031",
        "survey_number": "148/1",
        "khasra_number": "417",
        "khata_number": "118",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Amit Choudhary & Brothers",
        "co_owners_json": json.dumps(["Deepak Choudhary (33%)", "Rohit Choudhary (33%)"]),
        "land_type": "Agricultural (Fasli)",
        "area_ha": 4.10,
        "area_sqm": 41000.0,
        "valuation_inr": 9840000.0,
        "centroid_lat": 28.8402,
        "centroid_lng": 77.5860,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8390], [77.5880, 28.8390], [77.5880, 28.8415], [77.5840, 28.8415], [77.5840, 28.8390]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1032",
        "survey_number": "149/B",
        "khasra_number": "418",
        "khata_number": "125",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Balram Singh",
        "co_owners_json": json.dumps([]),
        "land_type": "Horticulture / Bagh (Mango Orchard)",
        "area_ha": 2.75,
        "area_sqm": 27500.0,
        "valuation_inr": 7425000.0,
        "centroid_lat": 28.8415,
        "centroid_lng": 77.5825,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5810, 28.8405], [77.5840, 28.8405], [77.5840, 28.8425], [77.5810, 28.8425], [77.5810, 28.8405]]]
        }),
        "verification_status": "Verified",
        "is_disputed": False,
        "encumbrance_status": "Clean (Nishkank)",
        "image_url": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800"
    },
    {
        "ulpin": "09-0824-0014-1033",
        "survey_number": "150/1",
        "khasra_number": "419",
        "khata_number": "132",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "tehsil": "Modinagar",
        "village": "Sikandrabad",
        "pincode": "201204",
        "owner_name": "Priya Sharma (Transferee)",
        "co_owners_json": json.dumps([]),
        "land_type": "Agricultural (Zamin)",
        "area_ha": 1.95,
        "area_sqm": 19500.0,
        "valuation_inr": 4680000.0,
        "centroid_lat": 28.8425,
        "centroid_lng": 77.5860,
        "boundary_geojson": json.dumps({
            "type": "Polygon",
            "coordinates": [[[77.5840, 28.8415], [77.5880, 28.8415], [77.5880, 28.8435], [77.5840, 28.8435], [77.5840, 28.8415]]]
        }),
        "verification_status": "Action Required (Mutation)",
        "is_disputed": False,
        "encumbrance_status": "Title Transfer Pending (MUT-2023-8941)",
        "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
    }
]

async def seed_10_parcels():
    logger.info("Connecting to database...")
    async with AsyncSessionLocal() as session:
        for p_data in GHAZIABAD_10_PARCELS:
            res = await session.execute(select(Parcel).where(Parcel.ulpin == p_data["ulpin"]))
            existing = res.scalars().first()
            if existing:
                for k, v in p_data.items():
                    setattr(existing, k, v)
                logger.info(f"Updated existing parcel: {p_data['ulpin']} (Khasra {p_data['khasra_number']})")
            else:
                new_p = Parcel(**p_data)
                session.add(new_p)
                logger.info(f"Created new parcel: {p_data['ulpin']} (Khasra {p_data['khasra_number']})")

        await session.commit()
    logger.info("Successfully seeded all 10 Ghaziabad Cadastral Parcels!")

if __name__ == "__main__":
    asyncio.run(seed_10_parcels())
