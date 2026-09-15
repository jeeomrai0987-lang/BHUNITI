"""Task 2 database migration script."""
import asyncio
from app.core.database import async_engine
from sqlalchemy import text

statements = [
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';",
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS aadhaar_hash VARCHAR(64);",
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS aadhaar_last4 VARCHAR(4);",
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gov_id_type VARCHAR(50);",
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gov_id_hash VARCHAR(64);",
    "ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gov_id_last4 VARCHAR(10);",
    """
    CREATE TABLE IF NOT EXISTS public.pending_signups (
        id               VARCHAR(36) PRIMARY KEY,
        signup_token     VARCHAR(64) UNIQUE NOT NULL,
        full_name        VARCHAR(200) NOT NULL,
        mobile           VARCHAR(20) NOT NULL,
        email            VARCHAR(255),
        district         VARCHAR(100) DEFAULT 'Ghaziabad',
        tehsil           VARCHAR(100),
        mobile_otp_hash  VARCHAR(64),
        mobile_verified  BOOLEAN DEFAULT FALSE,
        aadhaar_hash     VARCHAR(64),
        aadhaar_last4    VARCHAR(4),
        aadhaar_otp_hash VARCHAR(64),
        aadhaar_verified BOOLEAN DEFAULT FALSE,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at       TIMESTAMPTZ NOT NULL
    );
    """,
    "CREATE INDEX IF NOT EXISTS ix_pending_signups_token ON public.pending_signups(signup_token);",
    "CREATE INDEX IF NOT EXISTS ix_pending_signups_mobile ON public.pending_signups(mobile);",
    "CREATE INDEX IF NOT EXISTS ix_pending_signups_expires_at ON public.pending_signups(expires_at);",
    "ALTER TABLE public.pending_signups ENABLE ROW LEVEL SECURITY;",
    "DROP POLICY IF EXISTS pending_signups_all_policy ON public.pending_signups;",
    """
    CREATE POLICY pending_signups_all_policy ON public.pending_signups
        FOR ALL USING (true) WITH CHECK (true);
    """
]

async def migrate():
    async with async_engine.begin() as conn:
        for stmt in statements:
            await conn.execute(text(stmt))
    print("Task 2 migration executed successfully on live Supabase!")

if __name__ == "__main__":
    asyncio.run(migrate())
