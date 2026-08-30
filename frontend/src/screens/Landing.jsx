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
  const [showPrivacy, setShowPrivacy] = useState(false);
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
            {t.cta} <Sparkles size={16} />
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

          <div
            style={{
              fontSize: "calc(10.5px * var(--fs))",
              color: "var(--text-dim)",
              marginTop: 10,
              fontStyle: "italic",
              fontWeight: 500,
              width: "100%",
              textAlign: "center",
            }}
          >
            {lang === "hi"
              ? "* AI इन सभी भाषाओं में जवाब दे सकता है"
              : lang === "hinglish"
                ? "* AI in sabhi bhashaon mein jawab de sakta hai"
                : "* AI supports and replies in all the above languages"}
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
          <a
            href="https://github.com/Sudhanshu7393"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#f0a500", fontWeight: 700, textDecoration: "none" }}
          >
            Sudhanshu Pandey
          </a>
          {" | "}
          <span
            onClick={() => setShowPrivacy(true)}
            style={{
              cursor: "pointer",
              color: "#f0a500",
              textDecoration: "underline",
              fontWeight: 600
            }}
          >
            🛡️ {lang === "hi" ? "सुरक्षा एवं गोपनीयता" : "Security & Privacy"}
          </span>
          {onAdminClick && (
            <>
              {" | "}
              <span
                onClick={onAdminClick}
                style={{
                  cursor: "pointer",
                  color: "var(--text-dim)",
                  textDecoration: "underline",
                }}
              >
                {lang === "hi" ? "नियंत्रण पटल" : "Admin Portal"}
              </span>
            </>
          )}
        </div>
      </div>

      {showPrivacy && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 14, 26, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#161b2c",
              border: "1px solid rgba(240, 165, 0, 0.3)",
              borderRadius: 14,
              maxWidth: 500,
              width: "100%",
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              color: "#f3f4f6",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "calc(16px * var(--fs))", color: "#f0a500", fontWeight: 700 }}>
                🛡️ {lang === "hi" ? "सुरक्षा और गोपनीयता गारंटी" : "Security & Privacy Guarantee"}
              </h3>
              <button
                onClick={() => setShowPrivacy(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f0a500",
                  cursor: "pointer",
                  fontSize: 20,
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "calc(12.5px * var(--fs))", lineHeight: 1.5, maxHeight: 350, overflowY: "auto" }}>
              <p style={{ margin: 0 }}>
                <b>{lang === "hi" ? "संस्थापक" : "Founder"}:</b>{" "}
                <a 
                  href="https://github.com/Sudhanshu7393" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#f0a500", textDecoration: "underline", fontWeight: 700 }}
                >
                  Sudhanshu Pandey
                </a>
              </p>

              <div style={{ padding: 10, background: "rgba(34,197,94,0.08)", borderLeft: "3px solid #22c55e", borderRadius: 4, color: "#22c55e", textAlign: "left" }}>
                🔒 <b>{lang === "hi" ? "100% सुरक्षित और अनाम" : "100% Secure & Anonymous"}</b>
                <br />
                {lang === "hi" 
                  ? "NyayTak एक गैर-लाभकारी, ओपन-सोर्स कानूनी जागरूकता मंच है। हम कभी भी आपकी संवेदनशील जानकारी जैसे आधार, पैन कार्ड, बैंक खाता विवरण, ओटीपी या कोई भी व्यक्तिगत संपर्क विवरण नहीं मांगते हैं और न ही सहेजते हैं।" 
                  : "NyayTak is a non-profit, open-source legal awareness platform. We NEVER request, store, or process any sensitive credentials such as Aadhaar, PAN card, bank details, OTPs, or personal phone numbers."}
              </div>

              <p style={{ margin: 0, textAlign: "left" }}>
                <b>{lang === "hi" ? "डेटा सुरक्षा और होस्टिंग" : "Data Security & Hosting"}:</b>
                <br />
                {lang === "hi"
                  ? "यह वेबसाइट Google Cloud Firestore और Vercel edge networks पर सुरक्षित रूप से होस्ट की गई है। डेटा ट्रांसमिशन एंड-टू-एंड SSL/HTTPS एन्क्रिप्शन द्वारा सुरक्षित है।"
                  : "This application is securely deployed on Google Cloud Firestore and Vercel networks. All network transmissions are protected by end-to-end SSL/HTTPS encryption."}
              </p>

              <p style={{ margin: 0, textAlign: "left" }}>
                <b>{lang === "hi" ? "ओपन-सोर्स सत्यापन" : "Open-Source Verification"}:</b>
                <br />
                {lang === "hi"
                  ? "इस प्रोजेक्ट का पूरा कोड पारदर्शी (transparent) है। आप इसे ऊपर संस्थापक लिंक पर क्लिक करके गिटहब पर सत्यापित कर सकते हैं।"
                  : "To verify the security and logic of the platform, the full source code is public and open-source."}
              </p>
            </div>

            <button
              onClick={() => setShowPrivacy(false)}
              style={{
                marginTop: 18,
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#f0a500,#d4860a)",
                color: "#0a0e1a",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {lang === "hi" ? "समझ गया" : "I Understand"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
