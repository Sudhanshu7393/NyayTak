/* API + voice + share helpers */
const API_BASE = import.meta.env.VITE_API_BASE || ""; // empty = same origin (Vite proxy in dev)

export async function callClaude(body) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1400,
      ...body,
    }),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

function cleanMd(s) {
  return (s || "")
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/__(.*?)__/g, "$1") // __bold__
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // # headers
    .replace(/^\s*[*\-–]\s+/gm, "• ") // *, -, – line bullets → •
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2") // remaining *italic*
    .replace(/`{1,3}/g, ""); // backticks
}
function startVoice(speechLang, onText, onError) {
  const SR =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!SR) {
    onError && onError();
    return null;
  }
  let rec,
    pauseTimer = null,
    done = false,
    textSent = false; 

  const finals = [];
  const PAUSE_MS = 2500;

  const finish = () => {
    if (done || textSent) return; // Check textSent
    done = true;
    textSent = true; // Mark as sent
    if (pauseTimer) clearTimeout(pauseTimer);
    const text = finals.join(" ").replace(/\s+/g, " ").trim();
    try {
      rec.stop();
    } catch (_) {}
    if (text) onText(text);
  };

  // Rest same...
}

  try {
    rec = new SR();
    rec.lang = speechLang || "hi-IN";
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals[i] = r[0].transcript.trim(); // index pe rakho → dobara aaye to overwrite, judega nahi
      }
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(finish, PAUSE_MS);
    };
    rec.onerror = () => {
      if (pauseTimer) clearTimeout(pauseTimer);
      if (!done) onError && onError();
    };
    rec.onend = () => {
      finish();
    }; // engine khud band ho to bhi jo bola tha woh bhej do
    rec.start();
  } catch (_) {
    onError && onError();
    return null;
  }
  return rec;

function pickVoice(synth, lang) {
  const voices = synth.getVoices() || [];
  if (!voices.length) return null;
  const base = (lang || "hi-IN").split("-")[0].toLowerCase();
  const norm = (v) => (v.lang || "").replace("_", "-").toLowerCase();
  return (
    voices.find((v) => norm(v) === lang.toLowerCase()) ||
    voices.find(
      (v) => /india|hindi|भारत/i.test(v.name || "") && norm(v).startsWith(base),
    ) ||
    voices.find((v) => norm(v).startsWith(base)) ||
    voices.find((v) => /india|hindi/i.test(v.name || "")) ||
    null
  );
}
function speak(text, speechLang, onEnd) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) {
      onEnd && onEnd();
      return false;
    }
    synth.cancel();
    const clean = text
      .replace(/[🛡⚖📋⚠🫂⏱🏛🙏✏🕑🗣🔒⚡🌐🆓•]/gu, "")
      .replace(/\uFE0F/g, "")
      .replace(/[ \t]+/g, " ")
      .trim();
    if (!clean) {
      onEnd && onEnd();
      return false;
    }
    const hasDeva = /[\u0900-\u097F]/.test(clean); // Devanagari → Hindi voice; Latin → Indian-English
    const lang = hasDeva ? "hi-IN" : speechLang || "en-IN";
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = lang;
      u.rate = 0.95;
      u.pitch = 1;
      const v = pickVoice(synth, lang);
      if (v) u.voice = v;
      u.onend = () => onEnd && onEnd();
      u.onerror = () => onEnd && onEnd();
      synth.speak(u);
    };
    const vs = synth.getVoices();
    if (vs && vs.length) go();
    else {
      try {
        synth.onvoiceschanged = go;
      } catch (_) {}
      setTimeout(go, 300);
    } // voices load async on some devices
    return true;
  } catch (_) {
    onEnd && onEnd();
    return false;
  }
}
async function shareText(text, copiedMsg) {
  if (navigator.share) {
    // native app share sheet (mobile / HTTPS)
    try {
      await navigator.share({ title: "NyayTak", text });
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
    } // user cancelled → stop; other errors → fall through
  }
  try {
    await navigator.clipboard.writeText(text);
    alert(copiedMsg);
    return;
  } catch (_) {}
  try {
    // legacy copy fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert(copiedMsg);
    return;
  } catch (_) {}
  try {
    window.prompt("Copy:", text);
  } catch (_) {} // last resort
}

export { cleanMd, startVoice, pickVoice, speak, shareText };
