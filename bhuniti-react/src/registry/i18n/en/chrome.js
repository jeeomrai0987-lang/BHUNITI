/** Header, footer, primary navigation and the canonical six wizard steps. */
export default {
  nav: {
    label: 'Primary',
    toggle: 'Toggle navigation',
    parcel: 'Parcel Identification',
    owner: 'Owner & Party Details',
    transaction: 'Transaction Documents',
    review: 'Review & Submission',
    tracking: 'Registry Tracking',
  },

  header: {
    logoAlt: 'BHUNITI emblem',
    languageGroup: 'Select language',
    notifications: 'Notifications',
    userName: 'Rajesh Kumar',
    userId: 'Citizen ID: {{id}}',
    breadcrumbLabel: 'Breadcrumb',
    breadcrumbHome: 'Home',
    breadcrumbSection: 'Digital Registry',
  },

  footer: {
    linksLabel: 'Footer',
    tagline:
      'A Digital Land Governance Initiative by the Ministry of Rural Development, Government of India.',
    legalHeading: 'LEGAL',
    security: 'Security',
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    resourcesHeading: 'RESOURCES',
    faq: 'FAQ',
    manuals: 'Manuals',
    support: 'Support',
    copyright: '© {{year}} BHUNITI Portal. All rights reserved.',
    attributionLabel: 'Project attribution:',
    attributionValue: 'National Informatics Centre, GoI',
  },

  /**
   * One canonical vocabulary for the wizard. The horizontal stepper uses
   * `short`, the two page sidebars use `title`, and `hint` is the one-line
   * description shown under the active step.
   */
  steps: {
    listLabel: 'Registry progress',
    parcelLand: {
      short: 'PARCEL & LAND',
      title: 'Parcel & Land Details',
      hint: 'Locate the parcel and confirm it against the Record of Rights.',
    },
    parties: {
      short: 'PARTIES',
      title: 'Owner & Party Details',
      hint: 'Verify current ownership and register transferees.',
    },
    transaction: {
      short: 'TRANSACTION',
      title: 'Transaction Details',
      hint: 'Record the deed type, consideration value and date.',
    },
    documents: {
      short: 'DOCUMENTS',
      title: 'Document Upload',
      hint: 'Attach the deed, identity proof and encumbrance certificate.',
    },
    review: {
      short: 'REVIEW',
      title: 'Review',
      hint: 'Check every consolidated detail before submitting.',
    },
    submit: {
      short: 'SUBMIT',
      title: 'Submit',
      hint: 'Send the application to the sub-registrar office.',
    },
  },
}
