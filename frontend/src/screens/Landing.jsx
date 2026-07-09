import { useState, useEffect } from "react";
import { Scale, Sparkles } from "lucide-react";
import {
  FONT_HEAD,
  FONT_BODY,
  LANGS,
  CHAT_LANGS,
  ICONS,
  findCat,
  POPULAR,
} from "../data.js";
import {
  JaliSVG,
  EmblemSVG,
  LangSelect,
  SettingsBtn,
} from "../components/ui.jsx";
import OnboardingModal from "../components/OnboardingModal.jsx";

function Landing({
  onStart,
  onShowSaved,
  onPopularClick,
  savedCount,
  t = {},
  lang,
  setLang,
  settings = {},
}) {
  const [v, setV] = useState(false);
  useEffect(() => {
    setTimeout(() => setV(true), 60);
  }, []);

  const a = (d) =>
    v
      ? { opacity: 1, animation: `nsFadeUp 0.5s ease ${d}s both` }
      : { opacity: 0 };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 55% at 50% -5%, var(--hero-glow) 0%, transparent 60%), linear-gradient(180deg,var(--bg2),var(--bg))",
          zIndex: 0,
        }}
      />
      <JaliSVG />

      <div
        style={{
          position: "relative",
          zIndex: 40,
          padding: "13px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-soft)",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEAD,
            fontSize: "calc(22px * var(--fs))",
            fontWeight: 700,
            color: "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          Nyay<span style={{ color: "#f0a500" }}>Tak</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <LangSelect lang={lang} setLang={setLang} />
          <SettingsBtn t={t} {...settings} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "18px 22px 16px",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            ...a(0.05),
            marginBottom: 6,
            transform: "scale(0.72)",
            animation:
              (a(0.05).animation || "") + ", nsFloat 4s ease-in-out infinite",
          }}
        >
          <EmblemSVG />
        </div>
        <div
          style={{
            ...a(0.1),
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "6px 15px",
            borderRadius: "20px",
            marginBottom: 12,
            background: "rgba(240,165,0,0.1)",
            border: "1px solid rgba(240,165,0,0.28)",
            fontSize: "calc(11.5px * var(--fs))",
            boxShadow: "0 2px 14px rgba(240,165,0,0.12)",
          }}
        >
          <Scale size={13} color="#f0a500" />
          <span style={{ color: "var(--text-mid)" }}>Powered by</span>
          <b
            style={{
              color: "#f0a500",
              fontWeight: 800,
              letterSpacing: "0.2px",
            }}
          >
            NyayTak
          </b>
        </div>
        <h1
          style={{
            ...a(0.15),
            fontFamily: FONT_HEAD,
            fontSize: "calc((clamp(34px,7vw,56px)) * var(--fs))",
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: 8,
            letterSpacing: "-0.5px",
          }}
        >
          <span style={{ color: "var(--text)" }}>Apna</span>
          <span style={{ color: "#f0a500" }}> Haq</span>
          <br />
          <span style={{ color: "var(--text)" }}>Jaano</span>
        </h1>
        <p style={{ ...a(0.2), maxWidth: 340, marginBottom: 16 }}>
          <span
            style={{
              display: "block",
              fontFamily: FONT_HEAD,
              fontSize: "calc(18px * var(--fs))",
              color: "var(--text)",
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: 6,
            }}
          >
            Free Legal Awareness
          </span>
          <span
            style={{
              display: "block",
              fontSize: "calc(12px * var(--fs))",
              color: "var(--text-dim)",
              letterSpacing: "0.4px",
              fontWeight: 500,
            }}
          >
            For all Indians
          </span>
        </p>
        <button
          onClick={onStart}
          style={{
            ...a(0.25),
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 36px",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg,#f0a500,#d4860a)",
            color: "#0a0e1a",
            fontSize: "calc(15px * var(--fs))",
            fontWeight: 700,
            fontFamily: FONT_BODY,
            boxShadow: "0 4px 22px rgba(240,165,0,0.35)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
          }}
        >
          Shuru Karein — Free Hai ✨ <Sparkles size={16} />
        </button>
        <div style={{ ...a(0.3), width: "100%", maxWidth: 360, marginTop: 16 }}>
          <div
            style={{
              fontSize: "calc(10.5px * var(--fs))",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 9,
              fontWeight: 700,
            }}
          >
            SABBE ZYADA POOCHE GAYE
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              justifyContent: "center",
            }}
          >
            {POPULAR.map(([cid, idx]) => {
              const c = findCat(cid);
              const I = ICONS[cid];
              return (
                <button
                  key={cid + idx}
                  onClick={() => {
                    onPopularClick && onPopularClick(cid, idx);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 13px",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontFamily: FONT_BODY,
                    fontSize: "calc(12px * var(--fs))",
                    color: "var(--text-mid)",
                    background: c.card,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <I size={13} color={c.color} />
                  {c.tr[lang].sc[idx]}
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            ...a(0.34),
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            justifyContent: "center",
            marginTop: 14,
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                fontSize: "calc(11px * var(--fs))",
                padding: "4px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontFamily: "inherit",
                background:
                  l.code === lang
                    ? "rgba(240,165,0,0.18)"
                    : "rgba(240,165,0,0.07)",
                border: `1px solid ${l.code === lang ? "rgba(240,165,0,0.5)" : "rgba(240,165,0,0.18)"}`,
                color: l.code === lang ? "#f0a500" : "#b07c10",
                fontWeight: l.code === lang ? 700 : 400,
              }}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div style={{ ...a(0.38), marginTop: 10, maxWidth: 330 }}>
          <div
            style={{
              fontSize: "calc(10.5px * var(--fs))",
              color: "var(--text-dim)",
              lineHeight: 1.5,
              marginBottom: 7,
            }}
          >
            🗣️ Kisi bhi language mein pocho
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
            }}
          >
            {CHAT_LANGS.map((l) => (
              <span
                key={l}
                style={{
                  fontSize: "calc(10px * var(--fs))",
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-mid)",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "9px 10px 10px",
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 7,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          {[
            ["🔒", "No Data"],
            ["⚡", "Instant"],
            ["🌐", "10+ Languages"],
            ["🆓", "Free"],
          ].map(([ic, lb]) => (
            <div
              key={lb}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "calc(11px * var(--fs))",
                color: "var(--text-dim)",
              }}
            >
              <span>{ic}</span>
              <span>{lb}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
