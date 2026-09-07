/** Steps 5 & 6 — Review & Submission. */
export default {
  eyebrow: 'PROCESS',
  stepRange: 'Steps 5 & 6',
  title: 'Review & Submission',
  lede:
    'Verify the consolidated details of your digital registry application before final submission to the sub-registrar office.',

  parcelCard: {
    title: 'Parcel Information',
    subtitle: 'Location and physical attributes',
    ulpin: 'ULPIN (Bhu-Aadhaar)',
    stateDistrict: 'State / district',
    talukaVillage: 'Taluka / village',
    surveyPlot: 'Survey / gat no.',
    totalArea: 'Total area',
    landUse: 'Land use',
    landUseValue: '{{purpose}} (Class I)',
    gisVerified: 'GIS boundary verified',
    gisOpen: 'Open the GIS map for this parcel',
  },

  partiesCard: {
    title: 'Parties Involved',
    subtitle: 'Executant and claimant details',
    executant: 'Executant (seller)',
    claimant: 'Claimant (buyer)',
    sellerName: 'Rajaram Bhonsle',
    buyerSampleName: 'Priya Deshmukh',
    aadhaarLine: 'Aadhaar: {{value}}',
    ekyc: 'e-KYC VERIFIED',
  },

  feesCard: {
    title: 'Transaction & Fees',
    subtitle: 'Consideration value and stamp duty',
    deedType: 'Deed type',
    deedTypeValue: '{{deed}} ({{purpose}})',
    consideration: 'Consideration value',
    marketValue: 'Market value (ready reckoner)',
    heading: 'Fee calculation',
    stampDuty: 'Stamp duty ({{rate}})',
    registration: 'Registration fee ({{rate}})',
    cess: 'Cess / surcharge ({{rate}})',
    total: 'Total amount payable',
    paymentVerified: 'Payment verified (GRN: {{grn}})',
  },

  documentsCard: {
    title: 'Uploaded Documents',
    subtitle: 'Annexures and proofs',
    deedName: 'Draft_Sale_Deed_v2.pdf',
    deedMeta: '{{size}} • digitally signed',
    extractName: '7_12_Extract_Recent.pdf',
    extractMeta: '{{size}} • system fetched',
    nocName: 'NOC_Collector.pdf',
    nocMeta: '{{size}} • uploaded',
  },

  reconciliation: {
    title: 'Data Reconciliation',
    ulpinTitle: 'ULPIN validated',
    ulpinDetail: 'Matches central geospatial database',
    rorTitle: 'Record of Rights (RoR) synced',
    rorDetail: 'Ownership details match state records',
    encumbranceTitle: 'No encumbrances found',
    encumbranceDetail: 'CERSAI and local courts cleared',
    systemStatusLabel: 'System status',
    systemStatusValue: 'Ready for verification',
    systemStatusIcon: 'All reconciliation checks passed',
  },

  declaration:
    'I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that providing false information is an offence under the law.',
  submitButton: 'Submit digital registry',
  /** Explains the disabled state of the submit button, which was silent before. */
  submitBlocked: 'Accept the declaration above to enable submission.',
  forwardedTo: 'The application will be forwarded to Sub-Registrar Office, Haveli-II.',
  backToTransaction: 'Back to transaction & documents',
}
