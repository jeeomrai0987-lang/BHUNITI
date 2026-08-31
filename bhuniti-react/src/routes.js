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
};
