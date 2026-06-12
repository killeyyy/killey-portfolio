// Hand-rolled GoTrue (Supabase auth) client over plain fetch — a few KB
// instead of auth-js's 16, because Petalfall only needs email-OTP codes, token
// refresh and sign-out. Codes, not magic links: PKCE links die in email-app
// in-app browsers and across devices.
// Offline rule (roadmap): NEVER sign out because a refresh failed — local
// data stays readable regardless of auth state; sync simply waits.
import * as storage from "../storage.js";
import { stampFounding } from "../license.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const REFRESH_AHEAD_MS = 5 * 60 * 1000;

async function call(path, body, accessToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.error_description || data.msg || data.message || `Sign-in failed (${res.status})`,
    );
  }
  return data;
}

/** Device-local session (`nadya:session`) — deliberately NOT in backups. */
export function getSession() {
  return storage.get("session");
}

export function clearSession() {
  storage.remove("session");
}

function saveSession(data) {
  const session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    email: data.user?.email || "",
    userId: data.user?.id || "",
  };
  storage.set("session", session);
  return session;
}

/** Email a 6-digit code; the account is created on first sign-in. */
export function requestCode(email) {
  return call("/otp", { email: email.trim().toLowerCase(), create_user: true });
}

export async function verifyCode(email, token) {
  const session = saveSession(
    await call("/verify", { type: "email", email: email.trim().toLowerCase(), token: token.trim() }),
  );
  // Sign-ins during the founding window earn the (synced) founding flag.
  stampFounding();
  return session;
}

export function shouldRefresh(session, now = Date.now()) {
  return Boolean(session) && session.expiresAt - now < REFRESH_AHEAD_MS;
}

/**
 * Current session, refreshed when near expiry. A network failure returns the
 * stale session untouched — being offline must never log her out; only a
 * definitive server rejection (revoked/expired refresh token) signs out.
 */
export async function ensureFreshSession() {
  const session = getSession();
  if (!session || !shouldRefresh(session)) return session;
  try {
    return saveSession(
      await call("/token?grant_type=refresh_token", { refresh_token: session.refreshToken }),
    );
  } catch (err) {
    if (err instanceof TypeError) return session; // fetch network failure
    clearSession();
    return null;
  }
}

/** Local sign-out always succeeds; the server revoke is best-effort. */
export async function signOut() {
  const session = getSession();
  clearSession();
  if (session?.accessToken) {
    try {
      await call("/logout", {}, session.accessToken);
    } catch {
      /* offline — token expires on its own */
    }
  }
}
