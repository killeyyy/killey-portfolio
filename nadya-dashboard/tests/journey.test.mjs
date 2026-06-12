// Node logic tests for computeJourney (lib/journey.js) — the storage-fed
// parts: wish XP, Tend XP, and the tracker achievements added with them.
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

const { computeJourney } = await import("../src/lib/journey.js");

const empty = {
  habits: [], habitLog: {}, journal: {}, savings: { defaultGoal: 0, months: {} },
  categories: [],
};

// ---- baseline: empty everything → level 1, zero XP, no achievements ----
const base = computeJourney(empty);
assert.equal(base.xp, 0);
assert.equal(base.levelIndex, 0);
assert.equal(base.earnedCount, 0);
assert.equal(base.achievements.length, 18); // 12 original + 3 wish + 2 tend + founding
console.log("OK baseline");

// ---- wish XP: append-only log feeds XP + achievements ----
mem.set(
  "nadya:wishes",
  JSON.stringify({ "2026-06-08:showup": { at: 1, xp: 25 }, "2026-06-08:journal": { at: 2, xp: 25 } }),
);
const withWishes = computeJourney(empty);
assert.equal(withWishes.xp, 50);
assert.equal(withWishes.achievements.find((a) => a.id === "wish-1").earned, true);
assert.equal(withWishes.achievements.find((a) => a.id === "wish-10").earned, false);
console.log("OK wish XP + achievements");

// ---- Tend: +5 XP per tended day; intention days drive 'Well watered' ----
const water = { id: "w", kind: "count", target: 8 };
const stretch = { id: "x", kind: "check" };
mem.set("nadya:trackers", JSON.stringify([water, stretch]));
const log = {};
// 7 days meeting water's intention + 1 day of partial care = 8 tended days
for (let d = 1; d <= 7; d++) log[`2026-06-0${d}`] = { w: 8 };
log["2026-06-08"] = { w: 3 };
mem.set("nadya:trackerLog", JSON.stringify(log));

const withTend = computeJourney(empty);
assert.equal(withTend.xp, 50 + 8 * 5);
assert.equal(withTend.achievements.find((a) => a.id === "tend-7").earned, true);
assert.equal(withTend.achievements.find((a) => a.id === "tend-30").earned, false);
console.log("OK tend XP + well-watered");

// ---- check-kind trackers count toward intentions (goal = 1) ----
mem.set("nadya:trackerLog", JSON.stringify({ "2026-06-01": { x: 1 } }));
const checkOnly = computeJourney(empty);
assert.equal(checkOnly.xp, 50 + 5);
// 1 intention day — not enough for the badge, and that's fine (invitation, not failure)
assert.equal(checkOnly.achievements.find((a) => a.id === "tend-7").earned, false);
console.log("OK check-kind intentions");

// ---- XP only ever grows: clearing live trackers keeps the log's history ----
mem.set("nadya:trackers", JSON.stringify([])); // tracker archived/deleted
const orphan = computeJourney(empty);
assert.equal(orphan.xp, 50 + 5, "tended days still count without the tracker");
console.log("OK orphaned log days still count");

console.log("\nAll journey tests passed ✓");
