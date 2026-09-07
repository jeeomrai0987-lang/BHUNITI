/*
 * English strings for src/pages/revenue/MutationManagement.jsx -- the mutation
 * queue and the decision panel beside it.
 *
 * Two things shape this catalog. The queue itself was fetched and then thrown
 * away -- only the first row was ever shown -- so the list now has copy of its
 * own. And the discrepancy sentence used to arrive as one frozen English string;
 * the figures in it are placeholders now, because the same case is quoted on the
 * evidence and dispute screens and all three have to read alike in Hindi.
 *
 * Reached from a component as t("pages.mutationManagement....").
 */

const mutationManagement = {
  breadcrumb: "Mutation Management",
  title: "Mutation Management",
  intro:
    "Decide transfer and ownership mutation requests for your tehsil. Cases carrying an area or boundary discrepancy are listed first.",

  kpi: {
    sectionLabel: "Queue at a glance",
    pending: "Pending",
    underVerification: "Under Verification",
    awaitingDocs: "Awaiting Docs",
    approvedToday: "Approved (today)",
    up: "Up {{value}} on last week",
    down: "Down {{value}} on last week",
    flat: "No change on last week",
    liveSynced: "Live from the registry service",
    sampleData: "Sample figures — service unreachable",
  },

  queue: {
    heading: "Case queue",
    empty: "No mutation cases are open",
    emptyHint: "New requests appear here as soon as they are submitted.",
    // Read out for each row, because the row itself is a grid of small chips.
    rowSummary: "{{number}}, {{type}}, {{applicant}}, {{status}}",
    discrepancy: "Discrepancy",
    selected: "Currently open",
  },

  detail: {
    linkedParcel: "Linked to parcel",
    statusLabel: "Status",
    discrepancyFlag: "Discrepancy detected",
    applicant: "Applicant",
    submittedOn: "Submission date",
    claimedArea: "Claimed area",
    recordArea: "Record area",
    variance: "Difference",
  },

  actions: {
    approve: "Approve",
    reject: "Reject",
    clarify: "Request Clarification",
    working: "Recording…",
    // Each verb needs the case number in its accessible name: three identical
    // buttons sit side by side and a screen reader hears them out of context.
    approveNamed: "Approve mutation {{number}}",
    rejectNamed: "Reject mutation {{number}}",
    clarifyNamed: "Request clarification on mutation {{number}}",
    note: "Recorded from the revenue officer portal.",
  },

  result: {
    recorded: "{{number}} marked as {{status}}. The change is written to the register and the audit trail.",
    offline: "{{number}} could not be sent to the registry service. The decision is held on this device only.",
  },

  // The offline case. Every figure is a placeholder so the sentence reads
  // naturally in either language.
  fixture: {
    areaMismatch:
      "Area mismatch: {{claimed}} claimed against {{recorded}} in the record of rights, a difference of {{difference}}. A field boundary survey is required before the mutation can be approved.",
  },
};

export default mutationManagement;
