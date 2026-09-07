/*
 * English strings for src/pages/revenue/ReportsAnalytics.jsx -- the four KPI
 * cards, the category bar chart, the source-reliability panel, the village
 * hotspot list and the processing-time trend.
 *
 * The chart axes are page-local because each one measures something different:
 * `categories.axisTick` counts cases while `trend.axisTick` counts days.
 *
 * Reached from a component as t("pages.reportsAnalytics....").
 */

const reportsAnalytics = {
  breadcrumb: {
    system: "System",
    dashboard: "Dashboard",
  },

  title: "Reports & Analytics",
  intro:
    "System-wide performance, reconciliation metrics and discrepancy analysis.",

  // The scope strip states what the figures below cover. It is a summary rather
  // than a set of controls, because the demo build reports on one fixed extract.
  scope: {
    heading: "Report scope",
    district: "District: {{value}}",
    tehsil: "Tehsil: {{value}}",
    village: "Village: {{value}}",
    all: "All",
    period: "Last 30 days",
  },

  kpi: {
    openDiscrepancies: "Open Discrepancies",
    resolvedCases: "Resolved Cases (YTD)",
    processingTime: "Avg Processing Time",
    accuracyIndex: "Source Accuracy Index",
    change: "{{value}} against the previous period",
  },

  categories: {
    heading: "Discrepancies by Category",
    intro: "Volume of reported issues classified by root cause.",
    caption:
      "Bar chart of open discrepancies by root cause, highest first: {{summary}}",
    axisTick: "{{value}}",
    items: {
      areaMismatch: "Area Mismatch",
      titleDispute: "Title Dispute",
      boundary: "Boundary",
      missingDoc: "Missing Doc",
      classificationError: "Class. Error",
      other: "Other",
    },
  },

  sources: {
    heading: "Source Reliability",
    intro: "Trust scores across integration endpoints.",
    insight:
      "Legacy records in Tehsil {{tehsil}} require manual reconciliation because of shifting datum coordinates.",
    items: {
      legacy: "Legacy Land Records",
      drone: "Drone Survey (2023)",
      satellite: "Satellite Imagery",
      citizen: "Citizen Portal Submissions",
    },
  },

  hotspots: {
    heading: "Cases by Village",
    intro: "Geospatial discrepancy hotspots",
    mapCaption: "Satellite view of the tehsil with discrepancy hotspots marked",
    legend: {
      high: "High Volume",
      monitoring: "Monitoring",
    },
    tableHeading: "Top Affected Villages",
    viewFull: "View Full Table",
    cases_one: "{{count}} case",
    cases_other: "{{count}} cases",
    villages: {
      duhai: "Duhai",
      bhojpur: "Bhojpur",
      kadrabad: "Kadrabad",
    },
    levels: {
      critical: "Critical",
      elevated: "Elevated",
      normal: "Normal",
    },
  },

  trend: {
    heading: "Mutation Processing Time",
    intro: "Average days to resolve land mutations over time.",
    caption:
      "Line chart of the average mutation processing time by month: {{summary}}",
    axisTick: "{{value}}d",
    point: "{{month}}: {{value}}",
    months: {
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      may: "May",
    },
  },
};

export default reportsAnalytics;
