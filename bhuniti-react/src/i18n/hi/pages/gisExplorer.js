/*
 * Hindi strings for src/pages/revenue/GisExplorer.jsx -- the officer's
 * spatial search and 360° inspection screen.
 *
 * Reached from a component as t("pages.gisExplorer....").
 */

const gisExplorer = {
  header: {
    portal: "राजस्व अधिकारी",
    title: "जीआईएस एक्सप्लोरर एवं 360° निरीक्षण",
    postgis: "पोस्टजीआईएस क्लाउड सक्रिय",
    openSearch: "खोज एवं सूची",
    closeSearch: "खोज बंद करें",
  },

  search: {
    heading: "स्थानिक भूमि खोज",
    hint: "यूएलपीआईएन / खसरा द्वारा भूखंड खोजें",
    label: "सार्वत्रिक भूखंड पिन (ULPIN) / खसरा",
    placeholder: "उदा. 1024, 412/1, P-1026",
    submit: "जीआईएस मानचित्र पर खोजें",
    close: "खोज पटल बंद करें",
  },

  roster: {
    heading: "त्वरित भूखंड सूची ({{village}})",
    khasra: "ख. {{number}}",
    select: "भूखंड {{khasra}} ({{owner}}) मानचित्र पर दिखाएँ",
  },

  hint: "360° भू-निरीक्षण हेतु किसी भी भूखंड बहुभुज पर टैप करें",
};

export default gisExplorer;
