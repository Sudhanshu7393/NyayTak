import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, STATES } from "../data.js";

export default function OnboardingModal({ onStart, onSkip }) {
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");

  const handleStart = () => {
    if (!category || !state) {
      alert("Please select both category and state");
      return;
    }
    onStart(category, state);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--modal-bg)",
          border: "1px solid rgba(240,165,0,0.28)",
          borderRadius: 20,
          padding: "40px 35px",
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onSkip}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-mid)",
          }}
        >
          <X size={16} />
        </button>

        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: 10 }}>👋</div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text)",
              margin: "10px 0 8px 0",
            }}
          >
            Welcome to NyayTak!
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-mid)", margin: 0 }}>
            India's free legal awareness platform
          </p>
        </div>

        <div style={{ marginBottom: 30 }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 8,
            }}
          >
            What's your legal issue?
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              background: "#1a1f2e",
              border: "2px solid rgba(240,165,0,0.3)",
              color: "#ffffff",
              fontSize: "14px",
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.tr.hinglish.t}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 8,
              marginTop: 16,
            }}
          >
            Which state?
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              background: "#1a1f2e",
              border: "2px solid rgba(240,165,0,0.3)",
              color: "#ffffff",
              fontSize: "14px",
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="">Select a state...</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onSkip}
            style={{
              padding: "11px 20px",
              borderRadius: 10,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Skip
          </button>
          <button
            onClick={handleStart}
            style={{
              padding: "11px 24px",
              borderRadius: 10,
              background: "#f0a500",
              border: "none",
              color: "#0a0e1a",
              fontSize: "14px",
              fontWeight: 700,
              cursor: category && state ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              opacity: category && state ? 1 : 0.6,
            }}
          >
            Get Started
          </button>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "var(--text-dim)",
            textAlign: "center",
            marginTop: 20,
            borderTop: "1px solid var(--border-soft)",
            paddingTop: 20,
            margin: "20px 0 0 0",
          }}
        >
          100% anonymous • No login required
        </p>
      </div>
    </div>
  );
}
