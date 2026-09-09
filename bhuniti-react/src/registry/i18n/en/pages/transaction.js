/** Steps 3 & 4 — Transaction Details and Document Upload. */
export default {
  title: 'Digital Registry Application',
  subtitle: 'Steps 3 & 4: transaction details & document upload',

  help: {
    heading: 'Need help?',
    bodyLead: 'Refer to the',
    linkLabel: 'guidelines for document upload',
    bodyTrail: 'to ensure your files meet the required standards for verification.',
  },

  step3Heading: 'Transaction Details',

  typeLabel: 'Transaction type',
  typePlaceholder: 'Select transaction type',
  types: {
    sale: 'Sale deed',
    gift: 'Gift deed',
    lease: 'Lease agreement',
    mortgage: 'Mortgage',
  },

  valueLabel: 'Transaction value (₹)',
  valuePlaceholder: '0.00',
  dateLabel: 'Date of transaction',
  purposeLabel: 'Purpose of transaction',
  purposePlaceholder: 'Select purpose',
  remarksLabel: 'Remarks / additional information',
  remarksPlaceholder: 'Enter any relevant remarks…',

  summary: {
    eyebrow: 'TRANSACTION SUMMARY',
    heading: '{{type}} — {{purpose}}',
    propertyLabel: 'Property ID:',
    valueLabel: 'Value:',
    dutyLabel: 'ESTIMATED STAMP DUTY',
  },

  step4Heading: 'Required Documents',
  step4Lede:
    'Upload clear, legible copies of the following documents in PDF, JPG or PNG format. Maximum file size: 5 MB per document.',
  step4LockedNote: 'Unlock document upload to attach files.',

  docs: {
    saleDeedName: 'Sale deed document',
    saleDeedMeta: 'Draft or finalised copy',
    identityName: 'Identity proof (Aadhaar / PAN)',
    identityMeta: 'rajesh_aadhaar_card.pdf ({{size}})',
    identityUploading: 'Uploading… {{percent}}',
    encumbranceName: 'Encumbrance certificate',
    encumbranceMeta: 'EC_2023_DL_S_9842.pdf ({{size}})',
    cancelUpload: 'Cancel upload',
    attachedMeta: '{{size}} · attached',
  },

  dropzone: {
    heading: 'Drag & drop additional documents here',
    hint: 'or activate to browse from your computer',
    optional: 'NOC, POWER OF ATTORNEY, ETC. (OPTIONAL)',
  },

  unlock: 'Unlock document upload',
  continueToReview: 'Continue to review',
}
