// Namespaced localStorage wrapper — the single seam for persistence.
// Later, cloud sync can replace this implementation without touching callers
// (models call only get/set/remove/listKeys/clearAll).
const PREFIX = "nadya:";

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

/** Un-prefixed keys in our namespace, optionally filtered (e.g. "act:"). */
export function listKeys(prefix = "") {
  try {
    if (typeof window === "undefined") return [];
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX + prefix)) keys.push(k.slice(PREFIX.length));
    }
    return keys.sort();
  } catch {
    return [];
  }
}

/** Wipe the whole namespace (import-replace only). */
export function clearAll() {
  for (const k of listKeys()) remove(k);
}
