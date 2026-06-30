import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("File type not supported"));
  },
});

const KEY = process.env.GROQ_API_KEY;
const IK_KEY = process.env.INDIAN_KANOON_API_TOKEN;
const MODEL = "llama-3.3-70b-versatile";

console.log(
  "🔑 Groq key loaded:",
  KEY ? "yes" : "NO  ← .env me GROQ_API_KEY missing!",
);
console.log(
  "⚖️ Indian Kanoon key:",
  IK_KEY ? "yes" : "missing (case citations off)",
);

// ── Indian Kanoon Search ──
async function searchCaseLaw(query) {
  if (!IK_KEY) return [];
  try {
    const form = new URLSearchParams();
    form.append("formInput", query);
    form.append("pagenum", "0");

    const r = await fetch("http://api.indiankanoon.org/search/", {
      method: "POST",
      headers: {
        Authorization: `Token ${IK_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    if (!r.ok) return [];
    const data = await r.json();

    return (data.docs || []).slice(0, 2).map((doc) => ({
      title: doc.title || "Untitled",
      court: doc.docsource || "Indian Court",
      date: doc.publishdate || "",
      summary: (doc.headline || "").replace(/<[^>]*>/g, "").slice(0, 200),
      url: `https://indiankanoon.org/doc/${doc.tid}/`,
    }));
  } catch (e) {
    console.error("⚠️ Indian Kanoon error:", String(e));
    return [];
  }
}

// ── Inject Cases ──
function injectCases(systemPrompt, cases) {
  if (!cases.length) return systemPrompt;

  const block = `

RELEVANT INDIAN CASE LAW (cite these naturally if applicable):
${cases
  .map(
    (c, i) =>
      `${i + 1}. ${c.title}
   Court: ${c.court} | Date: ${c.date}
   Summary: ${c.summary}
   Source: ${c.url}`,
  )
  .join("\n\n")}

Instruction: Apne response mein 1-2 relevant cases naturally cite karo. Format: "Case Name (Court, Year)". Agar koi case directly relevant nahi hai toh cite mat karo.`;

  return systemPrompt + block;
}

// ── Extract Document Text ──
async function extractDocumentText(file) {
  try {
    if (file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(file.buffer);
      return pdfData.text.slice(0, 5000);
    } else if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      return "[Image uploaded - OCR not integrated. Please describe the document.]";
    } else if (file.mimetype === "text/plain") {
      return file.buffer.toString("utf-8").slice(0, 5000);
    }
  } catch (e) {
    console.error("Document extraction error:", e);
    return null;
  }
  return null;
}

// ── /api/chat ──
app.post("/api/chat", async (req, res) => {
  if (!KEY)
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY not set in backend/.env" });

  const { system, messages = [] } = req.body;

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const cases = lastUserMsg ? await searchCaseLaw(lastUserMsg.content) : [];

  if (cases.length)
    console.log(
      `⚖️ ${cases.length} case(s) found for: "${lastUserMsg?.content?.slice(0, 60)}"`,
    );

  const enrichedSystem = injectCases(system || "", cases);

  const chat = [];
  if (enrichedSystem) chat.push({ role: "system", content: enrichedSystem });
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

// ── /api/analyze-document ──
app.post("/api/analyze-document", upload.single("file"), async (req, res) => {
  if (!KEY)
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY not set in backend/.env" });

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { caseType, scenario, lang } = req.body;

  try {
    const docText = await extractDocumentText(req.file);
    if (!docText)
      return res
        .status(400)
        .json({ error: "Could not extract text from document" });

    console.log(
      `📄 Analyzing document: ${req.file.originalname} (${req.file.mimetype})`,
    );

    const analysisPrompt = `You are NyayTak's document analyzer for Indian legal cases.
A user has uploaded a legal document related to: Case Type: ${caseType}, Scenario: "${scenario}".

DOCUMENT CONTENT:
${docText}

ANALYSIS (in ${lang || "Hinglish"}):
Analyze this document thoroughly and provide:
1. 🔍 DOCUMENT TYPE & STATUS: What is this document? Is it complete?
2. ⚖️ LEGAL RELEVANCE: Which laws/sections does this relate to?
3. 📋 KEY FACTS: What are the important facts/claims?
4. ⚠️ STRENGTHS: What helps the case?
5. 🚨 WEAKNESSES: What could harm the case?
6. 📝 MISSING INFO: What additional information/documents are needed?
7. 🎯 NEXT STEPS: What should be done next?
8. 💡 QUICK TIPS: Any immediate advice?

Be thorough but concise. Use clear language, no jargon.`;

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      const msg = data?.error?.message || "HTTP " + r.status;
      console.error(`❌ Document analysis failed:`, msg);
      return res.status(r.status).json({ error: msg });
    }

    const analysis = (data?.choices?.[0]?.message?.content || "").trim();
    if (!analysis)
      return res.status(502).json({ error: "Could not generate analysis" });

    console.log(`✅ Document analysis complete`);
    return res.json({
      content: [
        {
          type: "text",
          text: analysis,
        },
      ],
    });
  } catch (e) {
    console.error("❌ Document analysis error:", String(e));
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
