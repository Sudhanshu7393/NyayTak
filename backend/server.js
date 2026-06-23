import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile"; // Groq free, fast, acchi quality

console.log(
  "🔑 Groq key loaded:",
  KEY ? "yes" : "NO  ← .env me GROQ_API_KEY missing!",
);

app.post("/api/chat", async (req, res) => {
  if (!KEY)
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY not set in backend/.env" });

  const { system, messages = [] } = req.body;
  // Anthropic-style {system, messages} → OpenAI-style messages
  const chat = [];
  if (system) chat.push({ role: "system", content: system });
  for (const m of messages) {
    chat.push({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    });
  }

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chat,
        max_tokens: 2000,
        temperature: 0.6,
      }),
    });
    const data = await r.json();

    if (!r.ok) {
      const msg = data?.error?.message || "HTTP " + r.status;
      console.error(`❌ ${MODEL} failed:`, msg);
      if (r.status === 429) {
        return res.status(429).json({
          error: "QUOTA",
          content: [
            {
              type: "text",
              text: "⚠️ Abhi demand zyada hai. Thodi der baad dobara try karein.",
            },
          ],
        });
      }
      return res.status(r.status).json({ error: msg });
    }

    const text = (data?.choices?.[0]?.message?.content || "").trim();
    if (!text) return res.status(502).json({ error: "Empty response" });

    console.log(`✅ reply via ${MODEL}`);
    return res.json({ content: [{ type: "text", text }] });
  } catch (e) {
    console.error("❌ threw:", String(e));
    return res.status(500).json({ error: String(e) });
  }
});

app.get("/", (_req, res) =>
  res.send("NyayTak backend (Groq) is running. POST /api/chat"),
);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () =>
  console.log(`✅ NyayTak backend (Groq) running on http://localhost:${PORT}`),
);