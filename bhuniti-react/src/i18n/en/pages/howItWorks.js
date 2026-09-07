/*
 * English strings for src/pages/main/HowItWorks.jsx -- the how it works.
 *
 * Reached from a component as t("pages.howItWorks....").
 */

const howItWorks = {
  intro: {
    eyebrow: "Process Architecture",
    title: "The Core Engine: From Raw Data to Institutional Trust",
    body: "BHUNITI transforms fragmented spatial and legal records into a unified, actionable source of truth. Explore the seven-step data lifecycle powering our governance infrastructure.",
  },

  // The reconciliation card in the left column.
  engine: {
    badge: "Core Engine",
    title: "Data Reconciliation",
    body: "The heart of BHUNITI. We cross-reference municipal cadastre shapes against state legal registries using proprietary fuzzy-matching and spatial overlay algorithms. Discrepancies are flagged, quantified, and routed for resolution.",
    accuracyLabel: "Live Accuracy Rate",
  },

  // The sample parcel being followed through the lifecycle.
  tracker: {
    heading: "Live Tracker: Parcel {{id}}",
    currentStep: "Step {{number}}: {{step}}",
    note: "Flagged for minor boundary overlap ({{area}}). Pending historical registry check.",
  },

  workflow: {
    heading: "The 7-Step Institutional Workflow",
    crucial: "Crucial Phase",
  },
  // The seven numbered stages, in the order they appear on screen.
  steps: {
    ingestion: {
      title: "Data Ingestion",
      body: "Secure ingestion of fragmented data sources including legacy physical deeds, municipal CAD files, and satellite imagery via encrypted API pipelines.",
    },
    identification: {
      title: "Parcel Identification",
      body: "Spatial geometry extraction assigns unique immutable identifiers (UUIDs) to individual land parcels, creating a standardized grid reference system.",
    },
    reconciliation: {
      title: "Reconciliation Engine",
      body: "The core mechanism. Automated cross-referencing between spatial boundaries and legal ownership records to surface discrepancies, overlaps, or missing metadata.",
    },
    historical: {
      title: "Historical Analysis",
      body: "Deep-dive into archived mutation records to trace the lineage of ownership and establish an unbroken chain of title for contested parcels.",
    },
    aiInsights: {
      title: "AI Insights",
      body: "Predictive models flag potential encroachment risks and identify patterns of irregular transactions, prioritizing high-risk parcels for review.",
    },
    verification: {
      title: "Human Verification",
      body: "Certified municipal officers review flagged anomalies via the BHUNITI dashboard, utilizing high-res spatial overlays to make final adjudications.",
    },
    governance: {
      title: "Governance Integration",
      body: "The validated, undisputed record is pushed to the central institutional ledger, unlocking secure public access and enabling smart infrastructural planning.",
    },
  },
};

export default howItWorks;
