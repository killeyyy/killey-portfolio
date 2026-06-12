// Cloud sync engine (Era 2 PR 8) — lives entirely behind the storage.js
// seam. localStorage stays the source of truth; this mirrors `nadya:*` keys
// into the per-user kv table, newest-write-wins per key.
//
// Write path: storage.set/remove → write hook → persisted dirty map →
// debounced flush (~2s). Dirty flags survive restarts, so a flush that never
// happened (offline, killed app) simply runs next boot — durability comes
// from the persisted set, not from any beacon.
// Pull: app start + sign-in; per-key LWW vs the local write time.
// Deletions travel as { __tombstone: true } rows (kv.value is NOT NULL).
import * as storage from "../storage.js";
import { ensureFreshSession } from "./auth.js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const REST = `${SUPABASE_URL}/rest/v1/kv`;
const DIRTY = "syncDirty"; // { [key]: localWriteMs }
const META = "syncMeta"; // { deviceId, lastPullAt }

// Device-local keys that must never leave this device.
const EXCLUDED = new Set([
  "session", "timer", "journeySeen", "wishesSeen", "onboarded",
  "meta", DIRTY, META,
]);
const excluded = (key) => EXCLUDED.has(key) || key.startsWith("migrated:");

export function syncMeta() {
  let m = storage.get(META);
  if (!m) {
    m = { deviceId: Math.random().toString(36).slice(2, 10), lastPullAt: 0 };
    storage.set(META, m);
  }
  return m;
}

// ---- dirty tracking ----

export function markDirty(key, at = Date.now()) {
  if (excluded(key)) return;
  const dirty = storage.get(DIRTY, {});
  dirty[key] = at;
  storage.set(DIRTY, dirty);
  scheduleFlush();
}

export function dirtyKeys() {
  return storage.get(DIRTY, {});
}

function clearDirty(flushed) {
  const dirty = storage.get(DIRTY, {});
  for (const [key, at] of Object.entries(flushed)) {
    if (dirty[key] === at) delete dirty[key]; // unchanged mid-flight only
  }
  storage.set(DIRTY, dirty);
}

// ---- transport ----

async function rest(method, path, body, accessToken, opts = {}) {
  const res = await fetch(`${REST}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      ...(opts.headers || {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    keepalive: opts.keepalive || false,
  });
  if (!res.ok) throw new Error(`sync ${method} failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

/** Exponential backoff with jitter: 1s → 30s. Pure, for tests. */
export function nextDelay(attempt) {
  const base = Math.min(30_000, 1000 * 2 ** attempt);
  return Math.round(base / 2 + Math.random() * (base / 2));
}

// ---- flush (push local → cloud) ----

let timer = null;
let attempts = 0;
const MAX_ATTEMPTS = 6;

function scheduleFlush(delay = 2000) {
  if (typeof window === "undefined") return;
  clearTimeout(timer);
  timer = setTimeout(() => flush(), delay);
}

/** One flusher across tabs (Web Locks where available). */
async function withLock(fn) {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request("nadya-sync", fn);
  }
  return fn();
}

export async function flush({ keepalive = false } = {}) {
  return withLock(async () => {
    const session = await ensureFreshSession();
    if (!session) return false; // guest or signed out — sync just waits
    const dirty = dirtyKeys();
    const keys = Object.keys(dirty);
    if (!keys.length) return true;

    const rows = keys.map((key) => {
      const value = storage.get(key);
      return {
        key,
        value: value === null ? { __tombstone: true } : value,
        updated_at: new Date(dirty[key]).toISOString(),
      };
    });
    try {
      await rest("POST", "?on_conflict=user_id,key", rows, session.accessToken, {
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        keepalive,
      });
      clearDirty(dirty);
      attempts = 0;
      return true;
    } catch {
      if (attempts < MAX_ATTEMPTS) {
        scheduleFlush(nextDelay(attempts));
        attempts += 1;
      }
      return false; // dirty map persists — next boot retries
    }
  });
}

// ---- pull (cloud → local, per-key LWW) ----

/**
 * Returns the keys whose LOCAL value changed (caller decides whether to
 * reload UI state). Local dirty keys that are newer than the server row are
 * left alone — the next flush wins them.
 */
export async function pull() {
  const session = await ensureFreshSession();
  if (!session) return [];
  const rows = await rest(
    "GET",
    "?select=key,value,updated_at",
    undefined,
    session.accessToken,
  );
  const dirty = dirtyKeys();
  const changed = [];
  for (const row of rows) {
    if (excluded(row.key)) continue;
    const serverAt = Date.parse(row.updated_at);
    if (dirty[row.key] && dirty[row.key] >= serverAt) continue; // local newer
    const isTombstone = row.value && row.value.__tombstone === true;
    const local = storage.get(row.key);
    if (isTombstone) {
      if (local !== null) {
        storage.remove(row.key);
        changed.push(row.key);
      }
    } else if (JSON.stringify(local) !== JSON.stringify(row.value)) {
      storage.set(row.key, row.value);
      changed.push(row.key);
    }
    // applying a server value resolves any older local dirt on that key
    if (dirty[row.key]) clearDirty({ [row.key]: dirty[row.key] });
  }
  storage.set(META, { ...syncMeta(), lastPullAt: Date.now() });
  return changed;
}

// ---- first sign-in: lossless merge ----

/**
 * Sign-in with existing local data: snapshot every local key the server is
 * about to overwrite under `migrated:<key>` (kept on-device, excluded from
 * sync and backups), then pull (LWW), then mark all syncable keys dirty so
 * everything local also reaches the account. Lossless by construction.
 */
export async function firstSync() {
  const session = await ensureFreshSession();
  if (!session) return { changed: [] };
  const rows = await rest("GET", "?select=key,updated_at", undefined, session.accessToken);
  const serverKeys = new Set(rows.map((r) => r.key));
  for (const key of storage.listKeys()) {
    if (excluded(key)) continue;
    if (serverKeys.has(key)) {
      storage.set(`migrated:${key}`, storage.get(key)); // safety copy
    }
  }
  const changed = await pull();
  const now = Date.now();
  for (const key of storage.listKeys()) {
    if (!excluded(key)) markDirty(key, now);
  }
  await flush();
  return { changed };
}

// ---- lifecycle ----

let hooked = false;

/** Call once post-paint (main.jsx). Cheap when signed out. */
export function startSync() {
  if (hooked || typeof window === "undefined") return;
  hooked = true;
  syncMeta();
  storage._setWriteHook((key, removed) => markDirty(key, removed ? Date.now() : Date.now()));

  // Boot: push anything left over, then pull what other devices wrote.
  // One reload max per session when remote data landed.
  flush().then(() =>
    pull().then((changed) => {
      if (changed.length && !sessionStorage.getItem("nadya-sync-reloaded")) {
        sessionStorage.setItem("nadya-sync-reloaded", "1");
        window.location.reload();
      }
    }).catch(() => {}),
  ).catch(() => {});

  window.addEventListener("online", () => flush().catch(() => {}));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush({ keepalive: true }).catch(() => {});
  });
}
