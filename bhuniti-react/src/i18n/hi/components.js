/*
 * src/components/ में साझा चरोम (नेवबार, साइडबार, फुटर, पोर्टल स्विचर) के लिए हिन्दी पाठ।
 *
 * कुंजियाँ ../en/components.js से पूर्णतः मेल खानी चाहिए। भूमिका नाम, बटन क्रियाएँ और
 * फ़ील्ड नाम यहाँ दोहराए नहीं गए हैं — वे ./common.js से आते हैं।
 */

const components = {
  nav: {
    home: "मुख्य पृष्ठ",
    platform: "प्लेटफ़ॉर्म",
    howItWorks: "यह कैसे कार्य करता है",
    features: "विशेषताएँ",
    governance: "अभिशासन",
    about: "परिचय",
  },

  citizenNav: {
    portal: "नागरिक पोर्टल",
    searchRecords: "अभिलेख खोजें",
    myApplications: "मेरे आवेदन",
    landServices: "भूमि सेवाएँ",
    helpSupport: "सहायता",
  },

  revenueNav: {
    overview: "अवलोकन",
    gisExplorer: "जीआईएस भूखंड एक्सप्लोरर",
    dataReconciliation: "डेटा समाधान",
    mutationManagement: "दाखिल-खारिज प्रबंधन",
    discrepancyCases: "विसंगति प्रकरण",
    historicalTimeline: "ऐतिहासिक समयरेखा",
    documentsEvidence: "दस्तावेज़ एवं प्रमाण",
    surveys: "सर्वेक्षण",
    reportsAnalytics: "रिपोर्ट एवं विश्लेषण",
    auditTrail: "अंकेक्षण अभिलेख",
    administration: "प्रशासन",
  },

  adminNav: {
    overview: "अवलोकन",
    districtGis: "ज़िला जीआईएस",
    tehsilAnalytics: "तहसील विश्लेषण",
    reconciliationMonitor: "समाधान मॉनिटर",
    mutationMonitor: "दाखिल-खारिज मॉनिटर",
    discrepancyCases: "विसंगति प्रकरण",
    fieldSurveys: "क्षेत्र सर्वेक्षण",
    officerPerformance: "अधिकारी प्रदर्शन",
    addOfficer: "अधिकारी जोड़ें",
    reports: "रिपोर्ट",
    alerts: "चेतावनियाँ",
    auditTrail: "अंकेक्षण अभिलेख",
  },

  topbar: {
    searchPlaceholder: "ULPIN / सर्वे नंबर खोजें…",
    districtSelector: "ज़िला: {{district}}",
    changeDistrict: "ज़िला बदलें",
    help: "सहायता",
    profilePhoto: "प्रोफ़ाइल चित्र",
    roleSwitch: "{{role}} • बदलें",
    citizenId: "आईडी: {{id}} • बदलें",
  },

  user: {
    citizen: "नागरिक उपयोगकर्ता",
    revenueOfficer: "के. शर्मा",
    adminOfficer: "प्रशासनिक अधिकारी",
  },

  footer: {
    tagline:
      "भूमि, डेटा और अभिशासन को जोड़ते हुए। सटीक जीआईएस और विधिक पारदर्शिता पर आधारित राष्ट्रीय अधोसंरचना।",
    badge: "भूमि, डेटा एवं अभिशासन प्लेटफ़ॉर्म 2026",
    solution: "समाधान",
    institution: "संस्थान",
    trust: "विश्वास",
    contact: "संपर्क",
    security: "सुरक्षा",
    privacy: "गोपनीयता",
    terms: "नियम एवं शर्तें",
    copyright: "© 2026 भूनीति अधोसंरचना पहल। भारत सरकार की परियोजना।",
    seal: "भारत सरकार",
  },

  citizenFooter: {
    about:
      "भू-अभिशासन का सुरक्षित डिजिटल प्रवेश-द्वार। प्रत्येक नागरिक के लिए भू-अभिलेखों और राजस्व सेवाओं तक पारदर्शी पहुँच।",
    quickLinks: "त्वरित लिंक",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    systemStatus: "प्रणाली की स्थिति",
    support: "हेल्पलाइन: {{number}}",
    email: "ईमेल: {{address}}",
    copyright: "© 2026 भूनीति भूमि प्रशासन, भारत सरकार।",
    accessibility: "सुगम्यता",
  },

  portalSwitcher: {
    trigger: "पोर्टल बदलने या साइन इन करने के लिए टैप करें",
    heading: "पोर्टल बदलें / लॉगिन",
    subheading: "भूनीति की सभी परतों में त्वरित आवागमन",
    footerNote: "डेमो त्वरित बदलाव",
    goToLogin: "लॉगिन स्क्रीन पर जाएँ",
    badge: {
      authRequired: "लॉगिन आवश्यक",
      public: "सार्वजनिक",
      authScreen: "लॉगिन स्क्रीन",
    },
    citizen: {
      name: "नागरिक पोर्टल",
      desc: "मोबाइल ओटीपी के साथ नागरिक लॉगिन",
    },
    revenue: {
      name: "राजस्व अधिकारी पोर्टल",
      desc: "ओटीपी सत्यापन के साथ राजस्व अधिकारी क्रेडेंशियल",
    },
    admin: {
      name: "ज़िला प्रशासन",
      desc: "द्वि-कारक लॉगिन के साथ ज़िला अधिकारी क्रेडेंशियल",
    },
    publicSite: {
      name: "सार्वजनिक लैंडिंग पृष्ठ",
      desc: "प्लेटफ़ॉर्म अवलोकन और सार्वजनिक सेवाएँ — लॉगिन आवश्यक नहीं",
    },
    login: {
      name: "लॉगिन / प्रमाणीकरण केंद्र",
      desc: "भूमिका चुनें और ओटीपी से प्रमाणित करें",
    },
  },
};

export default components;
