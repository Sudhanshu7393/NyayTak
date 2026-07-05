import { useState, useEffect } from "react";
import { FONT_BODY, UI } from "./data.js";
import { Disclaimer } from "./components/ui.jsx";
import Landing from "./screens/Landing.jsx";
import CategorySelect from "./screens/CategorySelect.jsx";
import ScenarioSelect from "./screens/ScenarioSelect.jsx";
import ChatScreen from "./screens/ChatScreen.jsx";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [catEn, setCatEn] = useState("");
  const [scenario, setScenario] = useState("");
  const [lang, setLang] = useState("hinglish");
  const [theme, setTheme] = useState("dark");
  const [fontScale, setFontScale] = useState(1);
  const [state, setState] = useState("Delhi");
  const [saved, setSaved] = useState([]);

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

  const t = UI[lang] || UI.hinglish;

  const handleOnboardingStart = (category, state_param) => {
    setCatEn(category);
    setState(state_param);
    setScreen("scenario");
    window.history.pushState({ screen: "scenario" }, "");
  };

  const onCatSelect = (cid) => {
    setCatEn(cid);
    setScreen("scenario");
    window.history.pushState({ screen: "scenario" }, "");
  };

  const onScenarioSelect = (idx) => {
    setScenario(idx);
    setScreen("chat");
    window.history.pushState({ screen: "chat" }, "");
  };

  const onBack = () => {
    if (screen === "chat") {
      setScreen("scenario");
      window.history.pushState({ screen: "scenario" }, "");
    } else if (screen === "scenario") {
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
          onStart={handleOnboardingStart}
          onShowSaved={() => {}}
          savedCount={saved.length}
          t={t}
          lang={lang}
          setLang={setLang}
          settings={{
            theme,
            setTheme,
            fontScale,
            setFontScale,
            state,
            setState,
          }}
        />
      )}

      {screen === "scenario" && catEn && (
        <ScenarioSelect
          catEn={catEn}
          onSelect={onScenarioSelect}
          onBack={onBack}
          t={t}
          lang={lang}
          setLang={setLang}
          settings={{
            theme,
            setTheme,
            fontScale,
            setFontScale,
            state,
            setState,
          }}
        />
      )}

      {screen === "chat" && catEn && (
        <ChatScreen
          catEn={catEn}
          scenario={scenario}
          langPrompt={lang}
          onBack={onBack}
          onSave={() => {}}
          t={t}
          lang={lang}
          setLang={setLang}
          settings={{
            theme,
            setTheme,
            fontScale,
            setFontScale,
            state,
            setState,
          }}
        />
      )}

      <Disclaimer t={t} />
    </div>
  );
}
