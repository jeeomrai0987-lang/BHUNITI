-- ==============================================================================
-- BHUNITI Land Governance Platform -- Supabase PostgreSQL schema
-- Smart India Hackathon (SIH 2026)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. USERS
CREATE TABLE IF NOT EXISTS public.users (
    id               VARCHAR(36) PRIMARY KEY,
    username         VARCHAR(100) NOT NULL,
    email            VARCHAR(255),
    hashed_password  VARCHAR(255) NOT NULL,
    role             VARCHAR(50)  NOT NULL DEFAULT 'citizen', -- citizen | revenue_officer | district_officer
    full_name        VARCHAR(200),
    phone            VARCHAR(20),
    designation      VARCHAR(100),
    district         VARCHAR(100) DEFAULT 'Ghaziabad',
    tehsil           VARCHAR(100),
    preferred_locale VARCHAR(5)   NOT NULL DEFAULT 'en',
    is_active        BOOLEAN      DEFAULT TRUE,
    created_at       TIMESTAMPTZ  DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- 3. PARCELS (land records + GIS)
CREATE TABLE IF NOT EXISTS public.parcels (
    id                  VARCHAR(36) PRIMARY KEY,
    ulpin               VARCHAR(50) NOT NULL,   -- '09-XXXX-XXXX-1024' or 'P-1024'
    survey_number       VARCHAR(50),
    khasra_number       VARCHAR(50),
    khata_number        VARCHAR(50),
    state               VARCHAR(100) DEFAULT 'Uttar Pradesh',
    district            VARCHAR(100) DEFAULT 'Ghaziabad',
    tehsil              VARCHAR(100) DEFAULT 'Modinagar',
    village             VARCHAR(100) DEFAULT 'Sikandrabad',
    pincode             VARCHAR(10),
    owner_name          VARCHAR(200) NOT NULL,
    co_owners_json      TEXT,                   -- JSON array
    land_type           VARCHAR(100) DEFAULT 'Agricultural',
    area_ha             DOUBLE PRECISION NOT NULL,
    area_sqm            DOUBLE PRECISION,
    valuation_inr       DOUBLE PRECISION,
    boundary_geojson    TEXT,                   -- GeoJSON polygon
    boundary_geom       GEOMETRY(Geometry, 4326),-- PostGIS geometry column
    centroid_lat        DOUBLE PRECISION,
    centroid_lng        DOUBLE PRECISION,
    verification_status VARCHAR(50)  DEFAULT 'Verified',  -- Verified | Under Verification | Disputed
    is_disputed         BOOLEAN      DEFAULT FALSE,
    dispute_reason      TEXT,
    encumbrance_status  VARCHAR(100) DEFAULT 'Clean',     -- Clean | Mortgaged | Leased | Court Stay
    image_url           TEXT,
    created_at          TIMESTAMPTZ  DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  DEFAULT NOW()
);

-- 4. APPLICATIONS (citizen land services)
CREATE TABLE IF NOT EXISTS public.applications (
    id                 VARCHAR(36) PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL,   -- 'MUT-2023-8941'
    citizen_id         VARCHAR(36) REFERENCES public.users(id)   ON DELETE SET NULL,
    citizen_name       VARCHAR(200) NOT NULL,
    parcel_id          VARCHAR(36) REFERENCES public.parcels(id) ON DELETE SET NULL,
    ulpin              VARCHAR(50),
    service_type       VARCHAR(100) NOT NULL DEFAULT 'Title Transfer',
    status             VARCHAR(50) DEFAULT 'In Progress',  -- In Progress | Action Required | Approved | Rejected
    current_stage      VARCHAR(50) DEFAULT 'Field Survey', -- Submitted | Verified | Field Survey | RO Review | Approved
    submission_date    DATE,
    verified_date      DATE,
    survey_date        DATE,
    ro_review_date     DATE,
    completion_date    DATE,
    action_required    VARCHAR(500),
    survey_details     TEXT,
    notes              TEXT,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SURVEYS (field survey + GNSS waypoints)
CREATE TABLE IF NOT EXISTS public.surveys (
    id                    VARCHAR(36) PRIMARY KEY,
    survey_number         VARCHAR(50) NOT NULL,
    parcel_id             VARCHAR(36) REFERENCES public.parcels(id)      ON DELETE SET NULL,
    ulpin                 VARCHAR(50) NOT NULL,
    application_id        VARCHAR(36) REFERENCES public.applications(id) ON DELETE SET NULL,
    surveyor_name         VARCHAR(200) NOT NULL,
    surveyor_phone        VARCHAR(20),
    scheduled_date        DATE,
    completed_date        DATE,
    status                VARCHAR(50) DEFAULT 'Scheduled',  -- Scheduled | In Progress | Completed | Rescheduled
    ground_truth_area_ha  DOUBLE PRECISION,
    waypoints_geojson     TEXT,
    survey_report_summary TEXT,
    photographs_json      TEXT,                             -- JSON array of photo URLs
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MUTATIONS (revenue officer case file)
CREATE TABLE IF NOT EXISTS public.mutations (
    id                  VARCHAR(36) PRIMARY KEY,
    mutation_number     VARCHAR(50) NOT NULL,   -- 'M-2026-018'
    parcel_id           VARCHAR(36) REFERENCES public.parcels(id)      ON DELETE SET NULL,
    ulpin               VARCHAR(50) NOT NULL,
    application_id      VARCHAR(36) REFERENCES public.applications(id) ON DELETE SET NULL,
    mutation_type       VARCHAR(100) DEFAULT 'Sale Mutation',  -- Sale Mutation | Inheritance | Partition
    applicant_name      VARCHAR(200) NOT NULL,
    party_type          VARCHAR(100) DEFAULT 'Transferee',
    submission_date     DATE,
    claimed_area_ha     DOUBLE PRECISION NOT NULL,
    record_area_ha      DOUBLE PRECISION NOT NULL,
    has_discrepancy     BOOLEAN DEFAULT FALSE,
    discrepancy_details TEXT,
    status              VARCHAR(50) DEFAULT 'Pending',
    assigned_officer_id VARCHAR(36) REFERENCES public.users(id) ON DELETE SET NULL,
    decision_note       TEXT,
    decision_date       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DISCREPANCIES (reconciliation findings)
CREATE TABLE IF NOT EXISTS public.discrepancies (
    id               VARCHAR(36) PRIMARY KEY,
    case_number      VARCHAR(50) NOT NULL,   -- 'DISC-2026-042'
    parcel_id        VARCHAR(36) REFERENCES public.parcels(id) ON DELETE SET NULL,
    ulpin            VARCHAR(50) NOT NULL,
    district         VARCHAR(100) DEFAULT 'Ghaziabad',
    tehsil           VARCHAR(100) DEFAULT 'Modinagar',
    village          VARCHAR(100),
    discrepancy_type VARCHAR(100) NOT NULL,  -- Area Mismatch | Boundary Overlap | Registry Mismatch
    severity         VARCHAR(50) DEFAULT 'High',  -- High | Medium | Low
    description      TEXT NOT NULL,
    claimed_value    VARCHAR(100),
    record_value     VARCHAR(100),
    status           VARCHAR(50) DEFAULT 'Open',  -- Open | In Review | Resolved | Dismissed
    resolution_note  TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DOCUMENTS (evidence, RoR Form 7/12)
CREATE TABLE IF NOT EXISTS public.documents (
    id             VARCHAR(36) PRIMARY KEY,
    parcel_id      VARCHAR(36) REFERENCES public.parcels(id)      ON DELETE SET NULL,
    ulpin          VARCHAR(50),
    application_id VARCHAR(36) REFERENCES public.applications(id) ON DELETE SET NULL,
    title          VARCHAR(200) NOT NULL,
    doc_type       VARCHAR(100) NOT NULL,  -- RoR (Form 7/12) | Cadastral Map | Sale Deed | Survey Report
    file_url       TEXT NOT NULL,
    file_format    VARCHAR(20) DEFAULT 'PDF',
    file_size_kb   INTEGER,
    sha256_hash    VARCHAR(64),
    is_verified    BOOLEAN DEFAULT TRUE,
    uploaded_by    VARCHAR(100) DEFAULT 'System',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id          VARCHAR(36) PRIMARY KEY,
    user_id     VARCHAR(36) REFERENCES public.users(id) ON DELETE CASCADE,
    ulpin       VARCHAR(50),
    message     TEXT NOT NULL,
    type        VARCHAR(50) NOT NULL DEFAULT 'system', -- mutation_update | survey_scheduled | discrepancy_alert | system
    read_status BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REGISTRATION RECORDS (official deed registry)
CREATE TABLE IF NOT EXISTS public.registration_records (
    id                   VARCHAR(36) PRIMARY KEY,
    parcel_id            VARCHAR(36) REFERENCES public.parcels(id) ON DELETE SET NULL,
    ulpin                VARCHAR(50) NOT NULL,
    deed_number          VARCHAR(100) NOT NULL,
    registration_date    DATE NOT NULL,
    sub_registrar_office VARCHAR(200) NOT NULL,
    stamp_duty           DOUBLE PRECISION NOT NULL,
    market_value         DOUBLE PRECISION,
    consideration_amount DOUBLE PRECISION,
    buyer_name           VARCHAR(200),
    seller_name          VARCHAR(200),
    document_url         TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ENCUMBRANCES (charges, mortgages, liens, stays)
CREATE TABLE IF NOT EXISTS public.encumbrances (
    id              VARCHAR(36) PRIMARY KEY,
    parcel_id       VARCHAR(36) REFERENCES public.parcels(id) ON DELETE SET NULL,
    ulpin           VARCHAR(50) NOT NULL,
    holder          VARCHAR(200) NOT NULL,
    amount          DOUBLE PRECISION,
    instrument_type VARCHAR(100) NOT NULL, -- Mortgage | Bank Charge | Court Injunction | Lease Deed
    date            DATE NOT NULL,
    expiry_date     DATE,
    status          VARCHAR(50) DEFAULT 'Active', -- Active | Discharged | Stayed
    remarks         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS (append-only, hash-chained)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id             VARCHAR(36) PRIMARY KEY,
    parcel_id      VARCHAR(36) REFERENCES public.parcels(id) ON DELETE SET NULL,
    ulpin          VARCHAR(50),
    action_type    VARCHAR(100) NOT NULL,
    actor_name     VARCHAR(200) NOT NULL,
    actor_role     VARCHAR(50)  NOT NULL,  -- Citizen | Revenue Officer | District Officer | System
    details        TEXT NOT NULL,
    old_state_json TEXT,
    new_state_json TEXT,
    prev_hash      VARCHAR(64) NOT NULL
                   DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    tamper_hash    VARCHAR(64),
    timestamp      TIMESTAMPTZ DEFAULT NOW()
);

-- 13. REF_TRANSLATIONS (localized place names)
CREATE TABLE IF NOT EXISTS public.ref_translations (
    id          VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50)  NOT NULL,  -- state | district | tehsil | village
    entity_key  VARCHAR(200) NOT NULL,
    locale      VARCHAR(5)   NOT NULL,
    value       VARCHAR(200) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ref_translation UNIQUE (entity_type, entity_key, locale)
);

-- 14. INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON public.users(username);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email    ON public.users(email);

CREATE UNIQUE INDEX IF NOT EXISTS ix_parcels_ulpin  ON public.parcels(ulpin);
CREATE INDEX IF NOT EXISTS ix_parcels_survey_number ON public.parcels(survey_number);
CREATE INDEX IF NOT EXISTS ix_parcels_khasra_number ON public.parcels(khasra_number);
CREATE INDEX IF NOT EXISTS ix_parcels_district      ON public.parcels(district);
CREATE INDEX IF NOT EXISTS ix_parcels_tehsil        ON public.parcels(tehsil);
CREATE INDEX IF NOT EXISTS ix_parcels_village       ON public.parcels(village);
CREATE INDEX IF NOT EXISTS ix_parcels_owner_name    ON public.parcels(owner_name);
CREATE INDEX IF NOT EXISTS ix_parcels_boundary_geom ON public.parcels USING GIST(boundary_geom);

CREATE UNIQUE INDEX IF NOT EXISTS ix_applications_application_number
    ON public.applications(application_number);
CREATE INDEX IF NOT EXISTS ix_applications_citizen_id ON public.applications(citizen_id);
CREATE INDEX IF NOT EXISTS ix_applications_parcel_id  ON public.applications(parcel_id);
CREATE INDEX IF NOT EXISTS ix_applications_ulpin      ON public.applications(ulpin);
CREATE INDEX IF NOT EXISTS ix_applications_citizen_created
    ON public.applications(citizen_id, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS ix_surveys_survey_number ON public.surveys(survey_number);
CREATE INDEX IF NOT EXISTS ix_surveys_parcel_id      ON public.surveys(parcel_id);
CREATE INDEX IF NOT EXISTS ix_surveys_ulpin          ON public.surveys(ulpin);
CREATE INDEX IF NOT EXISTS ix_surveys_application_id ON public.surveys(application_id);

CREATE UNIQUE INDEX IF NOT EXISTS ix_mutations_mutation_number
    ON public.mutations(mutation_number);
CREATE INDEX IF NOT EXISTS ix_mutations_parcel_id           ON public.mutations(parcel_id);
CREATE INDEX IF NOT EXISTS ix_mutations_ulpin               ON public.mutations(ulpin);
CREATE INDEX IF NOT EXISTS ix_mutations_application_id      ON public.mutations(application_id);
CREATE INDEX IF NOT EXISTS ix_mutations_assigned_officer_id ON public.mutations(assigned_officer_id);
CREATE INDEX IF NOT EXISTS ix_mutations_status_submitted
    ON public.mutations(status, submission_date);

CREATE UNIQUE INDEX IF NOT EXISTS ix_discrepancies_case_number
    ON public.discrepancies(case_number);
CREATE INDEX IF NOT EXISTS ix_discrepancies_parcel_id ON public.discrepancies(parcel_id);
CREATE INDEX IF NOT EXISTS ix_discrepancies_ulpin     ON public.discrepancies(ulpin);
CREATE INDEX IF NOT EXISTS ix_discrepancies_tehsil    ON public.discrepancies(tehsil);
CREATE INDEX IF NOT EXISTS ix_discrepancies_status_severity
    ON public.discrepancies(status, severity);

CREATE INDEX IF NOT EXISTS ix_documents_parcel_id      ON public.documents(parcel_id);
CREATE INDEX IF NOT EXISTS ix_documents_ulpin          ON public.documents(ulpin);
CREATE INDEX IF NOT EXISTS ix_documents_application_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS ix_documents_created_at     ON public.documents(created_at);

CREATE INDEX IF NOT EXISTS ix_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS ix_notifications_read_status ON public.notifications(user_id, read_status);

CREATE UNIQUE INDEX IF NOT EXISTS ix_registration_records_deed_number
    ON public.registration_records(deed_number);
CREATE INDEX IF NOT EXISTS ix_registration_records_ulpin
    ON public.registration_records(ulpin);
CREATE INDEX IF NOT EXISTS ix_registration_records_parcel_id
    ON public.registration_records(parcel_id);

CREATE INDEX IF NOT EXISTS ix_encumbrances_ulpin
    ON public.encumbrances(ulpin);
CREATE INDEX IF NOT EXISTS ix_encumbrances_parcel_id
    ON public.encumbrances(parcel_id);
CREATE INDEX IF NOT EXISTS ix_encumbrances_status
    ON public.encumbrances(status);

CREATE INDEX IF NOT EXISTS ix_audit_logs_ulpin     ON public.audit_logs(ulpin);
CREATE INDEX IF NOT EXISTS ix_audit_logs_timestamp ON public.audit_logs(timestamp);

CREATE INDEX IF NOT EXISTS ix_ref_translations_lookup
    ON public.ref_translations(entity_type, locale);

-- 15. ROW LEVEL SECURITY (Role-Based Policies)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mutations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discrepancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encumbrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_translations ENABLE ROW LEVEL SECURITY;

-- Helper to safely drop and recreate role-based policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Policies for public.users
-- Users can read their own row; officers/admins can read all.
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT USING (
        auth.uid()::text = id
        OR (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );

CREATE POLICY "users_update_policy" ON public.users
    FOR UPDATE USING (
        auth.uid()::text = id
        OR (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.parcels
CREATE POLICY "parcels_select_policy" ON public.parcels
    FOR SELECT USING (true);

CREATE POLICY "parcels_modify_policy" ON public.parcels
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.applications
CREATE POLICY "applications_select_policy" ON public.applications
    FOR SELECT USING (
        citizen_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );

CREATE POLICY "applications_insert_policy" ON public.applications
    FOR INSERT WITH CHECK (
        citizen_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('citizen', 'revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );

CREATE POLICY "applications_update_policy" ON public.applications
    FOR UPDATE USING (
        citizen_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.mutations
CREATE POLICY "mutations_select_policy" ON public.mutations
    FOR SELECT USING (true);

CREATE POLICY "mutations_modify_policy" ON public.mutations
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.discrepancies
CREATE POLICY "discrepancies_select_policy" ON public.discrepancies
    FOR SELECT USING (true);

CREATE POLICY "discrepancies_modify_policy" ON public.discrepancies
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.surveys
CREATE POLICY "surveys_select_policy" ON public.surveys
    FOR SELECT USING (true);

CREATE POLICY "surveys_modify_policy" ON public.surveys
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.documents
CREATE POLICY "documents_select_policy" ON public.documents
    FOR SELECT USING (true);

CREATE POLICY "documents_modify_policy" ON public.documents
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('citizen', 'revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.notifications
CREATE POLICY "notifications_select_policy" ON public.notifications
    FOR SELECT USING (
        user_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );

CREATE POLICY "notifications_update_policy" ON public.notifications
    FOR UPDATE USING (
        user_id = auth.uid()::text
        OR (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

CREATE POLICY "notifications_insert_policy" ON public.notifications
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );

-- Policies for public.registration_records
CREATE POLICY "registration_records_select_policy" ON public.registration_records
    FOR SELECT USING (true);

CREATE POLICY "registration_records_modify_policy" ON public.registration_records
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.encumbrances
CREATE POLICY "encumbrances_select_policy" ON public.encumbrances
    FOR SELECT USING (true);

CREATE POLICY "encumbrances_modify_policy" ON public.encumbrances
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );

-- Policies for public.audit_logs
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT USING (true);

CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
    FOR INSERT WITH CHECK (
        (auth.jwt() ->> 'role') IN ('revenue_officer', 'district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
        OR auth.uid() IS NULL
    );

-- Policies for public.ref_translations
CREATE POLICY "ref_translations_select_policy" ON public.ref_translations
    FOR SELECT USING (true);

CREATE POLICY "ref_translations_modify_policy" ON public.ref_translations
    FOR ALL USING (
        (auth.jwt() ->> 'role') IN ('district_officer', 'admin', 'service_role')
        OR auth.role() = 'service_role'
    );






