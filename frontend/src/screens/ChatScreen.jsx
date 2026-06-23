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
import { callClaude, cleanMd, speak, shareText } from "../lib.js";
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
  const [followUps, setFollowUps] = useState([]);
  const [copiedMsg, setCopiedMsg] = useState(-1);
  const scrollRef = useRef(null);
  const startedRef = useRef(false);
  const histRef = useRef([]);
  const loadingRef = useRef(false); // Prevent duplicate submissions

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
            system: buildPrompt(catEn, scenario, langPrompt, state),
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

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const first = [{ role: "user", text: scenario }];
    setMessages(first);
    ask(first);
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
                content: toolPrompt(kind, catEn, scenario, langPrompt, state),
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
            {state !== "All India" ? ` · ${state}` : ""}
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
          <MicBtn
            speechLang={speechLang}
            t={t}
            onText={() => {}}
            onAutoSend={(txt) => {
              if (txt.trim() && !loadingRef.current) {
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
      <Disclaimer t={t} />

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
          {state !== "All India" && (
            <>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: "calc(11px * var(--fs))",
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 700,
                  marginBottom: 3,
                }}
              >
                <MapPin size={11} />
                {state} — {t.statePortals}
              </div>
              <div
                style={{
                  fontSize: "calc(10px * var(--fs))",
                  color: "var(--text-dim)",
                  marginBottom: 9,
                }}
              >
                {t.stateSearchNote}
              </div>
              {[
                ["RERA", `${state} RERA authority official portal`],
                ["e-FIR / Police", `${state} police online e-FIR portal`],
                [
                  "Legal Services (SLSA)",
                  `${state} State Legal Services Authority`,
                ],
              ].map(([lbl, q]) => (
                <a
                  key={lbl}
                  href={stateSearchUrl(q)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 13px",
                    borderRadius: 11,
                    marginBottom: 7,
                    textDecoration: "none",
                    background: "var(--surface2)",
                    border: "1px dashed var(--border)",
                  }}
                >
                  <MapPin size={15} color="#f0a500" />
                  <span
                    style={{
                      flex: 1,
                      fontSize: "calc(12.5px * var(--fs))",
                      color: "var(--text)",
                    }}
                  >
                    {state} {lbl}
                  </span>
                  <ArrowRight size={13} color="#f0a500" />
                </a>
              ))}
            </>
          )}
        </PanelShell>
      )}
    </div>
  );
}

export default ChatScreen;
