/**
 * NyayTak Client-Side Zero-Knowledge Privacy & Anonymization Engine
 * 
 * Runs 100% on the user's device (browser) before any prompt is transmitted 
 * to backend APIs or LLM inference engines.
 * 
 * Automatically redacts:
 * - Indian Mobile Numbers (10 digits, +91, 0 prefixes)
 * - Aadhaar Card Numbers (12 digits, spaced or hyphenated)
 * - Permanent Account Numbers (PAN Cards)
 * - Email Addresses
 */

export function sanitizeClientPII(text) {
  if (!text || typeof text !== "string") return text;

  let sanitized = text;

  // 1. Redact Aadhaar Numbers (4 digits - 4 digits - 4 digits or 12 continuous digits)
  sanitized = sanitized.replace(/\b[2-9]{1}[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/g, "[Aadhaar_Protected]");

  // 2. Redact Indian PAN Card Numbers (5 letters, 4 digits, 1 letter)
  sanitized = sanitized.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi, "[PAN_Protected]");

  // 3. Redact Email Addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[Email_Protected]");

  // 4. Redact Indian Phone Numbers (+91 / 0 followed by 10 digits starting with 6,7,8,9)
  sanitized = sanitized.replace(/(?:\+91[\s-]?)?(?:\b0)?[6-9]\d{9}\b/g, "[Phone_Protected]");

  return sanitized;
}

export function detectPIIPresence(text) {
  if (!text || typeof text !== "string") return false;
  const hasAadhaar = /\b[2-9]{1}[0-9]{3}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/.test(text);
  const hasPan = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i.test(text);
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
  const hasPhone = /(?:\+91[\s-]?)?(?:\b0)?[6-9]\d{9}\b/.test(text);
  return hasAadhaar || hasPan || hasEmail || hasPhone;
}
