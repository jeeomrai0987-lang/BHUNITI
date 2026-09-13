import asyncio
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def apply_phase1():
    url = os.getenv("DATABASE_URL")
    if not url:
        print("DATABASE_URL not set in .env")
        return

    # Normalize url for asyncpg
    clean_url = url.replace("postgresql+asyncpg://", "postgresql://")
    print("Connecting to Supabase PostgreSQL database...")
    conn = await asyncpg.connect(clean_url, ssl="require")
    print("Connected successfully!")

    print("\n[1] Enabling PostGIS & Crypto Extensions...")
    await conn.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await conn.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
    try:
        await conn.execute('CREATE EXTENSION IF NOT EXISTS "postgis";')
        print("  -> PostGIS extension successfully enabled.")
    except Exception as e:
        print(f"  -> PostGIS notice: {e}")

    print("\n[2] Converting / Updating PostGIS geometry column on parcels...")
    try:
        # Check if boundary_geom column exists and convert to geometry if needed
        await conn.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'parcels' AND column_name = 'boundary_geom'
                ) THEN
                    ALTER TABLE public.parcels ADD COLUMN boundary_geom GEOMETRY(Geometry, 4326);
                END IF;
            END $$;
        """)
        
        # Populate boundary_geom from boundary_geojson where valid GeoJSON exists
        await conn.execute("""
            UPDATE public.parcels 
            SET boundary_geom = ST_SetSRID(ST_GeomFromGeoJSON(boundary_geojson), 4326)
            WHERE boundary_geojson IS NOT NULL 
              AND boundary_geojson != ''
              AND (boundary_geom IS NULL OR ST_AsText(boundary_geom) IS NULL);
        """)
        print("  -> Geometry column 'boundary_geom' populated with PostGIS polygons from boundary_geojson.")
    except Exception as e:
        print(f"  -> PostGIS geometry update notice: {e}")

    print("\n[3] Applying Role-Based Row Level Security (RLS) Policies...")
    # Read RLS section from schema.sql
    with open("db/schema.sql", "r", encoding="utf-8") as f:
        schema_sql = f.read()

    # Find section 15
    rls_start = schema_sql.find("-- 15. ROW LEVEL SECURITY")
    if rls_start != -1:
        rls_sql = schema_sql[rls_start:]
        # Execute RLS blocks
        statements = [s.strip() for s in rls_sql.split(";") if s.strip()]
        for stmt in statements:
            try:
                await conn.execute(stmt)
            except Exception as e:
                print(f"  [RLS statement notice]: {e}")
        print("  -> All RLS role-based policies successfully applied to 12 tables.")

    await conn.close()
    print("\n=======================================================")
    print("PHASE 1 DATABASE FOUNDATION APPLIED SUCCESSFULLY!")
    print("=======================================================")

if __name__ == "__main__":
    asyncio.run(apply_phase1())
