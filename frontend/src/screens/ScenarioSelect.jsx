import { useState, useEffect } from "react";
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
import { FONT_HEAD, FONT_BODY, LANGS, ICONS } from "../data.js";
import {
  JaliSVG,
  BackBtn,
  LangSelect,
  SettingsBtn,
  Stepper,
  Disclaimer,
  MicBtn,
} from "../components/ui.jsx";

function ScenarioSelect({
  cat,
  onSelect,
  onBack,
  t,
  lang,
  setLang,
  settings,
  fontScale,
}) {
  const [v, setV] = useState(false);
  const [custom, setCustom] = useState("");
  const c = cat.tr[lang];
  const I = ICONS[cat.id];
  const speechLang = LANGS.find((l) => l.code === lang).speech;
  useEffect(() => {
    setTimeout(() => setV(true), 50);
  }, []);
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
          background: `radial-gradient(ellipse 65% 40% at 50% 0%, ${cat.glow.replace("0.3", "0.08")} 0%, transparent 55%), linear-gradient(180deg,var(--bg2),var(--bg))`,
          zIndex: 0,
        }}
      />
      <JaliSVG opacity={0.14} />
      <div
        style={{
          position: "relative",
          zIndex: 40,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          borderBottom: "1px solid var(--border-soft)",
          flexShrink: 0,
        }}
      >
        <BackBtn onClick={onBack} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 12px",
            borderRadius: "20px",
            background: cat.card,
            border: `1px solid ${cat.border}`,
            minWidth: 0,
          }}
        >
          <I size={15} color={cat.color} />
          <span
            style={{
              fontSize: "calc(12px * var(--fs))",
              fontWeight: 600,
              color: cat.color,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {c.t}
          </span>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <LangSelect lang={lang} setLang={setLang} />
          <SettingsBtn t={t} {...settings} />
        </div>
      </div>
      <Stepper step={2} t={t} />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "6px 18px 8px",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEAD,
            fontSize: "calc(23px * var(--fs))",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.15,
            marginBottom: 3,
          }}
        >
          {t.scenarioHeading}
        </h2>
        <p
          style={{
            fontSize: "calc(12px * var(--fs))",
            color: "var(--text-dim)",
          }}
        >
          {t.scenarioSub}
        </p>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 16px 12px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {c.sc.map((s, i) => (
            <button
              key={s}
              onClick={() => onSelect(s, i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                textAlign: "left",
                padding: "13px 15px",
                borderRadius: 12,
                background: cat.card,
                border: `1px solid ${cat.border}`,
                cursor: "pointer",
                fontFamily: FONT_BODY,
                fontSize: "calc(13.5px * var(--fs))",
                color: "var(--text)",
                opacity: v ? 1 : 0,
                animation: v
                  ? `nsFadeUp 0.3s ease ${i * 0.04}s both`
                  : undefined,
                transition: "transform 0.18s,box-shadow 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow = `0 5px 18px ${cat.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: cat.color,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${cat.glow}`,
                }}
              />
              <span style={{ flex: 1, lineHeight: 1.35 }}>{s}</span>
              <ArrowRight
                size={15}
                color={cat.color}
                style={{ opacity: 0.6 }}
              />
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "10px 16px 12px",
          borderTop: "1px solid var(--border-soft)",
          flexShrink: 0,
          background: "var(--panel)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && custom.trim())
                onSelect(custom.trim(), -1);
            }}
            placeholder={t.customPlaceholder}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 11,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "max(16px, calc(13px * var(--fs)))",
              fontFamily: FONT_BODY,
              outline: "none",
            }}
          />
          <MicBtn
            speechLang={speechLang}
            t={t}
            onText={(txt) => setCustom(txt)}
            onAutoSend={(txt) => {
              if (txt.trim()) onSelect(txt.trim(), -1);
            }}
            accent={cat.color}
          />
          <button
            onClick={() => {
              if (custom.trim()) onSelect(custom.trim(), -1);
            }}
            disabled={!custom.trim()}
            style={{
              padding: "0 16px",
              borderRadius: 11,
              border: "none",
              cursor: custom.trim() ? "pointer" : "not-allowed",
              background: custom.trim() ? cat.color : "var(--surface)",
              color: custom.trim() ? "#0a0e1a" : "var(--text-dim)",
              fontSize: "calc(13.5px * var(--fs))",
              fontWeight: 700,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {t.ask}
          </button>
        </div>
      </div>
      <Disclaimer t={t} />
    </div>
  );
}

export default ScenarioSelect;
