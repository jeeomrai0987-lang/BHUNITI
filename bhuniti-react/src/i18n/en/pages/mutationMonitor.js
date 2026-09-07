/*
 * English strings for src/pages/admin/MutationMonitor.jsx -- the district-wide
 * mutation funnel.
 *
 * Every figure the original shipped was typed twice: once as a count and once as
 * a percentage in the hover column, and once more as an abbreviated total in the
 * middle of the donut. The page now derives all of them from one submitted
 * total, so the counts and shares arrive here as placeholders and follow the
 * numerals of the active language.
 *
 * Reached from a component as t("pages.mutationMonitor....").
 */

const mutationMonitor = {
  title: "Mutation Funnel Analytics",
  intro:
    "District-wide pipeline tracking for land transfer and ownership mutation requests. Figures cover every active tehsil.",
  // The date range used to be a dropdown that changed nothing; it now states the
  // window the figures cover.
  period: "Last {{days}} days",
  export: "Export Report",

  funnel: {
    heading: "Pipeline Conversion",
    live: "Live sync",
    // Read out for each bar, since the percentage column only appears on hover.
    stageSummary: "{{stage}}: {{count}} of {{total}} applications, {{share}}",
    stages: {
      submitted: "Submitted",
      verified: "Verified (L1)",
      notice: "Notice period",
      approved: "Approved",
      rejected: "Rejected",
    },
  },

  processing: {
    heading: "Avg Processing Time",
    days: "days",
    trend: "{{value}} from last month",
  },

  oldest: {
    heading: "Oldest Pending Application",
    days: "days",
    idLabel: "Mutation",
    escalate: "Escalate",
    escalateNamed: "Escalate mutation {{id}}",
  },

  types: {
    heading: "Mutation Types",
    total: "Total",
    // The donut is decorative; this is the sentence a screen reader hears.
    chart: "Share of the {{total}} mutations by type: {{breakdown}}.",
    breakdownItem: "{{type}} {{share}}",
    rowSummary: "{{type}}: {{count}} mutations, {{share}}",
  },

  toast: {
    exporting: "Preparing the mutation funnel report for the last {{days}} days.",
    escalated: "Mutation {{id}} has been escalated to the district officer.",
  },
};

export default mutationMonitor;
