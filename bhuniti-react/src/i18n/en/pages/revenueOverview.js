/*
 * English strings for src/pages/revenue/Overview.jsx -- the revenue officer's
 * dashboard: six KPI counters, the cadastral map with its jurisdiction pickers,
 * the discrepancy action queue and the recent activity log.
 *
 * Activity types and every status shown here come from the domain catalogs
 * (domain.action_type, domain.stage_state, domain.discrepancy_status), not from
 * this file -- the log used to hard-code "COMPLETED", "NEW" and "IN PROGRESS" in
 * capitals, which no other screen said and the API never returns.
 *
 * The KPI captions are deliberately short: they sit above a large number in a
 * narrow card, and the accessible name of each card is the caption plus that
 * number.
 *
 * Reached from a component as t("pages.revenueOverview....").
 */

const revenueOverview = {
  breadcrumb: "Officer Dashboard",
  title: "Officer Dashboard",

  kpi: {
    heading: "District indicators",
    totalParcels: "Total Parcels",
    verifiedParcels: "Verified Parcels",
    pendingMutations: "Pending Mutations",
    openDiscrepancies: "Open Discrepancies",
    highPriority: "High Priority Cases",
    awaitingSurvey: "Awaiting Survey",
    immediateAction: "Immediate action",
  },

  map: {
    heading: "Cadastral GIS Overview",
    source: "DILRMP PostGIS layer",
    tehsil: "Tehsil",
    village: "Village",
    // The picker lists the English name with the local one beside it, so an
    // officer reading either finds the same row.
    optionWithLocal: "{{name}} ({{local}})",
  },

  queue: {
    heading: "Discrepancy Cases",
    highPriorityCount: "{{count}} high priority",
    viewAll: "View all open cases",
    caseRef: "Case {{parcel}} · {{khasra}} {{number}}",
    // The card is the control, so its five parts become its accessible name.
    cardSummary: "{{ref}} — {{type}}, {{owner}}, {{place}}, {{when}}",
    place: "{{village}}, {{tehsil}}",
    notes: {
      areaMismatch:
        "Claimed {{claimed}} against a recorded {{recorded}} — a {{difference}} shortfall raised under mutation {{mutation}}.",
      roadOverlap:
        "The northern boundary overlaps the public road reservation buffer by {{overlap}}.",
      verified: "{{area}} of clean agricultural title with DGPS-verified boundaries.",
    },
  },

  activity: {
    heading: "Recent Activity Log",
    exportCsv: "Export log",
    reference: "Reference ID",
    type: "Activity Type",
    details: "Details",
    caption: "The last three actions recorded against this jurisdiction.",
    entries: {
      mutation: "Transfer of ownership recorded for ULPIN {{ulpin}}.",
      discrepancy:
        "Automated reconciliation detected an area mismatch on survey {{survey}} ({{khasra}} {{number}}).",
      survey: "Surveyor {{officer}} assigned to verify the {{khasra}} {{number}} boundaries.",
    },
  },
};

export default revenueOverview;
