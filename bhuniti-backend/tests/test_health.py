import pytest


@pytest.mark.asyncio
async def test_health_and_root(client):
    res = await client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res = await client.get("/")
    assert res.status_code == 200


@pytest.mark.asyncio
async def test_auth_login(client):
    # Test Citizen Login
    res = await client.post("/api/v1/auth/login", json={"username": "citizen", "password": "1234"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "citizen"
    assert data["redirect_url"] == "/citizen"

    # Test Revenue Officer Login
    res = await client.post("/api/v1/auth/login", json={"username": "revenue_officer", "password": "1234"})
    assert res.status_code == 200
    assert res.json()["role"] == "revenue_officer"
    assert res.json()["redirect_url"] == "/revenue-officer"

    # Test District Officer Login
    res = await client.post("/api/v1/auth/login", json={"username": "district_officer", "password": "1234"})
    assert res.status_code == 200
    assert res.json()["role"] == "district_officer"
    assert res.json()["redirect_url"] == "/administration"


@pytest.mark.asyncio
async def test_parcels(client):
    # Search parcel
    res = await client.get("/api/v1/parcels/search?query=1024")
    assert res.status_code == 200
    parcels = res.json()
    assert len(parcels) > 0

    # Get GIS layer
    res = await client.get("/api/v1/parcels/gis/all")
    assert res.status_code == 200
    assert len(res.json()) > 0


@pytest.mark.asyncio
async def test_applications(client):
    # Login to obtain auth token
    login_res = await client.post("/api/v1/auth/login", json={"username": "citizen", "password": "1234"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = await client.get("/api/v1/applications/my", headers=headers)
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) > 0

    app_num = apps[0]["application_number"]
    res = await client.post(f"/api/v1/applications/{app_num}/confirm-availability", headers=headers)
    assert res.status_code == 200
    assert res.json()["status"] == "success"


@pytest.mark.asyncio
async def test_mutations_and_audit(client):
    # Login as Revenue Officer
    login_res = await client.post("/api/v1/auth/login", json={"username": "revenue_officer", "password": "1234"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Stats
    res = await client.get("/api/v1/mutations/stats", headers=headers)
    assert res.status_code == 200
    assert "pending_count" in res.json()

    # Action: Approve Mutation
    res = await client.post(
        "/api/v1/mutations/M-2026-018/action",
        json={"action": "approve", "note": "Verified by field survey report."},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["status"] == "Approved"

    # Check Audit Log
    res = await client.get("/api/v1/audit", headers=headers)
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0


@pytest.mark.asyncio
async def test_analytics(client):
    # Login as District Officer
    login_res = await client.post("/api/v1/auth/login", json={"username": "district_officer", "password": "1234"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = await client.get("/api/v1/analytics/district-overview", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["district_name"] == "Ghaziabad"
    assert len(data["tehsils"]) > 0
