/*
 * Hindi copy for the district dashboard (/administration).
 *
 * "दाखिल-खारिज" राजस्व विभाग में mutation का प्रचलित नाम है; "उप-निबंधक कार्यालय"
 * Sub-Registrar Office के लिए। तहसीलों के नाम common.place.tehsils से आते हैं।
 */

const adminOverview = {
  badge: "कमान केंद्र — सजीव क्लाउड समकालन",
  title: "जिला भू-शासन कमान केंद्र",
  intro: "जिले भर की निगरानी, आंकड़ा गुणवत्ता तथा भू-प्रशासन का समग्र विवरण",

  actions: {
    exportReport: "प्रतिवेदन निर्यात करें",
    forceSync: "तत्काल समकालन करें",
  },

  kpi: {
    totalParcels: "कुल भूखंड",
    verifiedParcels: "सत्यापित भूखंड",
    openDiscrepancies: "लंबित विसंगतियाँ",
    highPriority: "{{count}} उच्च प्राथमिकता",
    pendingMutations: "लंबित दाखिल-खारिज",
    fieldSurveys_one: "{{count}} क्षेत्रीय सर्वेक्षण",
    fieldSurveys_other: "{{count}} क्षेत्रीय सर्वेक्षण",
  },

  map: {
    heading: "विसंगति संकेंद्रण",
    subheading: "तात्कालिक भू-स्थानिक मिलान आंकड़े",
    caption: "जिले का उपग्रह दृश्य, विसंगति संकेंद्रण सहित",
    layers: {
      heatmap: "ऊष्मा-चित्र",
      parcels: "भूखंड",
      satellite: "उपग्रह",
    },
    zoomIn: "बड़ा करें",
    zoomOut: "छोटा करें",
    recentre: "जिले पर केंद्रित करें",
    legend: {
      heading: "संकेंद्रण घनत्व",
      critical: "गंभीर (>500)",
      amber: "मध्यम (100–500)",
      low: "न्यून (<100)",
    },
  },

  table: {
    heading: "तहसीलवार निष्पादन",
    columns: {
      verification: "सत्यापन %",
      discrepancies: "विसंगतियाँ",
      quality: "आंकड़ा गुणवत्ता",
    },
    openTehsil: "{{tehsil}} का पटल खोलें",
    rowMenu: "{{tehsil}} के अन्य विकल्प",
  },

  quality: {
    optimal: "उत्तम",
    attention: "ध्यान अपेक्षित",
    review: "पुनरीक्षण",
  },

  insights: {
    heading: "एआई-सहायित विश्लेषण",
    quality: {
      kind: "गुणवत्ता चेतावनी",
      body:
        "तहसील {{tehsil}} में 7 दिनों में स्थानिक आंकड़ा गुणवत्ता {{delta}} घटी है। क्षेत्र 4 में असंगत सीमाओं का बड़ा संकेंद्रण पाया गया है।",
    },
    bottleneck: {
      kind: "कार्यप्रवाह अवरोध",
      body:
        "{{tehsil}} में दाखिल-खारिज की लंबित संख्या {{delta}} बढ़ी है। औसत निस्तारण समय निर्धारित समय-सीमा से {{days}} अधिक हो गया है।",
    },
  },

  alerts: {
    heading: "चेतावनी केंद्र",
    escalated: "{{count}} उच्चाधिकारी को संदर्भित",
    viewAll: "सभी चेतावनियाँ देखें",
    boundaryDispute: {
      title: "सीमा विवाद उच्चाधिकारी को संदर्भित",
      body: "{{tehsil}} का प्रकरण {{case}} उप-जिलाधिकारी के तत्काल पुनरीक्षण की अपेक्षा रखता है।",
    },
    syncFailure: {
      title: "रजिस्ट्री समकालन विफल",
      body_one:
        "उप-निबंधक कार्यालय, {{tehsil}} से {{count}} दाखिल-खारिज अभिलेख का समकालन नहीं हो सका।",
      body_other:
        "उप-निबंधक कार्यालय, {{tehsil}} से {{count}} दाखिल-खारिज अभिलेखों का समकालन नहीं हो सका।",
    },
    surveyorReassigned: {
      title: "क्षेत्रीय सर्वेक्षक का पुनर्नियोजन",
      body: "सर्वेक्षक {{id}} को तहसील {{tehsil}} के उच्च प्राथमिकता क्षेत्र में पुनर्नियोजित किया गया है।",
    },
    courtOrder: {
      title: "न्यायालय आदेश का पालन शेष",
      body: "ULPIN {{ulpin}} पर उच्च न्यायालय के स्थगन आदेश हेतु प्रणाली में हस्तचालित रोक आवश्यक है।",
    },
  },
};

export default adminOverview;
