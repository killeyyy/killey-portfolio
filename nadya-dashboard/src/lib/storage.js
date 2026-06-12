// Namespaced localStorage wrapper — the single seam for persistence.
// Cloud sync rides this seam: every write notifies the hook below so the
// sync engine (lib/cloud/sync.js) can mark keys dirty. Callers never change.
const PREFIX = "nadya:";

const writeHooks = new Set();
/** Register a write observer; receives (key, removed). Multiple allowed —
 * the sync engine marks dirty, the activities model invalidates its cache. */
export function _setWriteHook(fn) {
  writeHooks.add(fn);
}

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
    for (const fn of writeHooks) fn(key, false);
  } catch {
    /* quota/private mode — fail silent */
  }
}

export function remove(key) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PREFIX + key);
    for (const fn of writeHooks) fn(key, true);
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
