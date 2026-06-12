// Ruang Pro license plumbing. Honest by design:
// - While PRO.checkoutUrl is empty (the founding window) NOTHING is gated —
//   sync stays free, exactly as /welcome promises. Early sign-ins get a
//   founding flag that travels with their account (it's a synced key).
// - License activation only switches on when a verifier is configured in
//   data/pro.js — a gate that would accept any string never ships.
import * as storage from "./storage.js";
import { PRO } from "../data/pro.js";

/** { key, activatedAt } | null — synced like any other nadya:* key. */
export function getPro() {
  return storage.get("pro");
}

export function isPro() {
  return Boolean(getPro());
}

export function isFounding() {
  return storage.get("founding") === true;
}

/** Stamped at sign-in while the founding window is open. Never revoked. */
export function stampFounding(pro = PRO) {
  if (!pro.checkoutUrl && !isFounding()) storage.set("founding", true);
}

/** True once a real license verifier exists (data/pro.js). */
export function canActivate(pro = PRO) {
  return Boolean(pro.licenseVerify?.url);
}

/**
 * Verify a license key against the configured provider endpoint
 * (Lemon Squeezy `/v1/licenses/validate` and Gumroad `/v2/licenses/verify`
 * both accept form-encoded POSTs and answer over CORS). Stores on success.
 */
export async function activate(key, pro = PRO) {
  if (!canActivate(pro)) throw new Error("Activation isn't open yet.");
  const trimmed = key.trim();
  if (!trimmed) throw new Error("Enter your license key.");
  const body = new URLSearchParams({
    license_key: trimmed,
    ...(pro.licenseVerify.productId ? { product_id: pro.licenseVerify.productId } : {}),
  });
  const res = await fetch(pro.licenseVerify.url, { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  // LS answers { valid: true }, Gumroad { success: true } — accept either.
  const ok = res.ok && (data.valid === true || data.success === true);
  if (!ok) {
    throw new Error(data.error || data.message || "That key didn't verify — check for typos.");
  }
  const pro_ = { key: trimmed, activatedAt: Date.now() };
  storage.set("pro", pro_);
  return pro_;
}

export function deactivate() {
  storage.remove("pro");
}
