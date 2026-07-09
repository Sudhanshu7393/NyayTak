# ⚖️ NyayTak — Vakil se pehle, nyay tak

Anonymous, free, multilingual **AI legal-awareness** platform for India.
Built by **Sudhanshu Pandey** · Founder.

> Legal awareness only — for serious matters, consult a qualified lawyer.

This repo has two parts kept **separate**:

```
nyaytak/
├── frontend/     React + Vite app (all UI)
│   └── src/
│       ├── data.js              # languages, categories, laws, helplines, portals, UI strings, prompts
│       ├── lib.js               # API call (to backend), voice (TTS/mic), share, markdown cleanup
│       ├── styles.css           # theme variables, fonts, animations
│       ├── components/ui.jsx    # shared UI: buttons, language/settings menus, panels, answer renderer, SVGs
│       ├── screens/             # Landing, CategorySelect, ScenarioSelect, ChatScreen, SavedPanel
│       ├── App.jsx              # app state + screen routing
│       └── main.jsx             # React entry point
└── backend/      Node + Express API-key proxy (keeps your key off the browser)
    └── server.js
```

## 1) Backend setup (do this first)

```bash
cd backend
npm install
cp .env.example .env          # then open .env and paste your Groq API key
npm start                      # runs on http://localhost:8787
```

Get an API key from https://console.groq.com.

## 2) Frontend setup

```bash
cd frontend
npm install
npm run dev                    # opens http://localhost:5173
```

The frontend calls `/api/chat`, which Vite proxies to the backend in dev — so the
**API key never reaches the browser**.

## How it works

- The browser sends the chat/tool request to **your backend** (`/api/chat`).
- The backend adds the secret API key and forwards it to Groq (Llama 3.3 model), then returns the reply.
- This is the secure pattern — never put the API key directly in frontend code.

## Production deploy

- **Frontend** → Vercel / Netlify (static build: `npm run build` → `dist/`).
- **Backend** → Render / Railway / a small VPS (set `GROQ_API_KEY` as an env var).
- Set `VITE_API_BASE` in the frontend `.env` to your deployed backend URL
  (e.g. `https://nyaytak-api.onrender.com`).

## Notes

- Voice (mic + read-aloud) and the native Share sheet work best on **Android Chrome over HTTPS**;
  they are limited on desktop Firefox / iOS Safari and in local previews.
- Helpline numbers and government portal links are India-specific and verified, but always
  verify the exact authority for your state and case.
