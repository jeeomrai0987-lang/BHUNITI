"""Application entry point.

Fixes over the original: a failed schema init is no longer logged as a "note" and
forgotten (it aborts startup outside development, and marks the app degraded
otherwise), CORS is driven by settings including an optional origin regex,
``/health`` actually queries the database and answers 503 when it cannot,
running on the shipped development ``SECRET_KEY`` logs a loud warning, and a
database outage returns a translated 503 instead of a bare 500 traceback.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.deps import get_locale
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import init_models, ping
from app.core.i18n import resolve_locale, t
from app.core.limiter import limiter


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhuniti-api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s (%s)", settings.PROJECT_NAME, settings.ENVIRONMENT)

    # Enforce strict secret key validation outside local development
    if (settings.ENVIRONMENT or "").strip().lower() != "development" and settings.is_default_secret_key:
        error_msg = (
            f"CRITICAL SECURITY ERROR: Cannot start application in '{settings.ENVIRONMENT}' environment "
            f"using the default insecure SECRET_KEY. Refusing to start service. "
            f"Set a unique, cryptographically secure SECRET_KEY in your deployment environment."
        )
        logger.critical(error_msg)
        raise RuntimeError(error_msg)

    if settings.is_default_secret_key:
        logger.warning(
            "SECURITY WARNING: SECRET_KEY is set to the default development key. "
            "Every token this process issues can be forged by anyone holding the repository. "
            "This is acceptable for local development only. Set a unique SECRET_KEY before deploying."
        )

    # Warn loudly if running on SQLite outside local development
    if settings.uses_sqlite and (settings.ENVIRONMENT or "").strip().lower() != "development":
        logger.critical(
            "CRITICAL DATABASE WARNING: Application is running in '%s' environment using the "
            "local SQLite fallback database (%s). "
            "Ephemeral hosting platforms (such as Render or Docker containers) wipe local disk on every "
            "redeploy or restart, leading to TOTAL DATA LOSS! "
            "Set a persistent PostgreSQL DATABASE_URL and configure USE_SQLITE_FALLBACK=False in your environment.",
            settings.ENVIRONMENT,
            settings.SQLITE_DB_PATH,
        )

    app.state.db_ready = False
    try:
        await init_models()
        app.state.db_ready = True
        logger.info("Database schema is up to date.")
    except Exception as exc:
        if settings.ENVIRONMENT.lower() in ("production", "prod", "staging"):
            logger.error("Could not initialize the database schema: %s", exc)
            raise
        logger.error(
            "Could not initialize the database schema: %s. The API will start, but "
            "every data endpoint will fail until the database is reachable.",
            exc,
        )

    yield
    logger.info("Shutting down %s", settings.PROJECT_NAME)


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "FastAPI backend for the BHUNITI Land Governance Platform "
        "(Smart India Hackathon 2026). Send ?lang=hi or an Accept-Language header "
        "to receive translated messages and *_label fields."
    ),
    version="1.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


cors_kwargs = {
    "allow_origins": settings.BACKEND_CORS_ORIGINS,
    "allow_credentials": True,
    "allow_methods": ["*"],
    # X-Total-Count is set by every list endpoint; browsers hide it otherwise.
    "expose_headers": ["X-Total-Count"],
    "allow_headers": ["*"],
}
if settings.CORS_ORIGIN_REGEX:
    cors_kwargs["allow_origin_regex"] = settings.CORS_ORIGIN_REGEX
app.add_middleware(CORSMiddleware, **cors_kwargs)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.exception_handler(SQLAlchemyError)
async def database_error_handler(request: Request, exc: SQLAlchemyError):
    """Turn a driver/ORM failure into an honest 503 in the caller's language."""
    locale = resolve_locale(
        request.query_params.get("lang"), request.headers.get("accept-language")
    )
    logger.error("Database error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": t("error.database_unavailable", locale)},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions to ensure a JSON error is returned with CORS headers intact."""
    logger.error("Unhandled error on %s %s: %s", request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred. Please try again later."},
    )


@app.get("/health", tags=["System"])
async def health_check(request: Request):
    database_ok = await ping()
    payload = {
        "status": "healthy" if database_ok else "degraded",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "database_backend": "SQLite (local fallback)" if settings.uses_sqlite else "PostgreSQL",
        "database_reachable": database_ok,
        "schema_initialized": bool(getattr(request.app.state, "db_ready", False)),
        "supported_locales": settings.SUPPORTED_LOCALES,
    }
    return JSONResponse(
        status_code=status.HTTP_200_OK if database_ok else status.HTTP_503_SERVICE_UNAVAILABLE,
        content=payload,
    )


@app.get("/", tags=["System"])
async def root(locale: str = Depends(get_locale)):
    return {
        "message": t("system.welcome", locale),
        "service": t("system.service_name", locale),
        "docs": f"{settings.API_V1_STR}/docs",
        "health": "/health",
        "languages": f"{settings.API_V1_STR}/i18n/locales",
    }
