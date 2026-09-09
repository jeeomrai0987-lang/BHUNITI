/*
 * English copy for the Revenue Officer audit trail (/revenue-officer/audit-trail).
 *
 * `detail.*` entries are sentence templates rather than finished sentences: the
 * page splits them on their own {{placeholders}} so the old and new values can
 * keep their strikethrough / highlight styling without the sentence being cut
 * into two t() calls, which would fix English word order into Hindi.
 */

const auditTrail = {
  title: "System Audit Trail",
  intro:
    "View a comprehensive, immutable log of all administrative actions, data changes and system-detected discrepancies. Events are digitally signed and chronologically ordered.",
  exportLog: "Export Log",
  verifyChain: "Verify Chain",
  searchPlaceholder: "Search by ULPIN, Case ID or Actor…",

  filters: {
    dateRange: "Date range",
    allDates: "All Date Ranges",
    last24Hours: "Last 24 Hours",
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days",
    actor: "Actor",
    allActors: "All Actors",
    revenueOfficers: "Revenue Officers",
    citizens: "Citizens",
    systemAutomated: "System (Automated)",
    category: "Category",
    allCategories: "All Categories",
    administrative: "Administrative",
    geospatial: "Geospatial",
    document: "Document",
    system: "System",
  },

  columns: {
    timestamp: "Timestamp",
    actor: "Actor",
    actionTarget: "Action & Target",
    changeDetail: "Change Detail",
    verification: "Verification",
  },

  // Where the event came from. Shown small, on hover.
  origin: {
    ip: "IP: {{address}}",
    node: "Node: {{name}}",
  },

  verification: {
    signed: "Signed",
    chainVerified: "Chain Verified",
  },

  detail: {
    statusChange: "Status updated from {{from}} to {{to}}",
    areaMismatch: "Area mismatch flagged during automated GIS-record reconciliation.",
    previousValue: "Previous Value (Textual)",
    newValue: "New Value (GIS Derived)",
    documentAttached: "Sale deed scanned and appended to the property record.",
    backupCompleted: "Daily snapshot created successfully. Size: {{size}}.",
  },

  // Actor job titles that are not registry role values.
  roles: {
    documentVerifier: "Document Verifier",
    automatedTask: "Automated Task",
    systemAutomated: "System (Automated)",
  },

  // Event names with no matching action_type in the registry vocabulary; the
  // ones that do have one (Mutation Approved, Document Uploaded, …) go through
  // label("action_type", …) instead so the API's own wording wins.
  events: {
    discrepancyDetected: "Discrepancy Detected",
    backupCompleted: "Backup Completed",
  },

  target: {
    parcel: "Parcel {{id}}",
    deed: "Deed {{id}}",
  },

  pagination: {
    nextPage: "Next page",
    previousPage: "Previous page",
    goToPage: "Go to page {{page}}",
    morePages: "More pages",
  },
};

export default auditTrail;
