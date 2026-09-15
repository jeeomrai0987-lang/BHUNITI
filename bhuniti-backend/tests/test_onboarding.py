import hashlib
import random
import pytest
from sqlalchemy import select

from app.core.verhoeff import generate_verhoeff, validate_verhoeff
from app.models.pending_signup import PendingSignup
from app.models.user import User


def _rand_digits(n=8):
    return f"{random.randint(10**(n-1), (10**n)-1)}"


@pytest.mark.asyncio
async def test_verhoeff_algorithm():
    """Verify Verhoeff algorithm generation and validation logic."""
    aadhaar_prefix = f"99{_rand_digits(9)}"
    valid_aadhaar = generate_verhoeff(aadhaar_prefix)
    assert validate_verhoeff(valid_aadhaar) is True

    # Tamper with the checksum digit
    tampered_digit = str((int(valid_aadhaar[-1]) + 1) % 10)
    invalid_aadhaar = valid_aadhaar[:-1] + tampered_digit
    assert validate_verhoeff(invalid_aadhaar) is False


@pytest.mark.asyncio
async def test_citizen_self_signup_5_step_flow(client, db_session):
    """Test full 5-step citizen self-signup wizard with mobile OTP, Aadhaar e-KYC, and password creation."""
    suffix = _rand_digits(6)
    new_mobile = f"98{suffix}12"[:10]
    new_username = f"citizen_new_{suffix}"
    new_email = f"citizen_{suffix}@gmail.com"
    new_password = f"CitizenPass@{suffix}"

    aadhaar_prefix = f"99{_rand_digits(9)}"
    valid_aadhaar = generate_verhoeff(aadhaar_prefix)

    # ── Step 1: Start Signup ──
    res1 = await client.post("/api/v1/auth/signup/start", json={
        "full_name": "Rohan Gupta",
        "mobile": new_mobile,
        "email": new_email,
        "district": "Ghaziabad",
        "tehsil": "Modinagar"
    })
    assert res1.status_code == 200
    step1_data = res1.json()
    signup_token = step1_data["signup_token"]
    assert step1_data["status"] == "mobile_otp_sent"
    assert signup_token is not None

    # Inject test mobile OTP
    pending = (await db_session.execute(
        select(PendingSignup).where(PendingSignup.signup_token == signup_token)
    )).scalars().first()
    assert pending is not None
    test_mobile_otp = "852963"
    pending.mobile_otp_hash = hashlib.sha256(test_mobile_otp.encode("utf-8")).hexdigest()
    db_session.add(pending)
    await db_session.commit()

    # ── Step 2: Verify Mobile OTP ──
    res2 = await client.post("/api/v1/auth/signup/verify-mobile", json={
        "signup_token": signup_token,
        "otp": test_mobile_otp
    })
    assert res2.status_code == 200
    assert res2.json()["status"] == "mobile_verified"

    # ── Step 3: Enter Aadhaar Number ──
    # 3a. Reject invalid Verhoeff Aadhaar
    bad_res = await client.post("/api/v1/auth/signup/aadhaar", json={
        "signup_token": signup_token,
        "aadhaar_number": "123456789012"  # Invalid Verhoeff
    })
    assert bad_res.status_code == 400

    # 3b. Accept valid Verhoeff Aadhaar
    res3 = await client.post("/api/v1/auth/signup/aadhaar", json={
        "signup_token": signup_token,
        "aadhaar_number": valid_aadhaar
    })
    assert res3.status_code == 200
    step3_data = res3.json()
    assert step3_data["status"] == "aadhaar_otp_sent"

    # Inject test Aadhaar OTP
    db_session.expire_all()
    pending = (await db_session.execute(
        select(PendingSignup).where(PendingSignup.signup_token == signup_token)
    )).scalars().first()
    test_aadhaar_otp = "963852"
    pending.aadhaar_otp_hash = hashlib.sha256(test_aadhaar_otp.encode("utf-8")).hexdigest()
    db_session.add(pending)
    await db_session.commit()

    # ── Step 4: Verify Aadhaar OTP ──
    res4 = await client.post("/api/v1/auth/signup/verify-aadhaar", json={
        "signup_token": signup_token,
        "otp": test_aadhaar_otp
    })
    assert res4.status_code == 200
    assert res4.json()["status"] == "aadhaar_verified"

    # ── Step 5: Complete Account Creation ──
    res5 = await client.post("/api/v1/auth/signup/complete", json={
        "signup_token": signup_token,
        "username": new_username,
        "password": new_password,
        "preferred_locale": "hi"
    })
    assert res5.status_code == 201
    citizen_auth = res5.json()
    assert citizen_auth["role"] == "citizen"
    assert citizen_auth["username"] == new_username
    assert citizen_auth["preferred_locale"] == "hi"
    assert "access_token" in citizen_auth

    # ── Step 6: Verify Database Privacy & Salted Hash ──
    db_session.expire_all()
    created_user = (await db_session.execute(
        select(User).where(User.username == new_username)
    )).scalars().first()
    assert created_user is not None
    assert created_user.aadhaar_last4 == valid_aadhaar[-4:]
    assert len(created_user.aadhaar_hash) == 64
    assert valid_aadhaar not in (created_user.aadhaar_hash or "")


@pytest.mark.asyncio
async def test_citizen_signup_requires_email(client):
    """Ensure citizen signup/start rejects requests without a valid email address."""
    res = await client.post("/api/v1/auth/signup/start", json={
        "full_name": "Test Citizen",
        "mobile": "9812345678",
        "district": "Ghaziabad",
        "tehsil": "Modinagar"
        # email is omitted
    })
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_citizen_signup_demo_mode_otp(client, monkeypatch):
    """Verify DEMO_MODE returns otp_code for both Mobile OTP and Aadhaar OTP steps."""
    from app.core.config import settings

    monkeypatch.setattr(settings, "DEMO_MODE", True)

    suffix = _rand_digits(6)
    new_mobile = f"97{suffix}34"[:10]
    new_email = f"demo_citizen_{suffix}@gmail.com"

    # Step 1: Start signup in DEMO_MODE
    res1 = await client.post("/api/v1/auth/signup/start", json={
        "full_name": "Demo User",
        "mobile": new_mobile,
        "email": new_email,
        "district": "Ghaziabad",
        "tehsil": "Modinagar"
    })
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["otp_code"] is not None
    assert len(data1["otp_code"]) == 6
    signup_token = data1["signup_token"]

    # Verify mobile using the returned demo OTP code directly
    res2 = await client.post("/api/v1/auth/signup/verify-mobile", json={
        "signup_token": signup_token,
        "otp": data1["otp_code"]
    })
    assert res2.status_code == 200

    # Step 3: Request Aadhaar OTP in DEMO_MODE
    valid_aadhaar = generate_verhoeff(f"99{_rand_digits(9)}")
    res3 = await client.post("/api/v1/auth/signup/aadhaar", json={
        "signup_token": signup_token,
        "aadhaar_number": valid_aadhaar
    })
    assert res3.status_code == 200
    data3 = res3.json()
    assert data3["otp_code"] is not None
    assert len(data3["otp_code"]) == 6

    # Step 4: Verify Aadhaar using the returned demo Aadhaar OTP code directly
    res4 = await client.post("/api/v1/auth/signup/verify-aadhaar", json={
        "signup_token": signup_token,
        "otp": data3["otp_code"]
    })
    assert res4.status_code == 200
    assert res4.json()["status"] == "aadhaar_verified"
