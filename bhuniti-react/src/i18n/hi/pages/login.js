/*
 * Hindi strings for src/pages/main/Login.jsx -- unified Citizen / Officer OTP login.
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
    citizenTitle: "नागरिक पोर्टल प्रवेश",
    citizenSubtitle: "भू-अभिलेख, आवेदन एवं सेवाओं तक पहुँचें",
    officerTitle: "अधिकारी पोर्टल प्रवेश",
    officerSubtitle: "सुरक्षित भूमिका-आधारित प्रमाणीकरण एवं ओटीपी सत्यापन",
    otpTitle: "एकबारगी पासवर्ड सत्यापित करें",
    otpSubtitle: "बहु-स्तरीय प्रमाणीकरण",
    footer: "सुरक्षित शासकीय-आईडी प्रवेश • 256-बिट टीएलएस एन्क्रिप्टेड",
  },

  tabs: {
    citizen: "नागरिक",
    officer: "अधिकारी प्रवेश",
  },

  steps: {
    label: "प्रवेश प्रगति",
    credentials: "1. प्रमाण-पत्र",
    otp: "2. ओटीपी",
  },

  identifierMode: {
    username: "उपयोक्ता-नाम",
    email: "ईमेल",
    mobile: "मोबाइल",
  },

  roles: {
    revenueOfficer: "राजस्व अधिकारी",
    districtOfficer: "जिला अधिकारी / व्यवस्थापक",
  },

  identity: {
    username: "शासकीय उपयोक्ता-नाम",
    usernamePlaceholder: "उदा. citizen",
    email: "पंजीकृत ईमेल",
    emailPlaceholder: "उदा. name@bhuniti.gov.in",
    mobile: "पंजीकृत मोबाइल",
    mobilePlaceholder: "उदा. 9812345678",
    password: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड दर्ज करें",
    roleSelectLabel: "निर्धारित भूमिका",
    submitCitizen: "पोर्टल में प्रवेश करें",
    submitOfficer: "सत्यापन ओटीपी भेजें",
    loggingIn: "प्रवेश हो रहा है…",
    sendingOtp: "ओटीपी भेजा जा रहा है…",
  },

  otp: {
    verifiedFor: "इनके लिए प्रमाणीकरण प्रारंभ हुआ",
    sentTo: "6 अंकों का सत्यापन कोड भेजा गया है",
    label: "6 अंकों का ओटीपी दर्ज करें",
    submit: "ओटीपी सत्यापित करें एवं पोर्टल खोलें",
    verifying: "सत्यापन हो रहा है…",
    back: "← विवरण बदलें",
    resend: "पुनः ओटीपी भेजें",
    resendCooldown: "{{seconds}}s में पुनः भेजें",
    resendSuccess: "नया ओटीपी सफलतापूर्वक भेज दिया गया है।",
  },

  signupPrompt: "नए नागरिक?",
  signupLink: "आधार एवं मोबाइल से पंजीकरण करें",

  forcePasswordChange: {
    badge: "प्रथम-बार सुरक्षा सक्रियण",
    title: "अपना नया पासवर्ड सेट करें",
    subtitle: "पोर्टल में प्रवेश करने से पहले आपके खाते में अनिवार्य पासवर्ड परिवर्तन आवश्यक है।",
    currentPassword: "अस्थायी / वर्तमान पासवर्ड",
    currentPasswordPlaceholder: "अस्थायी पासवर्ड दर्ज करें",
    newPassword: "नया पासवर्ड (न्यूनतम 8 अक्षर)",
    newPasswordPlaceholder: "नया सुरक्षित पासवर्ड दर्ज करें",
    confirmPassword: "नए पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "नया पासवर्ड पुनः दर्ज करें",
    submit: "पासवर्ड अपडेट करें एवं जारी रखें",
    submitting: "पासवर्ड अपडेट हो रहा है…",
  },

  errors: {
    incomplete: "कृपया अपना प्रवेश पहचानकर्ता एवं पासवर्ड दर्ज करें।",
    invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें।",
    invalidMobile: "कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।",
    otpIncomplete: "कृपया 6 अंकों का ओटीपी दर्ज करें।",
    invalidCredentials: "पहचानकर्ता या पासवर्ड ग़लत है।",
    otpInvalid: "अमान्य या समाप्त हो चुका ओटीपी कोड।",
    newPasswordShort: "नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordsMismatch: "दोनों नए पासवर्ड मेल नहीं खाते हैं।",
    passwordChangeFailed: "पासवर्ड अपडेट विफल रहा। कृपया अपने अस्थायी पासवर्ड की पुष्टि करें।",
  },
};

export default login;
