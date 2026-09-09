/*
 * ParcelMapViewer (भू-नक्शा मानचित्र), Virtual360Viewer और AnimatedCounter के लिए
 * हिन्दी पाठ। कुंजियाँ ../en/viewers.js से पूर्णतः मेल खानी चाहिए।
 *
 * मूल घटक में यही पाठ कोष्ठक में अंग्रेज़ी अनुवाद सहित सीधे लिखा था; यहाँ केवल
 * हिन्दी रखी गई है और अंग्रेज़ी रूप ../en/viewers.js में है।
 */

const viewers = {
  parcelMap: {
    header: {
      title: "उ.प्र. भू-नक्शा • गाजियाबाद भू-अभिलेख पत्रक",
      villageChip: "ग्राम: {{village}} ({{tehsil}})",
      subtitle_one: "{{count}} खसरा भूखंड प्रदर्शित • खतौनी हेतु उस पर टैप करें",
      subtitle_other:
        "{{count}} सटे हुए खसरा भूखंड प्रदर्शित • खतौनी देखने हेतु किसी भी भूखंड पर टैप करें",
    },

    layers: {
      sectionLabel: "आधार-चित्र",
      satellite: "उपग्रह + भू-नक्शा",
      bhunaksha: "उ.प्र. भू-नक्शा शजरा",
    },

    tooltip: "खसरा {{khasra}} • {{owner}} • {{area}}",

    badge: {
      khasraShort: "ख. {{number}}",
      label: "खसरा {{number}}",
    },

    legend: {
      heading: "भू-नक्शा संकेत सूची",
      items: {
        agriculture: "कृषि भूमि",
        government: "ग्राम सभा / राजकीय",
        commercial: "व्यावसायिक",
        residential: "आवासीय (आबादी)",
        orchard: "बाग / फलोद्यान",
        water: "नहर / जल स्रोत",
        mutation: "दाखिल-खारिज प्रक्रियाधीन",
        dispute: "सीमा विवाद",
      },
    },

    drawer: {
      label: "भू-अभिलेख विवरण",
      khasraChip: "खसरा सं. {{number}}",
      khataChip: "खाता: {{number}}",
      handleExpand: "भू-अभिलेख विस्तृत करें",
      handleCollapse: "भू-अभिलेख संक्षिप्त करें",
      close: "भू-अभिलेख बंद करें",
      discrepancy: "भू-नक्शा विसंगति",
      owner: "पंजीकृत खातेदार",
      coOwners: "सह-खातेदार: {{names}}",
      areaMetric: "क्षेत्रफल (हेक्टेयर)",
      areaCustomary: "बीघा / बिस्वा (उ.प्र. इकाई)",
      areaBighaBiswa: "{{bigha}} ({{biswa}})",
      valuation: "सर्कल रेट मूल्यांकन",
      valuationLakh: "{{value}} लाख",
      landUse: "भूमि उपयोग श्रेणी",
      location: "स्थान एवं राजस्व क्षेत्र",
      locationValue:
        "ग्राम {{village}}, तहसील {{tehsil}}, जिला {{district}}, {{state}}",
      encumbrance: "भार / बंधक स्थिति",
      caseNumber: "प्रकरण {{number}}",
    },

    actions: {
      open360: "360° भू-निरीक्षण",
      open360Named: "खसरा {{khasra}} का 360° भू-निरीक्षण खोलें",
      downloadRor: "डिजिटल खतौनी डाउनलोड करें (PDF)",
      downloadRorNamed: "खसरा {{khasra}} की डिजिटल खतौनी डाउनलोड करें",
      downloadQueued:
        "खसरा {{khasra}}, {{district}} की डिजिटल खतौनी (अधिकार-अभिलेख प्रपत्र 7/12) तैयार की जा रही है।",
    },

    fixture: {
      areaMismatch:
        "दावा {{claimed}} किया गया, जबकि अधिकार-अभिलेख में {{recorded}} दर्ज है — प्रकरण {{case}} के अंतर्गत {{difference}} का अंतर।",
      roadOverlap:
        "उत्तरी सीमा लोक मार्ग आरक्षण पट्टी से {{distance}} तक अतिव्याप्त है।",
    },
  },

  virtual360: {
    dialogLabel: "360° भू-निरीक्षण",
    title: "360° भू-निरीक्षण",
    liveBadge: "सजीव स्थल सत्यता",
    identity: "ULPIN: {{ulpin}} • {{owner}}",
    close: "360° निरीक्षण बंद करें",

    modes: {
      sectionLabel: "चित्र स्रोत",
      ground: "भूस्तर",
      drone: "ड्रोन",
      cadastral: "शजरा",
    },

    panorama: {
      ground: "भूखंड का भूस्तरीय पैनोरमा",
      drone: "भूखंड का ड्रोन से लिया गया हवाई पैनोरमा",
      cadastral: "भूखंड के पैनोरमा पर शजरा आवरण",
    },

    controls: {
      zoomIn: "बड़ा करें",
      zoomOut: "छोटा करें",
      autoRotateStop: "360° स्वतः घुमाव रोकें",
      autoRotateStart: "360° स्वतः घुमाव प्रारंभ करें",
      reset: "दृश्य पुनः निर्धारित करें",
    },

    hud: {
      heading: "दिशा-कोण",
      headingValue: "{{degrees}}° {{direction}}",
      centroid: "केंद्र बिंदु",
      centroidValue: "{{lat}}° {{northSouth}}, {{lng}}° {{eastWest}}",
      compass: {
        north: "उ",
        east: "पू",
        south: "द",
        west: "प",
      },
    },

    hint: "360° देखने हेतु खींचें या स्वाइप करें • स्थल आँकड़ों हेतु पिन पर टैप करें",

    hotspots: {
      openInfo: "{{name}} की सर्वेक्षण टिप्पणी खोलें",
      closeInfo: "सर्वेक्षण टिप्पणी बंद करें",
      pillar: {
        name: "उत्तरी सीमा चिह्न (स्तंभ एन-1)",
        info: "डीजीपीएस मानक स्तंभ। ऊँचाई 218.4 मी. (औसत समुद्र तल से), स्थिति 28.8368° उ, 77.5832° पू।",
      },
      boundary: {
        disputedName: "विवादित अतिव्याप्ति क्षेत्र",
        verifiedName: "उप-विभाजन सीमा",
        disputedInfo: "प्रकरण {{case}} के अंतर्गत सीमा विवादाधीन है।",
        disputedInfoNoCase: "सीमा विवादाधीन है।",
        verifiedInfo: "सीमा 1984 के शजरा नक्शे से सत्यापित है।",
      },
      access: {
        name: "मार्ग सीमांत (18 मी. चौड़ा)",
        info: "राज्य राजमार्ग 57 से जोड़ने वाला गलियारा। मार्गाधिकार बाधामुक्त सत्यापित।",
      },
    },
  },
};

export default viewers;
