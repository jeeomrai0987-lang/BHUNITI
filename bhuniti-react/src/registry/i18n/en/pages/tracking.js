/** After submission — Registry Tracking. */
export default {
  empty: {
    badge: 'NOTHING SUBMITTED YET',
    title: 'No application to track',
    body:
      'This page follows an application once it has been submitted. Complete the review step and submit to see the live workflow here.',
    action: 'Go to review & submission',
  },

  badge: 'PROCESS COMPLETE',
  title: 'Digital Registry Submitted Successfully',
  lede:
    'Your application has been securely transmitted to the Regional Office and recorded in the BHUNITI ledger. A verification officer will review your documents shortly.',

  refIdLabel: 'Application reference ID',
  copyId: 'Copy the application reference ID',
  copied: 'Reference ID copied to the clipboard.',
  copyFailed: 'Could not reach the clipboard. Select the ID and copy it manually.',

  submittedLabel: 'Date of submission',
  entityLabel: 'Submitting entity',
  entityName: 'Rajesh Kumar',
  entityValue: '{{name}} (Citizen ID: {{id}})',
  parcelLabel: 'Associated parcel',

  print: 'Print acknowledgement',
  viewGis: 'View parcel on GIS',

  timeline: {
    heading: 'Application Tracking',
    subheading: 'Real-time status of workflow {{id}}',
    refreshed: 'Updated {{time}}',
    submittedTitle: 'Application submitted',
    submittedBody:
      'Data packet encrypted and stored in the central registry. Automated receipt generated.',
    verificationTitle: 'Document verification',
    verificationExpected: 'Expected: {{date}}',
    verificationBody:
      'Verification officer assessing KYC documents and initial parcel topology validity against historical records.',
    roTitle: 'Regional officer review',
    roBody:
      'Detailed scrutiny of boundary coordinates and historical encumbrances by the designated RO.',
    spatialTitle: 'Spatial reconciliation',
    spatialBody:
      'Automated GIS collision check against neighbouring parcels to ensure zero overlap.',
    finalTitle: 'Final approval & registry',
    finalBody: 'Issuance of the digital title deed and permanent block-ledger entry.',
  },

  recent: {
    heading: 'Recent Registries',
    listLabel: 'Recent registry applications',
    currentParcel: 'Parcel {{ulpin}}, {{village}}',
    firstParcel: 'Parcel MH-PUN-1104-C, Pune East',
    secondParcel: 'Parcel GJ-AHD-8821-B, Ahmedabad Central',
  },

  contextBody:
    'Spatial reconciliation involves precise GIS coordinate matching. This ensures your parcel boundaries are dispute-free upon final registry.',
  startNew: 'Start a new registry',
}
