/*
 * English copy for the shared chrome in src/components/ -- the four navbars and
 * sidebars, the two footers and the portal switcher.
 *
 * Reached as t("components....."). Role names, button verbs and field names are
 * NOT repeated here; they come from ./common.js.
 */

const components = {
  // Public site navigation. Each key matches a route in src/routes.js.
  nav: {
    home: "Home",
    platform: "Platform",
    howItWorks: "How It Works",
    features: "Features",
    governance: "Governance",
    about: "About",
  },

  citizenNav: {
    portal: "Citizen Portal",
    searchRecords: "Search Records",
    myApplications: "My Applications",
    landServices: "Land Services",
    helpSupport: "Help & Support",
  },

  revenueNav: {
    overview: "Overview",
    gisExplorer: "GIS Parcel Explorer",
    dataReconciliation: "Data Reconciliation",
    mutationManagement: "Mutation Management",
    discrepancyCases: "Discrepancy Cases",
    historicalTimeline: "Historical Timeline",
    documentsEvidence: "Documents & Evidence",
    surveys: "Surveys",
    reportsAnalytics: "Reports & Analytics",
    auditTrail: "Audit Trail",
    administration: "Administration",
  },

  adminNav: {
    overview: "Overview",
    districtGis: "District GIS",
    tehsilAnalytics: "Tehsil Analytics",
    reconciliationMonitor: "Reconciliation Monitor",
    mutationMonitor: "Mutation Monitor",
    discrepancyCases: "Discrepancy Cases",
    fieldSurveys: "Field Surveys",
    officerPerformance: "Officer Performance",
    reports: "Reports",
    alerts: "Alerts",
    auditTrail: "Audit Trail",
  },

  topbar: {
    searchPlaceholder: "Search ULPIN / Survey No…",
    districtSelector: "District: {{district}}",
    changeDistrict: "Change district",
    help: "Help",
    profilePhoto: "Profile photo",
    // Shown under the signed-in name; the switcher below opens on click.
    roleSwitch: "{{role}} • Switch",
    citizenId: "ID: {{id}} • Switch",
  },

  // Demo identities. A real deployment reads these from the session.
  user: {
    citizen: "Citizen User",
    revenueOfficer: "K. Sharma",
    adminOfficer: "Admin Officer",
  },

  footer: {
    tagline:
      "Connecting land, data and governance. National infrastructure built on precision GIS and legal transparency.",
    badge: "Platform for Land, Data & Governance 2026",
    solution: "Solution",
    institution: "Institution",
    trust: "Trust",
    contact: "Contact",
    security: "Security",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "© 2026 BHUNITI Infrastructure Initiative. A Government of India project.",
    seal: "Government of India",
  },

  citizenFooter: {
    about:
      "A secure digital gateway to land governance. Transparent access to land records and revenue services for every citizen.",
    quickLinks: "Quick Links",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    systemStatus: "System Status",
    support: "Helpline: {{number}}",
    email: "Email: {{address}}",
    copyright: "© 2026 BHUNITI Land Administration, Government of India.",
    accessibility: "Accessibility",
  },

  portalSwitcher: {
    trigger: "Tap to switch portal or sign in",
    heading: "Switch Portal / Login",
    subheading: "Quick navigation across the BHUNITI layers",
    footerNote: "Demo fast switch",
    goToLogin: "Go to the login screen",
    badge: {
      authRequired: "Login required",
      public: "Public",
      authScreen: "Login screen",
    },
    citizen: {
      name: "Citizen Portal",
      desc: "Citizen login with mobile OTP",
    },
    revenue: {
      name: "Revenue Officer Portal",
      desc: "Revenue Officer credentials with OTP verification",
    },
    admin: {
      name: "District Administration",
      desc: "District Officer credentials with two-factor login",
    },
    publicSite: {
      name: "Public Landing Page",
      desc: "Platform overview and public services — no login needed",
    },
    login: {
      name: "Login / Authentication Hub",
      desc: "Choose a role and authenticate with an OTP",
    },
  },
};

export default components;
