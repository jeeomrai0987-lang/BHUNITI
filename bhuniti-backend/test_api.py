import sys
from pathlib import Path
import pytest
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.main import app

@pytest.mark.asyncio
async def test_health_and_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        res = await ac.get("/")
        assert res.status_code == 200

@pytest.mark.asyncio
async def test_auth_login():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Test Citizen Login
        res = await ac.post("/api/v1/auth/login", json={"username": "citizen", "password": "1234"})
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["role"] == "citizen"
        assert data["redirect_url"] == "/citizen"

        # Test Revenue Officer Login
        res = await ac.post("/api/v1/auth/login", json={"username": "revenue_officer", "password": "1234"})
        assert res.status_code == 200
        assert res.json()["role"] == "revenue_officer"
        assert res.json()["redirect_url"] == "/revenue-officer"

        # Test District Officer Login
        res = await ac.post("/api/v1/auth/login", json={"username": "district_officer", "password": "1234"})
        assert res.status_code == 200
        assert res.json()["role"] == "district_officer"
        assert res.json()["redirect_url"] == "/administration"

@pytest.mark.asyncio
async def test_parcels():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Search parcel
        res = await ac.get("/api/v1/parcels/search?query=1024")
        assert res.status_code == 200
        parcels = res.json()
        assert len(parcels) > 0
        assert "1024" in parcels[0]["ulpin"]

        # Get by ULPIN
        res = await ac.get("/api/v1/parcels/09-XXXX-XXXX-1024")
        assert res.status_code == 200
        assert res.json()["owner_name"] == "Rahul Sharma"

        # Get GIS layer
        res = await ac.get("/api/v1/parcels/gis/all")
        assert res.status_code == 200
        assert len(res.json()) > 0

@pytest.mark.asyncio
async def test_applications():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/applications/my")
        assert res.status_code == 200
        apps = res.json()
        assert len(apps) > 0
        assert apps[0]["application_number"] == "MUT-2023-8941"

        res = await ac.post("/api/v1/applications/MUT-2023-8941/confirm-availability")
        assert res.status_code == 200
        assert res.json()["status"] == "success"

@pytest.mark.asyncio
async def test_mutations_and_audit():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Stats
        res = await ac.get("/api/v1/mutations/stats")
        assert res.status_code == 200
        assert "pending_count" in res.json()

        # Action: Approve Mutation
        res = await ac.post(
            "/api/v1/mutations/M-2026-018/action",
            json={"action": "approve", "note": "Verified by field survey report."}
        )
        assert res.status_code == 200
        assert res.json()["status"] == "Approved"

        # Check Audit Log was recorded
        res = await ac.get("/api/v1/audit")
        assert res.status_code == 200
        logs = res.json()
        assert len(logs) > 0

@pytest.mark.asyncio
async def test_analytics():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/api/v1/analytics/district-overview")
        assert res.status_code == 200
        data = res.json()
        assert data["district_name"] == "Ghaziabad"
        assert len(data["tehsils"]) > 0
