-- ==============================================================================
-- BHUNITI Land Governance Platform -- Supabase PostgreSQL schema
-- Smart India Hackathon (SIH 2026)
-- ==============================================================================
--
-- This file and app/models/*.py describe the same database. The models win at
-- runtime (SQLAlchemy's create_all builds the SQLite fallback and any empty
-- Postgres database), so this script is kept in step with them by hand.
--
-- Differences from the prototype version of this file, all of which were places
-- where the SQL and the ORM disagreed:
--
--   * Foreign keys are declared. The models have always had ForeignKey(...)
--     with ON DELETE SET NULL; the SQL had none, so a Postgres database built
--     from this script accepted a mutation pointing at a parcel that never
--     existed.
--   * The date columns are DATE, not VARCHAR(50). They used to hold display
--     strings ("Oct 24, 2023") and the placeholder "Pending", which cannot be
--     sorted or filtered. Run db/migrate.py on an existing database to convert
--     the values in place.
--   * audit_logs.prev_hash and users.preferred_locale exist here.
--   * Areas, valuations and coordinates are DOUBLE PRECISION to match
--     Column(Float); they were NUMERIC, so the same repository produced two
--     different column types depending on who created the database.
--   * Index names match the ones the models declare (ix_*), so migrate.py's
--     introspection does not create a second index over the same columns.
--
-- Apply with:  psql "$DATABASE_URL" -f db/schema.sql
-- Upgrade an existing database with:  python db/migrate.py
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
    -- Language this user sees by default; served back on login as preferred_locale.
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
    -- Real dates. NULL means "this stage has not happened yet".
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
    -- Anything other than Approved/Rejected counts as pending in the analytics.
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
    sha256_hash    VARCHAR(64),            -- integrity hash of the stored bytes
    is_verified    BOOLEAN DEFAULT TRUE,
    uploaded_by    VARCHAR(100) DEFAULT 'System',
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS (append-only, hash-chained)
-- prev_hash is the tamper_hash of the preceding row, so editing or deleting one
-- entry invalidates every entry after it. See app/core/audit_trail.py.
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
-- 10. REF_TRANSLATIONS (localized place names)
-- Village, tehsil and district names are registry data, not developer-authored
-- UI strings, so they live in the database instead of app/i18n/locales/*.json.
-- entity_key is always the canonical English spelling stored on the record.
CREATE TABLE IF NOT EXISTS public.ref_translations (
    id          VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50)  NOT NULL,  -- state | district | tehsil | village
    entity_key  VARCHAR(200) NOT NULL,
    locale      VARCHAR(5)   NOT NULL,
    value       VARCHAR(200) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ref_translation UNIQUE (entity_type, entity_key, locale)
);

-- 11. INDEXES
-- Names match the ones app/models declares. Columns marked unique=True in the
-- models become UNIQUE INDEXes here (not table constraints) for the same reason:
-- so introspection sees one object per index instead of two.
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON public.users(username);
CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email    ON public.users(email);

CREATE UNIQUE INDEX IF NOT EXISTS ix_parcels_ulpin  ON public.parcels(ulpin);
CREATE INDEX IF NOT EXISTS ix_parcels_survey_number ON public.parcels(survey_number);
CREATE INDEX IF NOT EXISTS ix_parcels_khasra_number ON public.parcels(khasra_number);
CREATE INDEX IF NOT EXISTS ix_parcels_district      ON public.parcels(district);
CREATE INDEX IF NOT EXISTS ix_parcels_tehsil        ON public.parcels(tehsil);
CREATE INDEX IF NOT EXISTS ix_parcels_village       ON public.parcels(village);
CREATE INDEX IF NOT EXISTS ix_parcels_owner_name    ON public.parcels(owner_name);

CREATE UNIQUE INDEX IF NOT EXISTS ix_applications_application_number
    ON public.applications(application_number);
CREATE INDEX IF NOT EXISTS ix_applications_citizen_id ON public.applications(citizen_id);
CREATE INDEX IF NOT EXISTS ix_applications_parcel_id  ON public.applications(parcel_id);
CREATE INDEX IF NOT EXISTS ix_applications_ulpin      ON public.applications(ulpin);
-- "my applications, newest first" reads this one.
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
-- The revenue officer queue: filter by status, order by submission_date.
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

CREATE INDEX IF NOT EXISTS ix_audit_logs_ulpin     ON public.audit_logs(ulpin);
CREATE INDEX IF NOT EXISTS ix_audit_logs_timestamp ON public.audit_logs(timestamp);

CREATE INDEX IF NOT EXISTS ix_ref_translations_lookup
    ON public.ref_translations(entity_type, locale);

-- 12. ROW LEVEL SECURITY
-- Unchanged from the prototype: the FastAPI service connects as the database
-- owner over asyncpg and bypasses RLS, so these policies only govern access
-- through the Supabase anon/authenticated keys. They are permissive by design
-- for the demo; tighten them before this handles real records.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mutations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discrepancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ref_translations ENABLE ROW LEVEL SECURITY;
-- The policies themselves. CREATE POLICY has no IF NOT EXISTS, which is why
-- re-running the prototype's version of this file always failed on the second
-- attempt; this block skips policies that already exist instead. The grants are
-- byte-for-byte the same as before -- only the re-runnability changed.
DO $$
DECLARE
    spec RECORD;
BEGIN
    FOR spec IN
        SELECT * FROM (VALUES
            ('Allow public read on users',            'users',            'SELECT'),
            ('Allow public read on parcels',          'parcels',          'SELECT'),
            ('Allow public read on applications',     'applications',     'SELECT'),
            ('Allow public all on applications',      'applications',     'ALL'),
            ('Allow public all on mutations',         'mutations',        'ALL'),
            ('Allow public all on discrepancies',     'discrepancies',    'ALL'),
            ('Allow public all on surveys',           'surveys',          'ALL'),
            ('Allow public all on documents',         'documents',        'ALL'),
            ('Allow public all on audit_logs',        'audit_logs',       'ALL'),
            ('Allow public read on ref_translations', 'ref_translations', 'SELECT')
        ) AS s(policy_name, table_name, command)
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
              AND tablename = spec.table_name
              AND policyname = spec.policy_name
        ) THEN
            EXECUTE format(
                'CREATE POLICY %I ON public.%I FOR %s USING (true)',
                spec.policy_name, spec.table_name, spec.command
            );
        END IF;
    END LOOP;
END $$;

-- ==============================================================================
-- Upgrading a database that was created by the earlier version of this file
-- ==============================================================================
-- This script only creates things, so running it against an existing database
-- adds the new table and the new indexes but cannot add columns to tables that
-- are already there, and cannot change VARCHAR dates into DATE. Run
--
--     python db/migrate.py --dry-run     # see what is missing
--     python db/migrate.py               # add columns/indexes, convert dates
--
-- migrate.py never drops a table and never deletes a row unless you ask for
-- --fresh --yes. Rows written before the hash chain existed keep their missing
-- hashes, so /audit/verify honestly reports a break until you run
-- migrate.py --seal-audit.






