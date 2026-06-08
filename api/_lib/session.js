import crypto from "node:crypto";

// Stateless HMAC-signed session in an httpOnly cookie (zero deps, node:crypto).
// docs/PLAYBOOK.md Recipe 7.1 / ADR-007. Secrets live ONLY in Vercel env:
//   SESSION_SECRET   — 32+ random bytes (signs the cookie)
//   OWNER_PASS_HASH  — "<saltHex>:<scryptHex>" of the owner password
// If those env vars are absent the app falls back to the interim passcode gate,
// so the preview is always usable.

const COOKIE = "killey_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  return process.env.SESSION_SECRET || "";
}

export function isConfigured() {
  return Boolean(process.env.SESSION_SECRET && process.env.OWNER_PASS_HASH);
}

function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function issueCookie(payload) {
  const token = sign({ ...payload, exp: Math.floor(Date.now() / 1000) + MAX_AGE });
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function verifySession(req) {
  if (!secret()) return null;
  const raw = req.cookies?.[COOKIE];
  if (!raw || !raw.includes(".")) return null;
  const [data, sig] = raw.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  // length guard FIRST — timingSafeEqual throws on unequal-length buffers,
  // which a forged token would otherwise exploit to crash the function.
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString());
    if (!p.exp || p.exp < Math.floor(Date.now() / 1000)) return null;
    return p;
  } catch {
    return null;
  }
}
