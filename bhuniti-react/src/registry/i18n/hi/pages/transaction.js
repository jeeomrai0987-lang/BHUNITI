/** चरण 3 एवं 4 — लेनदेन विवरण तथा दस्तावेज़ अपलोड। */
export default {
  title: 'डिजिटल रजिस्ट्री आवेदन',
  subtitle: 'चरण 3 एवं 4: लेनदेन विवरण तथा दस्तावेज़ अपलोड',

  help: {
    heading: 'सहायता चाहिए?',
    bodyLead: 'कृपया',
    linkLabel: 'दस्तावेज़ अपलोड दिशानिर्देश',
    bodyTrail: 'देखें, जिससे आपकी फ़ाइलें सत्यापन के आवश्यक मानकों पर खरी उतरें।',
  },

  step3Heading: 'लेनदेन विवरण',

  typeLabel: 'लेनदेन का प्रकार',
  typePlaceholder: 'लेनदेन का प्रकार चुनें',
  types: {
    sale: 'विक्रय विलेख',
    gift: 'दान विलेख',
    lease: 'पट्टा अनुबंध',
    mortgage: 'बंधक',
  },

  valueLabel: 'लेनदेन मूल्य (₹)',
  valuePlaceholder: '0.00',
  dateLabel: 'लेनदेन की तिथि',
  purposeLabel: 'लेनदेन का प्रयोजन',
  purposePlaceholder: 'प्रयोजन चुनें',
  remarksLabel: 'टिप्पणी / अतिरिक्त जानकारी',
  remarksPlaceholder: 'कोई प्रासंगिक टिप्पणी दर्ज करें…',

  summary: {
    eyebrow: 'लेनदेन सारांश',
    heading: '{{type}} — {{purpose}}',
    propertyLabel: 'संपत्ति आईडी:',
    valueLabel: 'मूल्य:',
    dutyLabel: 'अनुमानित स्टांप शुल्क',
  },

  step4Heading: 'आवश्यक दस्तावेज़',
  step4Lede:
    'निम्नलिखित दस्तावेज़ों की स्पष्ट एवं सुपाठ्य प्रतियाँ पीडीएफ़, जेपीजी अथवा पीएनजी रूप में अपलोड करें। प्रति दस्तावेज़ अधिकतम आकार: 5 एमबी।',
  step4LockedNote: 'फ़ाइलें संलग्न करने के लिए दस्तावेज़ अपलोड अनलॉक करें।',

  docs: {
    saleDeedName: 'विक्रय विलेख दस्तावेज़',
    saleDeedMeta: 'प्रारूप अथवा अंतिम प्रति',
    identityName: 'पहचान प्रमाण (आधार / पैन)',
    identityMeta: 'rajesh_aadhaar_card.pdf ({{size}})',
    identityUploading: 'अपलोड हो रहा है… {{percent}}',
    encumbranceName: 'भार-मुक्ति प्रमाणपत्र',
    encumbranceMeta: 'EC_2023_DL_S_9842.pdf ({{size}})',
    cancelUpload: 'अपलोड रद्द करें',
    attachedMeta: '{{size}} · संलग्न',
  },

  dropzone: {
    heading: 'अतिरिक्त दस्तावेज़ यहाँ खींचकर छोड़ें',
    hint: 'अथवा अपने कंप्यूटर से चुनने के लिए सक्रिय करें',
    optional: 'एनओसी, मुख्तारनामा, इत्यादि (वैकल्पिक)',
  },

  unlock: 'दस्तावेज़ अपलोड अनलॉक करें',
  continueToReview: 'समीक्षा की ओर बढ़ें',
}
