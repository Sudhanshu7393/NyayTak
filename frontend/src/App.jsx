import { useState, useEffect } from "react";
import { FONT_BODY, UI, CATEGORIES, findCat } from "./data.js";
import { Disclaimer } from "./components/ui.jsx";
import Landing from "./screens/Landing.jsx";
import CategorySelect from "./screens/CategorySelect.jsx";
import ScenarioSelect from "./screens/ScenarioSelect.jsx";
import ChatScreen from "./screens/ChatScreen.jsx";
import SavedPanel from "./screens/SavedPanel.jsx";
import AdminScreen from "./screens/AdminScreen.jsx";
import AuthScreen from "./screens/AuthScreen.jsx";
import { authService } from "./firebase.js";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [catEn, setCatEn] = useState("");
  const [scenario, setScenario] = useState("");
  const [lang, setLang] = useState("hinglish");
  const [theme, setTheme] = useState("dark");
  const [fontScale, setFontScale] = useState(1);

  const [user, setUser] = useState(null);
  const [adminEmails, setAdminEmails] = useState([]);

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
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--fs", fontScale);
    document.body.style.background = theme === "dark" ? "#0a0e1a" : "#f5f3ef";
    document.body.style.color = theme === "dark" ? "#e0e0e0" : "#1a1a1a";
  }, [fontScale, theme]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const rawAdmins = localStorage.getItem("nyaytak_admin_emails");
      let list = rawAdmins ? JSON.parse(rawAdmins) : [];
      if (!list.includes("sudhanshupandey7393@gmail.com")) {
        list.push("sudhanshupandey7393@gmail.com");
        localStorage.setItem("nyaytak_admin_emails", JSON.stringify(list));
      }
      setAdminEmails(list);
    } catch (_) {}
  }, [screen]);

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
    // Check if prompt was already captured globally
    if (window.deferredInstallPrompt && !isInstalled) {
      setInstallPrompt(window.deferredInstallPrompt);
      setShowInstallPopup(true);
    }

    const handlePrompt = (e) => {
      e.preventDefault();
      window.deferredInstallPrompt = e;
      if (!isInstalled) {
        setInstallPrompt(e);
        setShowInstallPopup(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);

    const handleCustomPrompt = () => {
      if (window.deferredInstallPrompt && !isInstalled) {
        setInstallPrompt(window.deferredInstallPrompt);
        setShowInstallPopup(true);
      }
    };
    window.addEventListener("pwa-prompt-available", handleCustomPrompt);

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallPopup(false);
      window.deferredInstallPrompt = null;
    };
    window.addEventListener("appinstalled", handleInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e) => {
      if (e.matches) setIsInstalled(true);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("pwa-prompt-available", handleCustomPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      setInstallPrompt(null);
      setShowInstallPopup(false);
    } else if (window.deferredInstallPrompt) {
      const prompt = window.deferredInstallPrompt;
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      window.deferredInstallPrompt = null;
      setInstallPrompt(null);
      setShowInstallPopup(false);
    } else {
      alert(lang === "hi" 
        ? "आपका ब्राउज़र डायरेक्ट डाउनलोड का समर्थन नहीं कर रहा है। कृपया ब्राउज़र मेनू (⋮) खोलकर 'Add to Home screen' या 'Install App' चुनें।" 
        : "Direct installation is not supported by your browser. Please open the browser menu (⋮) and select 'Add to Home screen' or 'Install App'.");
      setShowInstallPopup(false);
    }
  };

  const handleInstallRequest = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      setInstallPrompt(null);
      setShowInstallPopup(false);
    } else if (window.deferredInstallPrompt) {
      const prompt = window.deferredInstallPrompt;
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      window.deferredInstallPrompt = null;
      setInstallPrompt(null);
      setShowInstallPopup(false);
    } else {
      // Show the install popup card at the bottom of the screen instead of showing the help instructions modal
      setShowInstallPopup(true);
    }
  };

  const t = UI[lang] || UI.hinglish;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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
    } else if (screen === "admin") {
      setScreen("landing");
      window.history.pushState({ screen: "landing" }, "");
    } else if (screen === "landing") {
      // Already on landing
    }
  };

  if (!user) {
    return <AuthScreen onAuthSuccess={setUser} lang={lang} />;
  }

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
          onInstallClick={handleInstallRequest}
          isInstalled={isInstalled}
          onAdminClick={
            (user?.email?.toLowerCase() === "sudhanshupandey7393@gmail.com" || adminEmails.includes(user?.email?.toLowerCase()))
              ? () => {
                  setScreen("admin");
                  window.history.pushState({ screen: "admin" }, "");
                }
              : null
          }
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
            onAdminClick={
              (user?.email?.toLowerCase() === "sudhanshupandey7393@gmail.com" || adminEmails.includes(user?.email?.toLowerCase()))
                ? () => {
                    setScreen("admin");
                    window.history.pushState({ screen: "admin" }, "");
                  }
                : null
            }
          />
        );
      })()}

      {screen === "admin" && (
        <AdminScreen
          onBack={onBack}
          lang={lang}
        />
      )}

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
            bottom: isMobile ? 16 : 24,
            left: isMobile ? 16 : "50%",
            right: isMobile ? 16 : "auto",
            transform: isMobile ? "none" : "translateX(-50%)",
            width: isMobile ? "auto" : "calc(100% - 32px)",
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

      {showInstallGuide && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--overlay)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 10000,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              position: "relative",
              textAlign: "center",
              animation: "nsFadeUp 0.3s ease both",
            }}
          >
            <button
              onClick={() => setShowInstallGuide(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                color: "var(--text-mid)",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📲</div>
            <h3 style={{ fontSize: "calc(16px * var(--fs))", color: "var(--text)", fontWeight: 700, marginBottom: 8 }}>
              {lang === "hi" ? "ऐप इंस्टॉल करने का तरीका" : "How to Install App"}
            </h3>
            <p style={{ fontSize: "calc(12px * var(--fs))", color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.5 }}>
              {lang === "hi" 
                ? "NyayTak को सीधे अपने फोन की होम स्क्रीन पर एक नेटिव ऐप की तरह जोड़ें।" 
                : "Add NyayTak directly to your device home screen as a native application."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ background: "#f0a500", color: "#0a0e1a", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>1</span>
                <div>
                  <b style={{ color: "var(--text)", fontSize: "calc(12.5px * var(--fs))" }}>
                    {lang === "hi" ? "Android (Chrome / Edge)" : "Android (Chrome / Edge)"}
                  </b>
                  <p style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", marginTop: 2 }}>
                    {lang === "hi" ? "ऊपर दाईं ओर 3 डॉट्स (⋮) पर क्लिक करें और 'Add to Home screen' या 'Install App' चुनें।" : "Tap 3 dots (⋮) in Chrome and select 'Add to Home screen' or 'Install App'."}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ background: "#f0a500", color: "#0a0e1a", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>2</span>
                <div>
                  <b style={{ color: "var(--text)", fontSize: "calc(12.5px * var(--fs))" }}>
                    {lang === "hi" ? "iPhone / iOS (Safari)" : "iPhone / iOS (Safari)"}
                  </b>
                  <p style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", marginTop: 2 }}>
                    {lang === "hi" ? "सफारी में नीचे 'Share' 📤 बटन दबाएं और 'Add to Home Screen' चुनें।" : "Tap 'Share' 📤 button in Safari and choose 'Add to Home Screen'."}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ background: "#f0a500", color: "#0a0e1a", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>3</span>
                <div>
                  <b style={{ color: "var(--text)", fontSize: "calc(12.5px * var(--fs))" }}>
                    {lang === "hi" ? "कंप्यूटर / PC (Chrome/Edge)" : "Computer / PC (Chrome/Edge)"}
                  </b>
                  <p style={{ fontSize: "calc(11.5px * var(--fs))", color: "var(--text-mid)", marginTop: 2, marginBottom: 6 }}>
                    {lang === "hi" ? "URL एड्रेस बार में दाईं ओर बने छोटे 'Install' कंप्यूटर आइकॉन या '+' बटन पर क्लिक करें:" : "Click the 'Install' computer icon or '+' button at the right edge of address bar:"}
                  </p>
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      padding: "6px 12px",
                      borderRadius: 10,
                      fontFamily: "monospace",
                      fontSize: "calc(11.5px * var(--fs))",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--text-dim)",
                      maxWidth: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ color: "#22c55e" }}>🔒</span>
                    <span style={{ color: "var(--text-mid)", textDecoration: "underline" }}>nyaytak.online</span>
                    <span style={{ marginLeft: "auto", background: "rgba(240,165,0,0.18)", border: "1px solid #f0a500", color: "#f0a500", padding: "1px 5px", borderRadius: 4, fontSize: "calc(9px * var(--fs))", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: 3 }}>
                      🖥️ Install
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#f0a500,#d4860a)",
                color: "#0a0e1a",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "calc(13px * var(--fs))",
              }}
            >
              👍 {lang === "hi" ? "ठीक है, समझ गया" : "Okay, Got it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
