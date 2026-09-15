// Central map of every route in the app. Sidebars/Navbars import from here
// so link paths only ever need to change in one place.

export const MAIN_ROUTES = {
  home: "/",
  platform: "/platform",
  howItWorks: "/how-it-works",
  features: "/features",
  governance: "/governance",
  about: "/about",
  login: "/login",
  signup: "/signup",
};

export const CITIZEN_ROUTES = {
  portal: "/citizen",
  searchRecords: "/citizen/search-records",
  myApplications: "/citizen/applications",
  landServices: "/citizen/land-services",
};

export const REVENUE_ROUTES = {
  overview: "/revenue-officer",
  gisExplorer: "/revenue-officer/gis-explorer",
  dataReconciliation: "/revenue-officer/data-reconciliation",
  mutationManagement: "/revenue-officer/mutation-management",
  discrepancyCases: "/revenue-officer/discrepancy-cases",
  historicalTimeline: "/revenue-officer/historical-timeline",
  documentsEvidence: "/revenue-officer/documents-evidence",
  fieldSurvey: "/revenue-officer/field-survey",
  reportsAnalytics: "/revenue-officer/reports-analytics",
  auditTrail: "/revenue-officer/audit-trail",
};

export const ADMIN_ROUTES = {
  overview: "/administration",
  districtGis: "/administration/district-gis",
  tehsilAnalytics: "/administration/tehsil-analytics",
  reconciliationMonitor: "/administration/reconciliation-monitor",
  mutationMonitor: "/administration/mutation-monitor",
  officerPerformance: "/administration/officer-performance",
  addOfficer: "/administration/add-officer",
};

// The Digital Registry wizard. It arrived as its own app and keeps its own
// route table at src/registry/routes.js, which is where its header, both
// steppers and every Previous/Continue button read from — so that stays the
// source of truth and this is a re-export, not a second copy. Anything outside
// src/registry (the Platform card, for one) should link through here.
export { PATHS as REGISTRY_ROUTES, REGISTRY_BASE, registryServicePath } from "./registry/routes.js";
