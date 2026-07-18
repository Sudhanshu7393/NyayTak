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
