// Node tests for the activities shard cache (models/activities.js) and the
// multi-hook storage seam it relies on. Run: `npm run test:data`.
import assert from "node:assert/strict";

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

const storage = await import("../src/lib/storage.js");
const acts = await import("../src/models/activities.js");

// ---- cache: repeated reads return the SAME parsed object ----
storage.set("act:2026-06", { "2026-06-10": [{ id: "a", minutes: 30 }] });
const first = acts.getMonth("2026-06");
assert.equal(acts.getMonth("2026-06"), first, "second read is the cached reference");
assert.equal(first["2026-06-10"][0].minutes, 30);
console.log("OK cache hit");

// ---- ANY storage write to the shard invalidates (sync pull / import path) ----
storage.set("act:2026-06", { "2026-06-11": [{ id: "b", minutes: 60 }] });
const second = acts.getMonth("2026-06");
assert.notEqual(second, first);
assert.deepEqual(Object.keys(second), ["2026-06-11"]);
storage.remove("act:2026-06");
assert.deepEqual(acts.getMonth("2026-06"), {}, "remove invalidates too");
console.log("OK external invalidation");

// ---- model writes keep cache coherent ----
const shard = acts.addEntry("2026-06-12", { id: "c", categoryId: "study", minutes: 45 });
assert.equal(acts.getMonth("2026-06"), shard, "getMonth returns the just-written shard");
assert.deepEqual(JSON.parse(mem.get("nadya:act:2026-06")), shard, "localStorage matches");
const afterRemove = acts.removeEntry("2026-06-12", "c");
assert.equal(acts.getMonth("2026-06"), afterRemove);
assert.deepEqual(afterRemove, {});
console.log("OK write-through coherence");

// ---- multi-hook: a second observer fires alongside the cache hook ----
const seen = [];
storage._setWriteHook((key, removed) => seen.push(`${removed ? "-" : "+"}${key}`));
storage.set("habits", []);
storage.remove("habits");
assert.deepEqual(seen, ["+habits", "-habits"]);
console.log("OK multi-hook seam");

console.log("\nAll activities-cache tests passed ✓");
