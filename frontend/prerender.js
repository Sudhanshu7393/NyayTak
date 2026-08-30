import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("Build index.html not found! Run npm run build first.");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");

// Define pre-rendered landing page markup for SEO crawlers and bots
const prerenderedBody = `
    <div id="root">
      <!-- SEO Fallback Shell for Crawlers (Auto-generated on Build) -->
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center; color: #f3f4f6; background-color: #0b0f19;">
        <h1 style="font-size: 2.5rem; color: #f0a500; margin-bottom: 10px; font-weight: 800;">NyayTak</h1>
        <h2 style="font-size: 1.5rem; font-weight: 500; margin-bottom: 20px;">Vakil se pehle, Nyay tak</h2>
        
        <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px; color: #d1d5db;">
          Anonymous, free, and multilingual AI legal awareness for Indian citizens. Get instant, conversational guidance on police matters, property disputes, documentation, and civil rights in Hindi, Hinglish, English, and other regional languages before consulting a lawyer.
        </p>

        <div style="margin-bottom: 40px;">
          <a href="/chat" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f0a500, #d4860a); color: #0a0e1a; font-weight: 700; text-decoration: none; border-radius: 24px; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(240, 165, 0, 0.3);">
            Shuru Karein — Free Hai
          </a>
        </div>

        <div style="border-top: 1px solid #1f2937; padding-top: 30px; text-align: left;">
          <h3 style="color: #f0a500; font-size: 1.2rem; margin-bottom: 15px; font-weight: 700;">Legal Topics Covered / कानूनी विषय:</h3>
          <ul style="line-height: 2; color: #9ca3af; font-size: 1rem; list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 10px;">👮 <b>Police & FIR</b>: Police complaint filing, FIR quashing, bail, arrest rights</li>
            <li style="margin-bottom: 10px;">🏡 <b>Property Disputes</b>: Land partition, illegal possession, rent control</li>
            <li style="margin-bottom: 10px;">💼 <b>Employment & Dues</b>: Salary recovery, wrongful termination, labor laws</li>
            <li style="margin-bottom: 10px;">⚖️ <b>BNS ⇄ IPC Laws</b>: Search and compare new Bharatiya Nyaya Sanhita laws</li>
            <li style="margin-bottom: 10px;">📜 <b>Draft Templates</b>: Generate RTI, Police Complaint letters, Legal notices</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #1f2937; padding-top: 20px; text-align: left;">
          <h3 style="color: #f0a500; font-size: 1.1rem; margin-bottom: 10px; font-weight: 700;">Supported Indian Languages / भाषाएँ:</h3>
          <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.8;">
            Hinglish, हिन्दी (Hindi), English, मराठी (Marathi), বাংলা (Bengali), தமிழ் (Tamil), तेलुगु (Telugu), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), 🧡 (Odia), ਪੰਜਾਬੀ (Punjabi), മലയാളം (Malayalam), Assamese, Maithili.
          </p>
        </div>

        <div style="margin-top: 30px; border-top: 1px solid #1f2937; padding-top: 25px; text-align: left; font-size: 0.9rem; line-height: 1.6; color: #9ca3af;">
          <p>
            🛡️ <b>Founder & Creator:</b> <a href="https://github.com/Sudhanshu7393" target="_blank" style="color: #f0a500; text-decoration: underline; font-weight: 700;">Sudhanshu Pandey</a> (Independent Developer, India).
          </p>
          <p style="padding: 12px; background: rgba(34,197,94,0.08); border-left: 4px solid #22c55e; color: #22c55e; border-radius: 6px; margin-top: 10px;">
            🔒 <b>Privacy & Safety Guarantee:</b> NyayTak is an open-source, non-profit experiment for legal awareness. It never requests, stores, or handles sensitive documents, Aadhaar cards, PAN cards, OTPs, or payment information. All conversations are fully anonymous.
          </p>
        </div>
      </div>
    </div>
`;

// Replace root div with prerendered body
html = html.replace(/<div id="root">([\s\S]*?)<\/div>/, prerenderedBody);

fs.writeFileSync(indexPath, html, "utf8");
console.log("SUCCESS: Pre-rendered landing page content injected into dist/index.html!");
