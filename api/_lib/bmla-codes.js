import crypto from "node:crypto";

// BMLA access codes — monetization stage 2 (docs/BMLA-BUSINESS-MODEL.md §5).
// Stateless + self-verifying, zero deps, no database: the code carries its own
// expiry and a truncated HMAC, so the owner issues codes offline
// (scripts/bmla-codes.js) and /api/bmla/redeem validates them with the secret
// alone. Revocation = rotate BMLA_CODE_SECRET (fits the ~20-code manual scale).
//
// Wire format: BMLA-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX (30 hex chars) =
//   body: version(1B) | random id(4B) | expiry unix secs(4B, uint32BE)
//   sig:  HMAC-SHA256(secret, body) truncated to 6 bytes — unforgeable without
//         the secret; 2^48 online guesses is not a realistic attack surface.

const VERSION = 1;
const BODY_BYTES = 9;
const SIG_BYTES = 6;

function secret() {
  return process.env.BMLA_CODE_SECRET || process.env.SESSION_SECRET || "";
}

export function isCodeConfigured() {
  return Boolean(secret());
}

function tag(body) {
  return crypto.createHmac("sha256", secret()).update(body).digest().subarray(0, SIG_BYTES);
}

export function generateCode(days) {
  const body = Buffer.alloc(BODY_BYTES);
  body[0] = VERSION;
  crypto.randomBytes(4).copy(body, 1);
  body.writeUInt32BE(Math.floor(Date.now() / 1000) + Math.round(days * 86400), 5);
  const hex = Buffer.concat([body, tag(body)]).toString("hex").toUpperCase();
  return `BMLA-${hex.match(/.{5}/g).join("-")}`;
}

// -> { id, exp } for a valid unexpired code, null otherwise.
export function verifyCode(input) {
  if (!secret() || typeof input !== "string") return null;
  // Forgiving normalization (students paste these): case, spaces, dashes, and
  // the BMLA prefix are all optional. Strip separators BEFORE the prefix —
  // "B" and "A" are hex digits, so the prefix must go as a unit.
  const hex = input.toUpperCase().replace(/[\s-]/g, "").replace(/^BMLA/, "");
  if (!/^[0-9A-F]{30}$/.test(hex)) return null;
  const raw = Buffer.from(hex, "hex");
  const body = raw.subarray(0, BODY_BYTES);
  if (!crypto.timingSafeEqual(raw.subarray(BODY_BYTES), tag(body))) return null;
  if (body[0] !== VERSION) return null;
  const exp = body.readUInt32BE(5);
  if (exp < Math.floor(Date.now() / 1000)) return null;
  return { id: body.subarray(1, 5).toString("hex"), exp };
}
