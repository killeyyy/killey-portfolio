// Node tests for the gentle evening nudge (lib/nudge.js).
// Run from nadya-dashboard/: `npm run test:data`.
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

const { shouldNudge, takeNudge } = await import("../src/lib/nudge.js");

const base = { nudgeHour: 20, journal: {}, today: "2026-06-12", hour: 21, lastSeen: null };

assert.equal(shouldNudge(base), true, "evening + blank page + opted in");
assert.equal(shouldNudge({ ...base, nudgeHour: 0 }), false, "off by default");
assert.equal(shouldNudge({ ...base, hour: 14 }), false, "not before the chosen hour");
assert.equal(shouldNudge({ ...base, lastSeen: "2026-06-12" }), false, "once per evening");
assert.equal(shouldNudge({ ...base, lastSeen: "2026-06-11" }), true, "yesterday's seen doesn't block");
assert.equal(
  shouldNudge({ ...base, journal: { "2026-06-12": { highlight: "done", grateful: [] } } }),
  false,
  "a written page silences the nudge",
);
assert.equal(
  shouldNudge({ ...base, journal: { "2026-06-12": { mood: 4, grateful: [] } } }),
  false,
  "a mood alone counts as showing up",
);
console.log("OK shouldNudge cases");

// takeNudge marks seen exactly once.
const now = new Date(2026, 5, 12, 21, 30);
assert.equal(takeNudge({ nudgeHour: 20 }, {}, now), true);
assert.equal(mem.get("nadya:nudgeSeen"), '"2026-06-12"');
assert.equal(takeNudge({ nudgeHour: 20 }, {}, now), false, "second open stays quiet");
console.log("OK takeNudge marks seen");

console.log("\nAll nudge tests passed ✓");
