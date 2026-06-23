import {
  Laptop,
  Scale,
  ScrollText,
  Home,
  ShoppingCart,
  Users,
  Briefcase,
  Car,
  ClipboardList,
  Banknote,
  Stethoscope,
  HeartHandshake,
  Compass,
} from "lucide-react";

const FONT_HEAD = "'Cormorant Garamond','Tiro Devanagari Hindi',serif";
const FONT_BODY = "'DM Sans','Mukta','Noto Sans Devanagari',sans-serif";

/* ══ LANGUAGES ══ */
const LANGS = [
  { code: "hinglish", name: "Hinglish", prompt: "Hinglish", speech: "en-IN" },
  { code: "hi", name: "हिन्दी", prompt: "Hindi", speech: "hi-IN" },
  { code: "en", name: "English", prompt: "English", speech: "en-IN" },
];

/* Chat-supported languages (display only — chat AI replies in these) */
const CHAT_LANGS = [
  "हिन्दी",
  "English",
  "Hinglish",
  "বাংলা",
  "मराठी",
  "తెలుగు",
  "தமிழ்",
  "ગુજરાતી",
  "ಕನ್ನಡ",
  "മലയാളം",
  "ਪੰਜਾਬੀ",
  "ଓଡ଼ିଆ",
  "اردو",
  "অসমীয়া",
];

const STATES = [
  "All India",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/* ══ VERIFIED HELPLINES ══ */
const HELP = {
  legalAid: {
    num: "15100",
    t: {
      hinglish: "Free Legal Aid (NALSA)",
      hi: "मुफ़्त कानूनी सहायता (NALSA)",
      en: "Free Legal Aid (NALSA)",
    },
  },
  emergency: {
    num: "112",
    t: {
      hinglish: "Emergency — Police/Fire/Ambulance",
      hi: "आपातकाल — पुलिस/फायर/एम्बुलेंस",
      en: "Emergency — Police/Fire/Ambulance",
    },
  },
  cyber: {
    num: "1930",
    t: { hinglish: "Cyber Crime", hi: "साइबर क्राइम", en: "Cyber Crime" },
  },
  women: {
    num: "181",
    t: {
      hinglish: "Women Helpline",
      hi: "महिला हेल्पलाइन",
      en: "Women Helpline",
    },
  },
  child: {
    num: "1098",
    t: {
      hinglish: "Child Helpline",
      hi: "चाइल्ड हेल्पलाइन",
      en: "Child Helpline",
    },
  },
  senior: {
    num: "14567",
    t: {
      hinglish: "Senior Citizen (Elderline)",
      hi: "वरिष्ठ नागरिक (Elderline)",
      en: "Senior Citizen (Elderline)",
    },
  },
};
const CAT_HELP = {
  cyber: ["cyber"],
  family: ["women", "child"],
  scst: ["women"],
  medical: ["emergency"],
  general: [],
};

const LAWS = {
  cyber: ["IT Act 2000", "BNS 2023", "DPDP Act 2023"],
  criminal: ["BNS 2023", "BNSS 2023", "Constitution Art. 22"],
  civil: ["CPC 1908", "Indian Contract Act 1872", "Specific Relief Act 1963"],
  property: [
    "Transfer of Property Act 1882",
    "Registration Act 1908",
    "BNS 2023",
  ],
  consumer: ["Consumer Protection Act 2019", "RERA 2016"],
  family: [
    "DV Act 2005",
    "POCSO Act 2012",
    "Personal / Marriage Laws",
    "BNS 2023",
  ],
  labour: [
    "Code on Wages 2019",
    "Payment of Wages Act 1936",
    "PoSH Act 2013",
    "EPF Act 1952",
  ],
  traffic: ["Motor Vehicles Act 1988", "BNS 2023"],
  rti: ["RTI Act 2005", "Prevention of Corruption Act 1988"],
  cheque: ["NI Act 1881 — Sec 138", "BNS 2023"],
  medical: [
    "Consumer Protection Act 2019",
    "BNS 2023 (negligence)",
    "Clinical Establishments Act 2010",
  ],
  scst: [
    "SC/ST (Prevention of Atrocities) Act 1989",
    "Constitution Art. 17",
    "BNS 2023",
  ],
  general: ["Constitution of India", "BNS / BNSS 2023"],
};
const INDIA_CODE = "https://www.indiacode.nic.in/";

/* ══ VERIFIED NATIONAL e-PORTALS ══ */
const PORTALS = {
  cyber: {
    url: "https://cybercrime.gov.in",
    t: {
      hinglish: "Cyber crime report karein",
      hi: "साइबर क्राइम रिपोर्ट करें",
      en: "Report Cyber Crime",
    },
  },
  consumer: {
    url: "https://e-jagriti.gov.in/",
    t: {
      hinglish: "Consumer complaint (e-Jagriti)",
      hi: "उपभोक्ता शिकायत (e-Jagriti)",
      en: "Consumer complaint (e-Jagriti)",
    },
  },
  rti: {
    url: "https://rtionline.gov.in",
    t: {
      hinglish: "RTI online file karein",
      hi: "RTI ऑनलाइन फ़ाइल करें",
      en: "File RTI online",
    },
  },
  legalAid: {
    url: "https://nalsa.gov.in",
    t: {
      hinglish: "Free legal aid (NALSA)",
      hi: "मुफ़्त कानूनी सहायता (NALSA)",
      en: "Free legal aid (NALSA)",
    },
  },
  indiaCode: {
    url: INDIA_CODE,
    t: {
      hinglish: "Kanoon padhein (India Code)",
      hi: "कानून पढ़ें (India Code)",
      en: "Read the laws (India Code)",
    },
  },
};
const CAT_PORTAL = {
  cyber: ["cyber"],
  consumer: ["consumer"],
  medical: ["consumer"],
  property: ["consumer"],
  rti: ["rti"],
  general: [],
};
const stateSearchUrl = (q) =>
  `https://www.google.com/search?q=${encodeURIComponent(q + " site:gov.in")}`;

const CRISIS = {
  family: [0, 4, 5, 6],
  scst: [0],
  criminal: [4, 5],
  medical: [3],
  cyber: [4],
};
const CRISIS_WORDS = [
  "maar",
  "peet",
  "pit",
  "hinsa",
  "violence",
  "abuse",
  "beat",
  "assault",
  "rape",
  "balatkar",
  "suicide",
  "aatmhatya",
  "khudkushi",
  "jaan se",
  "blackmail",
  "viral",
  "dhamki",
  "threat",
  "बलात्कार",
  "आत्महत्या",
  "हिंसा",
  "धमकी",
  "मारपीट",
];
const isCrisis = (catId, idx, customText) => {
  if ((CRISIS[catId] || []).includes(idx)) return true;
  if (customText) {
    const l = customText.toLowerCase();
    return CRISIS_WORDS.some((w) => l.includes(w));
  }
  return false;
};

/* ══ CATEGORY ICONS (lucide) ══ */
const ICONS = {
  cyber: Laptop,
  criminal: Scale,
  civil: ScrollText,
  property: Home,
  consumer: ShoppingCart,
  family: Users,
  labour: Briefcase,
  traffic: Car,
  rti: ClipboardList,
  cheque: Banknote,
  medical: Stethoscope,
  scst: HeartHandshake,
  general: Compass,
};

/* ══ UI STRINGS ══ */
const UI = {
  hinglish: {
    anon: "100% Anonymous",
    tagPre: "Vakil se pehle —",
    h1Pre: "Apna ",
    h1Accent: "Haq",
    h1Line2: "Jaano",
    heroSub1: "Nyay tak pahunchne ka sahi rasta",
    heroSub2: "Gumnaam · Muft · Aapki bhasha mein",
    cta: "Shuru Karein — Free Hai",
    chatLangNote: "AI chat in bhashaon mein jawab deta hai:",
    footNoData: "No Data",
    footInstant: "Instant",
    footLang: "Any Language",
    footFree: "Free",
    popularTitle: "Sabse zyada pooche gaye",
    topicSub: "Topic chunein",
    smartTitle: "Pata nahi kaunsi category?",
    smartDesc: "Koi baat nahi — seedha apni problem likhein",
    scenarioHeading: "Aapki samasya kya hai?",
    scenarioSub: "Ek option chunein, ya neeche apni baat likhein",
    customPlaceholder: "Apni samasya khud likhein…",
    ask: "Poochho",
    chatPlaceholder: "Aur kuch poochhein…",
    voiceTitle: "Bolkar batayein",
    voiceUnsupported: "Is browser mein voice support nahi hai",
    complaintBtn: "Complaint",
    docsBtn: "Documents",
    strengthBtn: "Case strength",
    lawsBtn: "Laws",
    helpBtn: "Helpline",
    complaintTitle: "Complaint / Notice Draft",
    docsTitle: "Zaroori Documents",
    strengthTitle: "Case Strength Analysis",
    lawsTitle: "Relevant Laws",
    verifyLaws: "India Code par verify karein",
    lawsNote:
      "Ye aam taur par lagne wale kanoon hain — apne case ke liye verify karein.",
    lawsUpdated: "BNS/BNSS 2023 ke hisaab se · India Code par taaza jaankari",
    portalsTitle: "Useful Portals",
    statePortals: "State portals",
    openLbl: "Open",
    stateSearchNote: "Official sarkari portal ka search khulega",
    helpTitle: "Zaroori Helpline Numbers",
    legalAidPush:
      "Income kam hai? NALSA se MUFT vakil mil sakta hai — 15100 par call karein.",
    crisisTitle: "Aap akele nahi ho",
    crisisDesc: "Pehle ye numbers — turant madad ke liye:",
    generating: "Taiyaar ho raha hai…",
    complaintHint: "Ise vakil se verify zaroor karwayein",
    editHint: "Aap is draft ko edit kar sakte ho",
    download: "Download",
    copy: "Copy",
    copied: "Copied!",
    share: "Share",
    listen: "Suno",
    retry: "Dobara try karein",
    call: "Call",
    saveLbl: "Save",
    savedLbl: "Saved",
    networkErr: "Network issue. Internet check karke dobara try karein.",
    noAnswer: "Maaf kijiye, abhi jawab nahi mil paya. Dobara koshish karein.",
    disclaimer:
      "Legal awareness only — serious maamlein mein qualified vakil se milein",
    fu: [
      "Kitna samay lagega?",
      "Kya ye free hai?",
      "Aur kaunse documents?",
      "Online kaise karun?",
    ],
    settings: "Settings",
    themeLbl: "Theme",
    dark: "Dark",
    light: "Light",
    sizeLbl: "Text size",
    stateLbl: "Aapka State",
    savedTitle: "Meri Baatein",
    savedEmpty: "Abhi kuch save nahi kiya. Kisi jawab par 🔖 dabayein.",
    step1: "Topic",
    step2: "Samasya",
    step3: "Jawab",
  },
  hi: {
    anon: "100% गुमनाम",
    tagPre: "वकील से पहले —",
    h1Pre: "अपना ",
    h1Accent: "हक़",
    h1Line2: "जानो",
    heroSub1: "न्याय तक पहुँचने का सही रास्ता",
    heroSub2: "गुमनाम · मुफ़्त · आपकी भाषा में",
    cta: "शुरू करें — मुफ़्त है",
    chatLangNote: "AI चैट इन भाषाओं में जवाब देता है:",
    footNoData: "नो डेटा",
    footInstant: "तुरंत",
    footLang: "कोई भी भाषा",
    footFree: "मुफ़्त",
    popularTitle: "सबसे ज़्यादा पूछे गए",
    topicSub: "विषय चुनें",
    smartTitle: "पता नहीं कौन सी श्रेणी?",
    smartDesc: "कोई बात नहीं — सीधे अपनी समस्या लिखें",
    scenarioHeading: "आपकी समस्या क्या है?",
    scenarioSub: "एक विकल्प चुनें, या नीचे अपनी बात लिखें",
    customPlaceholder: "अपनी समस्या खुद लिखें…",
    ask: "पूछें",
    chatPlaceholder: "और कुछ पूछें…",
    voiceTitle: "बोलकर बताएं",
    voiceUnsupported: "इस ब्राउज़र में वॉइस सपोर्ट नहीं है",
    complaintBtn: "शिकायत",
    docsBtn: "दस्तावेज़",
    strengthBtn: "केस मज़बूती",
    lawsBtn: "कानून",
    helpBtn: "हेल्पलाइन",
    complaintTitle: "शिकायत / नोटिस ड्राफ्ट",
    docsTitle: "ज़रूरी दस्तावेज़",
    strengthTitle: "केस मज़बूती विश्लेषण",
    lawsTitle: "प्रासंगिक कानून",
    verifyLaws: "India Code पर जाँचें",
    lawsNote:
      "ये आम तौर पर लागू होने वाले कानून हैं — अपने केस के लिए ज़रूर जाँचें।",
    lawsUpdated: "BNS/BNSS 2023 के अनुसार · India Code पर ताज़ा जानकारी",
    portalsTitle: "उपयोगी पोर्टल",
    statePortals: "राज्य पोर्टल",
    openLbl: "खोलें",
    stateSearchNote: "आधिकारिक सरकारी पोर्टल का सर्च खुलेगा",
    helpTitle: "ज़रूरी हेल्पलाइन नंबर",
    legalAidPush:
      "आय कम है? NALSA से मुफ़्त वकील मिल सकता है — 15100 पर कॉल करें।",
    crisisTitle: "आप अकेले नहीं हैं",
    crisisDesc: "पहले ये नंबर — तुरंत मदद के लिए:",
    generating: "तैयार हो रहा है…",
    complaintHint: "इसे वकील से ज़रूर जाँच करवाएं",
    editHint: "आप इस ड्राफ्ट को संपादित कर सकते हैं",
    download: "डाउनलोड",
    copy: "कॉपी",
    copied: "कॉपी हो गया!",
    share: "शेयर",
    listen: "सुनें",
    retry: "दोबारा कोशिश करें",
    call: "कॉल",
    saveLbl: "सेव",
    savedLbl: "सेव हो गया",
    networkErr: "नेटवर्क समस्या। इंटरनेट जाँच कर दोबारा प्रयास करें।",
    noAnswer: "क्षमा करें, अभी जवाब नहीं मिल पाया। दोबारा कोशिश करें।",
    disclaimer: "केवल कानूनी जागरूकता — गंभीर मामलों में योग्य वकील से मिलें",
    fu: [
      "कितना समय लगेगा?",
      "क्या यह मुफ़्त है?",
      "और कौन से दस्तावेज़?",
      "ऑनलाइन कैसे करूँ?",
    ],
    settings: "सेटिंग्स",
    themeLbl: "थीम",
    dark: "डार्क",
    light: "लाइट",
    sizeLbl: "टेक्स्ट साइज़",
    stateLbl: "आपका राज्य",
    savedTitle: "मेरी बातें",
    savedEmpty: "अभी कुछ सेव नहीं किया। किसी जवाब पर 🔖 दबाएं।",
    step1: "विषय",
    step2: "समस्या",
    step3: "जवाब",
  },
  en: {
    anon: "100% Anonymous",
    tagPre: "Before a lawyer —",
    h1Pre: "Know Your ",
    h1Accent: "Rights",
    h1Line2: "",
    heroSub1: "The right path to justice",
    heroSub2: "Anonymous · Free · In your language",
    cta: "Get Started — It's Free",
    chatLangNote: "AI chat replies in these languages:",
    footNoData: "No Data",
    footInstant: "Instant",
    footLang: "Any Language",
    footFree: "Free",
    popularTitle: "Most asked",
    topicSub: "Choose a topic",
    smartTitle: "Not sure which category?",
    smartDesc: "No problem — just describe your issue",
    scenarioHeading: "What's your problem?",
    scenarioSub: "Pick an option, or describe it yourself below",
    customPlaceholder: "Describe your problem…",
    ask: "Ask",
    chatPlaceholder: "Ask anything else…",
    voiceTitle: "Speak your problem",
    voiceUnsupported: "Voice input isn't supported in this browser",
    complaintBtn: "Complaint",
    docsBtn: "Documents",
    strengthBtn: "Case strength",
    lawsBtn: "Laws",
    helpBtn: "Helpline",
    complaintTitle: "Complaint / Notice Draft",
    docsTitle: "Documents Needed",
    strengthTitle: "Case Strength Analysis",
    lawsTitle: "Relevant Laws",
    verifyLaws: "Verify on India Code",
    lawsNote:
      "These are the laws that commonly apply — always verify for your specific case.",
    lawsUpdated: "As per BNS/BNSS 2023 · check India Code for the latest",
    portalsTitle: "Useful Portals",
    statePortals: "State portals",
    openLbl: "Open",
    stateSearchNote: "Opens an official government portal search",
    helpTitle: "Important Helpline Numbers",
    legalAidPush:
      "Low income? You may get a FREE lawyer via NALSA — call 15100.",
    crisisTitle: "You are not alone",
    crisisDesc: "First, these numbers for immediate help:",
    generating: "Preparing…",
    complaintHint: "Always get this verified by a lawyer",
    editHint: "You can edit this draft",
    download: "Download",
    copy: "Copy",
    copied: "Copied!",
    share: "Share",
    listen: "Listen",
    retry: "Try again",
    call: "Call",
    saveLbl: "Save",
    savedLbl: "Saved",
    networkErr: "Network issue. Check your internet and try again.",
    noAnswer: "Sorry, couldn't get an answer right now. Please try again.",
    disclaimer:
      "Legal awareness only — for serious matters, consult a qualified lawyer",
    fu: [
      "How long will it take?",
      "Is this free?",
      "What other documents?",
      "How to do it online?",
    ],
    settings: "Settings",
    themeLbl: "Theme",
    dark: "Dark",
    light: "Light",
    sizeLbl: "Text size",
    stateLbl: "Your State",
    savedTitle: "Saved",
    savedEmpty: "Nothing saved yet. Tap 🔖 on any answer.",
    step1: "Topic",
    step2: "Issue",
    step3: "Answer",
  },
};

/* ══ CATEGORIES + SCENARIOS ══ */
const CATEGORIES = [
  {
    id: "cyber",
    color: "#6b8cff",
    card: "rgba(107,140,255,0.10)",
    border: "rgba(107,140,255,0.28)",
    glow: "rgba(107,140,255,0.3)",
    tr: {
      hinglish: {
        t: "Cyber / Digital",
        s: "साइबर क्राइम",
        sc: [
          "Online fraud / paise ki thagi",
          "Social media pe harassment",
          "Fake profile / identity theft",
          "Hacking / account hack hua",
          "Obscene photo/video viral",
          "OTP fraud / UPI scam",
          "Cyberbullying",
          "Dark web / data leak",
        ],
      },
      hi: {
        t: "साइबर / डिजिटल",
        s: "साइबर अपराध",
        sc: [
          "ऑनलाइन धोखाधड़ी / पैसे की ठगी",
          "सोशल मीडिया पर उत्पीड़न",
          "फ़र्ज़ी प्रोफ़ाइल / पहचान की चोरी",
          "हैकिंग / अकाउंट हैक हुआ",
          "अश्लील फ़ोटो/वीडियो वायरल",
          "OTP धोखा / UPI स्कैम",
          "साइबर बुलिंग",
          "डार्क वेब / डेटा लीक",
        ],
      },
      en: {
        t: "Cyber / Digital",
        s: "Cyber Crime",
        sc: [
          "Online fraud / money scam",
          "Harassment on social media",
          "Fake profile / identity theft",
          "Hacking / account hacked",
          "Obscene photo/video leaked",
          "OTP fraud / UPI scam",
          "Cyberbullying",
          "Dark web / data leak",
        ],
      },
    },
  },
  {
    id: "criminal",
    color: "#ff6b6b",
    card: "rgba(255,107,107,0.10)",
    border: "rgba(255,107,107,0.28)",
    glow: "rgba(255,107,107,0.3)",
    tr: {
      hinglish: {
        t: "Criminal (Faujdari)",
        s: "फौजदारी मामले",
        sc: [
          "FIR darz nahi ho rahi",
          "Jhoothi FIR mujhpe hui",
          "Mujhe arrest kiya — rights?",
          "Bail kaise milegi",
          "Maar-peet / assault hua",
          "Dhamki / threat mil rahi hai",
          "Chori / dakaiti hui",
          "Police ne pareshaan kiya",
        ],
      },
      hi: {
        t: "आपराधिक (फ़ौजदारी)",
        s: "फ़ौजदारी मामले",
        sc: [
          "FIR दर्ज नहीं हो रही",
          "मुझ पर झूठी FIR हुई",
          "मुझे गिरफ़्तार किया — अधिकार?",
          "ज़मानत कैसे मिलेगी",
          "मार-पीट / हमला हुआ",
          "धमकी मिल रही है",
          "चोरी / डकैती हुई",
          "पुलिस ने परेशान किया",
        ],
      },
      en: {
        t: "Criminal",
        s: "Criminal Matters",
        sc: [
          "FIR not being registered",
          "False FIR filed against me",
          "I was arrested — my rights?",
          "How to get bail",
          "Assault / beating happened",
          "Receiving threats",
          "Theft / robbery happened",
          "Police harassed me",
        ],
      },
    },
  },
  {
    id: "civil",
    color: "#f0a500",
    card: "rgba(240,165,0,0.10)",
    border: "rgba(240,165,0,0.28)",
    glow: "rgba(240,165,0,0.3)",
    tr: {
      hinglish: {
        t: "Civil (Deewani)",
        s: "दीवानी मामले",
        sc: [
          "Paisa wapas nahi mila",
          "Contract toot gaya",
          "Kisi ne dhoka diya",
          "Injunction chahiye",
          "Court notice aaya",
          "Muavza (damages) chahiye",
          "Documents fake hain",
          "Promissory note / bond",
        ],
      },
      hi: {
        t: "दीवानी (सिविल)",
        s: "दीवानी मामले",
        sc: [
          "पैसा वापस नहीं मिला",
          "अनुबंध टूट गया",
          "किसी ने धोखा दिया",
          "निषेधाज्ञा (इंजंक्शन) चाहिए",
          "कोर्ट नोटिस आया",
          "मुआवज़ा चाहिए",
          "दस्तावेज़ फ़र्ज़ी हैं",
          "प्रॉमिसरी नोट / बॉन्ड",
        ],
      },
      en: {
        t: "Civil",
        s: "Civil Matters",
        sc: [
          "Money not returned",
          "Contract was broken",
          "Someone cheated me",
          "Need an injunction",
          "Received a court notice",
          "Need compensation (damages)",
          "Documents are fake",
          "Promissory note / bond",
        ],
      },
    },
  },
  {
    id: "property",
    color: "#34d399",
    card: "rgba(52,211,153,0.10)",
    border: "rgba(52,211,153,0.28)",
    glow: "rgba(52,211,153,0.3)",
    tr: {
      hinglish: {
        t: "Zameen / Property",
        s: "ज़मीन / संपत्ति",
        sc: [
          "Padosi ne kabza kar liya",
          "Zameen ka mutation nahi",
          "Ghar se bekhali ka darr",
          "Wirasat mein hissa nahi",
          "Registry mein gadbad",
          "Benami property issue",
          "Builder ne paise liye, ghar nahi diya",
          "Zameen par jhootha claim",
        ],
      },
      hi: {
        t: "ज़मीन / संपत्ति",
        s: "ज़मीन / संपत्ति",
        sc: [
          "पड़ोसी ने कब्ज़ा कर लिया",
          "ज़मीन का दाख़िल-ख़ारिज नहीं हुआ",
          "घर से बेदख़ली का डर",
          "विरासत में हिस्सा नहीं",
          "रजिस्ट्री में गड़बड़",
          "बेनामी संपत्ति का मामला",
          "बिल्डर ने पैसे लिए, घर नहीं दिया",
          "ज़मीन पर झूठा दावा",
        ],
      },
      en: {
        t: "Land / Property",
        s: "Land & Property",
        sc: [
          "Neighbour encroached my land",
          "Land mutation not done",
          "Fear of eviction from home",
          "No share in inheritance",
          "Problem in registry",
          "Benami property issue",
          "Builder took money, no house",
          "False claim on my land",
        ],
      },
    },
  },
  {
    id: "consumer",
    color: "#fb923c",
    card: "rgba(251,146,60,0.10)",
    border: "rgba(251,146,60,0.28)",
    glow: "rgba(251,146,60,0.3)",
    tr: {
      hinglish: {
        t: "Consumer Rights",
        s: "उपभोक्ता अधिकार",
        sc: [
          "Kharab product mila",
          "Service nahi mili, paise gaye",
          "Online order fraud",
          "Builder ne flat nahi diya (RERA)",
          "Hospital ne bill zyada liya",
          "Insurance claim reject hua",
          "Warranty honor nahi ki",
          "MRP se zyada charge kiya",
        ],
      },
      hi: {
        t: "उपभोक्ता अधिकार",
        s: "उपभोक्ता अधिकार",
        sc: [
          "ख़राब प्रोडक्ट मिला",
          "सेवा नहीं मिली, पैसे गए",
          "ऑनलाइन ऑर्डर फ्रॉड",
          "बिल्डर ने फ्लैट नहीं दिया (RERA)",
          "अस्पताल ने ज़्यादा बिल लिया",
          "इंश्योरेंस क्लेम रिजेक्ट हुआ",
          "वारंटी पूरी नहीं की",
          "MRP से ज़्यादा चार्ज किया",
        ],
      },
      en: {
        t: "Consumer Rights",
        s: "Consumer Rights",
        sc: [
          "Received a defective product",
          "Paid but service not given",
          "Online order fraud",
          "Builder didn't deliver flat (RERA)",
          "Hospital overcharged the bill",
          "Insurance claim rejected",
          "Warranty not honoured",
          "Charged above MRP",
        ],
      },
    },
  },
  {
    id: "family",
    color: "#f472b6",
    card: "rgba(244,114,182,0.10)",
    border: "rgba(244,114,182,0.28)",
    glow: "rgba(244,114,182,0.3)",
    tr: {
      hinglish: {
        t: "Family / Personal",
        s: "पारिवारिक मामले",
        sc: [
          "Ghar mein maar-peet hoti hai",
          "Talaq / divorce lena hai",
          "Bachche ki custody chahiye",
          "Maintenance / guzara nahi milta",
          "Dahej ke liye tang kiya",
          "Shaadi se inkaar — forced marriage",
          "Bachche ka sexual abuse (POCSO)",
          "Wirasat mein hissa nahi",
        ],
      },
      hi: {
        t: "पारिवारिक / निजी",
        s: "पारिवारिक मामले",
        sc: [
          "घर में मार-पीट होती है",
          "तलाक़ लेना है",
          "बच्चे की कस्टडी चाहिए",
          "गुज़ारा भत्ता नहीं मिलता",
          "दहेज के लिए तंग किया",
          "ज़बरन शादी का दबाव",
          "बच्चे का यौन शोषण (POCSO)",
          "विरासत में हिस्सा नहीं",
        ],
      },
      en: {
        t: "Family / Personal",
        s: "Family Matters",
        sc: [
          "Domestic violence at home",
          "Want a divorce",
          "Need custody of my child",
          "Not getting maintenance",
          "Harassed for dowry",
          "Forced marriage pressure",
          "Child sexual abuse (POCSO)",
          "No share in inheritance",
        ],
      },
    },
  },
  {
    id: "labour",
    color: "#2dd4bf",
    card: "rgba(45,212,191,0.10)",
    border: "rgba(45,212,191,0.28)",
    glow: "rgba(45,212,191,0.3)",
    tr: {
      hinglish: {
        t: "Labour / Job",
        s: "मज़दूरी / नौकरी",
        sc: [
          "Salary nahi mili",
          "Naukri se nikaala — rights?",
          "PF / ESI nahi diya",
          "Kaam par sexual harassment",
          "Minimum wage nahi mili",
          "Overtime ka paisa nahi",
          "Maternity leave denied",
          "Kaam par bhede-bhaav",
        ],
      },
      hi: {
        t: "श्रम / नौकरी",
        s: "मज़दूरी / नौकरी",
        sc: [
          "सैलरी नहीं मिली",
          "नौकरी से निकाला — अधिकार?",
          "PF / ESI नहीं दिया",
          "काम पर यौन उत्पीड़न",
          "न्यूनतम मज़दूरी नहीं मिली",
          "ओवरटाइम का पैसा नहीं",
          "मातृत्व अवकाश नहीं दिया",
          "काम पर भेदभाव",
        ],
      },
      en: {
        t: "Labour / Job",
        s: "Work & Wages",
        sc: [
          "Salary not paid",
          "Fired from job — my rights?",
          "PF / ESI not given",
          "Sexual harassment at work",
          "Minimum wage not paid",
          "No overtime payment",
          "Maternity leave denied",
          "Discrimination at work",
        ],
      },
    },
  },
  {
    id: "traffic",
    color: "#a78bfa",
    card: "rgba(167,139,250,0.10)",
    border: "rgba(167,139,250,0.28)",
    glow: "rgba(167,139,250,0.3)",
    tr: {
      hinglish: {
        t: "Traffic / Vehicle",
        s: "यातायात / वाहन",
        sc: [
          "Accident mein main ghayal",
          "Insurance claim nahi mila",
          "Hit-and-run hua",
          "Galat challan aaya",
          "Gaadi police ne pakdi",
          "Drunk driving arrest",
          "RC / license ka issue",
          "Gaadi khareed kar dhokha",
        ],
      },
      hi: {
        t: "यातायात / वाहन",
        s: "यातायात / वाहन",
        sc: [
          "दुर्घटना में मैं घायल",
          "इंश्योरेंस क्लेम नहीं मिला",
          "हिट-एंड-रन हुआ",
          "ग़लत चालान आया",
          "पुलिस ने गाड़ी पकड़ी",
          "ड्रंक ड्राइविंग गिरफ़्तारी",
          "RC / लाइसेंस की समस्या",
          "गाड़ी खरीद कर धोखा",
        ],
      },
      en: {
        t: "Traffic / Vehicle",
        s: "Traffic & Vehicle",
        sc: [
          "I was injured in an accident",
          "Insurance claim not paid",
          "Hit-and-run happened",
          "Got a wrong challan",
          "Police seized my vehicle",
          "Drunk driving arrest",
          "RC / licence issue",
          "Cheated while buying a vehicle",
        ],
      },
    },
  },
  {
    id: "rti",
    color: "#38bdf8",
    card: "rgba(56,189,248,0.10)",
    border: "rgba(56,189,248,0.28)",
    glow: "rgba(56,189,248,0.3)",
    tr: {
      hinglish: {
        t: "RTI / Government",
        s: "आरटीआई / सरकारी",
        sc: [
          "RTI kaise file karein",
          "Sarkari kaam nahi ho raha",
          "Rishwat maangi ja rahi hai",
          "Sarkari scheme ka labh nahi mila",
          "Sarkari naukri mein dhokha",
          "Ration card / BPL issue",
          "Aadhar / documents block",
          "Panchayat ne gadbad ki",
        ],
      },
      hi: {
        t: "आरटीआई / सरकारी",
        s: "आरटीआई / सरकारी",
        sc: [
          "RTI कैसे फ़ाइल करें",
          "सरकारी काम नहीं हो रहा",
          "रिश्वत मांगी जा रही है",
          "सरकारी योजना का लाभ नहीं मिला",
          "सरकारी नौकरी में धोखा",
          "राशन कार्ड / BPL समस्या",
          "आधार / दस्तावेज़ ब्लॉक",
          "पंचायत ने गड़बड़ की",
        ],
      },
      en: {
        t: "RTI / Government",
        s: "RTI & Govt",
        sc: [
          "How to file an RTI",
          "Govt work not getting done",
          "Being asked for a bribe",
          "Not getting govt scheme benefit",
          "Cheated in a govt job",
          "Ration card / BPL issue",
          "Aadhaar / documents blocked",
          "Panchayat did wrongdoing",
        ],
      },
    },
  },
  {
    id: "cheque",
    color: "#fbbf24",
    card: "rgba(251,191,36,0.10)",
    border: "rgba(251,191,36,0.28)",
    glow: "rgba(251,191,36,0.3)",
    tr: {
      hinglish: {
        t: "Cheque / Financial",
        s: "चेक / वित्तीय",
        sc: [
          "Mera cheque bounce hua",
          "Maine diya cheque bounce",
          "Loan diya, wapas nahi mila",
          "Bank ne galti ki",
          "Credit card fraud",
          "Faizi (interest) ka chakkar",
          "Chit fund scam",
          "Finance company ne harass kiya",
        ],
      },
      hi: {
        t: "चेक / वित्तीय",
        s: "चेक / वित्तीय",
        sc: [
          "मेरा चेक बाउंस हुआ",
          "मेरे दिए चेक बाउंस हुए",
          "लोन दिया, वापस नहीं मिला",
          "बैंक ने गलती की",
          "क्रेडिट कार्ड फ्रॉड",
          "ब्याज का चक्कर",
          "चिट फंड घोटाला",
          "फाइनेंस कंपनी ने परेशान किया",
        ],
      },
      en: {
        t: "Cheque / Financial",
        s: "Cheque & Finance",
        sc: [
          "My cheque bounced",
          "Cheque I gave bounced",
          "Gave a loan, not repaid",
          "Bank made an error",
          "Credit card fraud",
          "Caught in an interest trap",
          "Chit fund scam",
          "Finance company harassed me",
        ],
      },
    },
  },
  {
    id: "medical",
    color: "#fb7185",
    card: "rgba(251,113,133,0.10)",
    border: "rgba(251,113,133,0.28)",
    glow: "rgba(251,113,133,0.3)",
    tr: {
      hinglish: {
        t: "Medical",
        s: "चिकित्सा लापरवाही",
        sc: [
          "Doctor ki galti se nuksan",
          "Hospital ne ilaj se mana kiya",
          "Naqli dawai / fake medicine",
          "Emergency mein seedha paisa maanga",
          "Medical report galat di",
          "Consent nahi liya operation ka",
          "Private hospital ne loot liya",
          "Health insurance fraud",
        ],
      },
      hi: {
        t: "चिकित्सा",
        s: "चिकित्सा लापरवाही",
        sc: [
          "डॉक्टर की गलती से नुकसान",
          "अस्पताल ने इलाज से मना किया",
          "नकली दवाई",
          "इमरजेंसी में पहले पैसा मांगा",
          "गलत मेडिकल रिपोर्ट दी",
          "ऑपरेशन की सहमति नहीं ली",
          "प्राइवेट अस्पताल ने लूटा",
          "हेल्थ इंश्योरेंस फ्रॉड",
        ],
      },
      en: {
        t: "Medical",
        s: "Medical Negligence",
        sc: [
          "Harm from doctor's mistake",
          "Hospital refused treatment",
          "Fake / counterfeit medicine",
          "Demanded money before emergency care",
          "Gave wrong medical report",
          "No consent taken for operation",
          "Private hospital overcharged",
          "Health insurance fraud",
        ],
      },
    },
  },
  {
    id: "scst",
    color: "#86efac",
    card: "rgba(134,239,172,0.10)",
    border: "rgba(134,239,172,0.28)",
    glow: "rgba(134,239,172,0.3)",
    tr: {
      hinglish: {
        t: "SC/ST Rights",
        s: "अत्याचार / भेदभाव",
        sc: [
          "Jaat ke naam par maar-peet",
          "Gaali di / humiliate kiya",
          "Zameen ya ghar chhudaya",
          "Naukri / school mein bhede-bhaav",
          "Mandir / pani mein rok",
          "FIR nahi likh rahi police",
          "Reservation mein gadbad",
          "Forced labour / bonded labour",
        ],
      },
      hi: {
        t: "SC/ST अधिकार",
        s: "अत्याचार / भेदभाव",
        sc: [
          "जाति के नाम पर मार-पीट",
          "गाली दी / अपमान किया",
          "ज़मीन या घर छीना",
          "नौकरी / स्कूल में भेदभाव",
          "मंदिर / पानी में रोक",
          "पुलिस FIR नहीं लिख रही",
          "आरक्षण में गड़बड़",
          "बंधुआ मज़दूरी",
        ],
      },
      en: {
        t: "SC/ST Rights",
        s: "Atrocity / Discrimination",
        sc: [
          "Beaten over caste",
          "Abused / humiliated",
          "Land or home snatched",
          "Discrimination at job / school",
          "Barred from temple / water",
          "Police won't register FIR",
          "Irregularity in reservation",
          "Forced / bonded labour",
        ],
      },
    },
  },
];
const GENERAL_CAT = {
  id: "general",
  color: "#f0a500",
  card: "rgba(240,165,0,0.10)",
  border: "rgba(240,165,0,0.28)",
  glow: "rgba(240,165,0,0.3)",
  tr: {
    hinglish: { t: "Aapki Problem", s: "Direct query", sc: [] },
    hi: { t: "आपकी समस्या", s: "सीधा सवाल", sc: [] },
    en: { t: "Your Issue", s: "Direct query", sc: [] },
  },
};
const findCat = (id) => CATEGORIES.find((c) => c.id === id) || GENERAL_CAT;

/* Popular questions: [catId, scenarioIdx] */
const POPULAR = [
  ["labour", 0],
  ["cyber", 0],
  ["cheque", 0],
  ["criminal", 0],
];

/* ══ PROMPTS ══ */

const buildPrompt = (catEn, scenario, langPrompt, state) =>
  `You are NyayTak — India's AI legal awareness assistant.
SITUATION: category "${catEn}" → issue: "${scenario}". User's state: ${state}.

LANGUAGE ENFORCEMENT (CRITICAL AND STRICT):
→ First, detect the script of the user's message:
  1. If user wrote in Roman letters containing Hindi/Indic words (e.g., "padosi ne kabza kar liya", "paise nahi mile") → user wants HINGLISH. Reply ONLY in Hinglish using Roman letters. Never use Devanagari.
  2. If user wrote in Devanagari script (e.g., "पड़ोसी ने कब्ज़ा कर लिया") → user wants HINDI. Reply in Devanagari script.
  3. If user wrote in English → reply in English.
  4. If user wrote in another Indian language script (Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, Assamese) → reply in THAT same language and script.
  5. If the user only greeted (hi, hello, hey, namaste, hii) with no legal issue → treat as greeting.
→ If script is ambiguous or user only gave a greeting, default to ${langPrompt}.
→ NEVER mix scripts. If replying in Hinglish, use ONLY Roman letters. If replying in Hindi, use ONLY Devanagari. Never switch mid-response.
→ Keep emoji headers exactly as: 🛡️ Haq (or equivalent in the language — e.g., "Adhikar" in Hindi), ⚖️ Kanoon, 📋 Kadam, etc.

GREETING RESPONSE (only for greetings like "hi", "hello", "namaste" with no legal issue):
Do NOT use the FORMAT below. Instead, give a SHORT 2-line welcome in the user's detected language/script:
  Example (Hinglish): "NyayTak mein aapka swagat hai! 🙏 Main aapki kanooni samasya samajhne aur sahi raasta dhoondhne mein madad karunga. Apni problem batayein."
  Example (Hindi): "NyayTak में आपका स्वागत है! 🙏 मैं आपकी कानूनी समस्या समझने और सही रास्ता ढूंढने में मदद करूंगा। अपनी समस्या बताएं।"
Then wait for their actual legal issue. Skip the ###FU### line entirely.

LENGTH: Be thorough — 18 to 28 lines. Explain everything fully so a common person with no legal background understands completely and needs no one else. NEVER give one-word or single-line points. Every law and every step must be properly explained, not just named.

FORMAT (ONLY when the user has described an actual legal issue):
🛡️ Haq: [2-3 lines — their right in simple words, and why they have it]
⚖️ Kanoon: [Law name + exact section. THEN 3-4 lines in very easy language: what this law actually says, and how it protects/helps them. Add a tiny real-life example so it's crystal clear. Explain any legal term in brackets in plain words.]
📋 Kadam: (point-wise, har step 2-3 line — kya karna hai, kaise karna hai, aur kahan karna hai, taaki user ko aur kuch poochhna na pade)
- [step 1 — fully explain how & where to do it]
- [step 2 — fully explain]
- [step 3 — fully explain]
- [step 4 — if needed]
- [step 5 — if needed]
⏱️ Samay/Kharcha: [2-3 lines — rough time it takes AND rough cost, with examples e.g. FIR is free; consumer case fee ~₹100s; how long each stage may take]
🏛️ Kahan: [2-3 lines — exact authority/office/portal to approach, state-specific for ${state} if it matters, and how to reach it]
⚠️ [1-2 lines — clear reminder to consult a qualified vakil for serious or court action]

TONE: Warm, patient, and detailed — like a knowledgeable friend who sits with you and explains every step slowly and completely. ZERO jargon; whenever a legal word is unavoidable, immediately explain it in brackets in plain words. Always prefer explaining a little more over leaving the user confused.

FORMATTING (STRICT): Plain text only. Do NOT use Markdown — no asterisks for bold/italic (** or *), no ## headings, no backticks. Use ONLY the emoji labels exactly as shown above. Each step in Kadam must start on its own new line beginning with "- ".

NEXT-STEP QUESTIONS: After the full answer, add a NEW line that starts with "###FU###" then exactly 3 short follow-up questions THIS user is most likely to ask next about their specific issue — max 6 words each, in the SAME LANGUAGE AND SCRIPT as your answer, separated by " | ". Example (Hinglish): ###FU### FIR kaise likhwaun? | Kitne din lagenge? | Vakil zaroori hai? 
Example (Hindi): ###FU### Fीर कैसे दर्ज करवाऊं? | कितने दिन लगेंगे? | वकील ज़रूरी है?
Skip the ###FU### line entirely if you only gave a greeting/welcome.

LAWS: BNS 2023, BNSS 2023, IT Act, DPDP Act, Consumer Protection Act 2019, RERA, RTI Act, DVA 2005, POCSO, Labour Laws, Property Laws, Constitution, SC/ST Atrocities Act, Motor Vehicles Act, NI Act.`;

export {
  FONT_HEAD,
  FONT_BODY,
  LANGS,
  CHAT_LANGS,
  STATES,
  HELP,
  CAT_HELP,
  LAWS,
  INDIA_CODE,
  PORTALS,
  CAT_PORTAL,
  stateSearchUrl,
  CRISIS,
  CRISIS_WORDS,
  isCrisis,
  ICONS,
  UI,
  CATEGORIES,
  GENERAL_CAT,
  findCat,
  POPULAR,
  buildPrompt,
  toolPrompt,
};
const toolPrompt = (kind, catEn, scenario, langPrompt, state) =>
  ({
    complaint: `You are NyayTak's complaint/notice draft generator for India.
Generate a FORMAL draft the user can fill and submit. Category: "${catEn}". Issue: "${scenario}". State: ${state}.
Write the ENTIRE draft in ${langPrompt}. Structure: To (correct authority for ${state}), Subject, body of facts with [____] placeholders, the relief requested, relevant law & section, and Date/Place/Signature placeholders.
End with one line: this is a template — get it verified by a lawyer before filing. Return ONLY the draft, no preamble.`,

    docs: `List the key documents and evidence the user should gather for: "${catEn}" - "${scenario}". 
Reply as a short checklist (max 8 bullets, each starting with •) in ${langPrompt}. 
Include: proof documents, communication records, photos/videos, witness details, official certificates needed.
No preamble, no explanation.`,

    strength: `Assess this case's strength for: "${catEn}" - "${scenario}".
In ${langPrompt} give exactly: 
1) Strength — Strong/Medium/Weak with one-line reason
2) Missing evidence to collect (2-3 bullets)
3) One recommended next step
Under 12 lines total. No preamble.`,
  })[kind];

export {
  FONT_HEAD,
  FONT_BODY,
  LANGS,
  CHAT_LANGS,
  STATES,
  HELP,
  CAT_HELP,
  LAWS,
  INDIA_CODE,
  PORTALS,
  CAT_PORTAL,
  stateSearchUrl,
  CRISIS,
  CRISIS_WORDS,
  isCrisis,
  ICONS,
  UI,
  CATEGORIES,
  GENERAL_CAT,
  findCat,
  POPULAR,
  buildPrompt,
  toolPrompt,
};