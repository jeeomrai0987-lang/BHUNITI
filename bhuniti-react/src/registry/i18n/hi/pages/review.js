/** चरण 5 एवं 6 — समीक्षा एवं प्रस्तुतीकरण। */
export default {
  eyebrow: 'प्रक्रिया',
  stepRange: 'चरण 5 एवं 6',
  title: 'समीक्षा एवं प्रस्तुतीकरण',
  lede:
    'उप-निबंधक कार्यालय को अंतिम रूप से प्रस्तुत करने से पूर्व अपने डिजिटल रजिस्ट्री आवेदन के समेकित विवरण सत्यापित करें।',

  parcelCard: {
    title: 'भूखंड जानकारी',
    subtitle: 'स्थिति एवं भौतिक विशेषताएँ',
    ulpin: 'यूएलपीआईएन (भू-आधार)',
    stateDistrict: 'राज्य / ज़िला',
    talukaVillage: 'तालुका / गाँव',
    surveyPlot: 'सर्वे / गट सं.',
    totalArea: 'कुल क्षेत्रफल',
    landUse: 'भू-उपयोग',
    landUseValue: '{{purpose}} (श्रेणी I)',
    gisVerified: 'जीआईएस सीमा सत्यापित',
    gisOpen: 'इस भूखंड का जीआईएस नक्शा खोलें',
  },

  partiesCard: {
    title: 'संबंधित पक्षकार',
    subtitle: 'निष्पादक एवं दावेदार विवरण',
    executant: 'निष्पादक (विक्रेता)',
    claimant: 'दावेदार (क्रेता)',
    sellerName: 'राजाराम भोसले',
    buyerSampleName: 'प्रिया देशमुख',
    aadhaarLine: 'आधार: {{value}}',
    ekyc: 'ई-केवाईसी सत्यापित',
  },

  feesCard: {
    title: 'लेनदेन एवं शुल्क',
    subtitle: 'प्रतिफल मूल्य एवं स्टांप शुल्क',
    deedType: 'विलेख प्रकार',
    deedTypeValue: '{{deed}} ({{purpose}})',
    consideration: 'प्रतिफल मूल्य',
    marketValue: 'बाज़ार मूल्य (रेडी रेकनर)',
    heading: 'शुल्क गणना',
    stampDuty: 'स्टांप शुल्क ({{rate}})',
    registration: 'पंजीकरण शुल्क ({{rate}})',
    cess: 'उपकर / अधिभार ({{rate}})',
    total: 'कुल देय राशि',
    paymentVerified: 'भुगतान सत्यापित (जीआरएन: {{grn}})',
  },

  documentsCard: {
    title: 'अपलोड किए गए दस्तावेज़',
    subtitle: 'अनुलग्नक एवं प्रमाण',
    deedName: 'Draft_Sale_Deed_v2.pdf',
    deedMeta: '{{size}} • डिजिटल हस्ताक्षरित',
    extractName: '7_12_Extract_Recent.pdf',
    extractMeta: '{{size}} • प्रणाली द्वारा प्राप्त',
    nocName: 'NOC_Collector.pdf',
    nocMeta: '{{size}} • अपलोड किया गया',
  },

  reconciliation: {
    title: 'आँकड़ा समाधान',
    ulpinTitle: 'यूएलपीआईएन मान्य',
    ulpinDetail: 'केंद्रीय भू-स्थानिक डेटाबेस से मेल खाता है',
    rorTitle: 'अधिकार अभिलेख (आरओआर) समन्वित',
    rorDetail: 'स्वामित्व विवरण राज्य अभिलेखों से मेल खाते हैं',
    encumbranceTitle: 'कोई भार नहीं पाया गया',
    encumbranceDetail: 'सर्साई एवं स्थानीय न्यायालयों से मुक्त',
    systemStatusLabel: 'प्रणाली स्थिति',
    systemStatusValue: 'सत्यापन के लिए तैयार',
    systemStatusIcon: 'सभी समाधान जाँच उत्तीर्ण',
  },

  declaration:
    'मैं घोषणा करता/करती हूँ कि दी गई जानकारी मेरी जानकारी के अनुसार सत्य एवं सही है। मैं समझता/समझती हूँ कि असत्य जानकारी देना विधि के अंतर्गत दंडनीय अपराध है।',
  submitButton: 'डिजिटल रजिस्ट्री प्रस्तुत करें',
  /** निष्क्रिय प्रस्तुत बटन का कारण, जो पहले कहीं नहीं बताया गया था। */
  submitBlocked: 'प्रस्तुत करने के लिए ऊपर दी गई घोषणा स्वीकार करें।',
  forwardedTo: 'आवेदन उप-निबंधक कार्यालय, हवेली-II को भेजा जाएगा।',
  backToTransaction: 'लेनदेन एवं दस्तावेज़ पर वापस जाएँ',
}
