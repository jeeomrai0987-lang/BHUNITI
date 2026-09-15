/*
 * English copy for src/pages/admin/AdminAddOfficer.jsx -- Provisioning Revenue Officers.
 * Reached as t("pages.adminAddOfficer....").
 */

const adminAddOfficer = {
  badge: "District Administration",
  heading: "Provision New {{highlight}} Account",
  headingHighlight: "Revenue Officer",
  subheading:
    "Securely onboard Revenue Officers for designated tehsils. Temporary credentials are auto-generated, emailed securely, and require a mandatory password reset upon first login.",
  form: {
    sectionPersonal: "Officer Personal & Contact Details",
    sectionPosting: "Jurisdiction & Posting",
    sectionGovId: "Government Identity Verification",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Vikram Singh",
    username: "Official Username",
    usernamePlaceholder: "e.g. ro_modinagar_01",
    email: "Official Email Address",
    emailPlaceholder: "e.g. ro.modinagar@bhuniti.gov.in",
    phone: "Contact Mobile Number",
    phonePlaceholder: "10-digit official contact",
    designation: "Designation",
    district: "Assigned District",
    tehsil: "Assigned Tehsil",
    govIdType: "Government ID Type",
    govIdNumber: "Government ID Number",
    govIdPlaceholder: "e.g. EMP-998812 or Aadhaar / PAN",
    govIdPrivacyNote: "Government ID references are salted & hashed (SHA-256) at rest. Only the last 4 digits are retained in the database audit log.",
    submit: "Provision Officer & Send Credentials",
    submitting: "Provisioning Account…",
  },
  modal: {
    title: "Officer Account Provisioned Successfully",
    subtitle: "The officer account is created in 'pending' status awaiting first-login password activation.",
    officerDetails: "Account Summary",
    name: "Name",
    username: "Username",
    email: "Email",
    jurisdiction: "Jurisdiction",
    govId: "Government ID",
    notice: "A secure temporary password was dispatched to the officer's email. On initial sign-in, the system will enforce a mandatory password change before granting portal access.",
    done: "Done & Return to Overview",
    addAnother: "Provision Another Officer",
  },
  errors: {
    incomplete: "Please fill in all mandatory fields.",
    emailInvalid: "Please enter a valid official email address.",
    phoneInvalid: "Please enter a valid 10-digit mobile number.",
  },
};

export default adminAddOfficer;
