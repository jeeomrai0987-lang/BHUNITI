/*
 * Hindi copy for src/pages/admin/MutationMonitor.jsx.
 *
 * सभी आंकड़े एक ही कुल संख्या से व्युत्पन्न होते हैं और स्थानधारकों के रूप में आते हैं,
 * जिससे गणना तथा प्रतिशत कभी असंगत न हों और अंक सक्रिय भाषा के अनुरूप दिखें।
 */

const mutationMonitor = {
  title: "नामांतरण प्रवाह विश्लेषण",
  intro:
    "भूमि अंतरण तथा स्वामित्व नामांतरण अनुरोधों की जिला-स्तरीय प्रक्रिया-श्रृंखला की निगरानी। आंकड़ों में सभी सक्रिय तहसीलें सम्मिलित हैं।",
  period: "विगत {{days}} दिन",
  export: "प्रतिवेदन निर्यात करें",

  funnel: {
    heading: "श्रृंखला-वार प्रगति",
    live: "सजीव समकालन",
    stageSummary: "{{stage}}: कुल {{total}} आवेदनों में से {{count}}, {{share}}",
    stages: {
      submitted: "प्रस्तुत",
      verified: "सत्यापित (स्तर 1)",
      notice: "सूचना अवधि",
      approved: "स्वीकृत",
      rejected: "अस्वीकृत",
    },
  },

  processing: {
    heading: "औसत निस्तारण अवधि",
    days: "दिन",
    trend: "गत माह की तुलना में {{value}}",
  },

  oldest: {
    heading: "सर्वाधिक लंबित आवेदन",
    days: "दिन",
    idLabel: "नामांतरण",
    escalate: "उच्चाधिकारी को भेजें",
    escalateNamed: "नामांतरण {{id}} उच्चाधिकारी को भेजें",
  },

  types: {
    heading: "नामांतरण के प्रकार",
    total: "कुल",
    chart: "कुल {{total}} नामांतरणों में प्रकार-वार हिस्सेदारी: {{breakdown}}।",
    breakdownItem: "{{type}} {{share}}",
    rowSummary: "{{type}}: {{count}} नामांतरण, {{share}}",
  },

  toast: {
    exporting: "विगत {{days}} दिनों का नामांतरण प्रवाह प्रतिवेदन तैयार किया जा रहा है।",
    escalated: "नामांतरण {{id}} जिला अधिकारी को अग्रेषित कर दिया गया है।",
  },
};

export default mutationMonitor;
