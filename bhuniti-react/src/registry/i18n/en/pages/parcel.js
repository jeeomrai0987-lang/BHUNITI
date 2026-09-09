/** Step 1 — Parcel Identification. */
export default {
  title: 'Create Digital Registry',
  lede:
    'Securely record property transactions on the national blockchain. Ensure all parcel details match the Record of Rights (RoR).',

  sectionTitle: 'Parcel Identification',

  ulpinLabel: 'UNIQUE LAND PARCEL IDENTIFICATION NUMBER (ULPIN)',
  ulpinPlaceholder: 'e.g. 12345678901234',
  searchErrorEmpty: 'Enter a ULPIN before searching.',

  stateLabel: 'STATE',
  districtLabel: 'DISTRICT',
  tehsilLabel: 'TEHSIL',
  villageLabel: 'VILLAGE',
  surveyLabel: 'SURVEY / KHASRA NO.',
  plotLabel: 'PLOT NO.',
  rorLabel: 'ROR REF NO.',

  /**
   * Place names are translated for display only — the stored value stays the
   * canonical English string, so switching language never rewrites the record.
   */
  places: {
    Maharashtra: 'Maharashtra',
    Gujarat: 'Gujarat',
    Karnataka: 'Karnataka',
    Pune: 'Pune',
    Mumbai: 'Mumbai',
    Nagpur: 'Nagpur',
    Haveli: 'Haveli',
    Khed: 'Khed',
  },

  selected: {
    eyebrow: 'SELECTED PARCEL DETAILS',
    heading: 'P-{{survey}} / {{village}}',
    areaLabel: 'AREA',
    landUseLabel: 'LAND USE',
    encumbranceLabel: 'ENCUMBRANCE',
    encumbranceNone: 'None',
    ownerLabel: 'OWNER',
    ownerValue: 'R. Kumar (partial)',
  },

  continueToParties: 'CONTINUE TO PARTIES',
}
