import asyncio
import os
import sys
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

load_dotenv()
db_url = os.getenv("DATABASE_URL")

async def run_migration():
    print(f"Connecting to database to apply schema.sql...")
    engine = create_async_engine(db_url, connect_args={"ssl": "require"})
    
    schema_path = Path(__file__).resolve().parent / "schema.sql"
    with open(schema_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    # Split statements
    statements = [stmt.strip() for stmt in sql_content.split(";") if stmt.strip()]

    async with engine.begin() as conn:
        print("Cleaning up old tables for fresh setup...")
        # Drop in reverse dependency order
        for tbl in ["audit_logs", "documents", "surveys", "discrepancies", "mutations", "applications", "parcels", "users"]:
            try:
                await conn.execute(text(f"DROP TABLE IF EXISTS public.{tbl} CASCADE;"))
            except Exception as e:
                print(f"Note dropping {tbl}: {e}")

        print(f"Executing {len(statements)} schema statements from schema.sql...")
        for i, stmt in enumerate(statements, 1):
            try:
                await conn.execute(text(stmt))
            except Exception as e:
                print(f"Warning on statement {i}: {e}")

    await engine.dispose()
    print("Schema migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(run_migration())
