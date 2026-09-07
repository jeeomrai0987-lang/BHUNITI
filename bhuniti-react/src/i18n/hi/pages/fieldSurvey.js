/*
 * Hindi copy for src/pages/revenue/FieldSurvey.jsx.
 *
 * सर्वेक्षण की तकनीकी शब्दावली राजस्व विभाग के प्रचलित प्रयोग के अनुसार रखी गई
 * है — क्षेत्रीय सर्वेक्षण, सीमांकन, अतिक्रमण, विचलन विश्लेषण। उपकरणों के
 * ब्रांड-नाम (DJI, Leica) मूल रूप में ही रहते हैं।
 */

const fieldSurvey = {
  breadcrumb: {
    system: "प्रणाली",
    dashboard: "नियंत्रण पटल",
  },

  title: "क्षेत्रीय सर्वेक्षण प्रबंधन",
  intro:
    "तहसील भर में भू-स्थल सत्यापन, डीजीपीएस रोवर दूरमापी तथा भू-नक्शा सर्वेक्षण की गतिविधियाँ।",
  newRequest: "नया अनुरोध",

  stats: {
    activeRequests: "सक्रिय अनुरोध",
    sinceYesterday: "कल से {{delta}}",
    inProgress: "प्रगति पर",
    activeTeams: "सक्रिय क्षेत्रीय दल",
    awaiting: "सत्यापन प्रतीक्षित",
    awaitingHint: "राजस्व अधिकारी की स्वीकृति अपेक्षित",
    equipment: "उपकरण तत्परता",
    equipmentHint: "अंशांकित एवं तैयार",
  },

  queue: {
    heading: "सर्वेक्षण अनुरोध पंक्ति",
    requestId: "अनुरोध क्रमांक",
    type: "सर्वेक्षण प्रकार",
    filter: "अभिलेख छानें",
    sort: "अभिलेख क्रमबद्ध करें",
    filterToast: "छानने के विकल्प बदले गए",
    sortToast: "पंक्ति प्राथमिकता के अनुसार क्रमबद्ध",
    openRequest: "अनुरोध {{id}} खोलें",
    unassigned: "अनियुक्त",
  },

  surveyTypes: {
    boundaryDispute: "सीमा विवाद",
    subdivision: "उपविभाजन",
    encroachment: "अतिक्रमण",
    routineAudit: "नैमित्तिक अंकेक्षण",
    mutationGroundCheck: "दाखिल-खारिज स्थल जाँच",
  },

  statuses: {
    reviewPending: "पुनरीक्षण प्रतीक्षित",
    inProgress: "प्रगति पर",
    assigned: "नियुक्त",
    pending: "लंबित",
  },

  teams: {
    alpha: "दल अल्फा",
    beta: "दल बीटा",
    gamma: "दल गामा",
  },

  // पंक्ति में सर्वेक्षक के नाम के साथ छपने वाला संक्षिप्त रूप।
  teamCodes: {
    alpha: "दल-अ",
    beta: "दल-ब",
    gamma: "दल-ग",
  },

  surveyor: "{{name}} ({{team}})",

  context: {
    eyebrow: "सक्रिय प्रसंग",
    parcel: "भूखंड {{id}}",
    khasra: "खसरा {{value}}",
    khasraShort: "ख. {{value}}",
    disputedOverlap: "विवादित सीमा अतिव्यापन",
    mapCaption: "उपग्रह आधार-चित्र पर भूखंड {{id}} की अभिलिखित भू-नक्शा सीमा",
    baseLayer: "आधार स्तर",
    layers: {
      satellite: "उपग्रह",
      cadastral: "भू-नक्शा",
    },
    latitude: "अक्षांश: {{value}}° उ",
    longitude: "देशांतर: {{value}}° पू",
  },

  // चयनित भूखंड पर दिखने वाले चिह्न। `dispute` और `encroachment` सर्वेक्षण
  // प्रकार का संक्षेप हैं; शेष दो पंक्ति की स्थिति दर्शाते हैं।
  badges: {
    dispute: "विवाद",
    encroachment: "अतिक्रमण",
    inProgress: "प्रगति पर",
    pending: "लंबित",
  },

  variance: {
    heading: "विचलन विश्लेषण",
    gisRecord: "जीआईएस अभिलेख",
    fieldMeasure: "स्थल माप",
    delta: "अंतर",
    value: "{{area}} ({{verdict}})",
    verdict: {
      beyondTolerance: "सह्य सीमा से अधिक",
      withinTolerance: "सह्य सीमा के भीतर",
      majorDiscrepancy: "गंभीर विसंगति",
      exactMatch: "पूर्ण मेल",
    },
  },

  notes: {
    heading: "स्थल टिप्पणी (ओसीआर)",
    quoted: "“{{text}}”",
    uploadedBy: "{{name}} द्वारा अपलोड • {{when}}",
    systemScheduled: "प्रणाली द्वारा निर्धारित • {{when}}",
    body: {
      "SR-2023-089":
        "पूर्वी छोर पर पड़ोसी बाड़ की रेखा अभिलिखित पी-1024 सीमा के लगभग 4 मीटर भीतर पाई गई। कंक्रीट के खंभे हाल में लगाए जान पड़ते हैं। ऐतिहासिक संरेखण आच्छादन अपेक्षित।",
      "SR-2023-091":
        "विभाजन रेखा डीजीपीएस रोवर चिह्नों से अंकित। उत्तरी तथा दक्षिणी उप-भूखंड, प्रत्येक 0.72 हेक्टेयर, दाखिल-खारिज विलेख से सत्यापित।",
      "SR-2023-095":
        "पश्चिमी सीमा ग्राम सभा के सार्वजनिक मार्ग पर अतिव्याप्त है। मिलीमीटर-स्तरीय आधार-रेखा निर्धारण हेतु सर्वेक्षण दल को सीओआरएस आरटीके ग्राही सहित भेजा गया।",
      "SR-2023-098":
        "त्रैवार्षिक भू-नक्शा सत्यापन निर्धारित। मानक शिला #BM-44 उत्तम दशा में। सभी कोने स्पष्ट।",
    },
  },

  actions: {
    reconcile: "प्रेक्षणों का समाधान करें",
    reconcileToast: "भूखंड {{parcel}} के स्थल प्रेक्षणों का समाधान हुआ",
    report: "सर्वेक्षण प्रतिवेदन बनाएँ",
    reportToast: "भूखंड {{parcel}} हेतु सर्वेक्षण प्रतिवेदन बना",
    createdToast: "{{parcel}} हेतु सर्वेक्षण अनुरोध बना ({{type}})",
  },

  fieldTeams: {
    heading: "सक्रिय क्षेत्रीय दल",
    onParcel: "{{parcel}} • {{type}}",
    inTransit: "{{parcel}} की ओर मार्ग में",
    active: "सक्रिय",
    moving: "गतिमान",
  },

  telemetry: {
    heading: "उपकरण दूरमापी",
    battery: "{{value}} बैटरी",
    devices: {
      drone: "ड्रोन-1",
      totalStation: "टोटल स्टेशन-3",
    },
    droneMeta: "{{team}} को आवंटित • आरटीके निर्धारण: मिलीमीटर स्तर • अंशांकित",
    stationMeta: "{{team}} को आवंटित • पुनः अंशांकन {{days}} में देय",
  },

  modal: {
    heading: "सर्वेक्षण अनुरोध बनाएँ",
    parcelLabel: "भूखंड क्रमांक / यूएलपीआईएन",
    parcelPlaceholder: "उदा. P-4492",
    typeLabel: "सर्वेक्षण प्रकार",
    submit: "अनुरोध बनाएँ",
  },
};

export default fieldSurvey;
