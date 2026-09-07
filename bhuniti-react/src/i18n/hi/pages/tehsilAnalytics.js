/*
 * Hindi copy for the district Tehsil Analytics screen
 * (/administration/tehsil-analytics).
 *
 * तहसीलों के नाम common.place.tehsils में हैं, जिन्हें जिले की अन्य स्क्रीन भी
 * उपयोग करती हैं; वास्तविक अभिलेखों के स्थान-नाम एपीआई द्वारा ref_translations
 * तालिका से आते हैं।
 */

const tehsilAnalytics = {
  title: "तहसील विश्लेषण",
  intro:
    "{{district}} जिले की तहसीलों के तुलनात्मक निष्पादन संकेतक तथा भू-अभिलेख समकालन की स्थिति।",

  alert: {
    heading: "ध्यान देने योग्य: तहसील {{tehsil}}",
    body:
      "{{tehsil}} में विसंगति दर स्वीकार्य सीमा से ऊपर पहुँच गई है ({{rate}}, जबकि जिले का औसत {{average}} है)। मूल कारण पुराने गैर-स्थानिक अभिलेख हैं, जिनका स्वचालित ULPIN मिलान नहीं हो पाता।",
    rootCause: "मूल कारण विश्लेषण देखें",
    dismiss: "चेतावनी हटाएँ",
  },

  kpi: {
    verification: "जिले का औसत सत्यापन",
    verificationDelta: "+{{value}} इस माह",
    backlog: "कुल लंबित कार्य",
    backlogDelta: "पिछली तिमाही की तुलना में {{value}}",
    backlogNote_one: "{{count}} तहसील में लंबित दाखिल-खारिज",
    backlogNote_other: "{{count}} तहसीलों में लंबित दाखिल-खारिज",
    resolution: "औसत निस्तारण समय",
    resolutionUnit: "दिन",
    slaTarget: "निर्धारित समय-सीमा: {{days}}",
    mapSync: "नक्शा समकालन दर",
    mapSyncCaption: "जिले का उपग्रह चित्र",
  },

  chart: {
    heading: "तहसीलवार सत्यापन स्थिति",
    options: "आलेख विकल्प",
    verified: "सत्यापित अभिलेख",
    scanned: "कुल स्कैन किए गए",
    barLabel: "{{tehsil}}: {{value}} स्कैन",
  },

  backlog: {
    heading: "लंबित कार्य का वितरण",
    legendItem: "{{name}} ({{share}})",
    others: "अन्य",
  },

  table: {
    heading: "तहसीलवार निष्पादन विवरण",
    period: "पिछले 30 दिन",
    columns: {
      verification: "सत्यापन %",
      backlog: "कुल लंबित",
      resolutionTime: "औसत निस्तारण समय",
      discrepancyRate: "विसंगति दर",
    },
    drillDown: "विस्तार से देखें",
    drillDownFor: "{{tehsil}} का विस्तृत विवरण देखें",
  },

  status: {
    optimal: "उत्तम",
    needsAttention: "ध्यान अपेक्षित",
    stable: "स्थिर",
  },
};

export default tehsilAnalytics;
