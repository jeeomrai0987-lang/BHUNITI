/*
 * English strings for src/pages/citizen/Portal.jsx -- the citizen dashboard.
 *
 * The record card and the application rows read their values from fixtures that
 * match the pages they link to, so every figure here is a placeholder: the area
 * arrives already formatted with its bigha conversion, and statuses come through
 * the shared domain catalog rather than being written out again.
 *
 * Reached from a component as t("pages.citizenPortal....").
 */

const citizenPortal = {
  eyebrow: "Citizen Portal",
  titleLead: "Secure, transparent",
  titleAccent: "land information.",
  intro:
    "Access your property records, initiate mutations, and track applications on the unified government land governance platform.",

  search: {
    label: "Search land records",
    placeholder: "Search by ULPIN, khasra number, or owner name…",
    submit: "Search Records",
  },

  actions: {
    sectionLabel: "Common services",
    items: {
      downloadTitle: {
        title: "Download Title",
        body: "Get a verified copy of the record of rights",
      },
      initiateMutation: {
        title: "Initiate Mutation",
        body: "Start a property transfer",
      },
      viewMaps: {
        title: "View Maps",
        body: "Open the spatial GIS record",
      },
    },
  },

  recent: {
    heading: "Recent search result",
    lastAccessed: "Last accessed {{when}}",
    viewFull: "View full record",
    viewFullNamed: "View the full record for parcel {{parcel}}",
    imageAlt: "Satellite view of parcel {{parcel}}",
    gisLayer: "GIS layer active",
    ulpinLabel: "ULPIN",
    parcelHeading: "Parcel {{parcel}}, Khasra {{khasra}}",
    owner: "Registered owner",
    area: "Total area",
    // The hectare figure and its bigha conversion are both formatted before
    // they arrive here.
    areaWithBigha: "{{area}} ({{bigha}} Bigha)",
    landType: "Land type",
    encumbrances: "Encumbrances",
  },

  applications: {
    heading: "My Applications",
    more: "Open all my applications",
    submittedFor: "Submitted for parcel {{parcel}}",
    closed: "Closed and stamped in the record of rights",
    progress: "Stage {{done}} of {{total}}",
    // Read out for each row, because the row is a grid of small chips.
    rowSummary: "{{number}}, {{type}}, {{status}}.",
    viewAll: "View All Applications",
  },

  help: {
    heading: "Need help?",
    body: "Read the citizen guide for step-by-step instructions on every land service.",
    cta: "Visit help centre",
  },
};

export default citizenPortal;
