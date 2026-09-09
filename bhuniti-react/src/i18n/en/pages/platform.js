/*
 * English strings for src/pages/main/Platform.jsx -- the public architecture
 * page and the two-step access modal that guards each module link.
 *
 * The four module titles used to double as lookup keys for the per-role route
 * table, which meant translating a title would have broken navigation. The page
 * now keys that table on stable ids (gis, registry, ai, audit) and the titles
 * below are free to change in any language.
 *
 * Figures quoted in the interoperability panels arrive as placeholders so the
 * numerals follow the active locale, and the demo credentials themselves stay
 * in the component: they are login data, not copy.
 *
 * Reached from a component as t("pages.platform....").
 */

const platform = {
  hero: {
    eyebrow: "System Architecture",
    title: "Institutional Intelligence for National Land Administration.",
    body: "The BHUNITI platform unifies fragmented land administration into a cohesive, interoperable ecosystem. By integrating high-precision GIS with immutable ledger technology, we establish a single source of truth for property rights, spatial planning and civic administration.",
    specs: "View Technical Specs",
    devPortal: "Access Developer Portal",
  },

  orb: {
    heading: "Live Ecosystem Flow",
    sync: "Sync active",
    // The schematic itself is decorative; this sentence is what a screen reader
    // announces in its place.
    diagram:
      "Schematic of the platform core exchanging data with the GIS, AI, ledger and registry services.",
  },

  modules: {
    eyebrow: "Infrastructure Overview",
    heading: "Integrated Modules for Comprehensive Governance",
    note: "Each module operates independently while maintaining strict synchronicity with the central platform ledger.",
    view: "View Module",
    // Four identical "View Module" buttons need four distinct accessible names.
    viewNamed: "View the {{module}} module",

    // Digital Registry goes straight to the wizard instead of the demo
    // sign-in, so its button says what actually happens.
    open: "Open Registry",
    openNamed: "Open the {{module}}",

    gis: {
      title: "High-Precision GIS",
      body: "Sub-metre accuracy spatial data mapping overlapping cadastral boundaries, infrastructure networks and environmental constraints in real time.",
      imageAlt: "Aerial view of surveyed farmland with visible parcel boundaries",
    },
    registry: {
      title: "Digital Registry",
      body: "Digitised property records linked directly to spatial identifiers, eliminating ambiguity in ownership.",
    },
    ai: {
      title: "AI Dispute Resolution",
      body: "Machine learning models analyse historical land records to flag anomalies and predict potential boundary disputes before registration.",
    },
    audit: {
      title: "Immutable Audit Trail",
      body: "Every transaction, modification and query is logged on a distributed ledger, ensuring cryptographic proof of provenance and absolute data integrity.",
      blockHash: "Block hash",
      confirmations: "{{value}} confirmed",
    },
  },

  interop: {
    index: "01",
    heading: "Seamless Interoperability with State Systems",
    body: "Designed for the Indian administrative context, BHUNITI provides standardised RESTful APIs and spatial data services (WMS/WFS) conforming to OGC standards. This allows immediate integration with existing state revenue department portals, municipal databases and central infrastructural planning tools without disrupting legacy workflows.",
    endpoint: "API endpoint",
    method: "GET",
    uptime: "{{value}} uptime",
    formats: "JSON / GeoJSON",
  },

  scale: {
    index: "02",
    heading: "Elastic Scalability for a Subcontinent",
    body: "Built on a containerised microservices architecture deployed across geographically redundant government cloud nodes. The platform scales dynamically to handle millions of simultaneous queries during peak administrative periods, ensuring low-latency access to heavy vector and raster spatial datasets regardless of user location.",
    latencyValue: "~{{value}} ms",
    latency: "Avg Query Latency",
    parcelsValue: "{{value}} billion+",
    parcels: "Parcels Indexable",
  },

  cta: {
    heading: "Ready to explore the platform?",
    body: "Access technical documentation or request sandbox access.",
    docs: "Documentation",
  },

  modal: {
    accessTitle: "Access {{module}}",
    accessSubtitle: "Identity verification and role-based access",
    otpTitle: "Verify One-Time Password",
    otpSubtitle: "Multi-factor authentication",
    stepIdentity: "1. Identity",
    stepOtp: "2. OTP",
    progress: "Step {{step}} of {{total}}",
    demo: "Demo:",
    quickFill: "Fill in the demo details for {{role}}",
    username: "Official Username",
    usernameHint: "e.g. citizen or revenue_officer",
    email: "Registered Email ID",
    emailHint: "e.g. revenue@bhuniti.gov.in",
    mobile: "Registered Mobile Number",
    mobileHint: "10-digit mobile number",
    countryCode: "+91",
    send: "Send Verification OTP",
    verifiedFor: "Identity verified for",
    sentTo: "A 6-digit verification code has been sent to",
    maskedMobile: "+91 ******{{last4}}",
    otpLabel: "Enter 6-Digit OTP",
    demoMode: "Demo mode",
    // The demo OTP is printed on screen on purpose: this build has no SMS gateway.
    demoOtp: "Use OTP {{otp}}",
    verifying: "Verifying…",
    launch: "Verify OTP and open {{module}}",
    changeIdentity: "Change identity details",
    footer: "Secure Gov-ID access • 256-bit TLS encrypted",
    errors: {
      missing: "Please enter your username, email ID and mobile number.",
      email: "Please enter a valid email address.",
      mobile: "Please enter a valid 10-digit mobile number.",
      noMatch: "The username, email ID and mobile number do not match our records.",
      otp: "Invalid OTP. Please enter the correct 6-digit OTP.",
    },
  },
};

export default platform;
