// Node logic tests for the sync engine (lib/cloud/sync.js).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

// localStorage shim.
const mem = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
    key: (i) => [...mem.keys()][i] ?? null,
    get length() {
      return mem.size;
    },
  },
};

// fetch stub with scripted responses + call log.
const calls = [];
let script = [];
globalThis.fetch = async (url, opts) => {
  calls.push({ url, opts });
  const next = script.shift();
  if (next instanceof Error) throw next;
  return {
    ok: next.status < 400,
    status: next.status,
    json: async () => next.body ?? null,
  };
};

const storage = await import("../src/lib/storage.js");
const sync = await import("../src/lib/cloud/sync.js");

// A live session so flush/pull have auth (far from expiry → no refresh call).
mem.set(
  "nadya:session",
  JSON.stringify({
    accessToken: "at", refreshToken: "rt",
    expiresAt: Date.now() + 3_600_000, email: "e", userId: "u",
  }),
);

// ---- dirty tracking: persisted, excluded keys never marked ----
sync.markDirty("habits", 1000);
sync.markDirty("session"); // excluded
sync.markDirty("timer"); // excluded
sync.markDirty("migrated:journal"); // excluded prefix
assert.deepEqual(Object.keys(sync.dirtyKeys()), ["habits"]);
assert.ok(mem.has("nadya:syncDirty"), "dirty map survives restarts");
console.log("OK dirty tracking + exclusions");

// ---- flush: batch upsert, tombstones for removed keys, clears on success ----
storage.set("habits", [{ id: "h1" }]); // hook not registered in node — fine
sync.markDirty("journal", 2000); // key with no local value → tombstone
script = [{ status: 201, body: null }];
assert.equal(await sync.flush(), true);
const up = calls.at(-1);
assert.ok(up.url.includes("/rest/v1/kv?on_conflict=user_id,key"));
assert.equal(up.opts.headers.Prefer, "resolution=merge-duplicates,return=minimal");
const rows = JSON.parse(up.opts.body);
assert.deepEqual(
  rows.find((r) => r.key === "habits").value,
  [{ id: "h1" }],
);
assert.deepEqual(rows.find((r) => r.key === "journal").value, { __tombstone: true });
assert.equal(rows.find((r) => r.key === "habits").updated_at, new Date(1000).toISOString());
assert.deepEqual(sync.dirtyKeys(), {});
console.log("OK flush batch + tombstone + clear");

// ---- flush failure keeps the dirty map (durability) ----
sync.markDirty("habits", 3000);
script = [{ status: 500, body: null }];
assert.equal(await sync.flush(), false);
assert.ok(sync.dirtyKeys().habits, "dirty survives a failed flush");
console.log("OK flush failure keeps dirty");

// ---- pull: per-key LWW ----
storage.set("settings", { name: "old" });
script = [
  {
    status: 200,
    body: [
      // server newer → applies
      { key: "settings", value: { name: "remote" }, updated_at: new Date(9_999_999_999_999).toISOString() },
      // local dirty newer → left alone
      { key: "habits", value: [{ id: "server" }], updated_at: new Date(1).toISOString() },
      // tombstone → removes local
      { key: "trackers", value: { __tombstone: true }, updated_at: new Date(9_999_999_999_999).toISOString() },
      // excluded keys from a hostile server are ignored
      { key: "session", value: { accessToken: "evil" }, updated_at: new Date(9_999_999_999_999).toISOString() },
    ],
  },
];
storage.set("trackers", [{ id: "t1" }]);
const changed = await sync.pull();
assert.deepEqual(changed.sort(), ["settings", "trackers"]);
assert.deepEqual(storage.get("settings"), { name: "remote" });
assert.deepEqual(storage.get("habits"), [{ id: "h1" }], "local-newer key untouched");
assert.equal(storage.get("trackers"), null, "tombstone removed local");
assert.equal(JSON.parse(mem.get("nadya:session")).accessToken, "at", "excluded key protected");
console.log("OK pull LWW + tombstone + hostile-key protection");

// ---- backoff curve ----
for (let a = 0; a < 8; a++) {
  const d = sync.nextDelay(a);
  assert.ok(d >= 500 && d <= 30_000, `delay ${d} within 0.5s..30s`);
}
console.log("OK backoff bounds");

// ---- firstSync: lossless — overwritten keys snapshot under migrated:* ----
mem.delete("nadya:syncDirty");
storage.set("journal", { "2026-06-01": { highlight: "local words" } });
script = [
  // key listing: server also has journal
  { status: 200, body: [{ key: "journal", updated_at: new Date(9_999_999_999_999).toISOString() }] },
  // pull: server journal wins
  {
    status: 200,
    body: [{ key: "journal", value: { "2026-06-02": { highlight: "remote" } }, updated_at: new Date(9_999_999_999_999).toISOString() }],
  },
  // flush of all local keys
  { status: 201, body: null },
];
await sync.firstSync();
assert.deepEqual(
  storage.get("migrated:journal"),
  { "2026-06-01": { highlight: "local words" } },
  "pre-merge local copy kept",
);
assert.deepEqual(storage.get("journal"), { "2026-06-02": { highlight: "remote" } });
console.log("OK firstSync lossless snapshot");

console.log("\nAll sync tests passed ✓");
