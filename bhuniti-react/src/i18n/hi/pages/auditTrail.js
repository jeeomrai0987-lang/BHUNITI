/*
 * Hindi copy for the Revenue Officer audit trail (/revenue-officer/audit-trail).
 *
 * Vocabulary follows the revenue department's own usage: अंकेक्षण अभिलेख for the
 * audit trail, विसंगति for a discrepancy, दाखिल-खारिज for a mutation, भूखंड for a
 * parcel. `detail.statusChange` keeps the placeholders in Hindi word order
 * ("... से ... कर दी गई"), which is exactly why the page splits the translated
 * template instead of assembling the sentence itself.
 */

const auditTrail = {
  title: "प्रणाली अंकेक्षण अभिलेख",
  intro:
    "सभी प्रशासनिक कार्यों, आंकड़ों में हुए परिवर्तनों और प्रणाली द्वारा पहचानी गई विसंगतियों का पूर्ण एवं अपरिवर्तनीय अभिलेख देखें। प्रत्येक प्रविष्टि अंकीय रूप से हस्ताक्षरित और कालक्रमानुसार दर्ज है।",
  exportLog: "अभिलेख निर्यात करें",
  verifyChain: "श्रृंखला सत्यापित करें",
  searchPlaceholder: "ULPIN, प्रकरण संख्या या कर्ता से खोजें…",

  filters: {
    dateRange: "तिथि अवधि",
    allDates: "सभी तिथि अवधियाँ",
    last24Hours: "पिछले 24 घंटे",
    last7Days: "पिछले 7 दिन",
    last30Days: "पिछले 30 दिन",
    actor: "कर्ता",
    allActors: "सभी कर्ता",
    revenueOfficers: "राजस्व अधिकारी",
    citizens: "नागरिक",
    systemAutomated: "प्रणाली (स्वचालित)",
    category: "श्रेणी",
    allCategories: "सभी श्रेणियाँ",
    administrative: "प्रशासनिक",
    geospatial: "भू-स्थानिक",
    document: "दस्तावेज़",
    system: "प्रणाली",
  },

  columns: {
    timestamp: "समय-चिह्न",
    actor: "कर्ता",
    actionTarget: "कार्य एवं लक्ष्य",
    changeDetail: "परिवर्तन विवरण",
    verification: "सत्यापन",
  },

  origin: {
    ip: "आईपी: {{address}}",
    node: "नोड: {{name}}",
  },

  verification: {
    signed: "हस्ताक्षरित",
    chainVerified: "श्रृंखला सत्यापित",
  },

  detail: {
    statusChange: "स्थिति {{from}} से {{to}} कर दी गई",
    areaMismatch:
      "स्वचालित जीआईएस-अभिलेख मिलान के दौरान क्षेत्रफल में अंतर चिह्नित किया गया।",
    previousValue: "पूर्व मान (अभिलेखानुसार)",
    newValue: "नया मान (जीआईएस से प्राप्त)",
    documentAttached: "विक्रय विलेख स्कैन कर सम्पत्ति अभिलेख से संलग्न किया गया।",
    backupCompleted: "दैनिक प्रतिचित्र सफलतापूर्वक बनाया गया। आकार: {{size}}।",
  },

  roles: {
    documentVerifier: "दस्तावेज़ सत्यापक",
    automatedTask: "स्वचालित कार्य",
    systemAutomated: "प्रणाली (स्वचालित)",
  },

  events: {
    discrepancyDetected: "विसंगति पाई गई",
    backupCompleted: "प्रतिचित्र पूर्ण",
  },

  target: {
    parcel: "भूखंड {{id}}",
    deed: "विलेख {{id}}",
  },

  pagination: {
    nextPage: "अगला पृष्ठ",
    previousPage: "पिछला पृष्ठ",
    goToPage: "पृष्ठ {{page}} पर जाएँ",
    morePages: "और पृष्ठ",
  },
};

export default auditTrail;
