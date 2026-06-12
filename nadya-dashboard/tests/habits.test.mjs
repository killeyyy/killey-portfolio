// Node tests for weekly-rhythm habits (habitAdherence + the habit wish).
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

const { habitAdherence } = await import("../src/lib/insights.js");
const { weeklyQuests } = await import("../src/lib/quests.js");

const TODAY = "2026-06-14";
const days14 = [...Array(14)].map((_, i) => `2026-06-${String(i + 1).padStart(2, "0")}`);
const old = new Date(2026, 0, 1).getTime();

// ---- daily habits: math byte-identical to the old behavior ----
const daily = { id: "d", createdAt: old };
const logD = { "2026-06-02": ["d"], "2026-06-03": ["d"], "2026-06-05": ["d"] };
const aD = habitAdherence(logD, daily, days14, TODAY);
assert.deepEqual(aD, { ticked: 3, eligible: 14, pct: 21 });
console.log("OK daily unchanged");

// ---- 3×/week over two weeks expects 6, not 14 ----
const tri = { id: "t", createdAt: old, timesPerWeek: 3 };
const logT = {};
for (const k of ["2026-06-02", "2026-06-04", "2026-06-06", "2026-06-09", "2026-06-11", "2026-06-13"]) {
  logT[k] = ["t"];
}
const aT = habitAdherence(logT, tri, days14, TODAY);
assert.deepEqual(aT, { ticked: 6, eligible: 6, pct: 100 });
// Doing extra never penalizes — caps at 100.
for (const k of days14) logT[k] = ["t"];
assert.equal(habitAdherence(logT, tri, days14, TODAY).pct, 100);
console.log("OK weekly rhythm + cap");

// ---- creation date still bounds eligibility; empty window stays null ----
const young = { id: "y", createdAt: new Date(2026, 5, 8).getTime(), timesPerWeek: 1 };
const aY = habitAdherence({}, young, days14, TODAY);
assert.equal(aY.eligible, 1); // 7 eligible days × 1/7
assert.equal(aY.pct, 0);
assert.equal(habitAdherence({}, young, ["2026-05-01"], TODAY).pct, null);
console.log("OK eligibility bounds");

// ---- the habit wish asks within the habit's own rhythm ----
const once = { id: "o", name: "Call home", emoji: "📞", timesPerWeek: 1 };
const quests = weeklyQuests({
  habits: [once], habitLog: {}, journal: {}, trackers: [], trackerLog: {},
  categories: [], weekStart: 1, today: "2026-06-10",
});
const wish = quests.find((q) => q.id === "2026-06-08:habit:o");
if (wish) {
  assert.equal(wish.target, 1, "a once-a-week habit is asked for once");
  assert.ok(wish.title.includes("1 day"));
}
// Daily habits keep the 4-day ask.
const questsDaily = weeklyQuests({
  habits: [{ id: "d2", name: "Read", emoji: "📖" }], habitLog: {}, journal: {},
  trackers: [], trackerLog: {}, categories: [], weekStart: 1, today: "2026-06-10",
});
const wishD = questsDaily.find((q) => q.id === "2026-06-08:habit:d2");
if (wishD) assert.equal(wishD.target, 4);
console.log("OK habit wish respects rhythm");

console.log("\nAll habit-rhythm tests passed ✓");
