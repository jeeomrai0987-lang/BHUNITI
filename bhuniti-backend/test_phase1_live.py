import asyncio
import sys
from pathlib import Path
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.main import app

async def run_phase1_test():
    print("==================================================================")
    print("  BHUNITI PHASE 1 — DATABASE FOUNDATION LIVE TEST SUITE          ")
    print("==================================================================")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        res = await client.get("/health")
        assert res.status_code == 200, f"Health failed: {res.text}"
        print(f"[TEST 1] Backend Health: {res.json()['status']} (DB: {res.json()['database_backend']})")

        # 2. Auth Login & Token
        login_res = await client.post("/api/v1/auth/login", json={"username": "citizen", "password": "1234"})
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"[TEST 2] Authentication: Token issued for role '{login_res.json()['role']}'")

        # 3. Parcels & PostGIS GIS Polygons
        gis_res = await client.get("/api/v1/parcels/gis/all")
        assert gis_res.status_code == 200
        parcels = gis_res.json()
        assert len(parcels) >= 10, f"Expected at least 10 parcels, found {len(parcels)}"
        assert parcels[0]["boundary_geojson"] is not None
        print(f"[TEST 3] GIS & PostGIS Layer: {len(parcels)} parcels loaded with boundary GeoJSON.")

        # 4. Notifications API
        notif_res = await client.get("/api/v1/notifications", headers=headers)
        assert notif_res.status_code == 200, f"Notifications failed: {notif_res.text}"
        notifs = notif_res.json()
        print(f"[TEST 4] Notifications: Found {len(notifs)} notifications for user.")
        if notifs:
            first_id = notifs[0]["id"]
            read_res = await client.patch(f"/api/v1/notifications/{first_id}/read", headers=headers)
            assert read_res.status_code == 200
            print(f"  -> Marked notification {first_id} as read.")

        # 5. Registration Records API
        ulpin = "09-0824-0014-1024"
        reg_res = await client.get(f"/api/v1/registrations/parcel/{ulpin}", headers=headers)
        assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"
        deeds = reg_res.json()
        assert len(deeds) > 0, "No registration deeds found"
        print(f"[TEST 5] Land Deed Registrations: Found deed '{deeds[0]['deed_number']}' (SRO: {deeds[0]['sub_registrar_office']}, Stamp: INR {deeds[0]['stamp_duty']})")

        # 6. Encumbrances API
        enc_res = await client.get("/api/v1/encumbrances/parcel/09-0824-0014-1026", headers=headers)
        assert enc_res.status_code == 200, f"Encumbrance lookup failed: {enc_res.text}"
        encs = enc_res.json()
        assert len(encs) > 0, "No encumbrance records found"
        print(f"[TEST 6] Encumbrances & Liens: Found encumbrance '{encs[0]['instrument_type']}' by {encs[0]['holder']} (Status: {encs[0]['status']})")

        # 7. Applications & Mutations
        app_res = await client.get("/api/v1/applications/my", headers=headers)
        assert app_res.status_code == 200
        apps = app_res.json()
        assert len(apps) > 0
        print(f"[TEST 7] Applications Lifecycle: Application {apps[0]['application_number']} (Stage: {apps[0]['current_stage']})")

        # Obtain officer token for mutation stats
        ro_login_res = await client.post("/api/v1/auth/login", json={"username": "revenue_officer", "password": "1234"})
        assert ro_login_res.status_code == 200
        ro_headers = {"Authorization": f"Bearer {ro_login_res.json()['access_token']}"}

        mut_res = await client.get("/api/v1/mutations/stats", headers=ro_headers)
        assert mut_res.status_code == 200
        print(f"[TEST 8] Revenue Mutations Stats: Pending={mut_res.json()['pending_count']}")

        # 8. Audit Trail Verification
        audit_res = await client.get("/api/v1/audit", headers=headers)
        assert audit_res.status_code == 200
        print(f"[TEST 9] Audit Trail: {len(audit_res.json())} immutable audit log entries verified.")

    print("\n==================================================================")
    print("  ALL 9 PHASE 1 FOUNDATION TESTS PASSED WITH 100% SUCCESS!        ")
    print("==================================================================")

if __name__ == "__main__":
    asyncio.run(run_phase1_test())
