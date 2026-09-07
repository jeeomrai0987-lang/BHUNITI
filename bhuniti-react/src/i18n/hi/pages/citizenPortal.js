/*
 * Hindi copy for src/pages/citizen/Portal.jsx.
 *
 * शीर्षक दो भागों में है क्योंकि दूसरा भाग भिन्न रंग में दर्शाया जाता है; क्षेत्रफल तथा
 * बीघा दोनों स्थानधारकों के रूप में आते हैं, और स्थितियाँ साझा शब्दावली से आती हैं।
 */

const citizenPortal = {
  eyebrow: "नागरिक पोर्टल",
  titleLead: "सुरक्षित एवं पारदर्शी",
  titleAccent: "भूमि जानकारी।",
  intro:
    "एकीकृत शासकीय भूमि अभिशासन मंच पर अपने संपत्ति अभिलेख देखें, नामांतरण आरंभ करें तथा आवेदनों की प्रगति जानें।",

  search: {
    label: "भू-अभिलेख खोजें",
    placeholder: "ULPIN, खसरा संख्या अथवा स्वामी के नाम से खोजें…",
    submit: "अभिलेख खोजें",
  },

  actions: {
    sectionLabel: "प्रमुख सेवाएँ",
    items: {
      downloadTitle: {
        title: "स्वत्व अभिलेख डाउनलोड करें",
        body: "अधिकार-अभिलेख की सत्यापित प्रति प्राप्त करें",
      },
      initiateMutation: {
        title: "नामांतरण आरंभ करें",
        body: "संपत्ति अंतरण की प्रक्रिया प्रारंभ करें",
      },
      viewMaps: {
        title: "नक्शे देखें",
        body: "भू-स्थानिक जीआईएस अभिलेख खोलें",
      },
    },
  },

  recent: {
    heading: "हाल की खोज",
    lastAccessed: "अंतिम बार देखा गया: {{when}}",
    viewFull: "पूरा अभिलेख देखें",
    viewFullNamed: "भूखंड {{parcel}} का पूरा अभिलेख देखें",
    imageAlt: "भूखंड {{parcel}} का उपग्रह चित्र",
    gisLayer: "जीआईएस स्तर सक्रिय",
    ulpinLabel: "ULPIN",
    parcelHeading: "भूखंड {{parcel}}, खसरा {{khasra}}",
    owner: "पंजीकृत स्वामी",
    area: "कुल क्षेत्रफल",
    areaWithBigha: "{{area}} ({{bigha}} बीघा)",
    landType: "भूमि का प्रकार",
    encumbrances: "भार",
  },

  applications: {
    heading: "मेरे आवेदन",
    more: "मेरे सभी आवेदन खोलें",
    submittedFor: "भूखंड {{parcel}} हेतु प्रस्तुत",
    closed: "अधिकार-अभिलेख में दर्ज कर प्रकरण बंद किया गया",
    progress: "चरण {{total}} में से {{done}}",
    rowSummary: "{{number}}, {{type}}, {{status}}।",
    viewAll: "सभी आवेदन देखें",
  },

  help: {
    heading: "सहायता चाहिए?",
    body: "प्रत्येक भूमि सेवा की चरणबद्ध जानकारी हेतु नागरिक मार्गदर्शिका पढ़ें।",
    cta: "सहायता केंद्र देखें",
  },
};

export default citizenPortal;
