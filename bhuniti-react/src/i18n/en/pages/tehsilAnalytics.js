/*
 * English copy for the district Tehsil Analytics screen
 * (/administration/tehsil-analytics).
 *
 * The five fixture place names live in common.place.tehsils, shared with the
 * other district screens. Real records get their localised place name from the
 * ref_translations table via the API; the shared list is only here because the
 * demo dashboard ships its own numbers.
 */

const tehsilAnalytics = {
  title: "Tehsil Analytics",
  intro:
    "Comparative performance metrics and land-record synchronisation status across the jurisdictions of {{district}} district.",

  alert: {
    heading: "Attention Required: {{tehsil}} Tehsil",
    body:
      "Discrepancy rates in {{tehsil}} have crossed the acceptable threshold ({{rate}} against a district average of {{average}}). The root cause is legacy non-spatial records that fail automated ULPIN matching.",
    rootCause: "View Root Cause Analysis",
    dismiss: "Dismiss Alert",
  },

  kpi: {
    verification: "District Avg Verification",
    verificationDelta: "+{{value}} MTD",
    backlog: "Total Backlog",
    backlogDelta: "{{value}} vs prev qtr",
    backlogNote_one: "Pending mutations across {{count}} tehsil",
    backlogNote_other: "Pending mutations across {{count}} tehsils",
    resolution: "Avg Resolution Time",
    resolutionUnit: "Days",
    slaTarget: "Target SLA: {{days}}",
    mapSync: "Map Sync Rate",
    mapSyncCaption: "Satellite imagery of the district",
  },

  chart: {
    heading: "Verification Status by Tehsil",
    options: "Chart options",
    verified: "Verified Records",
    scanned: "Total Scanned",
    barLabel: "{{tehsil}}: {{value}} scanned",
  },

  backlog: {
    heading: "Backlog Distribution",
    legendItem: "{{name}} ({{share}})",
    others: "Others",
  },

  table: {
    heading: "Tehsil Performance Breakdown",
    period: "Last 30 Days",
    columns: {
      verification: "Verification %",
      backlog: "Total Backlog",
      resolutionTime: "Avg Res Time",
      discrepancyRate: "Discrepancy Rate",
    },
    drillDown: "Drill Down",
    drillDownFor: "Drill down into {{tehsil}}",
  },

  // A tehsil's overall health. Deliberately separate from the officer_status
  // domain, which grades a person's caseload rather than a jurisdiction.
  status: {
    optimal: "Optimal",
    needsAttention: "Needs Attention",
    stable: "Stable",
  },
};

export default tehsilAnalytics;
