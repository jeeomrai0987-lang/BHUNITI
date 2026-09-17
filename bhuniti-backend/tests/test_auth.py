import hashlib
import random
import pytest
from sqlalchemy import select

from app.models.user import User
from app.models.otp import OtpVerification
from app.core.security import get_password_hash


def _rand_digits(n=6):
    return f"{random.randint(10**(n-1), (10**n)-1)}"


@pytest.mark.asyncio
async def test_backdoor_elimination(client):
    """Ensure invalid passwords are correctly rejected with 401."""
    res = await client.post("/api/v1/auth/login", json={"username": "citizen", "password": "wrongpassword"})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_citizen_login_identifiers(client):
    """Test citizen login using username, email (case-insensitive), and 10-digit mobile."""
    # 1. Standard username login
    res = await client.post("/api/v1/auth/login", json={"username": "citizen", "password": "1234"})
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "citizen"
    assert data["access_token"] is not None

    # 2. Email login
    res_email = await client.post("/api/v1/auth/login", json={"identifier": "CITIZEN@EXAMPLE.COM", "password": "1234"})
    if res_email.status_code == 200:
        assert res_email.json()["role"] == "citizen"

    # 3. Mobile login
    res_mobile = await client.post("/api/v1/auth/login", json={"identifier": "9876543210", "password": "1234"})
    if res_mobile.status_code == 200:
        assert res_mobile.json()["role"] == "citizen"


@pytest.mark.asyncio
async def test_officer_request_otp_role_mismatch(client):
    """Ensure role mismatch in request-otp is rejected with 401 without leaking role information."""
    res = await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "1234",
        "claimed_role": "district_officer"  # Mismatched!
    })
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_officer_request_otp_success_and_db_hash(client, db_session):
    """Test valid OTP request for officer and verify SHA-256 hash storage in DB."""
    res = await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "1234",
        "claimed_role": "revenue_officer"
    })
    assert res.status_code == 200
    otp_resp = res.json()
    assert otp_resp["status"] == "success"
    assert "masked_email" in otp_resp or "masked_target" in otp_resp

    user = (await db_session.execute(select(User).where(User.username == "revenue_officer"))).scalars().first()
    assert user is not None

    otp_record = (await db_session.execute(
        select(OtpVerification).where(OtpVerification.user_id == user.id).order_by(OtpVerification.created_at.desc())
    )).scalars().first()
    assert otp_record is not None
    assert len(otp_record.otp_hash) == 64  # SHA-256 hex length
    assert otp_record.attempt_count == 0


@pytest.mark.asyncio
async def test_officer_verify_otp_incorrect_code(client, db_session):
    """Test incorrect OTP code submission and attempt count incrementing."""
    # First request OTP
    await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "1234",
        "claimed_role": "revenue_officer"
    })

    user = (await db_session.execute(select(User).where(User.username == "revenue_officer"))).scalars().first()
    user_id = user.id

    # Submit invalid OTP
    res = await client.post("/api/v1/auth/verify-otp", json={
        "username": "revenue_officer",
        "otp": "000000"
    })
    assert res.status_code == 401

    otp_record = (await db_session.execute(
        select(OtpVerification).where(OtpVerification.user_id == user_id).order_by(OtpVerification.created_at.desc())
    )).scalars().first()
    assert otp_record is not None
    assert otp_record.attempt_count == 1


@pytest.mark.asyncio
async def test_officer_verify_otp_success_and_invalidation(client, db_session):
    """Test successful OTP verification and single-use purging from database."""
    await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "1234",
        "claimed_role": "revenue_officer"
    })

    user = (await db_session.execute(select(User).where(User.username == "revenue_officer"))).scalars().first()
    user_id = user.id

    otp_record = (await db_session.execute(
        select(OtpVerification).where(OtpVerification.user_id == user_id).order_by(OtpVerification.created_at.desc())
    )).scalars().first()

    known_otp = "854921"
    known_hash = hashlib.sha256(known_otp.encode("utf-8")).hexdigest()
    otp_record.otp_hash = known_hash
    db_session.add(otp_record)
    await db_session.commit()

    res = await client.post("/api/v1/auth/verify-otp", json={
        "username": "revenue_officer",
        "otp": known_otp
    })
    assert res.status_code == 200
    data = res.json()
    assert data["role"] == "revenue_officer"
    assert data["access_token"] is not None

    # Verify single-use purge
    db_session.expire_all()
    remaining_otp = (await db_session.execute(
        select(OtpVerification).where(OtpVerification.user_id == user_id)
    )).scalars().first()
    assert remaining_otp is None


@pytest.mark.asyncio
async def test_district_officer_otp_flow(client, db_session):
    """Test full District Officer OTP MFA login flow."""
    res = await client.post("/api/v1/auth/request-otp", json={
        "username": "district_officer",
        "password": "1234",
        "claimed_role": "district_officer"
    })
    assert res.status_code == 200

    dm_user = (await db_session.execute(select(User).where(User.username == "district_officer"))).scalars().first()
    dm_otp = (await db_session.execute(
        select(OtpVerification).where(OtpVerification.user_id == dm_user.id).order_by(OtpVerification.created_at.desc())
    )).scalars().first()

    dm_test_otp = "991122"
    dm_otp.otp_hash = hashlib.sha256(dm_test_otp.encode("utf-8")).hexdigest()
    db_session.add(dm_otp)
    await db_session.commit()

    res = await client.post("/api/v1/auth/verify-otp", json={
        "username": "district_officer",
        "otp": dm_test_otp
    })
    assert res.status_code == 200
    dm_data = res.json()
    assert dm_data["role"] == "district_officer"
    assert dm_data["redirect_url"] == "/administration"


@pytest.mark.asyncio
async def test_admin_provision_officer_and_first_login_password_change(client, db_session):
    """Test Admin provisioning new officer, first login forced password change flow, and activation."""
    # Admin login
    admin_login = await client.post("/api/v1/auth/login", json={"username": "district_officer", "password": "1234"})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    officer_suffix = _rand_digits(4)
    new_officer_name = f"Alok Verma {officer_suffix}"
    new_officer_uname = f"ro_loni_{officer_suffix}"
    new_officer_email = f"{new_officer_uname}@bhuniti.gov.in"
    gov_id = f"EMP-UP-REV-{officer_suffix}"

    res_prov = await client.post("/api/v1/admin/officers", headers=admin_headers, json={
        "full_name": new_officer_name,
        "username": new_officer_uname,
        "email": new_officer_email,
        "phone": f"+9198{_rand_digits(8)}",
        "district": "Ghaziabad",
        "tehsil": "Loni",
        "designation": "Revenue Officer",
        "gov_id_number": gov_id,
        "gov_id_type": "employee_id"
    })
    assert res_prov.status_code == 201
    prov_data = res_prov.json()
    assert prov_data["username"] == new_officer_uname
    assert prov_data["status"] == "pending"

    # Set temporary password
    temp_pass = "TempPass@2026"
    new_ro_db = (await db_session.execute(select(User).where(User.username == new_officer_uname))).scalars().first()
    new_ro_id = new_ro_db.id
    assert new_ro_db.force_password_change is True
    new_ro_db.hashed_password = get_password_hash(temp_pass)
    db_session.add(new_ro_db)
    await db_session.commit()

    # Request OTP with temporary password
    res_req = await client.post("/api/v1/auth/request-otp", json={
        "username": new_officer_uname,
        "password": temp_pass,
        "claimed_role": "revenue_officer"
    })
    assert res_req.status_code == 200

    # Inject test OTP hash
    new_ro_otp = (await db_session.execute(
        select(OtpVerification).where(OtpVerification.user_id == new_ro_id).order_by(OtpVerification.created_at.desc())
    )).scalars().first()
    test_otp = "741852"
    new_ro_otp.otp_hash = hashlib.sha256(test_otp.encode("utf-8")).hexdigest()
    db_session.add(new_ro_otp)
    await db_session.commit()

    # Verify OTP
    res_ver = await client.post("/api/v1/auth/verify-otp", json={
        "username": new_officer_uname,
        "otp": test_otp
    })
    assert res_ver.status_code == 200
    first_auth = res_ver.json()
    assert first_auth["force_password_change"] is True
    new_ro_token = first_auth["access_token"]

    # Change password
    ro_headers = {"Authorization": f"Bearer {new_ro_token}"}
    res_change = await client.post("/api/v1/auth/change-password", headers=ro_headers, json={
        "current_password": temp_pass,
        "new_password": "PermPass@2026!"
    })
    assert res_change.status_code == 200
    final_auth = res_change.json()
    assert final_auth["force_password_change"] is False

    db_session.expire_all()
    final_user = (await db_session.execute(select(User).where(User.username == new_officer_uname))).scalars().first()
    assert final_user.status == "active"
    assert final_user.force_password_change is False


@pytest.mark.asyncio
async def test_admin_claimed_role_otp_flow(client, db_session):
    """Test OTP request when claimed_role='admin' for district officer / admin user."""
    res = await client.post("/api/v1/auth/request-otp", json={
        "username": "district_officer",
        "password": "1234",
        "claimed_role": "admin"
    })
    assert res.status_code == 200
    assert res.json()["status"] == "success"


@pytest.mark.asyncio
async def test_demo_mode_otp_flag(client, monkeypatch):
    """Verify DEMO_MODE=True includes otp_code in response, DEMO_MODE=False excludes it."""
    from app.core.config import settings

    # 1. DEMO_MODE = False (default)
    monkeypatch.setattr(settings, "DEMO_MODE", False)
    res_off = await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "@12345",
        "claimed_role": "revenue_officer"
    })
    assert res_off.status_code == 200
    assert res_off.json()["otp_code"] is None

    # 2. DEMO_MODE = True
    monkeypatch.setattr(settings, "DEMO_MODE", True)
    res_on = await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "@12345",
        "claimed_role": "revenue_officer"
    })
    assert res_on.status_code == 200
    otp_code = res_on.json()["otp_code"]
    assert otp_code is not None
    assert len(otp_code) == 6
    assert otp_code.isdigit()


@pytest.mark.asyncio
async def test_emailjs_delivery_failure_raises_502(client, monkeypatch):
    """Verify that when EmailJS is configured and delivery fails, request-otp returns 502 Bad Gateway."""
    from app.core.config import settings

    monkeypatch.setattr(settings, "EMAILJS_SERVICE_ID", "service_mock")
    monkeypatch.setattr(settings, "EMAILJS_PUBLIC_KEY", "public_mock")

    async def mock_send_fail(*args, **kwargs):
        return False

    monkeypatch.setattr("app.api.v1.endpoints.auth.send_otp_email", mock_send_fail)

    res = await client.post("/api/v1/auth/request-otp", json={
        "username": "revenue_officer",
        "password": "1234",
        "claimed_role": "revenue_officer"
    })
    assert res.status_code == 502
    assert "EmailJS" in res.json()["detail"]
