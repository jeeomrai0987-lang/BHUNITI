/** चरण 2 — स्वामी एवं पक्षकार विवरण। */
export default {
  asideHeading: 'डिजिटल रजिस्ट्री',
  transactionIdLabel: 'लेनदेन आईडी:',

  propertyContextLabel: 'संपत्ति संदर्भ',
  propertyContextAction: 'भूखंड पहचान पर वापस जाएँ',
  parcelIdLine: 'भूखंड आईडी: {{survey}}/{{plot}} {{village}}',

  currentOwner: {
    heading: 'वर्तमान पंजीकृत स्वामी',
    verifiedBadge: 'आधार द्वारा सत्यापित',
    shareChartLabel: 'प्रमुख स्वामी के पास {{share}} प्रतिशत हिस्सा है',
    primaryOwner: 'प्रमुख स्वामी',
    soleOwner: 'एकमात्र स्वामी',
    fullNameLabel: 'पूरा नाम',
    parentageLabel: 'पितृत्व',
    dobLabel: 'जन्म तिथि',
    mobileLabel: 'मोबाइल नंबर',
    emailLabel: 'ईमेल पता',
    govtIdLabel: 'सरकारी पहचान (आधार)',
    addressLabel: 'पंजीकृत पता',
    name: 'राजेश कुमार',
    parentage: 'सुपुत्र सुरेश कुमार',
    dob: '14-अगस्त-1975',
    address: '142, ब्लॉक सी, वसंत विहार, नई दिल्ली, 110057',
  },

  coOwner: {
    nameLabel: 'सह-स्वामी {{n}} — पूरा नाम',
    namePlaceholder: 'उदा. सुनीता कुमार',
    shareLabel: 'हिस्सा %',
    remove: 'सह-स्वामी {{n}} हटाएँ',
    add: 'सह-स्वामी जोड़ें',
    overAllocated:
      'सह-स्वामियों का कुल हिस्सा {{total}}% है। आगे बढ़ने से पहले इसे 100% या कम करें।',
  },

  transferee: {
    heading: 'नया स्वामी / अंतरिती',
    lede: 'संपत्ति प्राप्त करने वाले व्यक्ति अथवा संस्था का विवरण दर्ज करें।',
    nameLabel: 'पूरा नाम (सरकारी पहचान के अनुसार)',
    namePlaceholder: 'उदा. अनीता शर्मा',
    parentLabel: 'पितृत्व / पति-पत्नी का नाम',
    parentPlaceholder: 'उदा. सुपुत्री रमेश शर्मा',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '98765 43210',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'anita.sharma@example.com',
    addressLabel: 'स्थायी पता',
    addressPlaceholder: 'पूरा पता दर्ज करें…',
    idTypeLabel: 'सरकारी पहचान का प्रकार',
    idTypePlaceholder: 'पहचान दस्तावेज़ चुनें',
    idNumberLabel: 'सरकारी पहचान संख्या',
    idNumberPlaceholder: 'पहचान संख्या दर्ज करें',
    idTypes: {
      aadhaar: 'आधार कार्ड',
      pan: 'पैन कार्ड',
      voter: 'मतदाता पहचान पत्र',
      passport: 'पासपोर्ट',
    },
  },

  parties: {
    nameLabel: 'अतिरिक्त पक्षकार {{n}} — नाम',
    namePlaceholder: 'उदा. विक्रम राव',
    roleLabel: 'भूमिका',
    remove: 'अतिरिक्त पक्षकार {{n}} हटाएँ',
    add: 'अतिरिक्त पक्षकार जोड़ें',
    roles: {
      witness: 'साक्षी',
      poa: 'मुख्तारनामा धारक',
      guardian: 'संरक्षक',
      confirming: 'पुष्टिकर्ता पक्ष',
    },
  },

  continueToTransaction: 'लेनदेन की ओर बढ़ें',
}
