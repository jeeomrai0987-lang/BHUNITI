/*
 * English strings for src/pages/citizen/SearchRecords.jsx -- the citizen record search.
 *
 * Reached from a component as t("pages.searchRecords....").
 */

const searchRecords = {
  search: {
    // The input had a placeholder and no label, so it announced itself as
    // nothing at all; this is the sr-only label that fixes that.
    label: "Search the cadastral registry",
    placeholder: "ULPIN, khasra or owner — e.g. 1024, 412/1, P-1026",
    // The two dropdowns keep their visible caption, which is now a real
    // <label>, hence the colon lives in the string.
    tehsil: "Tehsil:",
    village: "Village:",
    submit: "Search records",
  },

  view: {
    label: "Result view",
    map: "Interactive GIS & 360° view",
    details: "RoR certificate details",
  },

  banner: {
    registry: "Live cadastral registry (UP Bhulekh synchronised)",
    heading: "Parcel {{parcel}} • ULPIN {{ulpin}}",
    summary:
      "Khasra {{khasra}} • Owner {{owner}} • Village {{village}} • Tehsil {{tehsil}}",
    open360: "360° ground inspection",
  },

  record: {
    heading: "Record of rights (Form 7/12 and khatauni)",
    parcelNumber: "Parcel number",
    khasraNumber: "Khasra number",
    khataNumber: "Khata number",
    landCategory: "Land category",
    totalArea: "Total area",
    // Metric first, the customary bigha figure in brackets, as the khatauni
    // itself prints it.
    areaWithBigha: "{{metric}} ({{customary}})",
    valuation: "Circle valuation",
    encumbrance: "Encumbrance / legal status",
    // The fixture used to fold the lender into the status value itself
    // ("Mortgaged (SBI Agri-Infra)"), which no vocabulary could translate.
    encumbranceLender: "Lender: {{name}}",
    encumbranceCase: "Case {{number}}",
  },

  downloads: {
    heading: "Official downloads",
    ror: "Download Form 7/12 (PDF)",
    // Nothing is generated in the demo, so the button says what it would do.
    rorQueued:
      "Preparing the verified record of rights for parcel {{parcel}} ({{ulpin}}).",
    map: "Download cadastral map (GeoTIFF)",
    mapQueued: "Preparing the geo-referenced cadastral map for parcel {{parcel}}.",
  },
};

export default searchRecords;
