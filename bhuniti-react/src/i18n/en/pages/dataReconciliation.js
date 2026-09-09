/*
 * English copy for the Revenue Officer reconciliation screen
 * (/revenue-officer/data-reconciliation).
 *
 * The table compares one parcel across four source systems, so the column
 * headings name systems (RoR, GIS, Registration, Survey) and the row headings
 * name attributes. Attribute names that already exist in common.fields are read
 * from there instead of being repeated here.
 */

const dataReconciliation = {
  breadcrumb: {
    system: "System",
    current: "Reconciliation",
  },
  title: "Parcel Data Reconciliation",
  intro:
    "Compare information held by Land Records, GIS, Registration and Survey for {{ulpin}}.",
  ulpinChip: "ULPIN: {{id}}",

  actions: {
    requestSurvey: "Request Field Survey",
    createCase: "Create Case",
    viewEvidence: "View Evidence",
  },

  comparison: {
    heading: "Multi-Source Comparison",
    mismatchCount_one: "{{count}} mismatch detected",
    mismatchCount_other: "{{count}} mismatches detected",
    columns: {
      attribute: "Attribute",
      landRecord: "Land Record (RoR)",
      gis: "GIS",
      registration: "Registration",
      survey: "Survey",
    },
    attributes: {
      primaryOwner: "Primary Owner",
      totalArea: "Total Area",
      boundaryCoordinates: "Boundary Coordinates",
    },
    values: {
      notAvailable: "N/A",
      referText: "Refer Text",
      validGeometry: "Valid Geometry",
    },
    status: {
      match: "Match",
      mismatch: "Mismatch",
      verified: "Verified",
    },
  },

  map: {
    caption: "Cadastral overlay for the parcel under reconciliation",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    layers: "Toggle layers",
    gisBoundary: "GIS Boundary",
    rorBoundary: "RoR Boundary",
  },

  ai: {
    heading: "AI-Assisted Analysis",
    finding:
      "Discrepancy flagged: the GIS-calculated area ({{gis}}) exceeds the area stated in the Land Record ({{ror}}) by {{delta}}.",
    historicalHeading: "Historical Context",
    historical:
      "The 1998 physical survey recorded this parcel as {{area}}, which aligns closely with the current GIS geometry.",
    ruleHeading: "Regulatory Rule",
    rule:
      "An area discrepancy above 5% requires a physical re-survey before any transfer or mutation can proceed.",
    confidence: "Confidence Score",
  },

  metadata: {
    heading: "Parcel Metadata",
    subDistrict: "Sub-District",
    subDistrictValue: "North Block A",
    villageCode: "Village Code",
    dataSource: "Data Source",
    dataSourceValue: "NIC LandGrid API",
  },
};

export default dataReconciliation;
