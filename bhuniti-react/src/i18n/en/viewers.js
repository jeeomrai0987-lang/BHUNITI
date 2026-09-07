/*
 * English copy for the three interactive widgets in src/components/:
 * ParcelMapViewer (the Bhu-Naksha cadastral map), Virtual360Viewer and
 * AnimatedCounter.
 *
 * Both viewers were written entirely in Devanagari with a parenthesised English
 * gloss, so the English build showed Hindi chrome. The strings below carry the
 * gloss version; hi/viewers.js carries the Devanagari one, minus the gloss.
 *
 * Reached from a component as t("viewers.parcelMap....").
 */

const viewers = {
  parcelMap: {
    header: {
      title: "UP Bhu-Naksha • Ghaziabad cadastral sheet",
      villageChip: "Village: {{village}} ({{tehsil}})",
      // The sheet holds ten contiguous plots in the demo fixture but fewer when
      // a page passes its own search results through.
      subtitle_one: "Showing {{count}} khasra plot • tap it for the khatauni",
      subtitle_other:
        "Showing {{count}} contiguous khasra plots • tap any plot for its khatauni",
    },

    layers: {
      sectionLabel: "Base map",
      satellite: "Satellite + cadastral",
      bhunaksha: "UP Bhu-Naksha shajra",
    },

    // Hover label on a polygon. The area arrives already formatted with its unit.
    tooltip: "Khasra {{khasra}} • {{owner}} • {{area}}",

    // Printed inside the round badge pinned to each plot centroid, so it has to
    // stay short.
    badge: {
      khasraShort: "Kh. {{number}}",
      label: "Khasra {{number}}",
    },

    legend: {
      heading: "Bhu-Naksha legend",
      items: {
        agriculture: "Agricultural",
        government: "Gram Sabha / state",
        commercial: "Commercial",
        residential: "Residential (abadi)",
        orchard: "Orchard / bagh",
        water: "Canal / water body",
        mutation: "Under mutation",
        dispute: "Boundary dispute",
      },
    },

    drawer: {
      label: "Land record details",
      khasraChip: "Khasra {{number}}",
      khataChip: "Khata: {{number}}",
      handleExpand: "Expand the land record",
      handleCollapse: "Collapse the land record",
      close: "Close the land record",
      discrepancy: "Bhu-Naksha discrepancy",
      owner: "Registered khatedar",
      coOwners: "Co-khatedars: {{names}}",
      areaMetric: "Area (hectares)",
      areaCustomary: "Bigha / biswa (UP unit)",
      areaBighaBiswa: "{{bigha}} ({{biswa}})",
      valuation: "Circle-rate valuation",
      // The rupee figure is divided by a lakh before it gets here, so the word
      // has to follow the number rather than being part of the currency format.
      valuationLakh: "{{value}} lakh",
      landUse: "Land use category",
      location: "Location and revenue circle",
      locationValue:
        "Village {{village}}, Tehsil {{tehsil}}, District {{district}}, {{state}}",
      encumbrance: "Encumbrance / mortgage status",
      caseNumber: "Case {{number}}",
    },

    actions: {
      open360: "360° ground inspection",
      open360Named: "Open the 360° ground inspection of khasra {{khasra}}",
      downloadRor: "Download digital khatauni (PDF)",
      downloadRorNamed: "Download the digital khatauni for khasra {{khasra}}",
      // The demo has no document service behind it, so the button reports what
      // it would do instead of pretending a file arrived.
      downloadQueued:
        "Preparing the digital khatauni (RoR Form 7/12) for khasra {{khasra}}, {{district}}.",
    },

    // Fixture-only prose. A record that comes from the API brings its own
    // dispute note in dispute_reason and this is not used.
    fixture: {
      areaMismatch:
        "Claimed {{claimed}} against {{recorded}} in the record of rights — a difference of {{difference}} under case {{case}}.",
      roadOverlap:
        "The northern boundary overlaps the public road reservation buffer by {{distance}}.",
    },
  },

  virtual360: {
    dialogLabel: "360° ground inspection",
    title: "360° ground inspection",
    liveBadge: "Live ground truth",
    // ULPIN stays in Latin capitals in both languages: it is the statutory
    // acronym printed on the record itself.
    identity: "ULPIN: {{ulpin}} • {{owner}}",
    close: "Close the 360° inspection",

    modes: {
      sectionLabel: "Imagery source",
      ground: "Ground",
      drone: "Drone",
      // The third panorama is keyed "thermal" in the fixture but is presented
      // as the cadastral overlay, which is what the tinted image stands in for.
      cadastral: "Cadastral",
    },

    // Alternative text for the panorama, which is a remote photograph rather
    // than anything the viewer draws.
    panorama: {
      ground: "Ground-level panorama of the parcel",
      drone: "Aerial drone panorama of the parcel",
      cadastral: "Cadastral overlay over the parcel panorama",
    },

    controls: {
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      // One button, two accessible names, because the label has to say what the
      // next press does rather than what the current state is.
      autoRotateStop: "Stop the 360° auto-rotation",
      autoRotateStart: "Start the 360° auto-rotation",
      reset: "Reset the view",
    },

    hud: {
      heading: "Heading",
      headingValue: "{{degrees}}° {{direction}}",
      centroid: "Centroid",
      centroidValue: "{{lat}}° {{northSouth}}, {{lng}}° {{eastWest}}",
      // Single-letter compass points, printed inside the rotating rose and
      // after the coordinates.
      compass: {
        north: "N",
        east: "E",
        south: "S",
        west: "W",
      },
    },

    hint: "Drag or swipe to look around • tap a pin for ground metrics",

    hotspots: {
      openInfo: "Open the survey note for {{name}}",
      closeInfo: "Close the survey note",
      pillar: {
        name: "North boundary marker (pillar N-1)",
        info: "DGPS benchmark pillar. Elevation 218.4 m AMSL, at 28.8368° N, 77.5832° E.",
      },
      // The fixture shows this pin as a dispute when the parcel carries one and
      // as an ordinary sub-division boundary otherwise.
      boundary: {
        disputedName: "Disputed overlap zone",
        verifiedName: "Sub-division boundary",
        disputedInfo: "The boundary is under dispute under case {{case}}.",
        disputedInfoNoCase: "The boundary is under dispute.",
        verifiedInfo: "Boundary verified against the 1984 cadastral map.",
      },
      access: {
        name: "Road frontage (18 m wide)",
        info: "Connecting corridor to State Highway 57. Right of way verified as clear.",
      },
    },
  },
};

export default viewers;
