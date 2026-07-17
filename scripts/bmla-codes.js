#!/usr/bin/env node
// Owner-only: mint BMLA access codes offline (docs/BMLA-BUSINESS-MODEL.md §5 —
// student pays via JazzCash/EasyPaisa/transfer, owner sends a code, the code
// unlocks /bmla via /api/bmla/redeem). Run with the SAME secret Vercel uses:
//
//   BMLA_CODE_SECRET=<secret> node scripts/bmla-codes.js --days 120 --count 5
//
// Codes are stateless (expiry + signature baked in) — nothing to store; keep a
// note of who got which code if you want to track buyers.
import { generateCode, isCodeConfigured } from "../api/_lib/bmla-codes.js";

const args = process.argv.slice(2);
function num(flag, fallback) {
  const i = args.indexOf(`--${flag}`);
  return i === -1 ? fallback : Number(args[i + 1]);
}
const days = num("days", 120); // default ≈ one semester
const count = num("count", 1);

if (!isCodeConfigured()) {
  console.error("Set BMLA_CODE_SECRET (or SESSION_SECRET) — the same value as in Vercel env.");
  process.exit(1);
}
if (!Number.isFinite(days) || days <= 0 || !Number.isInteger(count) || count < 1 || count > 100) {
  console.error("Usage: node scripts/bmla-codes.js [--days N>0] [--count 1..100]");
  process.exit(1);
}

for (let i = 0; i < count; i++) console.log(generateCode(days));
console.error(`\n${count} code(s), each valid ${days} days from now.`);
