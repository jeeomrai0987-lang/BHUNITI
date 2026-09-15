import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.core.database import AsyncSessionLocal, async_engine
from app.core.limiter import limiter


@pytest.fixture(autouse=True)
def disable_rate_limiter():
    """Disable slowapi rate limiting during pytest execution."""
    limiter.enabled = False
    yield
    limiter.enabled = True


@pytest.fixture(autouse=True)
async def cleanup_database_engine():
    """Dispose DB engine connections after each test to prevent event loop mismatch."""
    yield
    await async_engine.dispose()


@pytest.fixture
async def client():
    """Async HTTP client driving the ASGI FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def db_session():
    """Async database session fixture for direct database queries and test setups."""
    async with AsyncSessionLocal() as session:
        yield session
