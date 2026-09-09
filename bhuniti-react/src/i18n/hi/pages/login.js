/*
 * Hindi strings for src/pages/main/Login.jsx -- the unified login.
 *
 * Reached from a component as t("pages.login....").
 */

const login = {
  hero: {
    badge: "राष्ट्रीय अधिसंरचना पहल",
    heading: "{{highlight}} हेतु विश्वसनीय डिजिटल आधार का निर्माण",
    headingHighlight: "भू-अभिशासन",
    lede:
      "भूनीति भू-अभिलेख, जीआईएस, पंजीकरण, नामांतरण एवं ऐतिहासिक आँकड़ों को एक बुद्धिमान, भूखंड-केंद्रित अभिशासन मंच में समेकित करता है।",
    access: "भूनीति में प्रवेश",
    howItWorks: "कार्य-प्रणाली देखें",
    traits: {
      integrated: "समेकित",
      gis: "जीआईएस-सक्षम",
      ai: "एआई-सहायित",
      auditable: "अंकेक्षण-योग्य",
    },
  },

  modal: {
    identityTitle: "भूनीति में सुरक्षित प्रवेश",
    identitySubtitle: "पहचान सत्यापन एवं भूमिका-आधारित प्रवेश",
    otpTitle: "एकबारगी पासवर्ड सत्यापित करें",
    otpSubtitle: "बहु-स्तरीय प्रमाणीकरण",
    footer: "सुरक्षित शासकीय-आईडी प्रवेश • 256-बिट टीएलएस एन्क्रिप्टेड",
  },

  steps: {
    label: "प्रवेश प्रगति",
    identity: "1. पहचान",
    otp: "2. ओटीपी",
  },

  demo: {
    label: "डेमो:",
    fill: "{{role}} हेतु डेमो प्रमाण-पत्र भरें",
  },

  identity: {
    username: "शासकीय उपयोक्ता-नाम",
    usernamePlaceholder: "उदा. citizen",
    email: "पंजीकृत ईमेल आईडी",
    emailPlaceholder: "उदा. citizen@bhuniti.gov.in",
    mobile: "पंजीकृत मोबाइल संख्या",
    mobilePlaceholder: "10 अंकों की मोबाइल संख्या",
    countryCode: "देश कोड +91",
    submit: "सत्यापन ओटीपी भेजें",
  },

  otp: {
    verifiedFor: "इनकी पहचान सत्यापित हुई",
    sentTo: "6 अंकों का सत्यापन कोड भेजा गया है",
    maskedMobile: "+91 ******{{last4}}",
    label: "6 अंकों का ओटीपी दर्ज करें",
    demoHeading: "डेमो मोड",
    demoHint: "ओटीपी प्रयोग करें: {{otp}}",
    submit: "ओटीपी सत्यापित करें एवं पोर्टल खोलें",
    verifying: "सत्यापन हो रहा है…",
    back: "← पहचान विवरण बदलें",
  },

  errors: {
    incomplete: "कृपया उपयोक्ता-नाम, ईमेल आईडी एवं मोबाइल संख्या दर्ज करें।",
    email: "कृपया वैध ईमेल पता दर्ज करें।",
    mobile: "कृपया वैध 10 अंकों की मोबाइल संख्या दर्ज करें।",
    noMatch: "उपयोक्ता-नाम, ईमेल आईडी एवं मोबाइल संख्या हमारे अभिलेखों से मेल नहीं खाते।",
    otp: "अमान्य ओटीपी। कृपया सही 6 अंकों का ओटीपी दर्ज करें।",
  },
};

export default login;
