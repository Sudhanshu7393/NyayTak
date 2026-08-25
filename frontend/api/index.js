import express from "express";
import cors from "cors";
import "dotenv/config";
import multer from "multer";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";

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
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

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

    return (data.results || []).slice(0, 2).map((doc) => ({
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
  const cases = (system && lastUserMsg) ? await searchCaseLaw(lastUserMsg.content) : [];

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

    let text = (data?.choices?.[0]?.message?.content || "").trim();
    if (!text) return res.status(502).json({ error: "Empty response" });

    // Strip thinking process tags if returned by reasoning models
    text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    return res.json({ content: [{ type: "text", text }] });
  } catch (e) {
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
      return res.status(r.status).json({ error: msg });
    }

    const analysis = (data?.choices?.[0]?.message?.content || "").trim();
    if (!analysis)
      return res.status(502).json({ error: "Could not generate analysis" });

    return res.json({
      content: [
        {
          type: "text",
          text: analysis,
        },
      ],
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

// ── Shared Admin Emails Database ──
const ADMINS_FILE = path.join("/tmp", "admins.json");
let authorizedAdmins = ["sudhanshupandey7393@gmail.com"];

function loadAdmins() {
  try {
    if (fs.existsSync(ADMINS_FILE)) {
      const data = fs.readFileSync(ADMINS_FILE, "utf8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) {
        if (!list.includes("sudhanshupandey7393@gmail.com")) {
          list.push("sudhanshupandey7393@gmail.com");
        }
        authorizedAdmins = list;
        return;
      }
    }
  } catch (e) {
    console.error("Error reading admins.json:", e);
  }
}

function saveAdmins(list) {
  try {
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing admins.json:", e);
  }
}

app.get("/api/admins", (req, res) => {
  loadAdmins();
  return res.json(authorizedAdmins);
});

app.post("/api/admins", (req, res) => {
  loadAdmins();
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  const cleanEmail = email.trim().toLowerCase();
  if (authorizedAdmins.includes(cleanEmail)) {
    return res.json(authorizedAdmins);
  }
  authorizedAdmins.push(cleanEmail);
  saveAdmins(authorizedAdmins);
  return res.json(authorizedAdmins);
});

app.delete("/api/admins", (req, res) => {
  loadAdmins();
  const email = req.query.email || req.body.email;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === "sudhanshupandey7393@gmail.com") {
    return res.status(403).json({ error: "Root administrator cannot be removed" });
  }
  authorizedAdmins = authorizedAdmins.filter(e => e !== cleanEmail);
  saveAdmins(authorizedAdmins);
  return res.json(authorizedAdmins);
});

// ── Shared Registered Users Database ──
const USERS_FILE = path.join("/tmp", "users.json");
let registeredUsers = [];

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      const list = JSON.parse(data);
      if (Array.isArray(list)) {
        registeredUsers = list;
        return;
      }
    }
  } catch (e) {
    console.error("Error reading users.json:", e);
  }
}

function saveUsers(list) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing users.json:", e);
  }
}

app.get("/api/users", (req, res) => {
  loadUsers();
  return res.json(registeredUsers);
});

app.post("/api/users", (req, res) => {
  loadUsers();
  const { uid, email, displayName, createdAt } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existingIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);

  if (existingIndex > -1) {
    registeredUsers[existingIndex] = {
      ...registeredUsers[existingIndex],
      uid: uid || registeredUsers[existingIndex].uid,
      displayName: displayName || registeredUsers[existingIndex].displayName,
    };
  } else {
    registeredUsers.push({
      uid: uid || `user-${Date.now()}`,
      email: cleanEmail,
      displayName: displayName || cleanEmail.split("@")[0],
      createdAt: createdAt || new Date().toLocaleDateString("en-IN")
    });
  }

  saveUsers(registeredUsers);
  return res.json(registeredUsers);
});

app.get("/", (_req, res) =>
  res.send("NyayTak backend (Vercel Serverless) is running."),
);

export default app;
