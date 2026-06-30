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
} from "lucide-react";
import { FONT_HEAD, FONT_BODY, LANGS, STATES } from "../data.js";
import { startVoice } from "../lib.js";

const JaliSVG = ({ opacity = 0.2 }) => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity,
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    <defs>
      <pattern
        id="jali"
        x="0"
        y="0"
        width="56"
        height="56"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M28 0L56 28L28 56L0 28Z"
          fill="none"
          stroke="rgba(240,165,0,0.18)"
          strokeWidth="0.5"
        />
        <circle
          cx="28"
          cy="28"
          r="8"
          fill="none"
          stroke="rgba(240,165,0,0.09)"
          strokeWidth="0.5"
        />
        <circle cx="0" cy="0" r="2" fill="rgba(240,165,0,0.12)" />
        <circle cx="56" cy="0" r="2" fill="rgba(240,165,0,0.12)" />
        <circle cx="0" cy="56" r="2" fill="rgba(240,165,0,0.12)" />
        <circle cx="56" cy="56" r="2" fill="rgba(240,165,0,0.12)" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#jali)" />
  </svg>
);
const EmblemSVG = () => (
  <svg width="96" height="96" viewBox="0 0 100 100" fill="none">
    <circle
      cx="50"
      cy="50"
      r="47"
      stroke="#f0a500"
      strokeWidth="0.7"
      strokeDasharray="5 4"
      opacity="0.3"
    />
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i * 22.5 * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={50 + 10 * Math.cos(a)}
          y1={50 + 10 * Math.sin(a)}
          x2={50 + 40 * Math.cos(a)}
          y2={50 + 40 * Math.sin(a)}
          stroke="#f0a500"
          strokeWidth="0.6"
          opacity="0.18"
        />
      );
    })}
    <line
      x1="50"
      y1="14"
      x2="50"
      y2="72"
      stroke="#f0a500"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="50" cy="14" r="4" fill="#f0a500" />
    <line
      x1="16"
      y1="29"
      x2="84"
      y2="29"
      stroke="#f0a500"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line x1="21" y1="29" x2="13" y2="50" stroke="#f0a500" strokeWidth="1.2" />
    <path d="M4 50 Q13 46 22 50 Q13 58 4 50Z" fill="#f0a500" opacity="0.9" />
    <line x1="79" y1="29" x2="87" y2="50" stroke="#f0a500" strokeWidth="1.2" />
    <path d="M78 50 Q87 46 96 50 Q87 58 78 50Z" fill="#f0a500" opacity="0.9" />
    <path d="M40 72 L60 72 L57 80 L43 80Z" fill="#f0a500" opacity="0.6" />
    <line
      x1="32"
      y1="80"
      x2="68"
      y2="80"
      stroke="#f0a500"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.45"
    />
  </svg>
);

const Disclaimer = ({ t }) => (
  <div
    style={{
      padding: "6px 16px",
      borderTop: "1px solid var(--border-soft)",
      fontSize: "calc(10.5px * var(--fs))",
      color: "var(--text-dim)",
      textAlign: "center",
      flexShrink: 0,
      background: "var(--panel)",
      zIndex: 20,
      position: "relative",
    }}
  >
    {t.disclaimer}
  </div>
);
function IconBtn({ children, onClick, label, active, disabled }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        background: active ? "rgba(240,165,0,0.14)" : "var(--surface)",
        border: `1px solid ${active ? "rgba(240,165,0,0.4)" : "var(--border)"}`,
        color: active ? "#f0a500" : "var(--text-mid)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}
const BackBtn = ({ onClick }) => (
  <IconBtn onClick={onClick} label="Back">
    <ArrowLeft size={17} />
  </IconBtn>
);

function LangSelect({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find((l) => l.code === lang);
  return (
    <div style={{ position: "relative", zIndex: 60 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "5px 10px",
          borderRadius: 20,
          background: "rgba(240,165,0,0.1)",
          border: "1px solid rgba(240,165,0,0.28)",
          color: "#f0a500",
          fontSize: "calc(12px * var(--fs))",
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        <Globe size={13} />
        <span style={{ fontWeight: 600 }}>{cur.name}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 55 }}
          />
          <div
            style={{
              position: "absolute",
              top: "118%",
              right: 0,
              zIndex: 65,
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 5,
              minWidth: 148,
              boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
            }}
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 8,
                  background:
                    l.code === lang ? "rgba(240,165,0,0.13)" : "transparent",
                  border: "none",
                  color: l.code === lang ? "#f0a500" : "var(--text)",
                  fontSize: "calc(13px * var(--fs))",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span>{l.name}</span>
                {l.code === lang && <Check size={14} color="#f0a500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function SettingsBtn({
  t,
  theme,
  setTheme,
  fontScale,
  setFontScale,
  state,
  setState,
}) {
  const [open, setOpen] = useState(false);
  const sizes = [
    ["A", 1],
    ["A+", 1.16],
    ["A++", 1.32],
  ];
  return (
    <div style={{ position: "relative", zIndex: 60 }}>
      <IconBtn onClick={() => setOpen((o) => !o)} label={t.settings}>
        <Settings size={16} />
      </IconBtn>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 55 }}
          />
          <div
            style={{
              position: "absolute",
              top: "118%",
              right: 0,
              zIndex: 65,
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 14,
              width: 230,
              boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                fontSize: "calc(11px * var(--fs))",
                color: "var(--text-dim)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              {t.themeLbl}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {[
                ["dark", t.dark, <Moon size={14} />],
                ["light", t.light, <Sun size={14} />],
              ].map(([v, lbl, ic]) => (
                <button
                  key={v}
                  onClick={() => setTheme(v)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "9px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "calc(12px * var(--fs))",
                    fontWeight: 600,
                    background:
                      theme === v ? "rgba(240,165,0,0.14)" : "var(--surface)",
                    border: `1px solid ${theme === v ? "rgba(240,165,0,0.4)" : "var(--border)"}`,
                    color: theme === v ? "#f0a500" : "var(--text-mid)",
                  }}
                >
                  {ic}
                  {lbl}
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: "calc(11px * var(--fs))",
                color: "var(--text-dim)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              {t.sizeLbl}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {sizes.map(([lbl, v]) => (
                <button
                  key={lbl}
                  onClick={() => setFontScale(v)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    background:
                      fontScale === v
                        ? "rgba(240,165,0,0.14)"
                        : "var(--surface)",
                    border: `1px solid ${fontScale === v ? "rgba(240,165,0,0.4)" : "var(--border)"}`,
                    color: fontScale === v ? "#f0a500" : "var(--text-mid)",
                    fontSize:
                      lbl === "A" ? "12px" : lbl === "A+" ? "14px" : "16px",
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <div
              style={{
                fontSize: "calc(11px * var(--fs))",
                color: "var(--text-dim)",
                marginBottom: 6,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <MapPin size={12} />
              {t.stateLbl}
            </div>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 10px",
                borderRadius: 10,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontSize: "max(16px, calc(12.5px * var(--fs)))",
                fontFamily: "inherit",
                outline: "none",
              }}
            >
              {STATES.map((s) => (
                <option key={s} value={s} style={{ color: "#111" }}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
function MicBtn({ speechLang, t, onText, onAutoSend, accent = "#f0a500" }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const toggle = () => {
    if (listening) {
      recRef.current && recRef.current.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recRef.current = startVoice(
      speechLang,
      (txt) => {
        onText(txt);
        setListening(false);
        if (onAutoSend) onAutoSend(txt);
      },
      () => {
        setListening(false);
        alert(t.voiceUnsupported);
      },
    );
    if (!recRef.current) setListening(false);
  };
  return (
    <button
      onClick={toggle}
      aria-label={t.voiceTitle}
      title={t.voiceTitle}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        flexShrink: 0,
        cursor: "pointer",
        border: `1px solid ${listening ? accent : "var(--border)"}`,
        background: listening ? accent : "var(--surface)",
        color: listening ? "#0a0e1a" : "var(--text-mid)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: listening ? "nsPulse 1.1s infinite" : undefined,
      }}
    >
      <Mic size={19} />
    </button>
  );
}
function Stepper({ step, t }) {
  const steps = [t.step1, t.step2, t.step3];
  return (
    <div
      style={{
        position: "relative",
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "7px 16px",
        flexShrink: 0,
      }}
    >
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              opacity: i + 1 <= step ? 1 : 0.4,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "calc(10px * var(--fs))",
                fontWeight: 700,
                background:
                  i + 1 < step
                    ? "#f0a500"
                    : i + 1 === step
                      ? "rgba(240,165,0,0.2)"
                      : "var(--surface)",
                border: `1px solid ${i + 1 <= step ? "#f0a500" : "var(--border)"}`,
                color: i + 1 < step ? "#0a0e1a" : "#f0a500",
              }}
            >
              {i + 1 < step ? <Check size={11} /> : i + 1}
            </span>
            <span
              style={{
                fontSize: "calc(10.5px * var(--fs))",
                color: i + 1 === step ? "#f0a500" : "var(--text-dim)",
                fontWeight: i + 1 === step ? 700 : 400,
              }}
            >
              {s}
            </span>
          </div>
          {i < 2 && (
            <span
              style={{ width: 14, height: 1, background: "var(--border)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PanelShell({ title, icon, onClose, children }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 90,
        background: "var(--overlay)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        padding: "18px 14px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "var(--modal-bg)",
          border: "1px solid rgba(240,165,0,0.28)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 18px 50px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            padding: "13px 16px",
            borderBottom: "1px solid var(--border-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT_HEAD,
              fontSize: "calc(18px * var(--fs))",
              fontWeight: 700,
              color: "#f0a500",
            }}
          >
            {icon} {title}
          </span>
          <IconBtn onClick={onClose} label="Close">
            <X size={16} />
          </IconBtn>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
function HelplineRow({ label, num, t, highlight }) {
  return (
    <a
      href={`tel:${num}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        marginBottom: 9,
        textDecoration: "none",
        background: highlight ? "rgba(240,165,0,0.12)" : "var(--surface)",
        border: `1px solid ${highlight ? "rgba(240,165,0,0.35)" : "var(--border)"}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "calc(13px * var(--fs))",
            fontWeight: 600,
            color: highlight ? "#f0a500" : "var(--text)",
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: "calc(18px * var(--fs))",
          fontWeight: 800,
          color: "#f0a500",
          letterSpacing: "0.5px",
        }}
      >
        {num}
      </div>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: "calc(11px * var(--fs))",
          padding: "5px 11px",
          borderRadius: 20,
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.3)",
          color: "#16a34a",
          fontWeight: 700,
        }}
      >
        <Phone size={12} />
        {t.call}
      </span>
    </a>
  );
}

const SEC_STYLE = {
  "🛡️": { c: "#34d399", b: "rgba(52,211,153,0.14)" },
  "⚖️": { c: "#6b8cff", b: "rgba(107,140,255,0.14)" },
  "📋": { c: "#f0a500", b: "rgba(240,165,0,0.14)" },
  "⏱️": { c: "#2dd4bf", b: "rgba(45,212,191,0.14)" },
  "🏛️": { c: "#a78bfa", b: "rgba(167,139,250,0.14)" },
  "⚠️": { c: "#fb7185", b: "rgba(251,113,133,0.14)" },
  "🫂": { c: "#fb7185", b: "rgba(251,113,133,0.14)" },
};
const SEC_KEYS = Object.keys(SEC_STYLE);
const matchSec = (ln) => {
  const t = ln.trimStart();
  return (
    SEC_KEYS.find(
      (k) => t.startsWith(k) || t.startsWith(k.replace("\uFE0F", "")),
    ) || null
  );
};
function AnswerBody({ text }) {
  const lines = (text || "").split("\n");
  const blocks = [];
  let cur = null;

  lines.forEach((ln) => {
    const k = matchSec(ln);
    if (k) {
      const t = ln.trimStart();
      const cut = t.startsWith(k) ? k.length : k.replace("\uFE0F", "").length;
      const rest = t.slice(cut).trim();
      let label = rest,
        inline = "";
      const ci = rest.indexOf(":");
      if (ci >= 0) {
        label = rest.slice(0, ci).trim();
        inline = rest.slice(ci + 1).trim();
      }
      cur = { key: k, label, body: inline ? [inline] : [] };
      blocks.push(cur);
    } else if (ln.trim()) {
      if (cur) cur.body.push(ln.trim());
      else blocks.push({ key: null, body: [ln.trim()] });
    }
  });

  if (!blocks.some((b) => b.key)) return <span>{text}</span>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {blocks.map((bl, i) => {
        if (!bl.key) {
          return (
            <div key={i} style={{ lineHeight: 1.6, color: "var(--text)" }}>
              {bl.body.join(" ")}
            </div>
          );
        }
        const s = SEC_STYLE[bl.key];
        return (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {/* Header Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 12,
                backgroundColor: s.b,
                border: `2px solid ${s.c}`,
                color: s.c,
                fontWeight: 800,
                fontSize: "calc(14px * var(--fs))",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: "calc(16px * var(--fs))" }}>
                {bl.key}
              </span>
              <span>{bl.label}</span>
            </div>

            {/* Body Content */}
            {bl.body.length > 0 && (
              <div
                style={{
                  paddingLeft: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {bl.body.map((l, j) => {
                  const isB = l.startsWith("•");
                  return (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        gap: 10,
                        lineHeight: 1.6,
                        color: "var(--text)",
                      }}
                    >
                      {isB && (
                        <span
                          style={{ color: s.c, fontWeight: 700, flexShrink: 0 }}
                        >
                          •
                        </span>
                      )}
                      <span>{isB ? l.replace(/^•\s*/, "") : l}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export {
  JaliSVG,
  EmblemSVG,
  Disclaimer,
  IconBtn,
  BackBtn,
  LangSelect,
  SettingsBtn,
  MicBtn,
  Stepper,
  PanelShell,
  HelplineRow,
  AnswerBody,
};
