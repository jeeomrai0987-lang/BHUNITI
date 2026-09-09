/*
 * English strings for src/pages/revenue/FieldSurvey.jsx -- the survey request
 * queue, the parcel context map and the field team / equipment panels.
 *
 * The survey types and queue statuses below are page-local rather than shared
 * domain values on purpose: `domain.survey_status` describes a scheduled site
 * visit, while this queue tracks the request that precedes one.
 *
 * Reached from a component as t("pages.fieldSurvey....").
 */

const fieldSurvey = {
  breadcrumb: {
    system: "System",
    dashboard: "Dashboard",
  },

  title: "Field Survey Management",
  intro:
    "On-ground verification, DGPS rover telemetry and cadastral survey activity across the tehsil.",
  newRequest: "New Request",

  stats: {
    activeRequests: "Active Requests",
    sinceYesterday: "{{delta}} since yesterday",
    inProgress: "In Progress",
    activeTeams: "Active field teams",
    awaiting: "Awaiting Verification",
    awaitingHint: "Requires RO approval",
    equipment: "Equipment Readiness",
    equipmentHint: "Calibrated and ready",
  },

  queue: {
    heading: "Survey Request Queue",
    requestId: "Request ID",
    type: "Survey Type",
    filter: "Filter records",
    sort: "Sort records",
    filterToast: "Filter options toggled",
    sortToast: "Queue sorted by priority",
    openRequest: "Open request {{id}}",
    unassigned: "Unassigned",
  },

  surveyTypes: {
    boundaryDispute: "Boundary Dispute",
    subdivision: "Subdivision",
    encroachment: "Encroachment",
    routineAudit: "Routine Audit",
    mutationGroundCheck: "Mutation Ground Check",
  },

  statuses: {
    reviewPending: "Review Pending",
    inProgress: "In Progress",
    assigned: "Assigned",
    pending: "Pending",
  },

  teams: {
    alpha: "Team Alpha",
    beta: "Team Beta",
    gamma: "Team Gamma",
  },

  // The short form printed against a surveyor's name in the queue.
  teamCodes: {
    alpha: "T-Alpha",
    beta: "T-Beta",
    gamma: "T-Gamma",
  },

  surveyor: "{{name}} ({{team}})",

  context: {
    eyebrow: "Active Context",
    parcel: "Parcel {{id}}",
    khasra: "Khasra {{value}}",
    khasraShort: "Kh. {{value}}",
    disputedOverlap: "Disputed boundary overlap",
    mapCaption: "Recorded cadastral boundary of parcel {{id}} on a satellite basemap",
    baseLayer: "Base layer",
    layers: {
      satellite: "Satellite",
      cadastral: "Cadastral",
    },
    latitude: "Lat: {{value}}° N",
    longitude: "Lng: {{value}}° E",
  },

  // Badges shown against the selected parcel. `dispute` and `encroachment`
  // shorten the survey type; the other two mirror the queue status.
  badges: {
    dispute: "Dispute",
    encroachment: "Encroachment",
    inProgress: "In Progress",
    pending: "Pending",
  },

  variance: {
    heading: "Variance Analysis",
    gisRecord: "GIS Record",
    fieldMeasure: "Field Measure",
    delta: "Delta",
    value: "{{area}} ({{verdict}})",
    verdict: {
      beyondTolerance: "Beyond tolerance",
      withinTolerance: "Within tolerance",
      majorDiscrepancy: "Major discrepancy",
      exactMatch: "Exact match",
    },
  },

  notes: {
    heading: "Field Notes (OCR)",
    quoted: "“{{text}}”",
    uploadedBy: "Uploaded by {{name}} • {{when}}",
    systemScheduled: "System scheduled • {{when}}",
    body: {
      "SR-2023-089":
        "Neighbouring fence line observed approximately 4 m inside the recorded P-1024 boundary on the eastern edge. Concrete pillars suggest recent placement. Historical alignment overlay requested.",
      "SR-2023-091":
        "Partition line demarcated with DGPS rover markers. Northern and southern sub-parcels of 0.72 ha each verified against the mutation deed.",
      "SR-2023-095":
        "Western boundary overlaps the Gram Sabha public road. Survey team dispatched with a CORS RTK receiver for a millimetre-grade baseline fix.",
      "SR-2023-098":
        "Scheduled triennial cadastral verification. Benchmark stone #BM-44 in good condition. All corners clear.",
    },
  },

  actions: {
    reconcile: "Reconcile Observations",
    reconcileToast: "Reconciled field observations for parcel {{parcel}}",
    report: "Generate Survey Report",
    reportToast: "Survey report generated for parcel {{parcel}}",
    createdToast: "Survey request created for {{parcel}} ({{type}})",
  },

  fieldTeams: {
    heading: "Active Field Teams",
    onParcel: "{{parcel}} • {{type}}",
    inTransit: "In transit to {{parcel}}",
    active: "Active",
    moving: "Moving",
  },

  telemetry: {
    heading: "Equipment Telemetry",
    battery: "{{value}} battery",
    devices: {
      drone: "Drone-1",
      totalStation: "Total Station-3",
    },
    droneMeta: "Assigned to {{team}} • RTK fix: millimetre grade • calibrated",
    stationMeta: "Assigned to {{team}} • recalibration due in {{days}}",
  },

  modal: {
    heading: "Create Survey Request",
    parcelLabel: "Parcel ID / ULPIN",
    parcelPlaceholder: "e.g. P-4492",
    typeLabel: "Survey Type",
    submit: "Create Request",
  },
};

export default fieldSurvey;
