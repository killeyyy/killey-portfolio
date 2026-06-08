import crypto from "node:crypto";
import { issueCookie, isConfigured } from "../_lib/session.js";

// POST { password } -> sets the signed httpOnly cookie on success.
// Generate OWNER_PASS_HASH once offline (see docs/SETUP-ENV.md):
//   node -e "const c=require('crypto');const s=c.randomBytes(16);const h=c.scryptSync('MYPASS',s,64);console.log(s.toString('hex')+':'+h.toString('hex'))"
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!isConfigured()) return res.status(503).json({ error: "unconfigured" });

  const { password } = req.body || {};
  if (typeof password !== "string") return res.status(400).json({ error: "bad" });

  const [saltHex, hashHex] = (process.env.OWNER_PASS_HASH || "").split(":");
  if (!saltHex || !hashHex) return res.status(503).json({ error: "unconfigured" });

  const salt = Buffer.from(saltHex, "hex");
  const stored = Buffer.from(hashHex, "hex");
  let candidate;
  try {
    candidate = crypto.scryptSync(password, salt, stored.length);
  } catch {
    return res.status(500).json({ error: "hash" });
  }
  const ok = candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
  if (!ok) return res.status(401).json({ error: "invalid" }); // generic message

  res.setHeader("Set-Cookie", issueCookie({ sub: "owner", role: "owner" }));
  return res.status(200).json({ ok: true });
}
