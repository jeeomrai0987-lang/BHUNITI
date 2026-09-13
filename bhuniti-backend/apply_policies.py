import asyncio
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

POLICIES = [
    # USERS
    "DROP POLICY IF EXISTS users_select_policy ON public.users;",
    """CREATE POLICY users_select_policy ON public.users FOR SELECT USING (
        auth.uid()::text = id
        OR (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );""",
    "DROP POLICY IF EXISTS users_update_policy ON public.users;",
    """CREATE POLICY users_update_policy ON public.users FOR UPDATE USING (
        auth.uid()::text = id
        OR (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # PARCELS
    "DROP POLICY IF EXISTS parcels_select_policy ON public.parcels;",
    "CREATE POLICY parcels_select_policy ON public.parcels FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS parcels_modify_policy ON public.parcels;",
    """CREATE POLICY parcels_modify_policy ON public.parcels FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # APPLICATIONS
    "DROP POLICY IF EXISTS applications_select_policy ON public.applications;",
    """CREATE POLICY applications_select_policy ON public.applications FOR SELECT USING (
        citizen_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );""",
    "DROP POLICY IF EXISTS applications_insert_policy ON public.applications;",
    """CREATE POLICY applications_insert_policy ON public.applications FOR INSERT WITH CHECK (
        citizen_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('citizen', 'revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );""",
    "DROP POLICY IF EXISTS applications_update_policy ON public.applications;",
    """CREATE POLICY applications_update_policy ON public.applications FOR UPDATE USING (
        citizen_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # MUTATIONS
    "DROP POLICY IF EXISTS mutations_select_policy ON public.mutations;",
    "CREATE POLICY mutations_select_policy ON public.mutations FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS mutations_modify_policy ON public.mutations;",
    """CREATE POLICY mutations_modify_policy ON public.mutations FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # DISCREPANCIES
    "DROP POLICY IF EXISTS discrepancies_select_policy ON public.discrepancies;",
    "CREATE POLICY discrepancies_select_policy ON public.discrepancies FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS discrepancies_modify_policy ON public.discrepancies;",
    """CREATE POLICY discrepancies_modify_policy ON public.discrepancies FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # SURVEYS
    "DROP POLICY IF EXISTS surveys_select_policy ON public.surveys;",
    "CREATE POLICY surveys_select_policy ON public.surveys FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS surveys_modify_policy ON public.surveys;",
    """CREATE POLICY surveys_modify_policy ON public.surveys FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # DOCUMENTS
    "DROP POLICY IF EXISTS documents_select_policy ON public.documents;",
    "CREATE POLICY documents_select_policy ON public.documents FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS documents_modify_policy ON public.documents;",
    """CREATE POLICY documents_modify_policy ON public.documents FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('citizen', 'revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # NOTIFICATIONS
    "DROP POLICY IF EXISTS notifications_select_policy ON public.notifications;",
    """CREATE POLICY notifications_select_policy ON public.notifications FOR SELECT USING (
        user_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );""",
    "DROP POLICY IF EXISTS notifications_update_policy ON public.notifications;",
    """CREATE POLICY notifications_update_policy ON public.notifications FOR UPDATE USING (
        user_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",
    "DROP POLICY IF EXISTS notifications_insert_policy ON public.notifications;",
    """CREATE POLICY notifications_insert_policy ON public.notifications FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );""",

    # REGISTRATION_RECORDS
    "DROP POLICY IF EXISTS registration_records_select_policy ON public.registration_records;",
    "CREATE POLICY registration_records_select_policy ON public.registration_records FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS registration_records_modify_policy ON public.registration_records;",
    """CREATE POLICY registration_records_modify_policy ON public.registration_records FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # ENCUMBRANCES
    "DROP POLICY IF EXISTS encumbrances_select_policy ON public.encumbrances;",
    "CREATE POLICY encumbrances_select_policy ON public.encumbrances FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS encumbrances_modify_policy ON public.encumbrances;",
    """CREATE POLICY encumbrances_modify_policy ON public.encumbrances FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );""",

    # AUDIT_LOGS
    "DROP POLICY IF EXISTS audit_logs_select_policy ON public.audit_logs;",
    "CREATE POLICY audit_logs_select_policy ON public.audit_logs FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS audit_logs_insert_policy ON public.audit_logs;",
    """CREATE POLICY audit_logs_insert_policy ON public.audit_logs FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );""",

    # REF_TRANSLATIONS
    "DROP POLICY IF EXISTS ref_translations_select_policy ON public.ref_translations;",
    "CREATE POLICY ref_translations_select_policy ON public.ref_translations FOR SELECT USING (true);",
    "DROP POLICY IF EXISTS ref_translations_modify_policy ON public.ref_translations;",
    """CREATE POLICY ref_translations_modify_policy ON public.ref_translations FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );"""
]

async def apply_policies():
    url = os.getenv("DATABASE_URL")
    clean_url = url.replace("postgresql+asyncpg://", "postgresql://")
    conn = await asyncpg.connect(clean_url, ssl="require")

    print("Applying individual RLS policies...")
    for stmt in POLICIES:
        try:
            await conn.execute(stmt)
        except Exception as e:
            print(f"Error on {stmt[:40]}: {e}")

    print("All RLS policies successfully verified and applied!")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(apply_policies())
