/** चरण 1 — भूखंड पहचान। */
export default {
  title: 'डिजिटल रजिस्ट्री बनाएँ',
  lede:
    'संपत्ति लेनदेन को राष्ट्रीय ब्लॉकचेन पर सुरक्षित रूप से अभिलिखित करें। सुनिश्चित करें कि सभी भूखंड विवरण अधिकार अभिलेख (आरओआर) से मेल खाते हैं।',

  sectionTitle: 'भूखंड पहचान',

  ulpinLabel: 'अद्वितीय भूखंड पहचान संख्या (यूएलपीआईएन)',
  ulpinPlaceholder: 'उदा. 12345678901234',
  searchErrorEmpty: 'खोजने से पहले यूएलपीआईएन दर्ज करें।',

  stateLabel: 'राज्य',
  districtLabel: 'ज़िला',
  tehsilLabel: 'तहसील',
  villageLabel: 'गाँव',
  surveyLabel: 'सर्वे / खसरा सं.',
  plotLabel: 'प्लॉट सं.',
  rorLabel: 'आरओआर संदर्भ सं.',

  /**
   * स्थान-नाम केवल प्रदर्शन के लिए अनूदित हैं — संग्रहीत मान अंग्रेज़ी ही
   * रहता है, इसलिए भाषा बदलने से अभिलेख कभी नहीं बदलता।
   */
  places: {
    Maharashtra: 'महाराष्ट्र',
    Gujarat: 'गुजरात',
    Karnataka: 'कर्नाटक',
    Pune: 'पुणे',
    Mumbai: 'मुंबई',
    Nagpur: 'नागपुर',
    Haveli: 'हवेली',
    Khed: 'खेड़',
  },

  selected: {
    eyebrow: 'चयनित भूखंड विवरण',
    heading: 'पी-{{survey}} / {{village}}',
    areaLabel: 'क्षेत्रफल',
    landUseLabel: 'भू-उपयोग',
    encumbranceLabel: 'भार',
    encumbranceNone: 'कोई नहीं',
    ownerLabel: 'स्वामी',
    ownerValue: 'आर. कुमार (आंशिक)',
  },

  continueToParties: 'पक्षकारों की ओर बढ़ें',
}
