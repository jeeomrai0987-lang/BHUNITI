/*
 * English strings for src/pages/main/About.jsx -- the institution profile: the
 * mission statement, the fragmentation problem, the technology stack and the
 * administrative contact form.
 *
 * Reached from a component as t("pages.about....").
 */

const about = {
  hero: {
    badge: "Institution profile",
    heading:
      "To build a trusted digital foundation for transparent and efficient land administration.",
    lede: "BHUNITI represents a paradigm shift in spatial governance, unifying fragmented legal, geographic and administrative records into a single, irrefutable institutional reality.",
    // The banner is a photograph, so it needs a name of its own.
    banner: "Aerial view of surveyed farmland divided into cadastral parcels",
  },

  challenge: {
    heading: "The infrastructure challenge",
    body: "Historically, national land intelligence has been constrained by isolated institutional silos, leading to discrepancies in property delineation and legal ownership.",
    objectiveHeading: "Governance objective",
    objectiveBody:
      "Establish an unassailable digital ledger linking spatial coordinates with legal entitlement, accelerating administrative processing by {{share}}.",
  },

  // The two facing cards. `ordinal` is the numeral printed beside the heading;
  // `diagram` names the sketch below it, which is decorative in shape but
  // carries the argument of the card.
  synthesis: {
    fragmented: {
      ordinal: "01.",
      heading: "Fragmented reality",
      body: "Legacy systems operate in isolation. Textual records reside in separate jurisdictions from spatial surveys, creating administrative friction, legal ambiguity and vulnerability to disputes. This fragmentation inherently limits the speed of infrastructure development and economic mobilisation.",
      diagram:
        "A broken survey line whose points are joined by two unrelated record trails.",
    },
    unified: {
      ordinal: "02.",
      heading: "Unified synthesis",
      body: "BHUNITI serves as the operational connective tissue. By mathematically aligning geospatial geometries with authenticated administrative metadata, the platform produces a single, verifiable institutional truth, dramatically reducing risk profiles for every stakeholder.",
      diagram:
        "One continuous survey line through a single verified parcel centre.",
    },
  },

  foundation: {
    eyebrow: "Technological foundation",
    heading: "Precision architecture",
    spatial: {
      heading: "Spatial intelligence",
      body: "A high-fidelity geometric processing engine that aligns disparate coordinate systems into one national grid with sub-metre accuracy.",
    },
    algorithmic: {
      heading: "Algorithmic verification",
      body: "Automated structural analysis of legal documentation, detecting topological anomalies and administrative discrepancies before human review.",
    },
    resilient: {
      heading: "Resilient infrastructure",
      body: "Distributed, government-grade data repositories ensuring continuous availability, cryptographic integrity and compliance with data localisation mandates.",
    },
  },

  contact: {
    heading: "Institutional contact",
    body: "For administrative inquiries, integration requests or governance documentation, please direct communications through official channels.",
    headquarters: "Headquarters",
    headquartersValue: "National Land Governance Centre, New Delhi, India",
    communications: "Official communications",
  },

  form: {
    heading: "Administrative request routing",
    department: "Department / ministry",
    departmentPlaceholder: "e.g. Department of Revenue",
    designation: "Officer designation",
    designationPlaceholder: "e.g. District Collector",
    subject: "Subject of inquiry",
    subjectPlaceholder: "e.g. spatial data federation integration",
    message: "Official statement / request",
    messagePlaceholder: "Outline your jurisdictional integration requirements…",
    submit: "Submit administrative request",
    // The button had no destination at all. It says so now rather than
    // pretending the request left the building.
    toast: "Demo build — request routing is not connected, so nothing was sent.",
  },
};

export default about;
