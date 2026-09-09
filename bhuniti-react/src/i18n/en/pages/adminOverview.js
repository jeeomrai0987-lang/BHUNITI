/*
 * English strings for src/pages/admin/Overview.jsx -- the district dashboard.
 *
 * Tehsil names come from common.place.tehsils; the quality grades below are
 * page-specific on purpose. They describe a jurisdiction's data health, which
 * is a different scale from the officer_status domain (that one grades a
 * person's caseload) even though both happen to start at "Optimal".
 *
 * Reached from a component as t("pages.adminOverview....").
 */

const adminOverview = {
  badge: "Command Centre — Live Cloud Sync",
  title: "District Land Governance Command Center",
  intro: "District-wide monitoring, data quality and land administration overview",

  actions: {
    exportReport: "Export Report",
    forceSync: "Force Sync",
  },

  kpi: {
    totalParcels: "Total Parcels",
    verifiedParcels: "Verified Parcels",
    openDiscrepancies: "Open Discrepancies",
    highPriority: "{{count}} High Priority",
    pendingMutations: "Pending Mutations",
    fieldSurveys_one: "{{count}} Field Survey",
    fieldSurveys_other: "{{count}} Field Surveys",
  },

  map: {
    heading: "Discrepancy Hotspots",
    subheading: "Real-time geospatial reconciliation data",
    caption: "Satellite view of the district with discrepancy hotspots",
    layers: {
      heatmap: "Heatmap",
      parcels: "Parcels",
      satellite: "Satellite",
    },
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    recentre: "Recentre on district",
    legend: {
      heading: "Hotspot Density",
      critical: "Critical (>500)",
      amber: "Amber (100–500)",
      low: "Low (<100)",
    },
  },

  table: {
    heading: "Tehsil-wise Performance",
    columns: {
      verification: "Verification %",
      discrepancies: "Discrepancies",
      quality: "Data Quality",
    },
    openTehsil: "Open the {{tehsil}} dashboard",
    rowMenu: "More options for {{tehsil}}",
  },

  quality: {
    optimal: "Optimal",
    attention: "Attention",
    review: "Review",
  },

  insights: {
    heading: "AI-Assisted Insights",
    quality: {
      kind: "Quality Alert",
      body:
        "{{tehsil}} tehsil shows a {{delta}} decline in spatial data quality over 7 days. A high cluster of mismatched boundaries has been detected in sector 4.",
    },
    bottleneck: {
      kind: "Workflow Bottleneck",
      body:
        "The {{tehsil}} mutation backlog has grown by {{delta}}. Average resolution time now exceeds the target SLA by {{days}}.",
    },
  },

  alerts: {
    heading: "Alert Center",
    escalated: "{{count}} Escalated",
    viewAll: "View All Alerts",
    boundaryDispute: {
      title: "Boundary Dispute Escalation",
      body:
        "Case {{case}} in {{tehsil}} requires an immediate sub-divisional magistrate review.",
    },
    syncFailure: {
      title: "Registry Sync Failure",
      body_one:
        "Failed to synchronise {{count}} mutation record from the Sub-Registrar Office, {{tehsil}}.",
      body_other:
        "Failed to synchronise {{count}} mutation records from the Sub-Registrar Office, {{tehsil}}.",
    },
    surveyorReassigned: {
      title: "Field Surveyor Reassigned",
      body: "Surveyor {{id}} has been reassigned to the high-priority zone in {{tehsil}} tehsil.",
    },
    courtOrder: {
      title: "Court Order Pending Execution",
      body: "A High Court stay order on ULPIN {{ulpin}} requires a manual block in the system.",
    },
  },
};

export default adminOverview;
