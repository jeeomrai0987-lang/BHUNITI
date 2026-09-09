/*
 * Hindi copy for src/pages/admin/OfficerPerformance.jsx.
 *
 * स्थिति पिल domain.officer_status ("उत्तम" / "ध्यान आवश्यक" /
 * "अत्यधिक भार") से आती है, अतः वे शब्द यहाँ दोहराए नहीं गए हैं। संख्याएँ,
 * प्रतिशत तथा अंतर पृष्ठ में गणित होकर {{placeholder}} के रूप में आते हैं।
 */

const officerPerformance = {
  eyebrow: "निष्पादन विश्लेषण",
  title: "राजस्व अधिकारी पर्यवेक्षण",

  actions: {
    filterRegion: "क्षेत्र छानें",
    exportReport: "रिपोर्ट निर्यात करें",
  },

  kpi: {
    activeOfficers: "कार्यरत अधिकारी",
    avgResolutionTime: "औसत निस्तारण अवधि",
    casesFlagged: "चिह्नित प्रकरण",
    vsLastMonth: "पिछले माह की तुलना में",
    districtTarget: "जिला लक्ष्य: {{value}}",
    requiringEscalation: "उच्च स्तर पर प्रेषण अपेक्षित",
  },

  tabs: {
    withCount: "{{label}} ({{count}})",
    all: "सभी अधिकारी",
    actionNeeded: "ध्यान आवश्यक",
    topPerformers: "श्रेष्ठ निष्पादक",
  },

  search: {
    placeholder: "आईडी अथवा नाम खोजें…",
    label: "अधिकारियों को आईडी अथवा नाम से खोजें",
  },

  table: {
    status: "स्थिति",
    officer: "अधिकारी आईडी / नाम",
    jurisdiction: "तहसील क्षेत्राधिकार",
    assignedCases: "आवंटित प्रकरण",
    resolutionRate: "निस्तारण दर",
    actions: "कार्रवाई",
    statusOf: "{{id}}: {{status}}",
    backlogAlert: "अत्यधिक लंबित प्रकरणों की चेतावनी",
    openOfficer: "अधिकारी {{id}} का विवरण खोलें",
    escalate: "{{id}} को उच्च स्तर पर प्रेषित करें",
  },

  rosterNote: "जिला स्थापना के {{total}} अधिकारियों में से नमूना सूची",
};

export default officerPerformance;
