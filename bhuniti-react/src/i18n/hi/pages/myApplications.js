/*
 * नागरिक पोर्टल -> मेरे आवेदन (src/pages/citizen/MyApplications.jsx).
 *
 * आवेदन विवरण: प्रगति समयरेखा, कार्रवाई-आवश्यक सूचना और संबंधित तहसील कार्यालय।
 */

const myApplications = {
  title: "आवेदन विवरण",
  idLabel: "आईडी: {{id}}",
  applicant: "आवेदक",

  actionRequired: {
    heading: "कार्रवाई आवश्यक",
    surveyScheduled:
      "{{date}} को क्षेत्र सर्वेक्षण निर्धारित किया गया है। कृपया भूखंड तक पहुँच सुनिश्चित करें।",
    confirmAvailability: "उपलब्धता की पुष्टि करें",
    recording: "दर्ज किया जा रहा है…",
    confirmed: "उपलब्धता की पुष्टि हो गई। क्षेत्र सर्वेक्षक को सूचित कर दिया गया है।",
  },

  progress: {
    heading: "आवेदन की प्रगति",
  },

  evidence: {
    heading: "संलग्न प्रमाण",
    saleDeed: "पंजीकृत विक्रय विलेख",
    saleDeedMeta: "विलेख #{{number}} • {{status}}",
    boundaryMap: "नक्शा (सीमा मानचित्र)",
  },

  office: {
    heading: "संबंधित कार्यालय",
    officer: "अधिकारी",
    officerValue: "सुरेश वर्मा (राजस्व निरीक्षक)",
    contact: "संपर्क",
  },
};

export default myApplications;
