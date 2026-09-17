import json
from typing import List, Union

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# =============================================================================
# INSECURE DEVELOPMENT DEFAULT SECRET KEY
# =============================================================================
# WARNING: This constant is ONLY for local zero-config development (ENVIRONMENT="development").
# It MUST NEVER be used in production, staging, or any deployed environment.
# The Settings validator and main.py lifespan check will refuse to start the application
# if this key is used when ENVIRONMENT != "development".
DEFAULT_SECRET_KEY = "bhuniti_secret_jwt_key_super_secure_development_key_12345"


class Settings(BaseSettings):
    PROJECT_NAME: str = "BHUNITI Land Governance Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = DEFAULT_SECRET_KEY
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ALGORITHM: str = "HS256"
    ENVIRONMENT: str = "development"

    # Internationalisation
    DEFAULT_LOCALE: str = "en"
    SUPPORTED_LOCALES: Union[List[str], str] = ["en", "hi", "mr", "bn", "ta"]

    # CORS. Accepts a JSON array or a plain comma-separated list, because both
    # spellings turn up in .env files.
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    # Optional regex for dev and deployed frontends (matches any localhost/127.0.0.1 port)
    CORS_ORIGIN_REGEX: str = r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$"

    # Supabase configuration
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # EmailJS configuration (for OTP & officer credentials delivery)
    EMAILJS_SERVICE_ID: str = ""
    EMAILJS_TEMPLATE_ID_OTP: str = ""
    EMAILJS_TEMPLATE_ID_OFFICER_CREDENTIALS: str = ""
    EMAILJS_PUBLIC_KEY: str = ""
    EMAILJS_PRIVATE_KEY: str = ""

    # SMS Gateway configuration (MSG91 / Fast2SMS / Twilio)
    SMS_GATEWAY_API_KEY: str = ""

    # Demo safety net mode (returns OTP code in response if True)
    DEMO_MODE: bool = False

    # PII & Aadhaar cryptographic salt (Set in environment in production)
    AADHAAR_HASH_SALT: str = "dev_aadhaar_salt_local_only"


    # Database configuration
    DATABASE_URL: str = ""
    SQLITE_DB_PATH: str = "./bhuniti_local.db"
    USE_SQLITE_FALLBACK: bool = True


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("BACKEND_CORS_ORIGINS", "SUPPORTED_LOCALES", mode="before")
    @classmethod
    def _split_comma_separated(cls, value):
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("[") and text.endswith("]"):
                try:
                    parsed = json.loads(text)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    pass
            return [item.strip() for item in text.split(",") if item.strip()]
        return value

    @model_validator(mode="after")
    def validate_secret_key_security(self) -> "Settings":
        env = (self.ENVIRONMENT or "").strip().lower()
        if env != "development" and self.SECRET_KEY == DEFAULT_SECRET_KEY:
            raise ValueError(
                f"CRITICAL SECURITY ERROR: Running outside development (ENVIRONMENT='{self.ENVIRONMENT}') "
                f"with the insecure DEFAULT_SECRET_KEY. Refusing to load settings. "
                f"Please generate and configure a cryptographically secure SECRET_KEY in your environment or .env file."
            )
        return self

    @property
    def is_default_secret_key(self) -> bool:
        return self.SECRET_KEY == DEFAULT_SECRET_KEY

    @property
    def uses_sqlite(self) -> bool:
        return not bool(self.DATABASE_URL.strip())

    @property
    def async_database_url(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            url = self.DATABASE_URL.strip()
            # Accept the plain postgresql:// form Supabase hands out.
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url
        if not self.USE_SQLITE_FALLBACK:
            raise RuntimeError(
                "DATABASE_URL is empty and USE_SQLITE_FALLBACK is disabled. "
                "Set DATABASE_URL in .env, or set USE_SQLITE_FALLBACK=True to use "
                f"the local SQLite file at {self.SQLITE_DB_PATH}."
            )
        return f"sqlite+aiosqlite:///{self.SQLITE_DB_PATH}"

    @property
    def sync_database_url(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            url = self.DATABASE_URL.strip()
            if url.startswith("postgresql+asyncpg://"):
                url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
            return url
        return f"sqlite:///{self.SQLITE_DB_PATH}"


settings = Settings()
