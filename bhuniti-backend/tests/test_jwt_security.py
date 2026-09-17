import pytest
from jose import jwt, JWTError
from pydantic import ValidationError

from app.core.config import Settings, DEFAULT_SECRET_KEY
from app.core.security import create_access_token, decode_token


def test_settings_rejects_default_secret_key_outside_development():
    """Ensure Settings raises a ValidationError when ENVIRONMENT is non-dev and SECRET_KEY is default."""
    # 1. Production with default key should fail
    with pytest.raises((ValidationError, ValueError)) as exc_info:
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY=DEFAULT_SECRET_KEY,
            _env_file=None,
        )
    assert "CRITICAL SECURITY ERROR" in str(exc_info.value)

    # 2. Staging with default key should fail
    with pytest.raises((ValidationError, ValueError)) as exc_info:
        Settings(
            ENVIRONMENT="staging",
            SECRET_KEY=DEFAULT_SECRET_KEY,
            _env_file=None,
        )
    assert "CRITICAL SECURITY ERROR" in str(exc_info.value)


def test_settings_allows_default_secret_key_in_development():
    """Ensure Settings allows DEFAULT_SECRET_KEY when ENVIRONMENT is 'development'."""
    s = Settings(
        ENVIRONMENT="development",
        SECRET_KEY=DEFAULT_SECRET_KEY,
        _env_file=None,
    )
    assert s.is_default_secret_key is True
    assert s.SECRET_KEY == DEFAULT_SECRET_KEY


def test_settings_allows_custom_secret_key_in_production():
    """Ensure Settings allows custom secure SECRET_KEY in production."""
    custom_key = "a_super_strong_production_secret_key_that_is_unique_and_secure_32b"
    s = Settings(
        ENVIRONMENT="production",
        SECRET_KEY=custom_key,
        _env_file=None,
    )
    assert s.is_default_secret_key is False
    assert s.SECRET_KEY == custom_key


def test_token_invalidation_after_key_rotation():
    """Verify that tokens signed with the old DEFAULT_SECRET_KEY fail verification with a rotated key."""
    old_secret = DEFAULT_SECRET_KEY
    new_secret = "49e9102299d907b40e1b8d5570ebb916daa796372b4c7bd8d3b570721f6d0321"

    # Token forged/signed with old DEFAULT_SECRET_KEY
    payload = {"sub": "district_officer", "role": "district_officer"}
    token_signed_with_old_key = jwt.encode(payload, old_secret, algorithm="HS256")

    # Attempt decoding with new secret key -> must raise JWTError
    with pytest.raises(JWTError):
        jwt.decode(token_signed_with_old_key, new_secret, algorithms=["HS256"])

    # Token signed with new secret key -> succeeds
    token_signed_with_new_key = jwt.encode(payload, new_secret, algorithm="HS256")
    decoded = jwt.decode(token_signed_with_new_key, new_secret, algorithms=["HS256"])
    assert decoded["sub"] == "district_officer"
    assert decoded["role"] == "district_officer"


@pytest.mark.asyncio
async def test_forged_demo_token_rejected(client):
    """Verify arbitrary fake demo token strings are rejected with HTTP 401."""
    res = await client.get(
        "/api/v1/applications/my",
        headers={"Authorization": "Bearer secure-demo-token-district_officer"},
    )
    assert res.status_code == 401
    assert res.json()["detail"] == "Could not validate credentials"
    assert "WWW-Authenticate" in res.headers


@pytest.mark.asyncio
async def test_demo_account_rejected_in_production_mode(client, monkeypatch):
    """Verify demo default password and officer single-factor logins are rejected when DEMO_MODE=False."""
    from app.core.config import settings

    monkeypatch.setattr(settings, "DEMO_MODE", False)

    # 1. Officer attempting single-factor password login in production -> 403 Forbidden
    res_officer = await client.post(
        "/api/v1/auth/login",
        json={"username": "district_officer", "password": "1234"},
    )
    assert res_officer.status_code == 403
    assert "Two-Factor Authentication" in res_officer.json()["detail"]

    # 2. Citizen attempting default demo password '1234' in production -> 401 Unauthorized
    res_citizen = await client.post(
        "/api/v1/auth/login",
        json={"username": "citizen", "password": "1234"},
    )
    assert res_citizen.status_code == 401
    assert "Invalid username or password" in res_citizen.json()["detail"]

