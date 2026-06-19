import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash"; // single model — free quota sabse acchi, 1 sawaal = 1 request

console.log(
  "🔑 Gemini key loaded:",
  KEY ? "yes" : "NO  ← .env me GEMINI_API_KEY missing!",
);

app.post("/api/chat", async (req, res) => {
  if (!KEY)
    return res
      .status(500)
      .json({ error: "GEMINI_API_KEY not set in backend/.env" });

  const { system, messages = [] } = req.body;
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body = { contents };
  if (system) body.systemInstruction = { parts: [{ text: system }] };

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = await r.json();

    if (!r.ok) {
      const msg = data?.error?.message || "HTTP " + r.status;
      console.error(`❌ ${MODEL} failed:`, msg);
      // Quota / rate limit → saaf message bhejo
      if (r.status === 429) {
        return res
          .status(429)
          .json({
            error: "QUOTA",
            content: [
              {
                type: "text",
                text: "⚠️ Abhi demand zyada hai (free limit). Thodi der baad dobara try karein.",
              },
            ],
          });
      }
      return res.status(r.status).json({ error: msg });
    }

    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("")
      .trim();
    if (!text) return res.status(502).json({ error: "Empty response" });

    console.log(`✅ reply via ${MODEL}`);
    return res.json({ content: [{ type: "text", text }] });
  } catch (e) {
    console.error("❌ threw:", String(e));
    return res.status(500).json({ error: String(e) });
  }
});

app.get("/", (_req, res) =>
  res.send("NyayTak backend (Gemini) is running. POST /api/chat"),
);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () =>
  console.log(
    `✅ NyayTak backend (Gemini) running on http://localhost:${PORT}`,
  ),
);
