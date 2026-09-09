/*
 * English strings for src/pages/main/Login.jsx -- the unified login.
 *
 * Reached from a component as t("pages.login....").
 */

const login = {
  hero: {
    badge: "National Infrastructure Initiative",
    // The second half of the heading is printed in the accent colour, so it
    // travels as a placeholder rather than as markup inside the sentence.
    heading: "Building a Trusted Digital Foundation for {{highlight}}",
    headingHighlight: "Land Governance",
    lede:
      "BHUNITI integrates land records, GIS, registration, mutation and historical data into one intelligent, parcel-centric governance platform.",
    access: "Access BHUNITI",
    howItWorks: "Explore How It Works",
    // The four-word trust strip under the hero buttons.
    traits: {
      integrated: "Integrated",
      gis: "GIS-enabled",
      ai: "AI-assisted",
      auditable: "Auditable",
    },
  },

  modal: {
    identityTitle: "Secure Access to BHUNITI",
    identitySubtitle: "Identity verification & RBAC access",
    otpTitle: "Verify One-Time Password",
    otpSubtitle: "Multi-factor authentication",
    footer: "Secure Gov-ID access • 256-bit TLS encrypted",
  },

  steps: {
    label: "Sign-in progress",
    identity: "1. Identity",
    otp: "2. OTP",
  },

  demo: {
    label: "Demo:",
    // The three quick-fill chips announce which role they load.
    fill: "Fill the demo credentials for {{role}}",
  },

  identity: {
    username: "Official username",
    usernamePlaceholder: "e.g. citizen",
    email: "Registered email ID",
    emailPlaceholder: "e.g. citizen@bhuniti.gov.in",
    mobile: "Registered mobile number",
    mobilePlaceholder: "10-digit mobile number",
    // The +91 prefix sits in its own box; it needs a name of its own so the
    // number field is not announced as starting mid-sentence.
    countryCode: "Country code +91",
    submit: "Send Verification OTP",
  },

  otp: {
    verifiedFor: "Identity verified for",
    sentTo: "A 6-digit verification code has been sent to",
    maskedMobile: "+91 ******{{last4}}",
    label: "Enter 6-digit OTP",
    demoHeading: "Demo mode",
    demoHint: "Use OTP: {{otp}}",
    submit: "Verify OTP & Launch Portal",
    verifying: "Verifying…",
    back: "← Change identity details",
  },

  errors: {
    // Kept as validation copy only -- the demo credential check itself is
    // unchanged.
    incomplete: "Please enter your username, email ID and mobile number.",
    email: "Please enter a valid email address.",
    mobile: "Please enter a valid 10-digit mobile number.",
    noMatch: "The username, email ID and mobile number do not match our records.",
    otp: "Invalid OTP. Please enter the correct 6-digit OTP.",
  },
};

export default login;
