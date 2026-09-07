/*
 * English strings for src/pages/revenue/DiscrepancyCases.jsx -- the officer's
 * discrepancy register: a filterable case list on the left and the selected
 * case's dossier on the right.
 *
 * Case types, statuses and severities are NOT restated here; they come from
 * domain.discrepancy_type, domain.discrepancy_status and domain.severity, which
 * are generated from the backend catalog so the register speaks the same
 * vocabulary the API stores. Column headings reuse common.fields.*.
 *
 * Every measurement in the dossier is derived from the case's two recorded
 * areas, so the per-case notes take the figures as {{placeholders}} instead of
 * spelling them out -- the original prose repeated "65.50 sq.m (5.5%)" beside a
 * `variance` field that said the same thing and was never rendered.
 *
 * Reached from a component as t("pages.discrepancyCases....").
 */

const discrepancyCases = {
  breadcrumb: "Discrepancy Cases",
  title: "Discrepancy Cases",
  intro:
    "Manage and resolve the geometric, topological and ownership conflicts raised during GIS-to-record reconciliation.",
  // Counted from the caseload rather than the "14" the header and the heading
  // each hardcoded above four rows.
  actionRequired_one: "{{count}} action required",
  actionRequired_other: "{{count}} actions required",

  toolbar: {
    newCase: "New case",
    filterHeading: "Filter by severity",
    filterCount: "{{label}} ({{count}})",
  },

  tabs: {
    // Label and count are joined so a screen reader does not read them as two
    // separate items.
    withCount: "{{label}} ({{count}})",
    all: "All cases",
    high: "High priority",
    area: "Area conflicts",
    boundary: "Boundary overlaps",
    ownership: "Ownership disputes",
  },

  table: {
    issueType: "Issue type",
    // The row is the control, and its five cells are its accessible name -- the
    // visible column headings cannot be associated with a grid of <div>s.
    rowSummary: "Case {{id}}, parcel {{parcel}} — {{type}}, {{severity}} severity, {{status}}",
    selected: "Selected",
  },

  details: {
    eyebrow: "Case details",
    close: "Close case details",
    print: "Print case report",
    export: "Export audit log",
    parcel: "Parcel: {{id}}",
    severityChip: "{{severity}} severity",
    reported: "Reported {{date}}",
    empty: "Select a discrepancy case to view its dossier",
  },

  workflow: {
    heading: "Case progress",
    reported: "Reported",
    review: "Review",
    resolution: "Resolution",
    // The stepper is dots and connecting lines, so each step's state is spelled
    // out for anyone who cannot see them. {{state}} comes from
    // domain.stage_state.
    stepState: "{{step}}: {{state}}",
  },

  measurement: {
    gisArea: "GIS calculated area",
    recordArea: "Record area (RoR)",
    variance: "Variance",
    tolerance: "Allowable tolerance",
    // "65.50 m² (5.5%)" -- both halves are computed from the two areas above.
    varianceValue: "{{area}} ({{percent}})",
    withinTolerance: "Within tolerance",
    exceedsTolerance: "Exceeds tolerance",
  },

  // One note per case, holding the officer-facing finding. The figures arrive as
  // placeholders: {{area}}, {{percent}} and {{tolerance}} are derived from the
  // recorded areas, the rest are identifiers carried on the case itself.
  caseNotes: {
    d1024:
      "A variance of {{area}} ({{percent}}) exceeds the allowable tolerance of {{tolerance}}. Investigation is required to establish whether the difference is a digitising error or a physical encroachment.",
    d1025:
      "A {{overlap}} boundary overlap runs along the western edge with survey number {{survey}}. A surveyor's ground inspection is recommended.",
    d1026:
      "The transfer claimed in mutation {{mutation}} diverges materially from the revenue registry. An injunction is recorded on the Sub-Registrar portal.",
    d1027:
      "Benchmark stone {{benchmark}} was removed during the highway widening. Resection is required from a CORS network station.",
  },

  spatial: {
    heading: "Spatial context",
    place: "{{village}}, {{tehsil}}",
    layer: "PostGIS cadastral layer",
    // The basemap is a photograph standing in for the cadastral tile service.
    basemap: "Satellite view of parcel {{id}}",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    coordinates: "Lat {{lat}}, Lng {{lng}}",
  },

  evidence: {
    heading: "Evidence & documents",
    add: "Add document",
    open: "Open {{name}}",
    // "Uploaded 2 days ago" / "System generated", then the file size.
    uploaded: "Uploaded {{when}}",
    systemGenerated: "System generated",
    meta: "{{origin}} • {{size}}",
  },

  investigation: {
    heading: "Investigation notes",
    label: "Investigation note for case {{id}}",
    placeholder: "Enter the findings from your record review…",
    attach: "Attach a file to this note",
    insertTemplate: "Insert the standard finding",
    template:
      "DGPS verified on the ground. Boundary discrepancy confirmed against the adjacent parcel.",
  },

  actions: {
    resolve: "Resolve case",
    requestSurvey: "Request survey",
    escalate: "Escalate to the District Officer",
  },

  modal: {
    title: "File a new discrepancy case",
    parcel: "Parcel ULPIN / ID",
    parcelPlaceholder: "e.g. 09-0824-0014-1024 or P-1024",
    type: "Discrepancy type",
    observation: "Initial observation",
    observationPlaceholder: "Describe the discrepancy…",
    submit: "File case",
  },

  // Nothing on this screen reaches a server, so each action reports what it
  // would have done. The reference id is generated on submit.
  toast: {
    created: "Discrepancy case {{ref}} opened for {{parcel}}.",
    printing: "Preparing the case brief for {{id}}.",
    exporting: "Exporting the audit log for {{id}}.",
    zoomed: "Centred the map on parcel {{id}}.",
    zoomReset: "Reset the map view for parcel {{id}}.",
    uploadDialog: "Document upload is not part of this build.",
    viewingDocument: "Opening {{name}}.",
    resolved: "Case {{id}} resolved and written to the audit trail.",
    surveyRequested: "Field survey requested for parcel {{id}}.",
    escalated: "Case {{id}} escalated to the District Officer.",
  },
};

export default discrepancyCases;
