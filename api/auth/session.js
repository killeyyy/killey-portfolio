import { verifySession, isConfigured } from "../_lib/session.js";

// GET -> { configured, authenticated }. Always 200 so the client can branch:
//   configured=false -> interim passcode gate (preview still works)
//   configured=true  -> real signed-cookie login
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    configured: isConfigured(),
    authenticated: Boolean(verifySession(req)),
  });
}
