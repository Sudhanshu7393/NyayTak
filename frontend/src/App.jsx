import { useState, useEffect } from "react";
import { FONT_BODY, UI, CATEGORIES, findCat } from "./data.js";
import { Disclaimer } from "./components/ui.jsx";
import Landing from "./screens/Landing.jsx";
import CategorySelect from "./screens/CategorySelect.jsx";
import ScenarioSelect from "./screens/ScenarioSelect.jsx";
import ChatScreen from "./screens/ChatScreen.jsx";
import SavedPanel from "./screens/SavedPanel.jsx";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [catEn, setCatEn] = useState("");
  const [scenario, setScenario] = useState("");
  const [lang, setLang] = useState("hinglish");
  const [theme, setTheme] = useState("dark");
  const [fontScale, setFontScale] = useState(1);

  const [saved, setSaved] = useState(() => {
    try {
      const stored = localStorage.getItem("nyaytak_saved");
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--fs", fontScale);
    document.body.style.background = theme === "dark" ? "#0a0e1a" : "#f5f3ef";
    document.body.style.color = theme === "dark" ? "#e0e0e0" : "#1a1a1a";
  }, [fontScale, theme]);

  useEffect(() => {
    window.history.pushState({ screen }, "");
    const handler = (e) => {
      if (e.state?.screen) {
        setScreen(e.state.screen);
      }
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  useEffect(() => {
    const handlePrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallPopup(true);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    setInstallPrompt(null);
    setShowInstallPopup(false);
  };

  const t = UI[lang] || UI.hinglish;

  const onToggleSave = (item) => {
    setSaved((prev) => {
      const exists = prev.some((s) => s.key === item.key);
      const updated = exists
        ? prev.filter((s) => s.key !== item.key)
        : [...prev, item];
      try {
        localStorage.setItem("nyaytak_saved", JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const onRemoveSaved = (key) => {
    setSaved((prev) => {
      const updated = prev.filter((s) => s.key !== key);
      try {
        localStorage.setItem("nyaytak_saved", JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };



  const onCatSelect = (cid) => {
    setCatEn(cid);
    setScenario("");
    setScreen("chat");
    window.history.pushState({ screen: "chat" }, "");
  };

  const onBack = () => {
    if (screen === "chat") {
      setScreen("category");
      window.history.pushState({ screen: "category" }, "");
    } else if (screen === "category") {
      setScreen("landing");
      window.history.pushState({ screen: "landing" }, "");
    } else if (screen === "landing") {
      // Already on landing
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: theme === "dark" ? "#0a0e1a" : "#f5f3ef",
        color: theme === "dark" ? "#e0e0e0" : "#1a1a1a",
        fontFamily: FONT_BODY,
        overflow: "hidden",
      }}
    >
      <style>{`
        :root {
          --fs: ${fontScale};
          --bg: ${theme === "dark" ? "#0a0e1a" : "#f5f3ef"};
          --bg2: ${theme === "dark" ? "#0f1419" : "#ede8e1"};
          --surface: ${theme === "dark" ? "#16192b" : "#f0ede6"};
          --panel: ${theme === "dark" ? "#1a1f2e" : "#ede8e1"};
          --modal-bg: ${theme === "dark" ? "#1a1f2e" : "#f5f3ef"};
          --text: ${theme === "dark" ? "#e8e8e8" : "#1a1a1a"};
          --text-mid: ${theme === "dark" ? "#a0a0a0" : "#666666"};
          --text-dim: ${theme === "dark" ? "#707070" : "#999999"};
          --border: ${theme === "dark" ? "#2a3142" : "#d9d4cc"};
          --border-soft: ${theme === "dark" ? "#252c3a" : "#e5dfd7"};
          --overlay: ${theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)"};
          --hero-glow: ${theme === "dark" ? "rgba(240,165,0,0.08)" : "rgba(240,165,0,0.05)"};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        @keyframes nsFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nsFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes nsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes nsChakra {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {screen === "landing" && (
        <Landing
          onStart={() => {
            setScreen("category");
            window.history.pushState({ screen: "category" }, "");
          }}
          onShowSaved={() => setShowSavedPanel(true)}
          savedCount={saved.length}
          t={t}
          lang={lang}
          setLang={setLang}
          settings={{
            theme,
            setTheme,
            fontScale,
            setFontScale,
          }}
        />
      )}

      {screen === "category" && (
        <CategorySelect
          onSelect={(cat) => onCatSelect(cat.id)}
          onGeneral={() => {
            setCatEn("general");
            setScenario("");
            setScreen("chat");
            window.history.pushState({ screen: "chat" }, "");
          }}
          onBack={onBack}
          t={t}
          lang={lang}
          setLang={setLang}
          settings={{
            theme,
            setTheme,
            fontScale,
            setFontScale,
          }}
        />
      )}

      {screen === "chat" && catEn && (() => {
        const selectedCat = findCat(catEn);
        const scenarioText = selectedCat.tr[lang]?.sc[scenario] || "";
        return (
          <ChatScreen
            cat={selectedCat}
            scenario={scenarioText}
            scenarioIdx={scenario}
            custom={false}
            onBack={onBack}
            t={t}
            lang={lang}
            setLang={setLang}
            settings={{
              theme,
              setTheme,
              fontScale,
              setFontScale,
            }}
            fontScale={fontScale}
            saved={saved}
            onToggleSave={onToggleSave}
            onShowSaved={() => setShowSavedPanel(true)}
          />
        );
      })()}

      <Disclaimer t={t} />

      {showSavedPanel && (
        <SavedPanel
          saved={saved}
          onClose={() => setShowSavedPanel(false)}
          onRemove={onRemoveSaved}
          t={t}
        />
      )}

      {showInstallPopup && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: 390,
            background: "rgba(22, 25, 43, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "16px 20px",
            boxShadow: "0 10px 32px rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            zIndex: 9999,
            animation: "nsFadeUp 0.4s ease both",
          }}
        >
          <img
            src="/logo.jpg"
            alt="NyayTak Logo"
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              objectFit: "cover",
              border: "1px solid rgba(240, 165, 0, 0.3)"
            }}
          />
          <div style={{ flex: 1, textAlign: "left" }}>
            <h4 style={{ fontSize: "calc(13.5px * var(--fs))", color: "var(--text)", fontWeight: 700, marginBottom: 2 }}>
              {lang === "hi" ? "NyayTak ऐप इंस्टॉल करें" : "Install NyayTak App"}
            </h4>
            <p style={{ fontSize: "calc(11px * var(--fs))", color: "var(--text-dim)", lineHeight: 1.4 }}>
              {lang === "hi" ? "तेज एक्सेस, कम इंटरनेट और ऑफलाइन सलाह पाएं।" : "Get instant access, lower data usage, and offline support."}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <button
              onClick={handleInstallClick}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#f0a500,#d4860a)",
                color: "#0a0e1a",
                fontSize: "calc(11.5px * var(--fs))",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {lang === "hi" ? "इंस्टॉल" : "Install"}
            </button>
            <button
              onClick={() => setShowInstallPopup(false)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-mid)",
                fontSize: "calc(11px * var(--fs))",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {lang === "hi" ? "बाद में" : "Later"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
