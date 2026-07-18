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
import { JaliSVG, LangSelect, SettingsBtn } from "../components/ui.jsx";
import OnboardingModal from "../components/OnboardingModal.jsx";

function Landing({
  onStart,
  onShowSaved,
  savedCount,
  t = {},
  lang,
  setLang,
  settings = {},
  onInstallClick,
  isInstalled,
  onAdminClick,
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
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "clamp(12px, 3vh, 24px) 16px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 65% 35% at 50% 0%, var(--hero-glow) 0%, transparent 60%), linear-gradient(180deg, var(--bg2), var(--bg))",
          zIndex: 0,
        }}
      />
      <JaliSVG opacity={0.16} />

      {/* Landing Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 440,
          margin: "0 auto 12px",
          position: "relative",
          zIndex: 20,
          paddingBottom: 8,
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEAD,
            fontSize: "calc(19px * var(--fs))",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          <img
            src="/logo.jpg"
            alt=""
            style={{
              width: "calc(22px * var(--fs))",
              height: "calc(22px * var(--fs))",
              borderRadius: 4,
              objectFit: "cover",
            }}
          />
          <span>
            Nyay<span style={{ color: "#f0a500" }}>Tak</span>
          </span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {!isInstalled && (
            <button
              onClick={onInstallClick}
              style={{
                padding: "7px 9px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "rgba(240,165,0,0.12)",
                color: "#f0a500",
                fontSize: "calc(11.5px * var(--fs))",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
              }}
              title={lang === "hi" ? "ऐप इंस्टॉल करें" : "Install App"}
            >
              <span>📲</span>
              <span>{lang === "hi" ? "इंस्टॉल" : "Install"}</span>
            </button>
          )}
          <LangSelect lang={lang} setLang={setLang} />
          <SettingsBtn t={t} {...settings} onAdminClick={onAdminClick} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "24px 20px",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          overflowY: "auto",
        }}
      >
        {/* Floating background blobs for visual depth */}
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(240, 165, 0, 0.12)",
            filter: "blur(40px)",
            top: "10%",
            left: "15%",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(240, 165, 0, 0.08)",
            filter: "blur(50px)",
            bottom: "15%",
            right: "10%",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            ...a(0.05),
            width: "100%",
            maxWidth: 390,
            background: "var(--surface)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "clamp(18px, 4vh, 28px) clamp(16px, 4vw, 24px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto 0",
          }}
        >
          <img
            src="/logo.jpg"
            alt="NyayTak Logo"
            style={{
              width: 120,
              height: 120,
              borderRadius: 12,
              border: "none",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              marginBottom: 14,
              objectFit: "contain",
              animation: "nsFloat 4s ease-in-out infinite",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 16px",
                borderRadius: "20px",
                background: "rgba(240,165,0,0.12)",
                border: "1px solid rgba(240,165,0,0.3)",
                fontSize: "calc(11.5px * var(--fs))",
                boxShadow: "0 2px 14px rgba(240,165,0,0.15)",
              }}
            >
              <Scale size={13} color="#f0a500" />
              <span style={{ color: "var(--text-mid)" }}>{t.tagPre}</span>
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
          </div>

          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontSize: "calc(42px * var(--fs))",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 10,
              letterSpacing: "-0.5px",
            }}
          >
            <span style={{ color: "var(--text)" }}>{t.h1Pre}</span>
            <span style={{ color: "#f0a500" }}>{t.h1Accent}</span>
            {t.h1Line2 && (
              <>
                <br />
                <span style={{ color: "var(--text)" }}>{t.h1Line2}</span>
              </>
            )}
          </h1>

          <p style={{ maxWidth: 300, marginBottom: 22 }}>
            <span
              style={{
                display: "block",
                fontFamily: FONT_HEAD,
                fontSize: "calc(17px * var(--fs))",
                color: "var(--text)",
                fontWeight: 600,
                lineHeight: 1.3,
                marginBottom: 6,
              }}
            >
              {t.heroSub1}
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
              {t.heroSub2}
            </span>
          </p>

          <button
            onClick={onStart}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              maxWidth: 290,
              padding: "15px 36px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg,#f0a500,#d4860a)",
              color: "#0a0e1a",
              fontSize: "calc(16px * var(--fs))",
              fontWeight: 800,
              fontFamily: FONT_BODY,
              boxShadow: "0 8px 24px rgba(240,165,0,0.32)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 28px rgba(240,165,0,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(240,165,0,0.32)";
            }}
          >
            {t.cta} ✨ <Sparkles size={16} />
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              justifyContent: "center",
              marginTop: 20,
              borderTop: "1px solid var(--border-soft)",
              paddingTop: 16,
              width: "100%",
            }}
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  fontSize: "calc(11.5px * var(--fs))",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background:
                    l.code === lang
                      ? "rgba(240,165,0,0.18)"
                      : "rgba(240,165,0,0.07)",
                  border: `1px solid ${l.code === lang ? "rgba(240,165,0,0.5)" : "rgba(240,165,0,0.18)"}`,
                  color: l.code === lang ? "#f0a500" : "var(--text-mid)",
                  fontWeight: l.code === lang ? 700 : 500,
                  transition: "all 0.15s",
                }}
              >
                {l.name}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 14, width: "100%" }}>
            <div
              style={{
                fontSize: "calc(10.5px * var(--fs))",
                color: "var(--text-dim)",
                lineHeight: 1.5,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              🗣️ {t.chatLangNote}
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
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-mid)",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
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
          gap: 6,
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
            ["🔒", t.footNoData],
            ["⚡", t.footInstant],
            ["🌐", t.footLang],
            ["🆓", t.footFree],
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
        <div
          style={{
            fontSize: "calc(10.5px * var(--fs))",
            color: "var(--text-dim)",
            fontWeight: 500,
            letterSpacing: "0.3px",
            marginTop: 2,
          }}
        >
          {lang === "hi" ? "संस्थापक" : "Founder"}:{" "}
          <span style={{ color: "#f0a500", fontWeight: 700 }}>
            Sudhanshu Pandey
          </span>
          {" | "}
          <span
            onClick={() => {
              const pin = prompt(lang === "hi" ? "नियंत्रण पटल अनलॉक करने के लिए पिन दर्ज करें (डिफ़ॉल्ट: 9935):" : "Enter PIN to unlock Admin Control (Default: 9935):");
              if (pin === "9935") {
                onAdminClick();
              } else if (pin !== null) {
                alert(lang === "hi" ? "गलत पिन कोड!" : "Invalid PIN!");
              }
            }}
            style={{ cursor: "pointer", color: "var(--text-dim)", textDecoration: "underline" }}
          >
            {lang === "hi" ? "नियंत्रण पटल" : "Admin Portal"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Landing;
