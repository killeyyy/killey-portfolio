// Node logic tests for the Tend layer (lib/tend.js + models/trackers.js).
// Run from nadya-dashboard/: `npm run test:data` (no browser needed).
import assert from "node:assert/strict";

// Minimal localStorage shim so the storage-backed model is testable.
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

const {
  dayValue, dayGoal, dayFill, weekKeys, weekSummary, categoryWeekMinutes, recentTags,
  tagMinutes,
} = await import("../src/lib/tend.js");
const trackersModel = await import("../src/models/trackers.js");

const water = { id: "w", kind: "count", target: 8, step: 1 };
const sleep = { id: "s", kind: "minutes", target: 480, weekTarget: 3000 };
const stretch = { id: "x", kind: "check", weekTarget: 5 };
const freeCount = { id: "f", kind: "count", target: 0 };

// ---- day-level ----
assert.equal(dayValue({}, "2026-06-10", "w"), 0);
assert.equal(dayValue({ "2026-06-10": { w: 4 } }, "2026-06-10", "w"), 4);
assert.equal(dayGoal(water), 8);
assert.equal(dayGoal(stretch), 1);
assert.equal(dayFill(water, 4), 0.5);
assert.equal(dayFill(water, 12), 1);
assert.equal(dayFill(freeCount, 0), 0);
assert.equal(dayFill(freeCount, 3), 1);
console.log("OK day value/goal/fill");

// ---- week keys (Monday start; 2026-06-10 is a Wednesday) ----
const wk = weekKeys("2026-06-10", 1);
assert.equal(wk.length, 7);
assert.equal(wk[0], "2026-06-08");
assert.equal(wk[6], "2026-06-14");
assert.equal(weekKeys("2026-06-10", 0)[0], "2026-06-07");
console.log("OK week keys");

// ---- week summaries ----
const log = {
  "2026-06-08": { w: 8, s: 480, x: 1 },
  "2026-06-09": { w: 4, x: 1 },
  "2026-06-10": { w: 8, s: 420 },
};
const wWeek = weekSummary(log, water, "2026-06-10", 1);
assert.equal(wWeek.total, 20);
assert.equal(wWeek.goal, 56); // no weekTarget → target × 7
assert.equal(wWeek.met, false);
assert.equal(wWeek.fills.length, 7);
assert.equal(wWeek.fills[1], 0.5);

const sWeek = weekSummary(log, sleep, "2026-06-10", 1);
assert.equal(sWeek.total, 900);
assert.equal(sWeek.goal, 3000); // explicit weekTarget wins

const xWeek = weekSummary(log, stretch, "2026-06-10", 1);
assert.equal(xWeek.total, 2); // check counts tended days
assert.equal(xWeek.goal, 5);
assert.equal(xWeek.met, false);
assert.equal(weekSummary({ ...log, "2026-06-11": { x: 1 }, "2026-06-12": { x: 1 }, "2026-06-13": { x: 1 } }, stretch, "2026-06-10", 1).met, true);
console.log("OK week summaries");

// ---- weekly category minutes + tags (months-shard shaped input) ----
const months = {
  "2026-06": {
    "2026-06-08": [
      { categoryId: "study", minutes: 60, tags: ["thesis"] },
      { categoryId: "work", minutes: 30, tags: ["thesis", "client"] },
    ],
    "2026-06-10": [{ categoryId: "study", minutes: 45, tags: ["thesis"] }],
    "2026-06-01": [{ categoryId: "study", minutes: 999 }], // outside the week
  },
};
const catMin = categoryWeekMinutes(months, "2026-06-10", 1);
assert.equal(catMin.study, 105);
assert.equal(catMin.work, 30);
assert.equal(catMin.rest, undefined);

const tags = recentTags(months, ["2026-06-08", "2026-06-10"]);
assert.deepEqual(tags, ["thesis", "client"]);

const byTag = tagMinutes(months, ["2026-06-08", "2026-06-10"]);
assert.deepEqual(byTag, [
  { tag: "thesis", minutes: 135 }, // 60 + 30 + 45
  { tag: "client", minutes: 30 },
]);
assert.deepEqual(tagMinutes(months, ["2026-06-01"]), []); // untagged day
console.log("OK category week minutes + recent tags + tag minutes");

// ---- model round-trip through the storage seam ----
trackersModel.setTrackers([water, sleep]);
assert.deepEqual(trackersModel.getTrackers(), [water, sleep]);
trackersModel.setLog(log);
assert.deepEqual(trackersModel.getLog(), log);
assert.deepEqual(JSON.parse(mem.get("nadya:trackers")), [water, sleep]);
console.log("OK trackers model round-trip");

console.log("\nAll Tend tests passed ✓");
