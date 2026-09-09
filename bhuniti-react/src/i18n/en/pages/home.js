/*
 * English strings for src/pages/main/Home.jsx -- the public landing page.
 *
 * Reached from a component as t("pages.home....").
 */

const home = {
  hero: {
    badge: "National Infrastructure Initiative",
    /*
     * One sentence, one key. {{highlight}} marks the phrase the headline paints
     * in the accent colour, so Hindi can put it wherever its own word order
     * needs it; Home.jsx splits the sentence on that marker.
     */
    title: "Building a Trusted Digital Foundation for {{highlight}}",
    titleHighlight: "Land Governance",
    subtitle:
      "BHUNITI integrates land records, GIS, registration, mutation, and historical data into one intelligent, parcel-centric governance platform.",
    access: "Access BHUNITI",
    explore: "Explore How It Works",
    mapAlt:
      "A detailed realistic cadastral map showing land parcels, boundaries, and survey lines.",
    traits: {
      integrated: "Integrated",
      gis: "GIS-enabled",
      ai: "AI-assisted",
      auditable: "Auditable",
    },
  },

  // The sample parcel card beside the headline.
  preview: {
    title: "Parcel {{id}}",
    activeSelection: "Active Selection",
    discrepancy: "Potential Area Discrepancy",
  },

  // Parcel attribute names, shown by both the preview card and the modal.
  fields: {
    recordArea: "Record Area",
    gisArea: "GIS Computed Area",
    location: "Location",
    valuation: "Valuation",
  },
  // Section 2: the fragmented-data infographic.
  fragmentation: {
    heading: "Land Data Is Fragmented. Governance Shouldn't Be.",
    body: "Land information often exists across multiple disconnected systems. When textual records, spatial data, and legal registrations don't align, differences become systemic problems.",
    sources: {
      records: "Land Records (RoR)",
      gis: "GIS Spatial Data",
      registration: "Registration",
      history: "Historical Data",
    },
  },

  // Section 3: the one-parcel-one-view diagram.
  unified: {
    heading: "One Parcel. One Connected View.",
    body: "BHUNITI creates a unified intelligence layer around the land parcel, connecting all attributes, history, and spatial realities into a single source of truth.",
    centralEntity: "Central Entity",
    nodes: {
      owner: "Owner Data",
      boundary: "GIS Boundary",
      mutation: "Mutation",
      history: "History",
      ai: "AI Analysis",
    },
  },

  // Carried on the sample parcel itself, so the 360° viewer shows it translated.
  parcel: {
    disputeReason:
      "Registered RoR area: {{recordArea}} vs GIS computed polygon: {{gisArea}} (+{{variance}} discrepancy)",
  },

  modal: {
    ids: "Khasra {{khasra}} • Khata {{khata}}",
    title: "Parcel {{id}} ({{ulpin}})",
    discrepancyHeading: "Area Discrepancy Detected",
    discrepancyBody:
      "Textual RoR specifies {{recordArea}}, but the GIS satellite vector computes {{gisArea}} (+{{variance}} variance). A field survey has been assigned under case {{caseId}}.",
    areaWithBigha: "{{area}} ({{bigha}} Bigha)",
    launch360: "Launch 360° Ground Inspection",
    viewOnGisMap: "View on GIS Map",
  },
};

export default home;
