/*
 * Hindi copy for the Revenue Officer reconciliation screen
 * (/revenue-officer/data-reconciliation).
 *
 * अभिलेख शब्द राजस्व विभाग की भाषा में "Record of Rights" के लिए प्रयुक्त है;
 * खतौनी उसका पारंपरिक नाम है, इसलिए स्तंभ शीर्षक में दोनों दिए गए हैं।
 */

const dataReconciliation = {
  breadcrumb: {
    system: "प्रणाली",
    current: "मिलान",
  },
  title: "भूखंड आंकड़ा मिलान",
  intro:
    "{{ulpin}} के लिए भू-अभिलेख, जीआईएस, रजिस्ट्री और सर्वेक्षण में दर्ज सूचना की तुलना करें।",
  ulpinChip: "ULPIN: {{id}}",

  actions: {
    requestSurvey: "क्षेत्रीय सर्वेक्षण का अनुरोध करें",
    createCase: "प्रकरण दर्ज करें",
    viewEvidence: "साक्ष्य देखें",
  },

  comparison: {
    heading: "बहु-स्रोत तुलना",
    mismatchCount_one: "{{count}} अंतर पाया गया",
    mismatchCount_other: "{{count}} अंतर पाए गए",
    columns: {
      attribute: "विशेषता",
      landRecord: "भू-अभिलेख (खतौनी)",
      gis: "जीआईएस",
      registration: "रजिस्ट्री",
      survey: "सर्वेक्षण",
    },
    attributes: {
      primaryOwner: "मुख्य खातेदार",
      totalArea: "कुल क्षेत्रफल",
      boundaryCoordinates: "सीमा निर्देशांक",
    },
    values: {
      notAvailable: "उपलब्ध नहीं",
      referText: "पाठ देखें",
      validGeometry: "वैध ज्यामिति",
    },
    status: {
      match: "मेल",
      mismatch: "अंतर",
      verified: "सत्यापित",
    },
  },

  map: {
    caption: "मिलान के अंतर्गत भूखंड का नक्शा",
    zoomIn: "बड़ा करें",
    zoomOut: "छोटा करें",
    layers: "परतें बदलें",
    gisBoundary: "जीआईएस सीमा",
    rorBoundary: "अभिलेख सीमा",
  },

  ai: {
    heading: "एआई-सहायित विश्लेषण",
    finding:
      "विसंगति चिह्नित: जीआईएस से गणना किया गया क्षेत्रफल ({{gis}}) भू-अभिलेख में दर्ज क्षेत्रफल ({{ror}}) से {{delta}} अधिक है।",
    historicalHeading: "ऐतिहासिक संदर्भ",
    historical:
      "सन् 1998 के भौतिक सर्वेक्षण में इस भूखंड का क्षेत्रफल {{area}} दर्ज था, जो वर्तमान जीआईएस ज्यामिति के निकट है।",
    ruleHeading: "नियमानुसार व्यवस्था",
    rule:
      "5% से अधिक क्षेत्रफल अंतर की दशा में नामांतरण अथवा दाखिल-खारिज से पूर्व भौतिक पुनः सर्वेक्षण अनिवार्य है।",
    confidence: "विश्वसनीयता अंक",
  },

  metadata: {
    heading: "भूखंड अधिविवरण",
    subDistrict: "उप-जिला",
    subDistrictValue: "उत्तरी खंड अ",
    villageCode: "ग्राम कोड",
    dataSource: "आंकड़ा स्रोत",
    dataSourceValue: "एनआईसी लैंडग्रिड एपीआई",
  },
};

export default dataReconciliation;
