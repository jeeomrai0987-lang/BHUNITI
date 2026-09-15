/*
 * English strings for src/pages/main/Login.jsx -- unified Citizen / Officer OTP login.
 *
 * Reached from a component as t("pages.login....").
 */

const login = {
  hero: {
    badge: "National Infrastructure Initiative",
    heading: "Building a Trusted Digital Foundation for {{highlight}}",
    headingHighlight: "Land Governance",
    lede:
      "BHUNITI integrates land records, GIS, registration, mutation and historical data into one intelligent, parcel-centric governance platform.",
    access: "Access BHUNITI",
    howItWorks: "Explore How It Works",
    traits: {
      integrated: "Integrated",
      gis: "GIS-enabled",
      ai: "AI-assisted",
      auditable: "Auditable",
    },
  },

  modal: {
    citizenTitle: "Citizen Portal Access",
    citizenSubtitle: "Access land records, applications & services",
    officerTitle: "Officer Portal Access",
    officerSubtitle: "Secure role-based authentication & OTP verification",
    otpTitle: "Verify One-Time Password",
    otpSubtitle: "Multi-factor authentication",
    footer: "Secure Gov-ID access • 256-bit TLS encrypted",
  },

  tabs: {
    citizen: "Citizen",
    officer: "Officer Login",
  },

  steps: {
    label: "Sign-in progress",
    credentials: "1. Credentials",
    otp: "2. OTP",
  },

  identifierMode: {
    username: "Username",
    email: "Email",
    mobile: "Mobile",
  },

  roles: {
    revenueOfficer: "Revenue Officer",
    districtOfficer: "District Officer / Admin",
  },

  identity: {
    username: "Official username",
    usernamePlaceholder: "e.g. citizen",
    email: "Registered email",
    emailPlaceholder: "e.g. name@bhuniti.gov.in",
    mobile: "Registered mobile",
    mobilePlaceholder: "e.g. 9812345678",
    password: "Password",
    passwordPlaceholder: "Enter password",
    roleSelectLabel: "Designated Role",
    submitCitizen: "Sign In to Portal",
    submitOfficer: "Send Verification OTP",
    loggingIn: "Signing in…",
    sendingOtp: "Sending OTP…",
  },

  otp: {
    verifiedFor: "Authentication initiated for",
    sentTo: "A 6-digit verification code has been sent to",
    label: "Enter 6-digit OTP",
    submit: "Verify OTP & Launch Portal",
    verifying: "Verifying…",
    back: "← Change credentials",
    resend: "Resend OTP",
    resendCooldown: "Resend OTP in {{seconds}}s",
    resendSuccess: "A new OTP has been sent successfully.",
  },

  signupPrompt: "New Citizen?",
  signupLink: "Register with Aadhaar & Mobile",

  forcePasswordChange: {
    badge: "First-Time Security Activation",
    title: "Set Your New Password",
    subtitle: "Your account requires a permanent password change before accessing the portal.",
    currentPassword: "Temporary / Current Password",
    currentPasswordPlaceholder: "Enter temporary password",
    newPassword: "New Password (min 8 characters)",
    newPasswordPlaceholder: "Enter new secure password",
    confirmPassword: "Confirm New Password",
    confirmPasswordPlaceholder: "Re-enter new password",
    submit: "Update Password & Continue",
    submitting: "Updating Password…",
  },

  errors: {
    incomplete: "Please enter your identifier and password.",
    invalidEmail: "Please enter a valid email address.",
    invalidMobile: "Please enter a valid 10-digit mobile number.",
    otpIncomplete: "Please enter the 6-digit OTP code.",
    invalidCredentials: "Invalid identifier or password.",
    otpInvalid: "Invalid or expired OTP code.",
    newPasswordShort: "New password must be at least 8 characters long.",
    passwordsMismatch: "New passwords do not match.",
    passwordChangeFailed: "Password update failed. Please verify your temporary password.",
  },
};

export default login;
