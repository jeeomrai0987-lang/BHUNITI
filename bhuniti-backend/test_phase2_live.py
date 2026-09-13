import asyncio
import sys
import uuid
from pathlib import Path
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.main import app

async def run_phase2_test():
    print("==================================================================")
    print("  BHUNITI PHASE 2 — BACKEND LOGIC LIVE TEST SUITE                ")
    print("==================================================================")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Login with demo accounts
        cit_login = await client.post("/api/v1/auth/login", json={"username": "citizen", "password": "1234"})
        assert cit_login.status_code == 200, f"Citizen login failed: {cit_login.text}"
        cit_token = cit_login.json()["access_token"]
        cit_headers = {"Authorization": f"Bearer {cit_token}"}

        ro_login = await client.post("/api/v1/auth/login", json={"username": "revenue_officer", "password": "1234"})
        assert ro_login.status_code == 200, f"RO login failed: {ro_login.text}"
        ro_token = ro_login.json()["access_token"]
        ro_headers = {"Authorization": f"Bearer {ro_token}"}

        admin_login = await client.post("/api/v1/auth/login", json={"username": "district_officer", "password": "1234"})
        assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        print("[TEST 1] Authentication & Tokens issued for citizen, revenue_officer, district_officer.")

        # 2. Registration lockdown: test that role can't be self-assigned
        random_suffix = uuid.uuid4().hex[:6]
        reg_payload = {
            "username": f"testuser_{random_suffix}",
            "password": "password123",
            "email": f"test_{random_suffix}@example.com",
            "full_name": "Test User Attempting Admin Elevation",
            "role": "district_officer"  # Attempting privilege escalation
        }
        reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
        assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
        new_user = reg_res.json()
        assert new_user["role"] == "citizen", f"Expected role 'citizen', got '{new_user['role']}'"
        print(f"[TEST 2] Registration Lockdown: User '{new_user['username']}' registered; forced role: '{new_user['role']}' (Privilege escalation blocked).")

        # 3. RBAC Enforcement: citizen token rejected from officer/admin endpoints with 403 Forbidden
        rbac_test1 = await client.get("/api/v1/users", headers=cit_headers)
        assert rbac_test1.status_code == 403, f"Expected 403 for citizen accessing /users, got {rbac_test1.status_code}"

        rbac_test2 = await client.get("/api/v1/mutations/stats", headers=cit_headers)
        assert rbac_test2.status_code == 403, f"Expected 403 for citizen accessing /mutations/stats, got {rbac_test2.status_code}"

        rbac_test3 = await client.post("/api/v1/parcels", json={"ulpin": "dummy", "khasra_number": "1"}, headers=cit_headers)
        assert rbac_test3.status_code == 403, f"Expected 403 for citizen creating parcel, got {rbac_test3.status_code}"

        print("[TEST 3] RBAC Enforcement: Citizen token correctly received 403 Forbidden on restricted endpoints.")

        # 4. Admin Users Endpoint Group & Role Elevation
        list_users_res = await client.get("/api/v1/users", headers=admin_headers)
        assert list_users_res.status_code == 200, f"List users failed: {list_users_res.text}"
        users_list = list_users_res.json()
        assert len(users_list) > 0
        print(f"[TEST 4A] Admin User Group: Found {len(users_list)} registered users via GET /api/v1/users.")

        # Elevate the new test user to revenue_officer via Admin endpoint
        elevate_res = await client.patch(
            f"/api/v1/users/{new_user['id']}/role",
            json={"role": "revenue_officer"},
            headers=admin_headers
        )
        assert elevate_res.status_code == 200, f"Role elevation failed: {elevate_res.text}"
        assert elevate_res.json()["role"] == "revenue_officer"
        print(f"[TEST 4B] Admin Role Elevation: User '{new_user['username']}' elevated to '{elevate_res.json()['role']}' by District Officer.")

        # 5. Notification Trigger on Mutation Action
        # List mutations and take action as revenue officer
        mut_list = await client.get("/api/v1/mutations", headers=ro_headers)
        assert mut_list.status_code == 200
        mutations = mut_list.json()
        if mutations:
            first_mut = mutations[0]
            action_res = await client.post(
                f"/api/v1/mutations/{first_mut['id']}/action",
                json={"action": "clarify", "note": "Please submit updated Khatoni Form 7."},
                headers=ro_headers
            )
            assert action_res.status_code == 200, f"Mutation action failed: {action_res.text}"
            print(f"[TEST 5A] Mutation Action: Updated mutation {first_mut['mutation_number']} to '{action_res.json()['status']}'.")

            # Check notifications
            notif_res = await client.get("/api/v1/notifications", headers=admin_headers)
            assert notif_res.status_code == 200
            notifs = notif_res.json()
            mut_notifs = [n for n in notifs if n["type"] == "mutation_update"]
            assert len(mut_notifs) > 0, "No mutation_update notification found"
            print(f"[TEST 5B] Notification Trigger: Mutation notification verified (Message: '{mut_notifs[0]['message'][:60]}...').")

        # 6. Notification Trigger on Discrepancy Flagging
        disc_payload = {
            "ulpin": "09-0824-0014-1024",
            "description": "Satellite area differs from registry entry by 0.12 ha",
            "severity": "Medium",
            "discrepancy_type": "Area Mismatch",
            "tehsil": "Modinagar",
            "village": "Bhojpur",
            "claimed_value": "1.37 ha",
            "record_value": "1.25 ha",
            "status": "Open",
        }
        disc_res = await client.post("/api/v1/discrepancies", json=disc_payload, headers=ro_headers)
        assert disc_res.status_code == 201, f"Create discrepancy failed: {disc_res.text}"
        disc_case = disc_res.json()
        print(f"[TEST 6A] Discrepancy Flagged: Created case {disc_case['case_number']}.")

        # Verify discrepancy notification generated
        notif_res2 = await client.get("/api/v1/notifications", headers=admin_headers)
        disc_notifs = [n for n in notif_res2.json() if n["type"] == "discrepancy_alert"]
        assert len(disc_notifs) > 0, "No discrepancy_alert notification found"
        print(f"[TEST 6B] Notification Trigger: Discrepancy alert notification verified (Message: '{disc_notifs[0]['message'][:60]}...').")

        # 7. Audit Hash Chain Verification
        audit_verify = await client.get("/api/v1/audit/verify", headers=admin_headers)
        assert audit_verify.status_code == 200, f"Audit verification failed: {audit_verify.text}"
        verify_data = audit_verify.json()
        assert verify_data["intact"] is True, f"Audit chain broken: {verify_data}"
        print(f"[TEST 7] Audit Trail Hash Chain: Cryptographically verified intact across {verify_data['entries_checked']} entries! (Message: '{verify_data['message']}')")

    print("\n==================================================================")
    print("  ALL PHASE 2 BACKEND LOGIC TESTS PASSED WITH 100% SUCCESS!       ")
    print("==================================================================")

if __name__ == "__main__":
    asyncio.run(run_phase2_test())
