/*
 * English strings for src/pages/revenue/HistoricalTimeline.jsx -- the audit
 * trail for a single parcel: the area chart in the hero, the chronology rail
 * and the three event cards.
 *
 * No date, area or percentage lives in here. Each event in the page's TIMELINE
 * fixture carries a real Date and a plain number, so `formatDate` and the
 * page's `area()` helper render them for the active locale; a baked-in
 * "March 12, 2021" would have stayed English forever. The +0.18 ha variance and
 * the +9% expansion are likewise computed from the two areas, so they cannot
 * drift apart from the figures they describe.
 *
 * Reached from a component as t("pages.historicalTimeline....").
 */

const historicalTimeline = {
  breadcrumb: {
    system: "System",
    dashboard: "Dashboard",
  },

  title: "Parcel History & Audit Trail",
  intro:
    "Chronological record of cadastral events, ownership transfers and geometric revisions for parcel {{parcel}}, khasra {{khasra}}.",
  ulpinChip: "ULPIN: {{id}}",
  anomalyDetected: "Anomaly detected",

  area: {
    // The registry still holds the pre-sync figure, so the headline is labelled
    // as the GIS reading rather than as the registered area -- the gap between
    // the two is the whole subject of the page.
    gisReported: "GIS-reported area",
    registry: "Registry holds {{value}}",
    chartCaption:
      "Recorded area by year: level at {{from}} until {{year}}, when an automated sync raised it to {{to}}",
    firstInconsistency:
      "First detected inconsistency: {{month}} ({{variance}} variance)",
  },

  chronology: {
    heading: "Chronology",
    jumpTo: "Jump to {{title}}",
  },

  events: {
    baseSurvey: {
      title: "Initial record creation",
      badge: "Base survey",
      photoCaption: "Village fields at the time of the base survey",
      recordedArea: "Recorded area",
      authority: "Authority",
      authorityValue: "Sub-Divisional Magistrate",
      body:
        "Digitisation of legacy paper records (Ref: Volume 42, Folio 18). Boundary geometry traced by hand from 1:4000 village maps. No spatial overlap was found when the record was first committed.",
    },

    deedRegistration: {
      title: "Deed registration (transfer)",
      photoCaption: "The registered parcel after the transfer",
      grantor: "Grantor",
      grantee: "Grantee",
      // This mutation is what makes the grantee the current owner in the search
      // record, so the note repeats the area to show it did not move here.
      note: "Mutation #{{mutation}} processed. Area confirmed unchanged at {{value}}.",
    },

    boundaryUpdate: {
      title: "Boundary update (GIS anomaly)",
      actionRequired: "Action required",
      body:
        "An automated spatial sync from drone survey {{survey}} introduced new vertex coordinates along the northern boundary, expanding the area with no supporting document.",
      previousArea: "Previous area",
      newArea: "New area",
      overlap:
        "Geospatial overlap detected with adjacent parcel {{parcel}}, held by {{owner}}. Possible encroachment or a digitisation error.",
      initiateDispute: "Initiate dispute",
      viewOverlay: "View overlay",
      mapCaption:
        "The registered boundary against the wider polygon produced by the sync, with the added strips along the northern edge highlighted",
      expansion: "{{value}} area expansion",
    },
  },
};

export default historicalTimeline;
