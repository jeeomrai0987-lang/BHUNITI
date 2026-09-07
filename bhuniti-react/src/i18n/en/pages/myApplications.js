/*
 * Citizen Portal -> My Applications (src/pages/citizen/MyApplications.jsx).
 *
 * Application detail view: progress timeline, the action-required banner and
 * the assigned revenue office.
 */

const myApplications = {
  title: "Application Details",
  idLabel: "ID: {{id}}",
  applicant: "Applicant",

  actionRequired: {
    heading: "Action Required",
    surveyScheduled:
      "A field survey has been scheduled for {{date}}. Please ensure access to the parcel.",
    confirmAvailability: "Confirm Availability",
    recording: "Recording…",
    confirmed: "Availability confirmed. The field surveyor has been notified.",
  },

  progress: {
    heading: "Application Progress",
  },

  evidence: {
    heading: "Attached Evidence",
    saleDeed: "Registered Sale Deed",
    saleDeedMeta: "Deed #{{number}} • {{status}}",
    boundaryMap: "Cadastral Boundary Map",
  },

  office: {
    heading: "Assigned Office",
    officer: "Officer",
    officerValue: "Suresh Verma (Revenue Inspector)",
    contact: "Contact",
  },
};

export default myApplications;
