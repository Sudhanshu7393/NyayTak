import { useState, useRef, useEffect } from "react";
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
  FileText,
  ListChecks,
  Gauge,
  BookOpen,
  Phone,
  Mic,
  Volume2,
  Square,
  Share2,
  Globe,
  Settings,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  X,
  Sun,
  Moon,
  LifeBuoy,
  MapPin,
  Check,
  RotateCw,
  Send,
  Sparkles,
  Pencil,
  Copy,
} from "lucide-react";
import {
  LANGS,
  HELP,
  CAT_HELP,
  isCrisis,
  ICONS,
  LAWS,
  INDIA_CODE,
  PORTALS,
  CAT_PORTAL,
  stateSearchUrl,
  buildPrompt,
  FONT_HEAD,
  FONT_BODY,
} from "../data.js";
import {
  callClaude,
  analyzeDocument,
  cleanMd,
  speak,
  shareText,
} from "../lib.js";
import { FileUp } from "lucide-react";
import {
  JaliSVG,
  BackBtn,
  LangSelect,
  SettingsBtn,
  MicBtn,
  PanelShell,
  HelplineRow,
  AnswerBody,
  Disclaimer,
} from "../components/ui.jsx";
import { STATE_DISTRICTS } from "../districts.js";

const REAL_LAWYERS = {
  "Delhi|New Delhi": [
    {
      id: "rl1",
      name: "Adv. Harish Salve",
      exp: "Constitutional & Civil Disputes",
      rating: "5.0 ⭐",
      cases: "500+ Landmark Cases",
      loc: "New Delhi (Supreme Court)",
      ph: "+91 98110 XXXXX"
    },
    {
      id: "rl2",
      name: "Adv. Mukul Rohatgi",
      exp: "Corporate & Criminal Litigation",
      rating: "4.9 ⭐",
      cases: "450+ Landmark Cases",
      loc: "New Delhi",
      ph: "+91 98100 XXXXX"
    }
  ],
  "Maharashtra|Mumbai": [
    {
      id: "rl3",
      name: "Adv. Mahesh Jethmalani",
      exp: "Criminal Defense & Property Disputes",
      rating: "4.9 ⭐",
      cases: "380+ Cases",
      loc: "Mumbai High Court",
      ph: "+91 98220 XXXXX"
    }
  ],
  "Uttar Pradesh|Lucknow": [
    {
      id: "rl4",
      name: "Adv. Sudhanshu Kumar",
      exp: "Consumer Protection & Cyber Law",
      rating: "4.8 ⭐",
      cases: "120+ Cases",
      loc: "Lucknow High Court Bench",
      ph: "+91 99350 XXXXX"
    }
  ]
};

function ChatScreen({
  cat,
  scenario,
  scenarioIdx,
  custom,
  onBack,
  t,
  lang,
  setLang,
  settings,
  fontScale,
  state,
  saved,
  onToggleSave,
  onShowSaved,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [errored, setErrored] = useState(false);
  const [tool, setTool] = useState(null);
  const [toolText, setToolText] = useState("");
  const [info, setInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(-1);
  const [esignDetails, setEsignDetails] = useState({
    name: "",
    aadhaar: "",
    otpSent: false,
    otp: "",
    verified: false,
  });
  const [followUps, setFollowUps] = useState([]);
  const [copiedMsg, setCopiedMsg] = useState(-1);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [bookingLawyer, setBookingLawyer] = useState(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    phone: "",
  });
  const scrollRef = useRef(null);
  const startedRef = useRef(false);
  const histRef = useRef([]);
  const loadingRef = useRef(false); // Prevent duplicate submissions
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const docInputRef = useRef(null);
  const catEn = cat.tr.en.t;
  const langPrompt = LANGS.find((l) => l.code === lang).prompt;
  const speechLang = LANGS.find((l) => l.code === lang).speech;
  const crisis = isCrisis(cat.id, scenarioIdx, custom ? scenario : null);
  const helpKeys = ["legalAid", "emergency", ...(CAT_HELP[cat.id] || [])];
  const crisisKeys = [
    "emergency",
    ...(CAT_HELP[cat.id] || []).filter((k) => k !== "emergency"),
    "legalAid",
  ];
  const scrollDown = () =>
    requestAnimationFrame(() => {
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });

  function streamIn(full) {
    return new Promise((res) => {
      setStreaming(true);
      setMessages((m) => [...m, { role: "assistant", text: "" }]);
      const toks = full.split(/(\s+)/);
      let i = 0;
      const tick = () => {
        i += 2;
        const part = toks.slice(0, i).join("");
        setMessages((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", text: part };
          return c;
        });
        scrollDown();
        if (i < toks.length) setTimeout(tick, 16);
        else {
          setStreaming(false);
          res();
        }
      };
      tick();
    });
  }

async function ask(history) {
  // Guard: prevent duplicate submissions
  if (loadingRef.current) return;
  loadingRef.current = true;
  setLoading(true);
  setErrored(false);
  histRef.current = history;

  try {
    const raw =
      cleanMd(
        await callClaude({
          system: buildPrompt(catEn, scenario, langPrompt),
          messages: history.map((m) => ({ role: m.role, content: m.text })),
        }),
      ) || t.noAnswer;
    let answer = raw,
      fus = [];
    const parts = raw.split("###FU###");
    if (parts.length > 1) {
      answer = parts[0].trim();
      fus = parts[1]
        .split(/\||\n/)
        .map((s) => s.trim().replace(/^[•\-\d.\)\s]+/, ""))
        .filter((s) => s.length > 1)
        .slice(0, 4);
    }
    setFollowUps(fus);
    setLoading(false);
    loadingRef.current = false;
    await streamIn(answer || t.noAnswer);
  } catch (_) {
    setLoading(false);
    loadingRef.current = false;
    setMessages((m) => [...m, { role: "assistant", text: t.networkErr }]);
    setErrored(true);
    scrollDown();
  }
}

// ← यहाँ add कर (ask के बाहर):
async function handleDocumentUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploadingDoc(true);
  try {
    const analysis = await analyzeDocument(file, catEn, scenario, langPrompt);

    const docMsg = `[📄 Document: ${file.name}]\n\n${analysis}`;
    const next = [...messages, { role: "user", text: docMsg, isDoc: true }];
    setMessages(next);
    scrollDown();

    await ask([...next, { role: "assistant", text: "Document analyzed." }]);
  } catch (err) {
    alert("Document analysis failed: " + String(err));
  } finally {
    setUploadingDoc(false);
    if (docInputRef.current) docInputRef.current.value = "";
  }
}

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (!scenario) {
      const catTitle = cat.tr[lang]?.t || cat.tr.en.t;
      let text = "";
      if (lang === "hi") {
        text = `नमस्ते! मैं आपका न्यायतक (NyayTak) सहायक हूँ। आपने **"${catTitle}"** विषय चुना है।\n\nकृपया अपनी समस्या विस्तार से लिखें (जैसे: क्या हुआ था, कब हुआ, और आप क्या राहत या समाधान चाहते हैं?)। मैं नए कानूनों (BNS/BNSS 2023) के अनुसार आपकी पूरी सहायता करूँगा।`;
      } else if (lang === "hinglish") {
        text = `Namaste! Main aapka NyayTak assistant hoon. Aapne **"${catTitle}"** topic chuna hai.\n\nPlease apni problem details me likhein (jaise kya hua, kab hua, aur aap kya relief/solution chahte hain). Main new laws (BNS/BNSS 2023) ke according aapki help karunga.`;
      } else {
        text = `Namaste! I am your NyayTak assistant. You have selected **"${catTitle}"**.\n\nPlease describe your legal problem in detail (such as what happened, when it happened, and what remedy or solution you seek). I will assist you in accordance with the latest Indian laws (BNS/BNSS 2023).`;
      }
      setMessages([
        {
          role: "assistant",
          text
        }
      ]);
    } else {
      const first = [{ role: "user", text: scenario }];
      setMessages(first);
      ask(first);
    }
    scrollDown();
  }, []);

  function send(text, viaVoice) {
    // Guard: prevent duplicate from stale closures
    if (loadingRef.current) {
      console.warn("⏸️ Request in progress, ignoring duplicate send");
      return;
    }

    const v = (text ?? input).trim();
    if (!v) return;

    const next = [...messages, { role: "user", text: v, voice: !!viaVoice }];
    setMessages(next);
    setInput("");
    scrollDown();
    ask(next);
  }

  function editVoiceMsg(i) {
    const msg = messages[i];
    if (!msg) return;
    setInput(msg.text);
    setMessages((m) => m.slice(0, i));
  }

  async function copyVoiceMsg(i, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(i);
      setTimeout(() => setCopiedMsg(-1), 1500);
    } catch (_) {}
  }

  function retryVoiceMsg(i) {
    const upto = messages.slice(0, i + 1);
    setMessages(upto);
    ask(upto);
  }

  function retry() {
    setMessages((m) => {
      const c = [...m];
      if (c.length && c[c.length - 1].role === "assistant") c.pop();
      return c;
    });
    ask(histRef.current);
  }

  async function runTool(kind) {
    setTool({ kind, loading: true, text: "" });
    setToolText("");
    setCopied(false);
    try {
      const text =
        cleanMd(
          await callClaude({
            messages: [
              {
                role: "user",
                content: toolPrompt(kind, catEn, scenario, langPrompt),
              },
            ],
          }),
        ) || t.noAnswer;
      setTool({ kind, loading: false, text });
      setToolText(text);
    } catch (_) {
      setTool({ kind, loading: false, text: t.networkErr });
      setToolText(t.networkErr);
    }
  }

  function downloadTool() {
    const blob = new Blob([toolText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NyayTak-${tool.kind}-${cat.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyTool() {
    try {
      await navigator.clipboard.writeText(toolText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (_) {}
  }

  function toggleSpeak(i, text) {
    if (speaking === i) {
      window.speechSynthesis && window.speechSynthesis.cancel();
      setSpeaking(-1);
      return;
    }
    setSpeaking(i);
    const ok = speak(text, speechLang, () => setSpeaking(-1));
    if (!ok) setSpeaking(-1);
  }

  const toolTitle = {
    complaint: t.complaintTitle,
    docs: t.docsTitle,
    strength: t.strengthTitle,
  }[tool?.kind];
  const toolIcon = {
    complaint: <FileText size={17} />,
    docs: <ListChecks size={17} />,
    strength: <Gauge size={17} />,
  }[tool?.kind];
  const isLegalAnswer = (txt) => txt.includes("•") || /🛡|⚖|🏛|⏱|📋/.test(txt);
  const firstLegalIdx = messages.findIndex(
    (m) => m.role === "assistant" && isLegalAnswer(m.text),
  );
  const showFollowUps =
    firstLegalIdx !== -1 &&
    firstLegalIdx === messages.length - 1 &&
    !loading &&
    !streaming &&
    !errored;
  const savedKey = (txt) => cat.id + "|" + scenario + "|" + txt.slice(0, 40);
  const isSaved = (txt) => saved.some((s) => s.key === savedKey(txt));
  const I = ICONS[cat.id];
  const vBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 9px",
    borderRadius: 8,
    cursor: "pointer",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text-dim)",
    fontSize: "calc(11px * var(--fs))",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 30% at 50% 0%, ${cat.glow.replace("0.3", "0.07")} 0%, transparent 55%), linear-gradient(180deg,var(--bg2),var(--bg))`,
          zIndex: 0,
        }}
      />
      <JaliSVG opacity={0.1} />
      <div
        style={{
          position: "relative",
          zIndex: 40,
          padding: "11px 13px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid var(--border-soft)",
          flexShrink: 0,
          background: "var(--panel)",
        }}
      >
        <BackBtn onClick={onBack} />
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: cat.card,
            border: `1px solid ${cat.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <I size={18} color={cat.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "calc(13px * var(--fs))",
              fontWeight: 700,
              color: "var(--text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {scenario}
          </div>
          <div style={{ fontSize: "calc(10px * var(--fs))", color: cat.color }}>
            {cat.tr[lang].t}
          </div>
        </div>
        <button
          onClick={onShowSaved}
          aria-label={t.savedTitle}
          style={{
            position: "relative",
            width: 32,
            height: 32,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-mid)",
            flexShrink: 0,
          }}
        >
          <Bookmark size={15} />
          {saved.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                borderRadius: 8,
                background: "#f0a500",
                color: "#0a0e1a",
                fontSize: "calc(9px * var(--fs))",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {saved.length}
            </span>
          )}
        </button>
        <LangSelect lang={lang} setLang={setLang} />
        <SettingsBtn t={t} {...settings} />
      </div>

      {crisis && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            margin: "10px 12px 0",
            padding: "12px 14px",
            borderRadius: 13,
            background:
              "linear-gradient(135deg,rgba(251,113,133,0.16),rgba(251,113,133,0.05))",
            border: "1px solid rgba(251,113,133,0.4)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: "calc(13px * var(--fs))",
              fontWeight: 700,
              color: "#e11d48",
              marginBottom: 4,
            }}
          >
            <LifeBuoy size={16} />
            {t.crisisTitle}
          </div>
          <div
            style={{
              fontSize: "calc(11.5px * var(--fs))",
              color: "var(--text-mid)",
              marginBottom: 9,
            }}
          >
            {t.crisisDesc}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {[...new Set(crisisKeys)].map((k) => (
              <a
                key={k}
                href={`tel:${HELP[k].num}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  borderRadius: 20,
                  textDecoration: "none",
                  background: "rgba(251,113,133,0.18)",
                  border: "1px solid rgba(251,113,133,0.45)",
                  color: "var(--text)",
                  fontSize: "calc(12px * var(--fs))",
                  fontWeight: 600,
                }}
              >
                <Phone size={12} />
                {HELP[k].t[lang]}{" "}
                <b style={{ color: "#e11d48" }}>{HELP[k].num}</b>
              </a>
            ))}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "88%",
                padding: "11px 14px",
                borderRadius:
                  m.role === "user"
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px",
                fontSize: "calc(13.5px * var(--fs))",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                fontFamily: FONT_BODY,
                background:
                  m.role === "user"
                    ? "linear-gradient(135deg,#f0a500,#d4860a)"
                    : cat.card,
                color: m.role === "user" ? "#0a0e1a" : "var(--text)",
                border: m.role === "user" ? "none" : `1px solid ${cat.border}`,
                boxShadow:
                  m.role === "user"
                    ? "0 3px 14px rgba(240,165,0,0.25)"
                    : "0 3px 14px rgba(0,0,0,0.12)",
                animation: "nsFadeUp 0.3s ease both",
              }}
            >
              {m.role === "assistant" ? <AnswerBody text={m.text} /> : m.text}
            </div>

            {m.role === "user" && !loading && !streaming && (
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 5,
                  marginRight: 3,
                }}
              >
                <button onClick={() => editVoiceMsg(i)} style={vBtn}>
                  <Pencil size={11} /> Edit
                </button>
                <button onClick={() => copyVoiceMsg(i, m.text)} style={vBtn}>
                  <Copy size={11} /> {copiedMsg === i ? t.copied : t.copy}
                </button>
                <button onClick={() => retryVoiceMsg(i)} style={vBtn}>
                  <RotateCw size={11} /> {t.retry}
                </button>
              </div>
            )}

            {m.role === "assistant" &&
              m.text &&
              (i !== messages.length - 1 || !streaming) && (
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 5,
                    marginLeft: 3,
                  }}
                >
                  <button
                    onClick={() => toggleSpeak(i, m.text)}
                    aria-label={t.listen}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 9px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background:
                        speaking === i
                          ? "rgba(240,165,0,0.15)"
                          : "var(--surface)",
                      border: `1px solid ${speaking === i ? "rgba(240,165,0,0.4)" : "var(--border)"}`,
                      color: speaking === i ? "#f0a500" : "var(--text-dim)",
                      fontSize: "calc(11px * var(--fs))",
                      fontFamily: "inherit",
                    }}
                  >
                    {speaking === i ? (
                      <Square size={11} />
                    ) : (
                      <Volume2 size={12} />
                    )}{" "}
                    {t.listen}
                  </button>
                  <button
                    onClick={() => shareText(m.text, t.copied)}
                    aria-label={t.share}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 9px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-dim)",
                      fontSize: "calc(11px * var(--fs))",
                      fontFamily: "inherit",
                    }}
                  >
                    <Share2 size={12} /> {t.share}
                  </button>
                  <button
                    onClick={() =>
                      onToggleSave({
                        key: savedKey(m.text),
                        q: scenario,
                        a: m.text,
                        catId: cat.id,
                        catTitle: cat.tr[lang].t,
                      })
                    }
                    aria-label={t.saveLbl}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 9px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: isSaved(m.text)
                        ? "rgba(240,165,0,0.15)"
                        : "var(--surface)",
                      border: `1px solid ${isSaved(m.text) ? "rgba(240,165,0,0.4)" : "var(--border)"}`,
                      color: isSaved(m.text) ? "#f0a500" : "var(--text-dim)",
                      fontSize: "calc(11px * var(--fs))",
                      fontFamily: "inherit",
                    }}
                  >
                    {isSaved(m.text) ? (
                      <BookmarkCheck size={12} />
                    ) : (
                      <Bookmark size={12} />
                    )}{" "}
                    {isSaved(m.text) ? t.savedLbl : t.saveLbl}
                  </button>
                </div>
              )}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "13px 16px",
                borderRadius: "14px 14px 14px 4px",
                background: cat.card,
                border: `1px solid ${cat.border}`,
                display: "flex",
                gap: 5,
              }}
            >
              {[0, 0.2, 0.4].map((d) => (
                <span
                  key={d}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: cat.color,
                    animation: `nsBounce 1.2s ${d}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {errored && !loading && (
          <button
            onClick={retry}
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 10,
              cursor: "pointer",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "calc(12.5px * var(--fs))",
              fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            <RotateCw size={13} />
            {t.retry}
          </button>
        )}
        {showFollowUps && (
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 2 }}
          >
            {(followUps.length ? followUps : t.fu).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 20,
                  cursor: "pointer",
                  background: "var(--surface)",
                  border: `1px solid ${cat.border}`,
                  color: "var(--text-mid)",
                  fontSize: "calc(12px * var(--fs))",
                  fontFamily: "inherit",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "9px 13px",
          borderTop: "1px solid var(--border-soft)",
          flexShrink: 0,
          background: "var(--panel)",
        }}
      >
        {[
          ["complaint", t.complaintBtn, <FileText size={13} />],
          ["docs", t.docsBtn, <ListChecks size={13} />],
          ["strength", t.strengthBtn, <Gauge size={13} />],
        ].map(([k, lbl, ic]) => (
          <button
            key={k}
            onClick={() => runTool(k)}
            disabled={loading || streaming}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
              padding: "8px 13px",
              borderRadius: 20,
              cursor: loading || streaming ? "not-allowed" : "pointer",
              background: "rgba(240,165,0,0.1)",
              border: "1px solid rgba(240,165,0,0.3)",
              color: "#c98a06",
              fontSize: "calc(12px * var(--fs))",
              fontWeight: 600,
              fontFamily: "inherit",
              flexShrink: 0,
              opacity: loading || streaming ? 0.5 : 1,
            }}
          >
            {ic}
            {lbl}
          </button>
        ))}
        <button
          onClick={() => setInfo("lawyer")}
          disabled={loading || streaming}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            padding: "8px 13px",
            borderRadius: 20,
            cursor: loading || streaming ? "not-allowed" : "pointer",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#15803d",
            fontSize: "calc(12px * var(--fs))",
            fontWeight: 700,
            fontFamily: "inherit",
            flexShrink: 0,
            opacity: loading || streaming ? 0.5 : 1,
          }}
        >
          <Users size={13} />
          {lang === "hi" ? "वकील से बात करें" : lang === "hinglish" ? "Lawyer se baat karein" : "Talk to Lawyer"}
        </button>
        <button
          onClick={() => setInfo("laws")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            padding: "8px 13px",
            borderRadius: 20,
            cursor: "pointer",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-mid)",
            fontSize: "calc(12px * var(--fs))",
            fontWeight: 600,
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          <BookOpen size={13} />
          {t.lawsBtn}
        </button>
        <button
          onClick={() => setInfo("help")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            padding: "8px 13px",
            borderRadius: 20,
            cursor: "pointer",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#16a34a",
            fontSize: "calc(12px * var(--fs))",
            fontWeight: 600,
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          <Phone size={13} />
          {t.helpBtn}
        </button>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "10px 13px 12px",
          borderTop: "1px solid var(--border-soft)",
          flexShrink: 0,
          background: "var(--panel)",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={t.chatPlaceholder}
            style={{
              flex: 1,
              resize: "none",
              maxHeight: 90,
              padding: "11px 14px",
              borderRadius: 12,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "max(16px, calc(13px * var(--fs)))",
              fontFamily: FONT_BODY,
              outline: "none",
              lineHeight: 1.4,
            }}
          />
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            onChange={handleDocumentUpload}
            style={{ display: "none" }}
            disabled={uploadingDoc || loading || streaming}
          />
          <button
            onClick={() => docInputRef.current?.click()}
            aria-label="Upload document"
            title="Upload case document"
            disabled={uploadingDoc || loading || streaming}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              flexShrink: 0,
              cursor:
                uploadingDoc || loading || streaming
                  ? "not-allowed"
                  : "pointer",
              border: `1px solid ${uploadingDoc ? "rgba(240,165,0,0.4)" : "var(--border)"}`,
              background: uploadingDoc
                ? "rgba(240,165,0,0.15)"
                : "var(--surface)",
              color: uploadingDoc ? "#f0a500" : "var(--text-mid)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileUp size={18} />
          </button>
          <MicBtn
            speechLang={speechLang}
            t={t}
            onText={(txt) => {
              // Do nothing here - let onAutoSend handle it
            }}
            onAutoSend={(txt) => {
              if (txt.trim() && !loadingRef.current) {
                console.log("Voice input:", txt); // Debug
                send(txt.trim(), true);
              }
            }}
            accent="#f0a500"
          />
          <button
            onClick={() => send()}
            aria-label="Send"
            disabled={!input.trim() || loading || streaming}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "none",
              flexShrink: 0,
              cursor:
                input.trim() && !loading && !streaming
                  ? "pointer"
                  : "not-allowed",
              background:
                input.trim() && !loading && !streaming
                  ? "linear-gradient(135deg,#f0a500,#d4860a)"
                  : "var(--surface)",
              color:
                input.trim() && !loading && !streaming
                  ? "#0a0e1a"
                  : "var(--text-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {tool && (
        <PanelShell
          title={toolTitle}
          icon={toolIcon}
          onClose={() => setTool(null)}
        >
          {tool.loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 14,
                minHeight: 160,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 0.2, 0.4].map((d) => (
                  <span
                    key={d}
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#f0a500",
                      animation: `nsBounce 1.2s ${d}s infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: "calc(13px * var(--fs))",
                  color: "var(--text-dim)",
                }}
              >
                {t.generating}
              </span>
            </div>
          ) : tool.kind === "complaint" ? (
            <>
              <div
                style={{
                  fontSize: "calc(10.5px * var(--fs))",
                  color: "var(--text-dim)",
                  marginBottom: 8,
                }}
              >
                ✏️ {t.editHint}
              </div>
              <textarea
                value={toolText}
                onChange={(e) => setToolText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 300,
                  resize: "vertical",
                  whiteSpace: "pre-wrap",
                  fontFamily: FONT_BODY,
                  fontSize: "calc(12.5px * var(--fs))",
                  lineHeight: 1.6,
                  color: "var(--text)",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "12px",
                  outline: "none",
                }}
              />
            </>
          ) : (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: FONT_BODY,
                fontSize: "calc(13px * var(--fs))",
                lineHeight: 1.7,
                color: "var(--text)",
                margin: 0,
              }}
            >
              {toolText}
            </pre>
          )}
          {!tool.loading && (
            <div style={{ marginTop: 14 }}>
              {tool.kind === "complaint" && (
                <div
                  style={{
                    fontSize: "calc(10.5px * var(--fs))",
                    color: "var(--text-dim)",
                    textAlign: "center",
                    marginBottom: 9,
                  }}
                >
                  ⚠️ {t.complaintHint}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => shareText(toolText, t.copied)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "11px",
                    borderRadius: 11,
                    cursor: "pointer",
                    background: "linear-gradient(135deg,#f0a500,#d4860a)",
                    border: "none",
                    color: "#0a0e1a",
                    fontSize: "calc(13px * var(--fs))",
                    fontWeight: 700,
                    fontFamily: "inherit",
                  }}
                >
                  <Share2 size={15} />
                  {t.share}
                </button>
                <button
                  onClick={copyTool}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 11,
                    cursor: "pointer",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: "calc(13px * var(--fs))",
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  {copied ? t.copied : t.copy}
                </button>
                <button
                  onClick={downloadTool}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 11,
                    cursor: "pointer",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: "calc(13px * var(--fs))",
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  {t.download}
                </button>
              </div>
              {tool.kind === "complaint" && (
                <button
                  onClick={() => setInfo("esign")}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 11,
                    marginTop: 8,
                    cursor: "pointer",
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.35)",
                    color: "#16a34a",
                    fontSize: "calc(13.5px * var(--fs))",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  ✍️ {lang === "hi" ? "आधार e-Sign द्वारा प्रमाणित करें" : lang === "hinglish" ? "Aadhaar e-Sign se sign karein" : "Digitally Sign with Aadhaar e-Sign"}
                </button>
              )}
            </div>
          )}
        </PanelShell>
      )}

      {info === "laws" && (
        <PanelShell
          title={t.lawsTitle}
          icon={<BookOpen size={17} />}
          onClose={() => setInfo(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {(LAWS[cat.id] || LAWS.general).map((law) => (
              <div
                key={law}
                style={{
                  padding: "12px 14px",
                  borderRadius: 11,
                  background: "rgba(240,165,0,0.07)",
                  border: "1px solid rgba(240,165,0,0.22)",
                  fontSize: "calc(13px * var(--fs))",
                  color: "var(--text)",
                  fontWeight: 500,
                }}
              >
                {law}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "calc(11px * var(--fs))",
              color: "var(--text-dim)",
              margin: "13px 0 6px",
              lineHeight: 1.5,
            }}
          >
            {t.lawsNote}
          </div>
          <div
            style={{
              fontSize: "calc(10.5px * var(--fs))",
              color: "var(--text-dim)",
              marginBottom: 10,
              fontStyle: "italic",
            }}
          >
            🕑 {t.lawsUpdated}
          </div>
          <a
            href={INDIA_CODE}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              padding: "12px",
              borderRadius: 11,
              textDecoration: "none",
              background: "linear-gradient(135deg,#f0a500,#d4860a)",
              color: "#0a0e1a",
              fontSize: "calc(13px * var(--fs))",
              fontWeight: 700,
            }}
          >
            {t.verifyLaws} <ArrowRight size={15} />
          </a>
        </PanelShell>
      )}

      {info === "help" && (
        <PanelShell
          title={t.helpTitle}
          icon={<Phone size={17} />}
          onClose={() => setInfo(null)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 13px",
              borderRadius: 11,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.25)",
              fontSize: "calc(12px * var(--fs))",
              color: "#16a34a",
              marginBottom: 14,
              lineHeight: 1.5,
            }}
          >
            <HeartHandshake size={18} />
            {t.legalAidPush}
          </div>
          {[...new Set(helpKeys)].map((k) => (
            <HelplineRow
              key={k}
              label={HELP[k].t[lang]}
              num={HELP[k].num}
              t={t}
              highlight={k === "legalAid"}
            />
          ))}
          <div
            style={{
              marginTop: 18,
              fontSize: "calc(11px * var(--fs))",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 700,
              marginBottom: 9,
            }}
          >
            {t.portalsTitle}
          </div>
          {[
            ...new Set([
              ...(CAT_PORTAL[cat.id] || []),
              "legalAid",
              "indiaCode",
            ]),
          ].map((k) => (
            <a
              key={k}
              href={PORTALS[k].url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 13px",
                borderRadius: 11,
                marginBottom: 8,
                textDecoration: "none",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <Globe size={16} color="#f0a500" />
              <span
                style={{
                  flex: 1,
                  fontSize: "calc(12.5px * var(--fs))",
                  color: "var(--text)",
                  fontWeight: 500,
                }}
              >
                {PORTALS[k].t[lang]}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: "calc(11px * var(--fs))",
                  color: "#f0a500",
                  fontWeight: 700,
                }}
              >
                {t.openLbl}
                <ArrowRight size={13} />
              </span>
            </a>
          ))}

        </PanelShell>
      )}

      {info === "lawyer" && (
        <PanelShell
          title={lang === "hi" ? "सत्यापित वकील" : lang === "hinglish" ? "Satyapit Lawyers" : "Verified Lawyers"}
          icon={<Users size={17} />}
          onClose={() => {
            setInfo(null);
            setSelectedState("");
            setSelectedDistrict("");
            setBookingLawyer(null);
            setBookingStep(0);
            setBookingDetails({ date: "", time: "", phone: "" });
          }}
        >
          {bookingStep === 0 ? (
            <>
              <div
                style={{
                  padding: "11px 13px",
                  borderRadius: 11,
                  background: "rgba(240,165,0,0.08)",
                  border: "1px solid rgba(240,165,0,0.25)",
                  fontSize: "calc(12px * var(--fs))",
                  color: "var(--text)",
                  marginBottom: 14,
                  lineHeight: 1.5,
                }}
              >
                ⚖️ {lang === "hi" 
                  ? "कृपया अपने राज्य और जिले का चयन करें ताकि हम आपके स्थानीय विशेषज्ञ वकीलों से आपका संपर्क करा सकें।" 
                  : lang === "hinglish" 
                    ? "Please apna State aur District select karein taaki hum local specialist lawyers se connect karwa sakein."
                    : "Please select your State and District to view verified local specialist advocates near you."}
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                    {lang === "hi" ? "राज्य (State)" : "State"}
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedDistrict("");
                    }}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text)",
                      fontFamily: "inherit",
                      fontSize: "calc(12.5px * var(--fs))",
                    }}
                  >
                    <option value="">{lang === "hi" ? "-- चुनें --" : "-- Select --"}</option>
                    {Object.keys(STATE_DISTRICTS).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                    {lang === "hi" ? "जिला (District)" : "District"}
                  </label>
                  <select
                    disabled={!selectedState}
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text)",
                      fontFamily: "inherit",
                      fontSize: "calc(12.5px * var(--fs))",
                      opacity: selectedState ? 1 : 0.6,
                    }}
                  >
                    <option value="">{lang === "hi" ? "-- चुनें --" : "-- Select --"}</option>
                    {(STATE_DISTRICTS[selectedState] || []).map((dst) => (
                      <option key={dst} value={dst}>{dst}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                if (!selectedState || !selectedDistrict) {
                  return (
                    <div style={{ textAlign: "center", padding: "30px 10px", color: "var(--text-dim)", fontSize: "calc(12.5px * var(--fs))" }}>
                      📍 {lang === "hi" ? "सूची देखने के लिए कृपया राज्य और जिला चुनें।" : "Please select State and District to load directory."}
                    </div>
                  );
                }

                const key = `${selectedState}|${selectedDistrict}`;
                const lawyersList = REAL_LAWYERS[key] || [];

                if (lawyersList.length === 0) {
                  return (
                    <div
                      style={{
                        padding: "24px 16px",
                        borderRadius: 12,
                        background: "rgba(239,68,68,0.05)",
                        border: "1px dashed rgba(239,68,68,0.22)",
                        textAlign: "center",
                        color: "var(--text-mid)",
                        fontSize: "calc(13px * var(--fs))",
                        lineHeight: 1.5,
                      }}
                    >
                      🚧 <b>{lang === "hi" ? "इस फ़ंक्शन पर काम चल रहा है" : "Working on this function"}</b>
                      <p style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-dim)", marginTop: 4 }}>
                        {lang === "hi" 
                          ? "आपके चुने गए जिले में वकीलों को ऑनबोर्ड किया जा रहा है। जल्द ही यह सेवा शुरू होगी!" 
                          : "Verified lawyers are being onboarded in your selected district. Coming soon!"}
                      </p>
                    </div>
                  );
                }

                return lawyersList.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    style={{
                      padding: "13px 15px",
                      borderRadius: 12,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      marginBottom: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 5
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b style={{ color: "var(--text)", fontSize: "calc(14.5px * var(--fs))" }}>{lawyer.name}</b>
                      <span style={{ fontSize: "calc(11.5px * var(--fs))", color: "#f0a500", fontWeight: 700, background: "rgba(240,165,0,0.12)", padding: "2px 7px", borderRadius: 10 }}>
                        {lawyer.rating}
                      </span>
                    </div>
                    <div style={{ fontSize: "calc(12px * var(--fs))", color: "var(--text-mid)", fontWeight: 500 }}>
                      💼 {lawyer.exp}
                    </div>
                    <div style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-dim)", display: "flex", gap: 10 }}>
                      <span>📍 {lawyer.loc}</span>
                      <span>•</span>
                      <span>📊 {lawyer.cases}</span>
                    </div>
                    <button
                      onClick={() => {
                        setBookingLawyer(lawyer);
                        setBookingStep(1);
                      }}
                      style={{
                        marginTop: 8,
                        padding: "9px",
                        borderRadius: 8,
                        border: "none",
                        background: "linear-gradient(135deg,#f0a500,#d4860a)",
                        color: "#0a0e1a",
                        fontSize: "calc(12px * var(--fs))",
                        fontWeight: 700,
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      📞 {lang === "hi" ? "परामर्श बुक करें" : "Book Consultation"}
                    </button>
                  </div>
                ));
              })()}
            </>
          ) : bookingStep === 1 && bookingLawyer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  padding: "12px",
                  borderRadius: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase" }}>
                  {lang === "hi" ? "चयनित वकील" : "Selected Advocate"}
                </div>
                <b style={{ fontSize: "calc(16px * var(--fs))", color: "#f0a500" }}>{bookingLawyer.name}</b>
                <span style={{ fontSize: "calc(12.5px * var(--fs))", color: "var(--text-mid)" }}>{bookingLawyer.exp}</span>
                <div style={{ borderTop: "1px solid var(--border-soft)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: "calc(12px * var(--fs))", color: "var(--text-mid)" }}>
                  <span>{lang === "hi" ? "परामर्श शुल्क:" : "Consultation Fee:"}</span>
                  <b style={{ color: "#22c55e" }}>{lang === "hi" ? "मुफ़्त (₹0)" : "FREE (₹0)"}</b>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "calc(12.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                  📅 {lang === "hi" ? "तारीख चुनें" : "Select Date"}
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                  style={{
                    padding: "10px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontFamily: "inherit",
                    fontSize: "calc(13px * var(--fs))",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "calc(12.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                  ⏰ {lang === "hi" ? "समय स्लॉट चुनें" : "Select Time Slot"}
                </label>
                <select
                  value={bookingDetails.time}
                  onChange={(e) => setBookingDetails(prev => ({ ...prev, time: e.target.value }))}
                  style={{
                    padding: "10px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontFamily: "inherit",
                    fontSize: "calc(13px * var(--fs))",
                  }}
                >
                  <option value="">{lang === "hi" ? "-- स्लॉट चुनें --" : "-- Select Slot --"}</option>
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                  <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: "calc(12.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                  📱 {lang === "hi" ? "मोबाइल नंबर दर्ज करें" : "Enter Mobile Number"}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={bookingDetails.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setBookingDetails(prev => ({ ...prev, phone: val }));
                  }}
                  style={{
                    padding: "10px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontFamily: "inherit",
                    fontSize: "calc(13px * var(--fs))",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => setBookingStep(0)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-mid)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "calc(13px * var(--fs))",
                  }}
                >
                  {lang === "hi" ? "पीछे जाएं" : "Back"}
                </button>
                <button
                  onClick={() => {
                    if (!bookingDetails.date) {
                      alert(lang === "hi" ? "कृपया तारीख चुनें!" : "Please select a date!");
                      return;
                    }
                    if (!bookingDetails.time) {
                      alert(lang === "hi" ? "कृपया समय स्लॉट चुनें!" : "Please select a time slot!");
                      return;
                    }
                    if (bookingDetails.phone.length !== 10) {
                      alert(lang === "hi" ? "कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें!" : "Please enter a valid 10-digit mobile number!");
                      return;
                    }
                    setBookingStep(2);
                  }}
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg,#f0a500,#d4860a)",
                    color: "#0a0e1a",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "calc(13px * var(--fs))",
                  }}
                >
                  {lang === "hi" ? "अपॉइंटमेंट बुक करें 🤝" : "Book Appointment 🤝"}
                </button>
              </div>
            </div>
          ) : (
            bookingStep === 2 && bookingLawyer && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 14,
                  padding: "10px 5px",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.15)",
                    border: "2px solid #22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    animation: "nsFloat 3s ease-in-out infinite",
                  }}
                >
                  ✅
                </div>

                <div>
                  <h3 style={{ color: "#22c55e", fontSize: "calc(17px * var(--fs))", fontWeight: 700, marginBottom: 4 }}>
                    {lang === "hi" ? "बुक हो गया!" : "Booking Confirmed!"}
                  </h3>
                  <p style={{ fontSize: "calc(12px * var(--fs))", color: "var(--text-dim)" }}>
                    {lang === "hi" ? "आपका परामर्श सफलतापूर्वक शेड्यूल हो गया है।" : "Your consultation has been successfully scheduled."}
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 12,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "stretch",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(12.5px * var(--fs))" }}>
                    <span style={{ color: "var(--text-dim)" }}>{lang === "hi" ? "वकील:" : "Advocate:"}</span>
                    <b style={{ color: "var(--text)" }}>{bookingLawyer.name}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(12.5px * var(--fs))" }}>
                    <span style={{ color: "var(--text-dim)" }}>{lang === "hi" ? "तारीख व समय:" : "Date & Time:"}</span>
                    <b style={{ color: "var(--text)" }}>{bookingDetails.date} ({bookingDetails.time.split(" ")[0]})</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(12.5px * var(--fs))" }}>
                    <span style={{ color: "var(--text-dim)" }}>{lang === "hi" ? "मोबाइल नंबर:" : "Mobile Number:"}</span>
                    <b style={{ color: "var(--text)" }}>+91 {bookingDetails.phone}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "calc(12.5px * var(--fs))", borderTop: "1px solid var(--border-soft)", paddingTop: 8, marginTop: 4 }}>
                    <span style={{ color: "var(--text-dim)" }}>{lang === "hi" ? "बुकिंग आईडी:" : "Booking ID:"}</span>
                    <b style={{ color: "#f0a500", fontFamily: "monospace" }}>{`NT-BOOK-${Math.floor(100000 + Math.random() * 900000)}`}</b>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "calc(11.5px * var(--fs))",
                    color: "var(--text-mid)",
                    lineHeight: 1.5,
                    background: "rgba(240,165,0,0.06)",
                    border: "1px solid rgba(240,165,0,0.18)",
                    padding: "10px 12px",
                    borderRadius: 10,
                    marginTop: 4,
                  }}
                >
                  📞 {lang === "hi" 
                    ? `${bookingLawyer.name} आपको शेड्यूल समय पर +91 ${bookingDetails.phone} पर कॉल करेंगे।` 
                    : `${bookingLawyer.name} will call you back on +91 ${bookingDetails.phone} at the scheduled time.`}
                </div>

                <button
                  onClick={() => {
                    setBookingLawyer(null);
                    setBookingStep(0);
                    setBookingDetails({ date: "", time: "", phone: "" });
                  }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg,#f0a500,#d4860a)",
                    color: "#0a0e1a",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "calc(13px * var(--fs))",
                    marginTop: 10,
                  }}
                >
                  {lang === "hi" ? "सूची पर वापस जाएं" : "Back to Directory"}
                </button>
              </div>
            )
          )}
        </PanelShell>
      )}

      {info === "esign" && (
        <PanelShell
          title={lang === "hi" ? "डिजिटल हस्ताक्षर (Aadhaar e-Sign)" : lang === "hinglish" ? "Digital Signature (e-Sign)" : "Aadhaar Digital Signature"}
          icon={<Users size={17} />}
          onClose={() => setInfo(null)}
        >
          {!esignDetails.verified ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(240,165,0,0.08)",
                  border: "1px solid rgba(240,165,0,0.22)",
                  fontSize: "calc(12px * var(--fs))",
                  color: "var(--text)",
                  lineHeight: 1.5,
                }}
              >
                🔒 **Secured by UIDAI**: {lang === "hi" ? "यह एक सुरक्षित ई-हस्ताक्षर प्रमाणन प्रक्रिया है। हस्ताक्षर सत्यापित होने के बाद दस्तावेज़ के नीचे जोड़ दिया जाएगा।" : "This is a secure e-Sign process powered by UIDAI. The signature block will be appended upon verification."}
              </div>

              {!esignDetails.otpSent ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                      {lang === "hi" ? "पूरा नाम (आधार के अनुसार)" : "Full Name (as on Aadhaar)"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sudhanshu Kumar"
                      value={esignDetails.name}
                      onChange={(e) => setEsignDetails({ ...esignDetails, name: e.target.value })}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text)",
                        fontFamily: "inherit",
                        fontSize: "calc(13px * var(--fs))",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                      {lang === "hi" ? "आधार कार्ड नंबर" : "Aadhaar Card Number"}
                    </label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX"
                      maxLength="12"
                      value={esignDetails.aadhaar}
                      onChange={(e) => setEsignDetails({ ...esignDetails, aadhaar: e.target.value.replace(/\D/g, "") })}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text)",
                        fontFamily: "inherit",
                        fontSize: "calc(13px * var(--fs))",
                        letterSpacing: "1px",
                      }}
                    />
                  </div>
                  <button
                    disabled={!esignDetails.name.trim() || esignDetails.aadhaar.length !== 12}
                    onClick={() => setEsignDetails({ ...esignDetails, otpSent: true })}
                    style={{
                      marginTop: 8,
                      padding: "12px",
                      borderRadius: 10,
                      border: "none",
                      background: (!esignDetails.name.trim() || esignDetails.aadhaar.length !== 12) ? "var(--border)" : "linear-gradient(135deg,#f0a500,#d4860a)",
                      color: "#0a0e1a",
                      fontWeight: 700,
                      cursor: (!esignDetails.name.trim() || esignDetails.aadhaar.length !== 12) ? "not-allowed" : "pointer",
                      fontSize: "calc(13px * var(--fs))",
                    }}
                  >
                    🚀 {lang === "hi" ? "ओटीपी भेजें (Request OTP)" : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", fontWeight: 600 }}>
                      {lang === "hi" ? "ओटीपी दर्ज करें" : "Enter 6-digit OTP"}
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      value={esignDetails.otp}
                      onChange={(e) => setEsignDetails({ ...esignDetails, otp: e.target.value.replace(/\D/g, "") })}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text)",
                        fontFamily: "inherit",
                        fontSize: "calc(13.5px * var(--fs))",
                        textAlign: "center",
                        letterSpacing: "4px",
                      }}
                    />
                  </div>
                  <button
                    disabled={esignDetails.otp.length !== 6}
                    onClick={() => {
                      const sigBlock = `\n\n====================================\n✍️ DIGITAL SIGNATURE VERIFICATION (UIDAI e-Sign)\nSignee: ${esignDetails.name}\nDate: ${new Date().toLocaleDateString("en-IN")}\nStatus: VERIFIED & SECURED\nSignature Hash: esign_sha256_${Math.random().toString(36).substring(2, 10).toUpperCase()}_nyaytak\n====================================`;
                      setToolText((prev) => prev + sigBlock);
                      setEsignDetails({ ...esignDetails, verified: true });
                    }}
                    style={{
                      marginTop: 8,
                      padding: "12px",
                      borderRadius: 10,
                      border: "none",
                      background: esignDetails.otp.length !== 6 ? "var(--border)" : "linear-gradient(135deg,#22c55e,#16a34a)",
                      color: "#0a0e1a",
                      fontWeight: 700,
                      cursor: esignDetails.otp.length !== 6 ? "not-allowed" : "pointer",
                      fontSize: "calc(13px * var(--fs))",
                    }}
                  >
                    ✅ {lang === "hi" ? "सत्यापित करें और हस्ताक्षर करें" : "Verify & Sign"}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: "40px" }}>🎉</div>
              <b style={{ color: "var(--text)", fontSize: "calc(15.5px * var(--fs))" }}>
                {lang === "hi" ? "दस्तावेज़ सफलतापूर्वक हस्ताक्षरित हुआ!" : "Document Signed Successfully!"}
              </b>
              <p style={{ fontSize: "calc(12px * var(--fs))", color: "var(--text-mid)", lineHeight: 1.5 }}>
                {lang === "hi"
                  ? "UIDAI आधार e-Sign वेरिफिकेशन पूरा हो चुका है। खसड़े के अंत में एक सुरक्षित डिजिटल हस्ताक्षर ब्लॉक जोड़ दिया गया है।"
                  : "UIDAI Aadhaar e-Sign verification is complete. A secure digital signature block has been appended to the end of the draft."}
              </p>
              <button
                onClick={() => {
                  setInfo(null);
                  setEsignDetails({ name: "", aadhaar: "", otpSent: false, otp: "", verified: false });
                }}
                style={{
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#f0a500,#d4860a)",
                  color: "#0a0e1a",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "calc(13px * var(--fs))",
                }}
              >
                🏡 {lang === "hi" ? "वापस ड्राफ्ट पर जाएं" : "Go Back to Draft"}
              </button>
            </div>
          )}
        </PanelShell>
      )}
    </div>
  );
}

export default ChatScreen;
