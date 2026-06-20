// Namespaced localStorage wrapper for the Calculus vault — the single seam for
// persistence (mirrors lib/bmla/storage.js so the two products stay symmetric).
const PREFIX = "calc:v1:";

export function get(key, fallback = null) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota/private mode — fail silent */
  }
}

export function remove(key) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}
