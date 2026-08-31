-- ==============================================================================
-- BHUNITI Land Governance Platform - Supabase PostgreSQL Database Schema
-- Smart India Hackathon (SIH 2026)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen', -- 'citizen', 'revenue_officer', 'district_officer'
    full_name VARCHAR(200),
    phone VARCHAR(20),
    designation VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Ghaziabad',
    tehsil VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PARCELS TABLE (Land Records & GIS)
CREATE TABLE IF NOT EXISTS public.parcels (
    id VARCHAR(36) PRIMARY KEY,
    ulpin VARCHAR(50) UNIQUE NOT NULL, -- e.g., '09-XXXX-XXXX-1024', 'P-1024'
    survey_number VARCHAR(50),
    khasra_number VARCHAR(50),
    khata_number VARCHAR(50),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    district VARCHAR(100) DEFAULT 'Ghaziabad',
    tehsil VARCHAR(100) DEFAULT 'Modinagar',
    village VARCHAR(100) DEFAULT 'Sikandrabad',
    pincode VARCHAR(10),
    owner_name VARCHAR(200) NOT NULL,
    co_owners_json TEXT,
    land_type VARCHAR(100) DEFAULT 'Agricultural',
    area_ha NUMERIC(10, 4) NOT NULL,
    area_sqm NUMERIC(12, 2),
    valuation_inr NUMERIC(14, 2),
    boundary_geojson TEXT,
    centroid_lat NUMERIC(9, 6),
    centroid_lng NUMERIC(9, 6),
    verification_status VARCHAR(50) DEFAULT 'Verified',
    is_disputed BOOLEAN DEFAULT FALSE,
    dispute_reason TEXT,
    encumbrance_status VARCHAR(100) DEFAULT 'Clean',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATIONS TABLE (Citizen Land Services)
CREATE TABLE IF NOT EXISTS public.applications (
    id VARCHAR(36) PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'MUT-2023-8941'
    citizen_id VARCHAR(36),
    citizen_name VARCHAR(200) NOT NULL,
    parcel_id VARCHAR(36),
    ulpin VARCHAR(50),
    service_type VARCHAR(100) DEFAULT 'Title Transfer',
    status VARCHAR(50) DEFAULT 'In Progress', -- 'In Progress', 'Action Required', 'Approved', 'Rejected'
    current_stage VARCHAR(50) DEFAULT 'Field Survey', -- 'Submitted', 'Verified', 'Field Survey', 'RO Review', 'Approved'
    submission_date VARCHAR(50),
    verified_date VARCHAR(50),
    survey_date VARCHAR(50),
    ro_review_date VARCHAR(50),
    completion_date VARCHAR(50),
    action_required VARCHAR(500),
    survey_details TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MUTATIONS TABLE (Revenue Officer Mutations)
CREATE TABLE IF NOT EXISTS public.mutations (
    id VARCHAR(36) PRIMARY KEY,
    mutation_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'M-2026-018'
    parcel_id VARCHAR(36),
    ulpin VARCHAR(50) NOT NULL,
    application_id VARCHAR(36),
    mutation_type VARCHAR(100) DEFAULT 'Sale Mutation',
    applicant_name VARCHAR(200) NOT NULL,
    party_type VARCHAR(100) DEFAULT 'Transferee',
    submission_date VARCHAR(50),
    claimed_area_ha NUMERIC(10, 4) NOT NULL,
    record_area_ha NUMERIC(10, 4) NOT NULL,
    has_discrepancy BOOLEAN DEFAULT FALSE,
    discrepancy_details TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Under Verification', 'Awaiting Docs', 'Approved', 'Rejected'
    assigned_officer_id VARCHAR(36),
    decision_note TEXT,
    decision_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DISCREPANCIES TABLE (AI Reconciliation & Mismatches)
CREATE TABLE IF NOT EXISTS public.discrepancies (
    id VARCHAR(36) PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'DISC-2026-042'
    parcel_id VARCHAR(36),
    ulpin VARCHAR(50) NOT NULL,
    district VARCHAR(100) DEFAULT 'Ghaziabad',
    tehsil VARCHAR(100) DEFAULT 'Modinagar',
    village VARCHAR(100),
    discrepancy_type VARCHAR(100) NOT NULL, -- 'Area Mismatch', 'Boundary Overlap', 'Registry Mismatch'
    severity VARCHAR(50) DEFAULT 'High', -- 'High', 'Medium', 'Low'
    description TEXT NOT NULL,
    claimed_value VARCHAR(100),
    record_value VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Open', -- 'Open', 'In Review', 'Resolved', 'Dismissed'
    resolution_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SURVEYS TABLE (Field Survey & GNSS Waypoints)
CREATE TABLE IF NOT EXISTS public.surveys (
    id VARCHAR(36) PRIMARY KEY,
    survey_number VARCHAR(50) UNIQUE NOT NULL,
    parcel_id VARCHAR(36),
    ulpin VARCHAR(50) NOT NULL,
    application_id VARCHAR(36),
    surveyor_name VARCHAR(200) NOT NULL,
    surveyor_phone VARCHAR(20),
    scheduled_date VARCHAR(50),
    completed_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Scheduled',
    ground_truth_area_ha NUMERIC(10, 4),
    waypoints_geojson TEXT,
    survey_report_summary TEXT,
    photographs_json TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DOCUMENTS TABLE (Evidence & RoR Form 7/12)
CREATE TABLE IF NOT EXISTS public.documents (
    id VARCHAR(36) PRIMARY KEY,
    parcel_id VARCHAR(36),
    ulpin VARCHAR(50),
    application_id VARCHAR(36),
    title VARCHAR(200) NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    file_format VARCHAR(20) DEFAULT 'PDF',
    file_size_kb INTEGER,
    sha256_hash VARCHAR(64),
    is_verified BOOLEAN DEFAULT TRUE,
    uploaded_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE (Immutable Trail with Tamper Hash)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    parcel_id VARCHAR(36),
    ulpin VARCHAR(50),
    action_type VARCHAR(100) NOT NULL,
    actor_name VARCHAR(200) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    old_state_json TEXT,
    new_state_json TEXT,
    tamper_hash VARCHAR(64),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INDEXES FOR HIGH EFFICIENCY
CREATE INDEX IF NOT EXISTS idx_parcels_ulpin ON public.parcels(ulpin);
CREATE INDEX IF NOT EXISTS idx_parcels_khasra ON public.parcels(khasra_number);
CREATE INDEX IF NOT EXISTS idx_parcels_district_tehsil ON public.parcels(district, tehsil);
CREATE INDEX IF NOT EXISTS idx_mutations_ulpin ON public.mutations(ulpin);
CREATE INDEX IF NOT EXISTS idx_mutations_status ON public.mutations(status);
CREATE INDEX IF NOT EXISTS idx_apps_appnum ON public.applications(application_number);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_discrepancies_status ON public.discrepancies(status);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mutations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discrepancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for demo API service role
CREATE POLICY "Allow public read on parcels" ON public.parcels FOR SELECT USING (true);
CREATE POLICY "Allow public read on applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow public all on applications" ON public.applications FOR ALL USING (true);
CREATE POLICY "Allow public all on mutations" ON public.mutations FOR ALL USING (true);
CREATE POLICY "Allow public all on discrepancies" ON public.discrepancies FOR ALL USING (true);
CREATE POLICY "Allow public all on surveys" ON public.surveys FOR ALL USING (true);
CREATE POLICY "Allow public all on documents" ON public.documents FOR ALL USING (true);
CREATE POLICY "Allow public all on audit_logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow public read on users" ON public.users FOR SELECT USING (true);
