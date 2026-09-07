/*
 * Hindi copy for src/pages/revenue/ReportsAnalytics.jsx.
 *
 * विसंगति की श्रेणियाँ तथा स्रोत-विश्वसनीयता की शब्दावली राजस्व विभाग के
 * प्रचलित प्रयोग के अनुसार है। ग्राम-नाम देवनागरी में लिप्यंतरित हैं।
 */

const reportsAnalytics = {
  breadcrumb: {
    system: "प्रणाली",
    dashboard: "नियंत्रण पटल",
  },

  title: "प्रतिवेदन एवं विश्लेषण",
  intro:
    "प्रणाली-व्यापी निष्पादन, समाधान की मापें तथा विसंगति विश्लेषण।",

  scope: {
    heading: "प्रतिवेदन का विस्तार",
    district: "जिला: {{value}}",
    tehsil: "तहसील: {{value}}",
    village: "ग्राम: {{value}}",
    all: "सभी",
    period: "पिछले 30 दिन",
  },

  kpi: {
    openDiscrepancies: "लंबित विसंगतियाँ",
    resolvedCases: "निस्तारित प्रकरण (चालू वर्ष)",
    processingTime: "औसत निस्तारण अवधि",
    accuracyIndex: "स्रोत शुद्धता सूचकांक",
    change: "पिछली अवधि की तुलना में {{value}}",
  },

  categories: {
    heading: "श्रेणी अनुसार विसंगतियाँ",
    intro: "मूल कारण के अनुसार वर्गीकृत प्रतिवेदित प्रकरणों की संख्या।",
    caption:
      "मूल कारण अनुसार लंबित विसंगतियों का स्तंभ आलेख, अधिकतम से आरंभ: {{summary}}",
    axisTick: "{{value}}",
    items: {
      areaMismatch: "क्षेत्रफल असंगति",
      titleDispute: "स्वत्व विवाद",
      boundary: "सीमा",
      missingDoc: "दस्तावेज़ अनुपलब्ध",
      classificationError: "वर्गीकरण त्रुटि",
      other: "अन्य",
    },
  },

  sources: {
    heading: "स्रोत विश्वसनीयता",
    intro: "एकीकृत स्रोतों के विश्वास अंक।",
    insight:
      "तहसील {{tehsil}} के पुराने अभिलेखों में डेटम निर्देशांक बदलने के कारण मानवीय समाधान आवश्यक है।",
    items: {
      legacy: "पुराने भू-अभिलेख",
      drone: "ड्रोन सर्वेक्षण (2023)",
      satellite: "उपग्रह चित्रावली",
      citizen: "नागरिक पोर्टल से प्राप्त",
    },
  },

  hotspots: {
    heading: "ग्राम अनुसार प्रकरण",
    intro: "भू-स्थानिक विसंगति के केंद्र",
    mapCaption: "तहसील का उपग्रह दृश्य, विसंगति केंद्र अंकित",
    legend: {
      high: "अधिक संख्या",
      monitoring: "निगरानी में",
    },
    tableHeading: "सर्वाधिक प्रभावित ग्राम",
    viewFull: "पूरी तालिका देखें",
    cases_one: "{{count}} प्रकरण",
    cases_other: "{{count}} प्रकरण",
    villages: {
      duhai: "दुहाई",
      bhojpur: "भोजपुर",
      kadrabad: "कादराबाद",
    },
    levels: {
      critical: "अति गंभीर",
      elevated: "बढ़ा हुआ",
      normal: "सामान्य",
    },
  },

  trend: {
    heading: "दाखिल-खारिज निस्तारण अवधि",
    intro: "समय के साथ भूमि दाखिल-खारिज के निस्तारण की औसत अवधि (दिनों में)।",
    caption:
      "माह अनुसार औसत दाखिल-खारिज निस्तारण अवधि का रेखा आलेख: {{summary}}",
    axisTick: "{{value}} दि",
    point: "{{month}}: {{value}}",
    months: {
      jan: "जन",
      feb: "फर",
      mar: "मार्च",
      apr: "अप्रै",
      may: "मई",
    },
  },
};

export default reportsAnalytics;
