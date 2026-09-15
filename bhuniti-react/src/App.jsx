import { Routes, Route, Navigate } from "react-router-dom";

// ── Layouts ──────────────────────────────────────────────────────────────────
import MainLayout            from "./layouts/MainLayout";
import CitizenLayout         from "./layouts/CitizenLayout";
import RevenueOfficerLayout  from "./layouts/RevenueOfficerLayout";
import AdminLayout           from "./layouts/AdminLayout";

// ── Public / marketing pages ─────────────────────────────────────────────────
import Home        from "./pages/main/Home";
import Platform    from "./pages/main/Platform";
import HowItWorks  from "./pages/main/HowItWorks";
import Features    from "./pages/main/Features";
import Governance  from "./pages/main/Governance";
import About       from "./pages/main/About";
import Login       from "./pages/main/Login";
import SignupCitizen from "./pages/main/SignupCitizen";

// ── Citizen portal ───────────────────────────────────────────────────────────
import CitizenPortal    from "./pages/citizen/Portal";
import SearchRecords    from "./pages/citizen/SearchRecords";
import MyApplications   from "./pages/citizen/MyApplications";
import LandServices     from "./pages/citizen/LandServices";

// ── Revenue Officer portal ───────────────────────────────────────────────────
import RevenueOverview       from "./pages/revenue/Overview";
import GisExplorer           from "./pages/revenue/GisExplorer";
import DataReconciliation    from "./pages/revenue/DataReconciliation";
import MutationManagement    from "./pages/revenue/MutationManagement";
import DiscrepancyCases      from "./pages/revenue/DiscrepancyCases";
import HistoricalTimeline    from "./pages/revenue/HistoricalTimeline";
import DocumentsEvidence     from "./pages/revenue/DocumentsEvidence";
import FieldSurvey           from "./pages/revenue/FieldSurvey";
import ReportsAnalytics      from "./pages/revenue/ReportsAnalytics";
import AuditTrail            from "./pages/revenue/AuditTrail";

// ── District Officer / Admin portal ─────────────────────────────────────────
import AdminOverview          from "./pages/admin/Overview";
import AdminAddOfficer        from "./pages/admin/AdminAddOfficer";
import DistrictGis            from "./pages/admin/DistrictGis";
import TehsilAnalytics        from "./pages/admin/TehsilAnalytics";
import ReconciliationMonitor  from "./pages/admin/ReconciliationMonitor";
import MutationMonitor        from "./pages/admin/MutationMonitor";
import OfficerPerformance     from "./pages/admin/OfficerPerformance";

// ── Digital Registry wizard (src/registry — brings its own header/footer) ────
import RegistrySection        from "./registry/App";
import { PATHS as REG_PATH, SEGMENTS as REG, REGISTRY_SEGMENT } from "./registry/routes";
import ParcelIdentification   from "./registry/pages/ParcelIdentification";
import OwnerAndParty          from "./registry/pages/OwnerAndParty";
import TransactionsDocuments  from "./registry/pages/TransactionsDocuments";
import ReviewSubmission       from "./registry/pages/ReviewSubmission";
import RegistryTracking       from "./registry/pages/RegistryTracking";

export default function App() {
  return (
    <Routes>

      {/* ── Public marketing site (main layout: top-nav + footer) ──────── */}
      <Route element={<MainLayout />}>
        <Route index                    element={<Home />} />
        <Route path="platform"          element={<Platform />} />
        <Route path="how-it-works"      element={<HowItWorks />} />
        <Route path="features"          element={<Features />} />
        <Route path="governance"        element={<Governance />} />
        <Route path="about"             element={<About />} />
        <Route path="login"             element={<Login />} />
        <Route path="signup"            element={<SignupCitizen />} />
      </Route>

      {/* ── Citizen portal (top-nav + footer, dashboard color theme) ───── */}
      <Route path="citizen" element={<CitizenLayout />}>
        <Route index                    element={<CitizenPortal />} />
        <Route path="portal"            element={<CitizenPortal />} />
        <Route path="search-records"    element={<SearchRecords />} />
        <Route path="applications"      element={<MyApplications />} />
        <Route path="land-services"     element={<LandServices />} />
      </Route>

      {/* ── Revenue Officer portal (sidebar + topbar) ───────────────────── */}
      <Route path="revenue-officer" element={<RevenueOfficerLayout />}>
        <Route index                      element={<RevenueOverview />} />
        <Route path="overview"            element={<RevenueOverview />} />
        <Route path="gis-explorer"        element={<GisExplorer />} />
        <Route path="data-reconciliation" element={<DataReconciliation />} />
        <Route path="mutation-management" element={<MutationManagement />} />
        <Route path="discrepancy-cases"   element={<DiscrepancyCases />} />
        <Route path="historical-timeline" element={<HistoricalTimeline />} />
        <Route path="documents-evidence"  element={<DocumentsEvidence />} />
        <Route path="field-survey"        element={<FieldSurvey />} />
        <Route path="reports-analytics"   element={<ReportsAnalytics />} />
        <Route path="audit-trail"         element={<AuditTrail />} />
      </Route>

      {/* ── District Officer / Admin portal (sidebar + topbar) ──────────── */}
      <Route path="administration" element={<AdminLayout />}>
        <Route index                         element={<AdminOverview />} />
        <Route path="overview"               element={<AdminOverview />} />
        <Route path="add-officer"            element={<AdminAddOfficer />} />
        <Route path="district-gis"           element={<DistrictGis />} />
        <Route path="tehsil-analytics"       element={<TehsilAnalytics />} />
        <Route path="reconciliation-monitor" element={<ReconciliationMonitor />} />
        <Route path="mutation-monitor"       element={<MutationMonitor />} />
        <Route path="officer-performance"    element={<OfficerPerformance />} />
      </Route>

      {/* Digital Registry entry and service-aware wizard. */}
      <Route
        path={REGISTRY_SEGMENT}
        element={<Navigate to="/registry/sale/parcel-identification" replace />}
      />

      <Route path={`${REGISTRY_SEGMENT}/:serviceType`} element={<RegistrySection />}>
        <Route index                  element={<Navigate to={REG.parcel} replace />} />
        <Route path={REG.parcel}      element={<ParcelIdentification />} />
        <Route path={REG.owner}       element={<OwnerAndParty />} />
        <Route path={REG.transaction} element={<TransactionsDocuments />} />
        <Route path={REG.review}      element={<ReviewSubmission />} />
        <Route path={REG.tracking}    element={<RegistryTracking />} />
        <Route path="*"               element={<Navigate to={REG.parcel} replace />} />
      </Route>

      {/* ── Wildcard Fallback ───────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
