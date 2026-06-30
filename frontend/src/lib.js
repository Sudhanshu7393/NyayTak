/* API + voice + share + document helpers */
const API_BASE = import.meta.env.VITE_API_BASE || "";

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

export async function analyzeDocument(file, caseType, scenario, lang) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("caseType", caseType);
  formData.append("scenario", scenario);
  formData.append("lang", lang);

  const res = await fetch(`${API_BASE}/api/analyze-document`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Document analysis failed: " + res.status);
  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

function cleanMd(s) {
  return (s || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[*\-–]\s+/gm, "• ")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/`{1,3}/g, "");
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
    if (done || textSent) return;
    done = true;
    textSent = true;
    if (pauseTimer) clearTimeout(pauseTimer);
    const text = finals.join(" ").replace(/\s+/g, " ").trim();
    try {
      rec.stop();
    } catch (_) {}
    if (text) onText(text);
  };

  try {
    rec = new SR();
    rec.lang = speechLang || "hi-IN";
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finals[i] = r[0].transcript.trim();
      }
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(finish, PAUSE_MS);
    };
    rec.onerror = () => {
      if (pauseTimer) clearTimeout(pauseTimer);
      if (!done) onError && onError();
    };
    rec.onend = () => {
      if (!done) finish();
    };
    rec.start();
    return rec;
  } catch (_) {
    onError && onError();
    return null;
  }
}

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
    const hasDeva = /[\u0900-\u097F]/.test(clean);
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
    }
    return true;
  } catch (_) {
    onEnd && onEnd();
    return false;
  }
}

async function shareText(text, copiedMsg) {
  if (navigator.share) {
    try {
      await navigator.share({ title: "NyayTak", text });
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    alert(copiedMsg);
    return;
  } catch (_) {}
  try {
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
  } catch (_) {}
}

export { cleanMd, startVoice, pickVoice, speak, shareText };
