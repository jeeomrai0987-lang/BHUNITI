/** Step 2 — Owner & Party Details. */
export default {
  asideHeading: 'Digital Registry',
  transactionIdLabel: 'Transaction ID:',

  propertyContextLabel: 'PROPERTY CONTEXT',
  propertyContextAction: 'Back to parcel identification',
  parcelIdLine: 'Parcel ID: {{survey}}/{{plot}} {{village}}',

  currentOwner: {
    heading: 'Current Registered Owner',
    verifiedBadge: 'VERIFIED VIA AADHAAR',
    shareChartLabel: 'Primary owner holds {{share}} percent',
    primaryOwner: 'PRIMARY OWNER',
    soleOwner: 'SOLE OWNER',
    fullNameLabel: 'FULL NAME',
    parentageLabel: 'PARENTAGE',
    dobLabel: 'DATE OF BIRTH',
    mobileLabel: 'MOBILE NUMBER',
    emailLabel: 'EMAIL ADDRESS',
    govtIdLabel: 'GOVT ID (AADHAAR)',
    addressLabel: 'REGISTERED ADDRESS',
    name: 'Rajesh Kumar',
    parentage: 'S/O Suresh Kumar',
    dob: '14-Aug-1975',
    address: '142, Block C, Vasant Vihar, New Delhi, 110057',
  },

  coOwner: {
    nameLabel: 'Co-owner {{n}} — full name',
    namePlaceholder: 'e.g. Sunita Kumar',
    shareLabel: 'Share %',
    remove: 'Remove co-owner {{n}}',
    add: 'Add co-owner',
    overAllocated:
      'Co-owner shares total {{total}}%. Reduce them to 100% or less before continuing.',
  },

  transferee: {
    heading: 'New Owner / Transferee',
    lede: 'Enter the details of the individual or entity acquiring the property.',
    nameLabel: 'Full name (as per govt ID)',
    namePlaceholder: 'e.g. Anita Sharma',
    parentLabel: 'Parentage / spouse name',
    parentPlaceholder: 'e.g. D/O Ramesh Sharma',
    mobileLabel: 'Mobile number',
    mobilePlaceholder: '98765 43210',
    emailLabel: 'Email address',
    emailPlaceholder: 'anita.sharma@example.com',
    addressLabel: 'Permanent address',
    addressPlaceholder: 'Enter complete address…',
    idTypeLabel: 'Govt ID type',
    idTypePlaceholder: 'Select ID document',
    idNumberLabel: 'Govt ID number',
    idNumberPlaceholder: 'Enter ID number',
    idTypes: {
      aadhaar: 'Aadhaar card',
      pan: 'PAN card',
      voter: 'Voter ID',
      passport: 'Passport',
    },
  },

  parties: {
    nameLabel: 'Additional party {{n}} — name',
    namePlaceholder: 'e.g. Vikram Rao',
    roleLabel: 'Role',
    remove: 'Remove additional party {{n}}',
    add: 'Add additional party',
    roles: {
      witness: 'Witness',
      poa: 'Power of attorney',
      guardian: 'Guardian',
      confirming: 'Confirming party',
    },
  },

  continueToTransaction: 'CONTINUE TO TRANSACTION',
}
