"""Engine, session factory and the optional Supabase client.

Changes from the original: SQLite connections now switch foreign keys on (the
models declare them, and SQLite ignores every one of them unless the pragma is
set per connection), the Postgres SSL argument is only applied to Postgres URLs,
schema creation lives in ``init_models()`` instead of being inlined in
``main.py``, and ``ping()`` gives ``/health`` a real answer instead of guessing
from the presence of a config value.
"""
import logging
from typing import Any, AsyncGenerator, Dict

from sqlalchemy import event, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from app.core.config import settings

logger = logging.getLogger(__name__)

# Base model for every ORM entity.
Base = declarative_base()

DATABASE_URL = settings.async_database_url
IS_SQLITE = DATABASE_URL.startswith("sqlite")


def _engine_kwargs() -> Dict[str, Any]:
    if IS_SQLITE:
        # check_same_thread is a SQLite-only guard that async access trips over.
        return {"connect_args": {"check_same_thread": False}}
    return {
        # Supabase's pooler requires TLS; asyncpg takes the mode as a string.
        "connect_args": {"ssl": "require"},
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }


async_engine = create_async_engine(DATABASE_URL, echo=False, future=True, **_engine_kwargs())

if IS_SQLITE:

    @event.listens_for(async_engine.sync_engine, "connect")
    def _sqlite_pragmas(dbapi_connection, _connection_record):
        """Enforce foreign keys on the local fallback database."""
        cursor = dbapi_connection.cursor()
        try:
            cursor.execute("PRAGMA foreign_keys=ON")
        finally:
            cursor.close()


AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_models() -> None:
    """Create any missing tables. Never alters existing ones -- see ``db/migrate.py``."""
    # Imported for the side effect of registering every model on Base.metadata.
    import app.models  # noqa: F401

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def ping() -> bool:
    """True when the database answers a trivial query."""
    try:
        async with async_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except SQLAlchemyError as exc:
        logger.warning("Database ping failed: %s", exc)
        return False
    except Exception as exc:  # driver-level failures (DNS, TLS, auth)
        logger.warning("Database unreachable: %s", exc)
        return False


# Optional Supabase client (storage / auth helpers). Absence is not an error.
supabase_client = None
if settings.SUPABASE_URL and (settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY):
    try:
        from supabase import create_client

        supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY,
        )
        logger.info("Supabase client initialized.")
    except Exception as exc:
        logger.warning("Could not initialize Supabase client: %s", exc)


def get_supabase():
    return supabase_client
