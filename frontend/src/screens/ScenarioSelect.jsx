import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FONT_HEAD, FONT_BODY, CATEGORIES } from "../data.js";
import {
  JaliSVG,
  BackBtn,
  LangSelect,
  SettingsBtn,
  Stepper,
  Disclaimer,
} from "../components/ui.jsx";

function ScenarioSelect({
  catEn,
  onSelect,
  onBack,
  t = {},
  lang,
  setLang,
  settings = {},
}) {
  const [v, setV] = useState(false);

  useEffect(() => {
    setTimeout(() => setV(true), 50);
  }, []);

  const category = CATEGORIES.find((c) => c.id === catEn);

  if (!category) {
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
            position: "relative",
            zIndex: 40,
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid var(--border-soft)",
            flexShrink: 0,
          }}
        >
          <BackBtn onClick={onBack} />
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontFamily: FONT_HEAD,
                fontSize: "calc(19px * var(--fs))",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Nyay<span style={{ color: "#f0a500" }}>Tak</span>
            </span>
          </div>
          <LangSelect lang={lang} setLang={setLang} />
          <SettingsBtn t={t} {...settings} />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-dim)",
          }}
        >
          Category not found
        </div>
        <Disclaimer t={t} />
      </div>
    );
  }

  const scenarios = category.tr[lang]?.sc || [];

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
          background:
            "radial-gradient(ellipse 70% 30% at 50% 0%, var(--hero-glow) 0%, transparent 55%), linear-gradient(180deg,var(--bg2),var(--bg))",
          zIndex: 0,
        }}
      />
      <JaliSVG opacity={0.16} />

      <div
        style={{
          position: "relative",
          zIndex: 40,
          padding: "13px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--border-soft)",
          flexShrink: 0,
        }}
      >
        <BackBtn onClick={onBack} />
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontSize: "calc(19px * var(--fs))",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Nyay<span style={{ color: "#f0a500" }}>Tak</span>
          </span>
          <div
            style={{
              fontSize: "calc(10px * var(--fs))",
              color: "var(--text-dim)",
            }}
          >
            {category.tr[lang]?.t || "Scenario"}
          </div>
        </div>
        <LangSelect lang={lang} setLang={setLang} />
        <SettingsBtn t={t} {...settings} />
      </div>

      <Stepper step={2} t={t} />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {scenarios.map((scenario, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                padding: "16px",
                borderRadius: 14,
                textAlign: "left",
                background: category.card,
                border: `1px solid ${category.border}`,
                cursor: "pointer",
                fontFamily: FONT_BODY,
                opacity: v ? 1 : 0,
                animation: v
                  ? `nsFadeUp 0.3s ease ${i * 0.05}s both`
                  : undefined,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow = `0 7px 22px ${category.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.12)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "calc(14px * var(--fs))",
                      fontWeight: 600,
                      color: category.color,
                    }}
                  >
                    {scenario}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  color={category.color}
                  style={{ flexShrink: 0 }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Disclaimer t={t} />
    </div>
  );
}

export default ScenarioSelect;
