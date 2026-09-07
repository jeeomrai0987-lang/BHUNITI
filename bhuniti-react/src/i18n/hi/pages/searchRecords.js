/*
 * Hindi strings for src/pages/citizen/SearchRecords.jsx -- the citizen record search.
 *
 * Reached from a component as t("pages.searchRecords....").
 */

const searchRecords = {
  search: {
    label: "भू-अभिलेख रजिस्ट्री में खोजें",
    placeholder: "यूएलपीआईएन, खसरा या भूमिस्वामी — उदा. 1024, 412/1, P-1026",
    tehsil: "तहसील:",
    village: "ग्राम:",
    submit: "अभिलेख खोजें",
  },

  view: {
    label: "परिणाम दृश्य",
    map: "संवादात्मक जीआईएस एवं 360° दृश्य",
    details: "खतौनी विवरण",
  },

  banner: {
    registry: "सजीव भू-अभिलेख रजिस्ट्री (उ.प्र. भूलेख से समकालित)",
    heading: "भूखंड {{parcel}} • ULPIN {{ulpin}}",
    summary:
      "खसरा {{khasra}} • भूमिस्वामी {{owner}} • ग्राम {{village}} • तहसील {{tehsil}}",
    open360: "360° भू-निरीक्षण",
  },

  record: {
    heading: "अधिकार-अभिलेख (प्रपत्र 7/12 एवं खतौनी)",
    parcelNumber: "भूखंड क्रमांक",
    khasraNumber: "खसरा संख्या",
    khataNumber: "खाता संख्या",
    landCategory: "भूमि श्रेणी",
    totalArea: "कुल क्षेत्रफल",
    areaWithBigha: "{{metric}} ({{customary}})",
    valuation: "सर्कल दर मूल्यांकन",
    encumbrance: "भार / वैधानिक स्थिति",
    encumbranceLender: "ऋणदाता: {{name}}",
    encumbranceCase: "प्रकरण {{number}}",
  },

  downloads: {
    heading: "शासकीय डाउनलोड",
    ror: "प्रपत्र 7/12 डाउनलोड करें (PDF)",
    rorQueued:
      "भूखंड {{parcel}} ({{ulpin}}) का सत्यापित अधिकार-अभिलेख तैयार किया जा रहा है।",
    map: "शजरा नक्शा डाउनलोड करें (GeoTIFF)",
    mapQueued: "भूखंड {{parcel}} का भू-संदर्भित शजरा नक्शा तैयार किया जा रहा है।",
  },
};

export default searchRecords;
