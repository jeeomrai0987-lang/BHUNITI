/*
 * Hindi copy for src/pages/admin/AdminAddOfficer.jsx -- Provisioning Revenue Officers.
 * Reached as t("pages.adminAddOfficer....").
 */

const adminAddOfficer = {
  badge: "ज़िला प्रशासन",
  heading: "नया {{highlight}} खाता जोड़ें",
  headingHighlight: "राजस्व अधिकारी",
  subheading:
    "निर्दिष्ट तहसीलों के लिए राजस्व अधिकारियों को सुरक्षित रूप से जोड़ें। अस्थायी पासवर्ड स्वतः उत्पन्न होता है, ईमेल द्वारा भेजा जाता है, और प्रथम प्रवेश पर अनिवार्य पासवर्ड परिवर्तन की आवश्यकता होती है।",
  form: {
    sectionPersonal: "अधिकारी व्यक्तिगत एवं संपर्क विवरण",
    sectionPosting: "अधिकार क्षेत्र एवं पदस्थापना",
    sectionGovId: "शासकीय पहचान सत्यापन",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "उदा. विक्रम सिंह",
    username: "शासकीय उपयोक्ता-नाम",
    usernamePlaceholder: "उदा. ro_modinagar_01",
    email: "शासकीय ईमेल पता",
    emailPlaceholder: "उदा. ro.modinagar@bhuniti.gov.in",
    phone: "संपर्क मोबाइल नंबर",
    phonePlaceholder: "10 अंकों का शासकीय संपर्क",
    designation: "पदनाम",
    district: "आवंटित ज़िला",
    tehsil: "आवंटित तहसील",
    govIdType: "शासकीय पहचान पत्र प्रकार",
    govIdNumber: "शासकीय पहचान पत्र संख्या",
    govIdPlaceholder: "उदा. EMP-998812 अथवा आधार / पैन",
    govIdPrivacyNote: "शासकीय पहचान पत्र संदर्भों को क्रिप्टोग्राफ़िक साल्ट के साथ हैश (SHA-256) के रूप में सुरक्षित रखा जाता है। डेटाबेस अंकेक्षण में केवल अंतिम 4 अंक ही रखे जाते हैं।",
    submit: "अधिकारी खाता बनाएं एवं विवरण भेजें",
    submitting: "खाता बनाया जा रहा है…",
  },
  modal: {
    title: "अधिकारी खाता सफलतापूर्वक बनाया गया",
    subtitle: "अधिकारी खाता 'प्रतीक्षारत' (pending) स्थिति में प्रथम प्रवेश पासवर्ड सक्रियण हेतु तैयार है।",
    officerDetails: "खाता सारांश",
    name: "नाम",
    username: "उपयोक्ता-नाम",
    email: "ईमेल",
    jurisdiction: "अधिकार क्षेत्र",
    govId: "शासकीय पहचान",
    notice: "अधिकारी के ईमेल पर एक सुरक्षित अस्थायी पासवर्ड भेजा गया है। प्रथम प्रवेश पर, पोर्टल का उपयोग करने से पूर्व प्रणाली अनिवार्य पासवर्ड परिवर्तन लागू करेगी।",
    done: "पूर्ण एवं अवलोकन पर लौटें",
    addAnother: "एक अन्य अधिकारी जोड़ें",
  },
  errors: {
    incomplete: "कृपया सभी अनिवार्य फ़ील्ड भरें।",
    emailInvalid: "कृपया एक मान्य शासकीय ईमेल पता दर्ज करें।",
    phoneInvalid: "कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।",
  },
};

export default adminAddOfficer;
