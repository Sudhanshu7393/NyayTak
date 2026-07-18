import React, { useState } from "react";
import { Scale, Lock, Mail, User, ShieldAlert, Sparkles } from "lucide-react";
import { authService } from "../firebase.js";

function AuthScreen({ onAuthSuccess, lang }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg(lang === "hi" ? "कृपया सभी फ़ील्ड भरें!" : "Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (isSignUp && !displayName.trim()) {
      setErrorMsg(lang === "hi" ? "कृपया अपना नाम दर्ज करें!" : "Please enter your name.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const user = await authService.signUp(email, password, displayName);
        onAuthSuccess(user);
      } else {
        const user = await authService.signIn(email, password);
        onAuthSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
      background: "radial-gradient(circle at top, #0f172a, #020617)",
      padding: "20px",
      boxSizing: "border-box",
      fontFamily: "inherit",
      color: "#e2e8f0"
    }}>
      {/* Login Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "rgba(30, 41, 59, 0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 24,
        padding: "32px 28px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        textAlign: "center"
      }}>
        {/* Brand Logo */}
        <div style={{ display: "inline-flex", padding: 12, borderRadius: 16, background: "rgba(240, 165, 0, 0.1)", border: "1px solid rgba(240, 165, 0, 0.2)", marginBottom: 16 }}>
          <Scale size={32} style={{ color: "#f0a500" }} />
        </div>
        
        <h2 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 6px 0", background: "linear-gradient(135deg, #ffffff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          NyayTak
        </h2>
        <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: "0 0 28px 0" }}>
          {lang === "hi" ? "भारत का एआई विधिक जागरूकता पोर्टल" : "India's AI Legal Awareness Portal"}
        </p>

        {/* Tab Selector */}
        <div style={{ display: "flex", background: "rgba(15, 23, 42, 0.6)", padding: 4, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.04)", marginBottom: 24 }}>
          <button
            onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "13.5px",
              background: !isSignUp ? "#f0a500" : "transparent",
              color: !isSignUp ? "#020617" : "#94a3b8",
              transition: "all 0.2s"
            }}
          >
            {lang === "hi" ? "लॉगिन" : "Login"}
          </button>
          <button
            onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "13.5px",
              background: isSignUp ? "#f0a500" : "transparent",
              color: isSignUp ? "#020617" : "#94a3b8",
              transition: "all 0.2s"
            }}
          >
            {lang === "hi" ? "पंजीकरण" : "Sign Up"}
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            padding: "12px 14px",
            borderRadius: 12,
            color: "#ef4444",
            fontSize: "12px",
            textAlign: "left",
            marginBottom: 20
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignUp && (
            <div style={{ position: "relative", textAlign: "left" }}>
              <User size={16} style={{ position: "absolute", left: 14, top: 15, color: "#64748b" }} />
              <input
                type="text"
                placeholder={lang === "hi" ? "पूरा नाम" : "Full Name"}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 40px",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(15, 23, 42, 0.4)",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          <div style={{ position: "relative", textAlign: "left" }}>
            <Mail size={16} style={{ position: "absolute", left: 14, top: 15, color: "#64748b" }} />
            <input
              type="email"
              placeholder={lang === "hi" ? "ईमेल पता" : "Email Address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 40px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(15, 23, 42, 0.4)",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ position: "relative", textAlign: "left" }}>
            <Lock size={16} style={{ position: "absolute", left: 14, top: 15, color: "#64748b" }} />
            <input
              type="password"
              placeholder={lang === "hi" ? "पासवर्ड (न्यूनतम 6 अंक)" : "Password (Min 6 chars)"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 40px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(15, 23, 42, 0.4)",
                color: "#ffffff",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #f0a500, #b47a00)",
              color: "#020617",
              fontWeight: 800,
              fontSize: "14.5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 12px rgba(240, 165, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "transform 0.1s, opacity 0.2s"
            }}
          >
            {loading ? (
              <span>{lang === "hi" ? "लोड हो रहा है..." : "Processing..."}</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>{isSignUp ? (lang === "hi" ? "पंजीकरण करें" : "Create Account") : (lang === "hi" ? "प्रवेश करें" : "Sign In")}</span>
              </>
            )}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
          <span style={{ padding: "0 10px", fontSize: "11.5px", color: "#64748b", fontWeight: 600 }}>
            {lang === "hi" ? "अथवा" : "OR"}
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
        </div>

        <button
          type="button"
          onClick={async () => {
            setErrorMsg("");
            setLoading(true);
            try {
              const user = await authService.signInWithGoogle();
              onAuthSuccess(user);
            } catch (err) {
              setErrorMsg(err.message || "Google Authentication failed.");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "13.5px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "background 0.2s"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.15 3.69-5.32 3.69-8.74z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.89-3.02c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.21v3.23C3.18 21.82 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.27 14.27a7.18 7.18 0 0 1 0-4.54V6.5H1.21a11.97 11.97 0 0 0 0 11.01l4.06-3.24z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.31 0 3.18 2.18 1.21 5.75l4.06 3.23c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          <span>{lang === "hi" ? "गूगल के साथ लॉगिन करें" : "Sign in with Google"}</span>
        </button>

        {/* Sandbox Notice */}
        {authService.isSimulated && (
          <div style={{ marginTop: 24, fontSize: "11px", color: "#64748b" }}>
            🔒 {lang === "hi" ? "सुरक्षित लोकल सैंडबॉक्स मोड सक्रिय है" : "Secure Local Sandbox Mode Active"}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
