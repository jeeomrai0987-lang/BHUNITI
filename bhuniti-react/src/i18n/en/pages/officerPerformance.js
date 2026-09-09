/*
 * English strings for src/pages/admin/OfficerPerformance.jsx -- the three
 * district KPI cards and the officer roster.
 *
 * The status pill reuses domain.officer_status (Optimal / Action Needed /
 * Overloaded), the same vocabulary TehsilAnalytics reports against, so it is not
 * restated here. Counts, percentages, deltas and the row range are all derived
 * in the page and arrive as {{placeholders}}.
 *
 * Reached from a component as t("pages.officerPerformance....").
 */

const officerPerformance = {
  eyebrow: "Performance analytics",
  title: "Revenue Officer Oversight",

  actions: {
    filterRegion: "Filter region",
    exportReport: "Export report",
  },

  kpi: {
    activeOfficers: "Active officers",
    avgResolutionTime: "Avg. resolution time",
    casesFlagged: "Cases flagged",
    vsLastMonth: "vs last month",
    districtTarget: "District target: {{value}}",
    requiringEscalation: "requiring escalation",
  },

  tabs: {
    // The label and the count are joined here so the two cannot be read as
    // separate items by a screen reader.
    withCount: "{{label}} ({{count}})",
    all: "All officers",
    actionNeeded: "Action needed",
    topPerformers: "Top performers",
  },

  search: {
    placeholder: "Search ID or name…",
    label: "Search officers by ID or name",
  },

  table: {
    status: "Status",
    officer: "Officer ID / name",
    jurisdiction: "Tehsil jurisdiction",
    assignedCases: "Assigned cases",
    resolutionRate: "Resolution rate",
    actions: "Actions",
    // The dot carries the whole meaning of the column, so the status is spelled
    // out for anyone who cannot see the colour.
    statusOf: "{{id}}: {{status}}",
    backlogAlert: "High backlog alert",
    openOfficer: "Open officer {{id}}",
    escalate: "Escalate {{id}}",
  },

  // The demo build ships one page of the roster, so the range describes what is
  // actually loaded rather than promising pages that do not exist.
  rosterNote: "Sample roster from the district establishment of {{total}} officers",
};

export default officerPerformance;
