import { issueCookie, verifySession } from "../_lib/session.js";
import { isCodeConfigured, verifyCode } from "../_lib/bmla-codes.js";

// BMLA access-code redemption (docs/BMLA-BUSINESS-MODEL.md §5, stage 2).
//   GET  -> { configured, authenticated } so BmlaGate can branch (mirrors
//           /api/auth/session): configured=false -> client passcode fallback.
//   POST { code } -> verifies the signed code, sets a role:"bmla" cookie.
// The cookie is separate from the owner's ("killey_bmla" vs "killey_session")
// and owner endpoints additionally require role:"owner", so a redeemed code
// can never unlock the cockpit. Ships inert until VITE_BMLA_MODE=codes.

const COOKIE = "killey_bmla";
const MAX_COOKIE_AGE = 60 * 60 * 24 * 30; // re-enter the code monthly at most

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  // Cookies are signed with SESSION_SECRET, so codes-mode needs it even when
  // the codes themselves use a dedicated BMLA_CODE_SECRET.
  const configured = isCodeConfigured() && Boolean(process.env.SESSION_SECRET);

  if (req.method === "GET") {
    const session = verifySession(req, { name: COOKIE });
    return res.status(200).json({
      configured,
      authenticated: session?.role === "bmla",
    });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method" });
  }
  if (!configured) return res.status(503).json({ error: "unconfigured" });

  const code = verifyCode(req.body?.code);
  if (!code) return res.status(401).json({ error: "invalid" }); // generic: wrong OR expired

  const maxAge = Math.min(MAX_COOKIE_AGE, code.exp - Math.floor(Date.now() / 1000));
  res.setHeader("Set-Cookie", issueCookie({ sub: code.id, role: "bmla" }, { name: COOKIE, maxAge }));
  return res.status(200).json({ ok: true, exp: code.exp });
}
