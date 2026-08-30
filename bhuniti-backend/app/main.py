from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import async_engine, Base
from app.api.v1.router import api_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhuniti-api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing BHUNITI Backend API...")
    # Create DB tables if needed
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.warning(f"Note on DB schema auto-create: {e}")
    yield
    logger.info("Shutting down BHUNITI Backend API...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for BHUNITI Land Governance Platform (Smart India Hackathon 2026)",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Set up CORS
origins = settings.BACKEND_CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "BHUNITI Land Governance Platform API",
        "environment": settings.ENVIRONMENT,
        "database_backend": "Supabase PostgreSQL" if settings.DATABASE_URL else "SQLite Local Fallback"
    }

@app.get("/", tags=["System"])
async def root():
    return {
        "message": "Welcome to BHUNITI Land Governance API",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": "/health"
    }
