import uuid
from datetime import datetime, timezone
import pytest
from sqlalchemy import select

from app.core.security import create_access_token, get_password_hash
from app.models.application import Application
from app.models.parcel import Parcel
from app.models.user import User


# Pre-computed bcrypt hash for "pass1234" to avoid running bcrypt key derivation on every test
_PRECOMPUTED_HASH = get_password_hash("pass1234")


@pytest.fixture
async def idor_test_setup(db_session):
    """Fixture providing two distinct citizens (A and B), an officer, parcels, and applications."""
    uid = uuid.uuid4().hex[:6]
    now = datetime.now(timezone.utc)

    # 1. Create Citizen A
    user_a = User(
        id=f"usr-a-{uid}",
        username=f"citizen_a_{uid}",
        email=f"cit_a_{uid}@test.com",
        full_name=f"Citizen Alpha {uid}",
        hashed_password=_PRECOMPUTED_HASH,
        role="citizen",
        district="Ghaziabad",
        tehsil="Modinagar",
        is_active=True,
    )
    # 2. Create Citizen B
    user_b = User(
        id=f"usr-b-{uid}",
        username=f"citizen_b_{uid}",
        email=f"cit_b_{uid}@test.com",
        full_name=f"Citizen Beta {uid}",
        hashed_password=_PRECOMPUTED_HASH,
        role="citizen",
        district="Ghaziabad",
        tehsil="Modinagar",
        is_active=True,
    )
    # 3. Create Revenue Officer
    user_ro = User(
        id=f"usr-ro-{uid}",
        username=f"ro_{uid}",
        email=f"ro_{uid}@test.com",
        full_name=f"Officer {uid}",
        hashed_password=_PRECOMPUTED_HASH,
        role="revenue_officer",
        district="Ghaziabad",
        tehsil="Modinagar",
        is_active=True,
    )
    db_session.add_all([user_a, user_b, user_ro])
    await db_session.flush()

    # 4. Create dummy parcel
    parcel = Parcel(
        id=f"pcl-{uid}",
        ulpin=f"09-9999-9999-{uid[:4]}",
        owner_name=user_a.full_name,
        area_ha=2.5,
        district="Ghaziabad",
        tehsil="Modinagar",
    )
    db_session.add(parcel)
    await db_session.flush()

    # 5. Create Application A (owned by Citizen A)
    app_a = Application(
        id=f"app-a-{uid}",
        application_number=f"MUT-2026-A{uid[:4].upper()}",
        citizen_id=user_a.id,
        citizen_name=user_a.full_name,
        parcel_id=parcel.id,
        ulpin=parcel.ulpin,
        service_type="Title Transfer",
        status="In Progress",
        current_stage="Submitted",
        action_required="Citizen confirmation required",
        submission_date=now.date(),
    )
    # 6. Create Application B (owned by Citizen B)
    app_b = Application(
        id=f"app-b-{uid}",
        application_number=f"MUT-2026-B{uid[:4].upper()}",
        citizen_id=user_b.id,
        citizen_name=user_b.full_name,
        parcel_id=parcel.id,
        ulpin=parcel.ulpin,
        service_type="Title Transfer",
        status="In Progress",
        current_stage="Submitted",
        action_required="Citizen confirmation required",
        submission_date=now.date(),
    )
    db_session.add_all([app_a, app_b])
    await db_session.commit()

    token_a = create_access_token(subject=user_a.username, role=user_a.role)
    token_b = create_access_token(subject=user_b.username, role=user_b.role)
    token_ro = create_access_token(subject=user_ro.username, role=user_ro.role)

    return {
        "user_a_id": user_a.id,
        "user_b_id": user_b.id,
        "app_a_id": app_a.id,
        "app_a_number": app_a.application_number,
        "app_b_id": app_b.id,
        "app_b_number": app_b.application_number,
        "headers_a": {"Authorization": f"Bearer {token_a}"},
        "headers_b": {"Authorization": f"Bearer {token_b}"},
        "headers_ro": {"Authorization": f"Bearer {token_ro}"},
    }


@pytest.mark.asyncio
async def test_citizen_get_my_applications_scoped_to_caller(client, idor_test_setup):
    """GET /applications/my must ONLY return applications owned by the calling citizen."""
    headers_a = idor_test_setup["headers_a"]
    app_a_id = idor_test_setup["app_a_id"]
    app_a_number = idor_test_setup["app_a_number"]
    app_b_id = idor_test_setup["app_b_id"]
    app_b_number = idor_test_setup["app_b_number"]

    res = await client.get("/api/v1/applications/my", headers=headers_a)
    assert res.status_code == 200
    items = res.json()
    returned_ids = [item["id"] for item in items]
    returned_numbers = [item["application_number"] for item in items]

    # Citizen A sees their own application
    assert app_a_id in returned_ids
    assert app_a_number in returned_numbers

    # Citizen A NEVER sees Citizen B's application
    assert app_b_id not in returned_ids
    assert app_b_number not in returned_numbers


@pytest.mark.asyncio
async def test_citizen_get_other_citizen_application_returns_404(client, idor_test_setup):
    """GET /applications/{id} must return 404 when a citizen attempts to read another citizen's application."""
    headers_a = idor_test_setup["headers_a"]
    app_a_id = idor_test_setup["app_a_id"]
    app_b_id = idor_test_setup["app_b_id"]
    app_b_number = idor_test_setup["app_b_number"]

    # Citizen A requesting their own application -> 200 OK
    res_own = await client.get(f"/api/v1/applications/{app_a_id}", headers=headers_a)
    assert res_own.status_code == 200
    assert res_own.json()["id"] == app_a_id

    # Citizen A requesting Citizen B's application by UUID -> 404 NOT FOUND (not 403)
    res_other_id = await client.get(f"/api/v1/applications/{app_b_id}", headers=headers_a)
    assert res_other_id.status_code == 404

    # Citizen A requesting Citizen B's application by application_number -> 404 NOT FOUND
    res_other_num = await client.get(f"/api/v1/applications/{app_b_number}", headers=headers_a)
    assert res_other_num.status_code == 404


@pytest.mark.asyncio
async def test_citizen_confirm_other_citizen_survey_availability_returns_404(client, idor_test_setup, db_session):
    """POST /applications/{id}/confirm-availability must return 404 and not mutate another citizen's record."""
    headers_a = idor_test_setup["headers_a"]
    app_b_id = idor_test_setup["app_b_id"]

    # Citizen A tries to confirm survey availability on Citizen B's application
    res = await client.post(
        f"/api/v1/applications/{app_b_id}/confirm-availability",
        headers=headers_a,
        json={"preferred_date": "2026-10-15"},
    )
    assert res.status_code == 404

    # Verify Citizen B's application was NOT modified in the database
    fresh_app_b = (
        await db_session.execute(select(Application).where(Application.id == app_b_id))
    ).scalars().first()
    assert fresh_app_b.action_required == "Citizen confirmation required"


@pytest.mark.asyncio
async def test_officer_sees_all_applications(client, idor_test_setup):
    """Officers must retain full administrative access to all applications."""
    headers_ro = idor_test_setup["headers_ro"]
    app_a_id = idor_test_setup["app_a_id"]
    app_b_id = idor_test_setup["app_b_id"]

    # Officer calling GET /applications/my sees both applications
    res_list = await client.get("/api/v1/applications/my", headers=headers_ro)
    assert res_list.status_code == 200
    items = res_list.json()
    returned_ids = [item["id"] for item in items]
    assert app_a_id in returned_ids
    assert app_b_id in returned_ids

    # Officer fetching Citizen B's application directly -> 200 OK
    res_get_b = await client.get(f"/api/v1/applications/{app_b_id}", headers=headers_ro)
    assert res_get_b.status_code == 200
    assert res_get_b.json()["id"] == app_b_id
