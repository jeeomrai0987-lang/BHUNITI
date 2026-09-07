/*
 * English strings for src/pages/main/Governance.jsx -- the RBAC / governance
 * model explainer.
 *
 * Reached from a component as t("pages.governance....").
 */

const governance = {
  hero: {
    // The heading prints on two lines, so it travels as two strings.
    titleLead: "Institutional intelligence:",
    titleMain: "The BHUNITI governance model",
    lede:
      "A structured, multi-tier governance framework built for precision, accountability and transparency in land administration, resting on a rigorous role-based access control (RBAC) foundation aligned with national digital infrastructure goals.",
  },

  sections: {
    tiers: "01 / Operational tiers",
    trust: "02 / Architecture of trust",
    alignment: "03 / Strategic alignment",
  },

  capabilities: "Capabilities",

  tiers: {
    citizen: {
      name: "Citizen",
      summary:
        "The public access layer, focused on transparency and service delivery. Citizens view non-sensitive land records, raise service requests and track application status.",
      first: "View records",
      second: "Submit requests",
    },
    revenue: {
      name: "Revenue Officer",
      summary:
        "Front-line operators responsible for data collection, first verification and local GIS mapping. They process citizen requests and keep ground-level intelligence current.",
      first: "Data entry & editing",
      second: "Field verification",
    },
    district: {
      name: "District Officer",
      summary:
        "The supervisory layer: oversight, dispute resolution and approval of significant structural changes to regional land records, with protocol compliance assured.",
      first: "Approve changes",
      second: "Dispute override",
    },
    administration: {
      name: "Administration",
      summary:
        "State and national oversight, concerned with macro-analytics, policy implementation, system-wide audits and the global parameters of the RBAC system.",
      first: "System configuration",
      second: "Global analytics",
    },
  },

  rbac: {
    heading: "Role-based access control (RBAC)",
    body:
      "Accountability is built into BHUNITI. Every action — from viewing a public registry entry to altering geospatial coordinates — is logged, timestamped and constrained by a cryptographic RBAC matrix.",
    detail:
      "The decision tree ensures that a lower-tier modification cannot enter the definitive ledger without explicit, traceable approval from a higher oversight tier, producing a self-auditing system that resists unauthorised manipulation.",
    // The flow diagram was an unlabelled <svg>; this is its accessible name,
    // and the five node captions follow.
    diagramLabel: "Approval flow: a change is initiated, verified against GIS and checked legally, then approved and committed to the ledger.",
    nodes: {
      initiate: "Initiate",
      verifyGis: "Verify GIS",
      legalCheck: "Legal check",
      approve: "Approve",
      commit: "Commit",
    },
  },

  alignment: {
    badge: "Digital India initiative",
    imageHeading: "Modernising national infrastructure",
    dilrmp: {
      heading: "DILRMP compliance",
      body:
        "BHUNITI is engineered to support the Digital India Land Records Modernisation Programme (DILRMP) directly. Digitising spatial and textual data into one secure ledger removes the silos, and the litigation, inherent in legacy paper-based systems.",
    },
    sovereignty: {
      heading: "Data sovereignty",
      body:
        "All geospatial data and citizen records are held in domestically hosted, government-approved cloud infrastructure, in strict adherence to national data localisation and sovereignty mandates.",
    },
    transparency: {
      heading: "Transparent governance",
      body:
        "By exposing an immutable audit trail of every land transaction and mapping alteration, BHUNITI supports zero-trust verification and narrows the trust gap between administrative bodies and the citizen.",
    },
  },
};

export default governance;
