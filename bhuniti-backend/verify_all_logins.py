"""Verification script to test OTP flow for Revenue Officer, Admin (District Officer), and Citizen."""
import asyncio
import hashlib
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.otp import OtpVerification
from app.models.pending_signup import PendingSignup
from app.models.user import User
from sqlalchemy import select


async def run_verification():
    print("==================================================")
    print("   BHUNITI OTP & LOGIN FLOW VERIFICATION")
    print("==================================================")
    print(f"EMAILJS_SERVICE_ID : '{settings.EMAILJS_SERVICE_ID}'")
    print(f"EMAILJS_PUBLIC_KEY : '{settings.EMAILJS_PUBLIC_KEY}'")
    print(f"DEMO_MODE          : {settings.DEMO_MODE}")
    print("--------------------------------------------------\n")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        
        # ── 1. REVENUE OFFICER OTP LOGIN ──
        print("1. [TEST] Revenue Officer Login OTP Flow...")
        res_ro_req = await client.post("/api/v1/auth/request-otp", json={
            "username": "revenue_officer",
            "password": "1234",
            "claimed_role": "revenue_officer"
        })
        print(f"   Request-OTP status: {res_ro_req.status_code}")
        ro_data = res_ro_req.json()
        print(f"   Response payload  : {ro_data}")
        assert res_ro_req.status_code == 200, f"Failed RO request-otp: {ro_data}"

        # Fetch the generated OTP hash from DB to get the valid OTP or inject a known OTP
        async with AsyncSessionLocal() as session:
            ro_user = (await session.execute(select(User).where(User.username == "revenue_officer"))).scalars().first()
            otp_record = (await session.execute(
                select(OtpVerification).where(OtpVerification.user_id == ro_user.id).order_by(OtpVerification.created_at.desc())
            )).scalars().first()
            
            # Set known test OTP to verify endpoint logic
            test_otp = "654321"
            otp_record.otp_hash = hashlib.sha256(test_otp.encode("utf-8")).hexdigest()
            session.add(otp_record)
            await session.commit()

        # Verify OTP
        res_ro_ver = await client.post("/api/v1/auth/verify-otp", json={
            "username": "revenue_officer",
            "otp": test_otp
        })
        print(f"   Verify-OTP status : {res_ro_ver.status_code}")
        ro_token_data = res_ro_ver.json()
        print(f"   RO Logged In! Role: {ro_token_data.get('role')}, Redirect: {ro_token_data.get('redirect_url')}")
        assert res_ro_ver.status_code == 200
        assert ro_token_data.get("role") == "revenue_officer"
        print("   -> Revenue Officer OTP Login: SUCCESS [OK]\n")

        # ── 2. ADMIN / DISTRICT OFFICER OTP LOGIN ──
        print("2. [TEST] Admin / District Officer Login OTP Flow...")
        res_adm_req = await client.post("/api/v1/auth/request-otp", json={
            "username": "district_officer",
            "password": "1234",
            "claimed_role": "admin"
        })
        print(f"   Request-OTP status (claimed_role=admin): {res_adm_req.status_code}")
        adm_data = res_adm_req.json()
        print(f"   Response payload  : {adm_data}")
        assert res_adm_req.status_code == 200, f"Failed Admin request-otp: {adm_data}"

        async with AsyncSessionLocal() as session:
            adm_user = (await session.execute(select(User).where(User.username == "district_officer"))).scalars().first()
            otp_record = (await session.execute(
                select(OtpVerification).where(OtpVerification.user_id == adm_user.id).order_by(OtpVerification.created_at.desc())
            )).scalars().first()
            
            test_otp_adm = "789123"
            otp_record.otp_hash = hashlib.sha256(test_otp_adm.encode("utf-8")).hexdigest()
            session.add(otp_record)
            await session.commit()

        # Verify Admin OTP
        res_adm_ver = await client.post("/api/v1/auth/verify-otp", json={
            "username": "district_officer",
            "otp": test_otp_adm
        })
        print(f"   Verify-OTP status : {res_adm_ver.status_code}")
        adm_token_data = res_adm_ver.json()
        print(f"   Admin Logged In! Role: {adm_token_data.get('role')}, Redirect: {adm_token_data.get('redirect_url')}")
        assert res_adm_ver.status_code == 200
        assert adm_token_data.get("role") == "district_officer"
        print("   -> Admin / District Officer OTP Login: SUCCESS [OK]\n")

        # ── 3. CITIZEN SIGNUP OTP & LOGIN FLOW ──
        print("3. [TEST] Citizen Registration OTP Flow & Citizen Login...")
        
        # Test Citizen Direct Password Login
        res_cit_login = await client.post("/api/v1/auth/login", json={
            "username": "citizen",
            "password": "1234"
        })
        print(f"   Citizen Password Login status: {res_cit_login.status_code}")
        cit_data = res_cit_login.json()
        print(f"   Citizen Logged In! Role: {cit_data.get('role')}, Name: {cit_data.get('full_name')}")
        assert res_cit_login.status_code == 200
        
        # Test Citizen Signup OTP (Step 1: Mobile OTP dispatched via EmailJS)
        test_mobile = "9871100223"
        test_email = "test.citizen.verification@bhuniti.gov.in"
        res_sig_start = await client.post("/api/v1/auth/signup/start", json={
            "full_name": "Test Citizen User",
            "mobile": test_mobile,
            "email": test_email,
            "district": "Ghaziabad",
            "tehsil": "Modinagar"
        })
        print(f"   Citizen Signup Step 1 (Mobile OTP dispatched via email): {res_sig_start.status_code}")
        sig_data = res_sig_start.json()
        print(f"   Response: {sig_data}")
        assert res_sig_start.status_code == 200
        token = sig_data["signup_token"]

        # Step 2: Verify Mobile OTP
        async with AsyncSessionLocal() as session:
            pending = (await session.execute(select(PendingSignup).where(PendingSignup.signup_token == token))).scalars().first()
            mob_otp = "321654"
            pending.mobile_otp_hash = hashlib.sha256(mob_otp.encode("utf-8")).hexdigest()
            session.add(pending)
            await session.commit()

        res_sig_v_mob = await client.post("/api/v1/auth/signup/verify-mobile", json={
            "signup_token": token,
            "otp": mob_otp
        })
        print(f"   Citizen Signup Step 2 (Verify Mobile OTP): {res_sig_v_mob.status_code}")
        assert res_sig_v_mob.status_code == 200

        # Step 3: Trigger Aadhaar OTP (dispatched via EmailJS)
        from app.core.verhoeff import generate_verhoeff
        aadhaar = generate_verhoeff("99123456789")
        res_sig_aadhaar = await client.post("/api/v1/auth/signup/aadhaar", json={
            "signup_token": token,
            "aadhaar_number": aadhaar
        })
        print(f"   Citizen Signup Step 3 (Aadhaar OTP dispatched via email): {res_sig_aadhaar.status_code}")
        assert res_sig_aadhaar.status_code == 200

        # Step 4: Verify Aadhaar OTP
        async with AsyncSessionLocal() as session:
            pending = (await session.execute(select(PendingSignup).where(PendingSignup.signup_token == token))).scalars().first()
            aadhaar_otp = "654987"
            pending.aadhaar_otp_hash = hashlib.sha256(aadhaar_otp.encode("utf-8")).hexdigest()
            session.add(pending)
            await session.commit()

        res_sig_v_aadhaar = await client.post("/api/v1/auth/signup/verify-aadhaar", json={
            "signup_token": token,
            "otp": aadhaar_otp
        })
        print(f"   Citizen Signup Step 4 (Verify Aadhaar OTP): {res_sig_v_aadhaar.status_code}")
        assert res_sig_v_aadhaar.status_code == 200

        # Clean up temporary pending signup
        async with AsyncSessionLocal() as session:
            pending = (await session.execute(select(PendingSignup).where(PendingSignup.signup_token == token))).scalars().first()
            if pending:
                await session.delete(pending)
                await session.commit()

        print("   -> Citizen Signup OTP & Citizen Login: SUCCESS [OK]\n")

    print("==================================================")
    print("   ALL 3 ROLES VERIFIED & READY FOR DEMO! [OK]")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_verification())
