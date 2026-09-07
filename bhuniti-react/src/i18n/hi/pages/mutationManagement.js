/*
 * Hindi copy for src/pages/revenue/MutationManagement.jsx.
 *
 * विसंगति का वाक्य स्थानधारकों से बनता है, क्योंकि यही प्रकरण साक्ष्य तथा विवाद
 * स्क्रीनों पर भी उद्धृत है और तीनों जगह एक-सा पढ़ा जाना चाहिए।
 */

const mutationManagement = {
  breadcrumb: "नामांतरण प्रबंधन",
  title: "नामांतरण प्रबंधन",
  intro:
    "अपनी तहसील के अंतरण तथा स्वामित्व नामांतरण अनुरोधों पर निर्णय लें। क्षेत्रफल अथवा सीमा संबंधी विसंगति वाले प्रकरण सूची में पहले दर्शाए गए हैं।",

  kpi: {
    sectionLabel: "सूची का सारांश",
    pending: "लंबित",
    underVerification: "सत्यापनाधीन",
    awaitingDocs: "दस्तावेज़ प्रतीक्षित",
    approvedToday: "स्वीकृत (आज)",
    up: "गत सप्ताह की तुलना में {{value}} वृद्धि",
    down: "गत सप्ताह की तुलना में {{value}} कमी",
    flat: "गत सप्ताह की तुलना में कोई परिवर्तन नहीं",
    liveSynced: "पंजी सेवा से सजीव आंकड़े",
    sampleData: "निदर्शन आंकड़े — सेवा अनुपलब्ध",
  },

  queue: {
    heading: "प्रकरण सूची",
    empty: "कोई नामांतरण प्रकरण लंबित नहीं है",
    emptyHint: "नए अनुरोध प्रस्तुत होते ही यहाँ दिखाई देंगे।",
    rowSummary: "{{number}}, {{type}}, {{applicant}}, {{status}}",
    discrepancy: "विसंगति",
    selected: "वर्तमान में खुला",
  },

  detail: {
    linkedParcel: "संबद्ध भूखंड",
    statusLabel: "स्थिति",
    discrepancyFlag: "विसंगति पाई गई",
    applicant: "आवेदक",
    submittedOn: "प्रस्तुति दिनांक",
    claimedArea: "दावाकृत क्षेत्रफल",
    recordArea: "अभिलेखित क्षेत्रफल",
    variance: "अंतर",
  },

  actions: {
    approve: "स्वीकृत करें",
    reject: "अस्वीकृत करें",
    clarify: "स्पष्टीकरण मांगें",
    working: "अंकित किया जा रहा है…",
    approveNamed: "नामांतरण {{number}} स्वीकृत करें",
    rejectNamed: "नामांतरण {{number}} अस्वीकृत करें",
    clarifyNamed: "नामांतरण {{number}} पर स्पष्टीकरण मांगें",
    note: "राजस्व अधिकारी पोर्टल से अंकित।",
  },

  result: {
    recorded: "{{number}} को {{status}} अंकित किया गया। परिवर्तन पंजी तथा अंकेक्षण अभिलेख में दर्ज है।",
    offline: "{{number}} पंजी सेवा तक नहीं भेजा जा सका। निर्णय केवल इस उपकरण पर सुरक्षित है।",
  },

  fixture: {
    areaMismatch:
      "क्षेत्रफल में असंगति: अधिकार-अभिलेख में दर्ज {{recorded}} के सापेक्ष {{claimed}} का दावा, अर्थात {{difference}} का अंतर। नामांतरण की स्वीकृति से पूर्व स्थल पर सीमा सर्वेक्षण आवश्यक है।",
  },
};

export default mutationManagement;
