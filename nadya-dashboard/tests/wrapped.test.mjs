// Node logic tests for computeWrapped's storage-fed parts (lib/wrapped.js):
// week slicing of the granted-wishes log. Run: `npm run test:data`.
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

const { computeWrapped, lastCompleteWeek } = await import("../src/lib/wrapped.js");

// Today = Wed 2026-06-10 → last complete week starts Mon 2026-06-01.
const TODAY = "2026-06-10";
assert.deepEqual(lastCompleteWeek(TODAY, 1), { start: "2026-06-01", end: "2026-06-07" });

mem.set(
  "nadya:wishes",
  JSON.stringify({
    "2026-06-01:showup": { at: 1, xp: 25 }, // last week → counts
    "2026-06-01:journal": { at: 2, xp: 25 }, // last week → counts
    "2026-06-08:showup": { at: 3, xp: 25 }, // current week → not yet
    "2026-05-25:habit:h1": { at: 4, xp: 25 }, // older week → no
  }),
);

const empty = {
  categories: [], habits: [], habitLog: {}, journal: {},
  savings: { defaultGoal: 0, months: {} }, weekStart: 1, today: TODAY,
};
const w = computeWrapped(empty);
assert.equal(w.wishesGranted, 2);
assert.equal(w.xp, 50); // only the two last-week wishes contribute
console.log("OK wrapped slices wishes by week");

mem.delete("nadya:wishes");
const none = computeWrapped(empty);
assert.equal(none.wishesGranted, 0);
assert.equal(none.xp, 0);
console.log("OK wrapped without wishes unchanged");

console.log("\nAll wrapped tests passed ✓");
