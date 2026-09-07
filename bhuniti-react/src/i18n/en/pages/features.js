/*
 * English copy for the public Platform Capabilities page (/features).
 *
 * The six modules are one entry each under `modules`, keyed by the order they
 * appear. Every module has the same four fields, so the page renders them from a
 * list rather than repeating the same block of markup six times.
 *
 * Reached from a component as t("pages.features....").
 */

const features = {
  eyebrow: "Platform Capabilities",
  title: "Architecting the Future of Land Administration.",
  intro:
    "An integrated suite of enterprise-grade modules engineered for high-stakes governance. BHUNITI bridges the gap between spatial data and legal documentation through transparent, AI-driven workflows.",

  stats: {
    uptime: "Uptime SLA",
    modules: "Core Modules",
  },

  forOfficials: "For Officials",
  forCitizens: "For Citizens",

  modules: {
    gis: {
      title: "GIS Intelligence",
      body:
        "Dynamic, multi-layered spatial mapping using high-resolution cadastral overlays, integrated with national coordinate systems for pinpoint accuracy in parcel identification and boundary resolution.",
      officials: "Resolve boundary disputes instantly with automated overlay clash detection.",
      citizens: "View verifiable, exact property perimeters from any authorised device.",
      badge: "Live Spatial Sync",
      imageCaption: "Cadastral overlay on a satellite basemap",
    },
    ai: {
      title: "AI-Assisted Analysis",
      body:
        "Machine learning detects anomalies in land valuations, predicts urbanisation trends, and automates the validation of complex legacy records against modern spatial realities.",
      officials: "Automated risk-flagging for potentially fraudulent transaction patterns.",
      citizens: "Fair, algorithmic assessment of property values based on long historical records.",
      accuracy: "Model accuracy: {{value}}",
      chartCaption: "Model accuracy trend over the last six months",
    },
    mutation: {
      title: "Mutation Management",
      body:
        "A frictionless, end-to-end digital pipeline for ownership transfer. Smart workflows route approvals to the right jurisdictional office instead of queueing behind a counter.",
      officials:
        "Streamlined queues with automated prerequisite checks, cutting manual review time.",
      citizens: "Track mutation status in real time without visiting a government office.",
      steps: {
        deed: "Deed",
        verify: "Verify",
        mutate: "Mutate",
      },
    },
    documents: {
      title: "Document Intelligence",
      body:
        "OCR and natural-language processing parse handwritten, historical and multilingual land records, turning unstructured legacy paper into searchable digital assets.",
      officials: "Search decades of archival text for precedent and lineage in seconds.",
      citizens: "Access accurately digitised, legally valid copies of ancestral deeds.",
      imageCaption: "A historical deed being scanned and recognised character by character",
    },
    survey: {
      title: "Field Survey Management",
      body:
        "Coordinate ground-truth verification end to end: dispatch teams, track surveyor telemetry, and ingest drone photogrammetry straight into the core GIS database.",
      officials: "Live oversight of active field operations with immediate data ingestion.",
      citizens: "Faster resolution of physical boundary disputes using modern survey equipment.",
      imageCaption: "Aerial survey of farmland under demarcation",
    },
    audit: {
      title: "Cryptographic Audit Trail",
      body:
        "Every view, edit and mutation is cryptographically signed and written to an append-only ledger, which is what makes historical integrity provable rather than merely claimed.",
      officials: "Provable operational integrity and protection against internal tampering.",
      citizens: "Confidence that a property record cannot be quietly altered.",
      ledger: {
        caption: "Sample ledger entries",
        authSuccess: "User authentication succeeded via the biometric gateway",
        boundaryModified: "Spatial boundary modified. Node ID: {{node}}",
        hashCommitted: "Hash committed to the append-only ledger.",
      },
    },
  },

  cta: {
    heading: "Experience Institutional Intelligence",
    body:
      "Join the districts already using BHUNITI to modernise their land governance infrastructure.",
    demo: "Request Technical Demo",
    docs: "View Documentation",
  },
};

export default features;
