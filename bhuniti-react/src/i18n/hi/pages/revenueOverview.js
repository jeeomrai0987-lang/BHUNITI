/*
 * Hindi copy for src/pages/revenue/Overview.jsx.
 *
 * कार्रवाई के प्रकार तथा सभी स्थितियाँ domain.action_type, domain.stage_state
 * और domain.discrepancy_status से आती हैं, अतः यहाँ पुनः नहीं लिखी गईं।
 *
 * "दाखिल-खारिज" राजस्व विभाग में नामांतरण हेतु प्रचलित शब्द है; खसरा संख्या
 * common.fields.khasra से आती है।
 */

const revenueOverview = {
  breadcrumb: "अधिकारी डैशबोर्ड",
  title: "अधिकारी डैशबोर्ड",

  kpi: {
    heading: "जिला संकेतक",
    totalParcels: "कुल भूखंड",
    verifiedParcels: "सत्यापित भूखंड",
    pendingMutations: "लंबित नामांतरण",
    openDiscrepancies: "खुली विसंगतियाँ",
    highPriority: "उच्च प्राथमिकता प्रकरण",
    awaitingSurvey: "सर्वेक्षण प्रतीक्षित",
    immediateAction: "तत्काल कार्रवाई",
  },

  map: {
    heading: "भू-अभिलेख जीआईएस अवलोकन",
    source: "डीआईएलआरएमपी पोस्टजीआईएस परत",
    tehsil: "तहसील",
    village: "ग्राम",
    optionWithLocal: "{{name}} ({{local}})",
  },

  queue: {
    heading: "विसंगति प्रकरण",
    highPriorityCount: "{{count}} उच्च प्राथमिकता",
    viewAll: "सभी खुले प्रकरण देखें",
    caseRef: "प्रकरण {{parcel}} · {{khasra}} {{number}}",
    cardSummary: "{{ref}} — {{type}}, {{owner}}, {{place}}, {{when}}",
    place: "{{village}}, {{tehsil}}",
    notes: {
      areaMismatch:
        "दावाकृत {{claimed}} के सापेक्ष अभिलेखीय {{recorded}} — नामांतरण {{mutation}} के अंतर्गत {{difference}} की कमी दर्ज।",
      roadOverlap: "उत्तरी सीमा लोक मार्ग हेतु आरक्षित पट्टी से {{overlap}} अतिव्यापित है।",
      verified: "{{area}} कृषि भूमि, स्वामित्व निर्विवाद तथा सीमाएँ डीजीपीएस से सत्यापित।",
    },
  },

  activity: {
    heading: "हाल की गतिविधियाँ",
    exportCsv: "लॉग निर्यात करें",
    reference: "संदर्भ क्रमांक",
    type: "गतिविधि का प्रकार",
    details: "विवरण",
    caption: "इस क्षेत्राधिकार में दर्ज पिछली तीन कार्रवाइयाँ।",
    entries: {
      mutation: "यूएलपीआईएन {{ulpin}} हेतु स्वामित्व अंतरण अभिलेखित किया गया।",
      discrepancy:
        "स्वचालित मिलान में सर्वेक्षण {{survey}} ({{khasra}} {{number}}) पर क्षेत्रफल की भिन्नता पाई गई।",
      survey: "{{khasra}} {{number}} की सीमाओं के सत्यापन हेतु सर्वेक्षक {{officer}} आवंटित।",
    },
  },
};

export default revenueOverview;
