// Node logic tests for richer stats (lib/correlations.js).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

const { moodHabitLinks, timeOfDay, monthRecap, DAY_BUCKETS } = await import(
  "../src/lib/correlations.js"
);

// ---- mood×habit links ----
const walk = { id: "w", name: "Walk", archivedAt: null };
const read = { id: "r", name: "Read", archivedAt: null };
const old = { id: "o", name: "Old", archivedAt: 123 };

// 10 days of moods: walk days average 4.5, non-walk days average 3.0.
const dayKeys = [...Array(10)].map((_, i) => `2026-06-${String(i + 1).padStart(2, "0")}`);
const journal = {};
const habitLog = {};
dayKeys.forEach((k, i) => {
  const walked = i < 5;
  journal[k] = { mood: walked ? (i % 2 ? 4 : 5) : 3, grateful: [] };
  if (walked) habitLog[k] = ["w"];
  if (i === 0) habitLog[k] = ["w", "r"]; // Read has only 1 sample — must be gated out
});

const links = moodHabitLinks({ habits: [walk, read, old], habitLog, journal, dayKeys });
assert.equal(links.length, 1);
assert.equal(links[0].habit.id, "w");
assert.equal(links[0].lift, 1.6); // 4.6 avg with − 3.0 without, 1dp
assert.equal(links[0].days, 5);
console.log("OK mood links: math + sample gate + archived excluded");

// Negative correlations are never reported (no failure-shaming).
const downJournal = {};
dayKeys.forEach((k, i) => {
  downJournal[k] = { mood: i < 5 ? 2 : 5, grateful: [] }; // walk days feel worse
});
assert.equal(
  moodHabitLinks({ habits: [walk], habitLog, journal: downJournal, dayKeys }).length,
  0,
);
console.log("OK mood links: positive-only by construction");

// ---- time of day (entry.at is local; build timestamps from local hours) ----
const at = (h) => new Date(2026, 5, 10, h, 30).getTime();
const months = {
  "2026-06": {
    "2026-06-10": [
      { categoryId: "study", minutes: 60, at: at(8) }, // dawn
      { categoryId: "study", minutes: 30, at: at(13) }, // daylight
      { categoryId: "rest", minutes: 60, at: at(17) }, // golden hour
      { categoryId: "rest", minutes: 30, at: at(22) }, // night
      { categoryId: "rest", minutes: 20, at: at(2) }, // small hours → night
    ],
  },
};
const profile = timeOfDay(months, ["2026-06-10", "2026-06-11"]);
assert.equal(profile.total, 200);
const by = Object.fromEntries(profile.buckets.map((b) => [b.id, b.minutes]));
assert.deepEqual(by, { dawn: 60, daylight: 30, golden: 60, night: 50 });
assert.equal(profile.buckets[0].pct, 30);
assert.ok(["dawn", "golden"].includes(profile.peak.id));
assert.equal(DAY_BUCKETS.length, 4);
assert.equal(timeOfDay(months, ["2026-06-11"]).peak, null); // empty → no peak claim
console.log("OK time of day buckets");

// ---- month recap (future days never count against her) ----
const days = [
  { key: "2026-06-08", total: 90, byCategory: { study: 90 } },
  { key: "2026-06-09", total: 0, byCategory: {} },
  { key: "2026-06-10", total: 150, byCategory: { study: 60, rest: 90 } },
  { key: "2026-06-11", total: 999, byCategory: { rest: 999 } }, // future
];
const recap = monthRecap({
  days,
  categories: [
    { id: "study", label: "Study", color: "lavender" },
    { id: "rest", label: "Rest", color: "mint" },
  ],
  habitLog: { "2026-06-08": ["a", "b"], "2026-06-10": ["a"], "2026-06-11": ["a"] },
  journal: { "2026-06-08": { mood: 4, grateful: [] }, "2026-06-10": { mood: 5, grateful: [] } },
  today: "2026-06-10",
});
assert.equal(recap.activeDays, 2);
assert.equal(recap.daysSoFar, 3);
assert.deepEqual(recap.bestDay, { key: "2026-06-10", total: 150 });
assert.equal(recap.top.category.id, "study"); // 150 study vs 90 rest, future excluded
assert.equal(recap.top.minutes, 150);
assert.equal(recap.ticks, 3); // future tick excluded
assert.equal(recap.journalDays, 2);
assert.equal(recap.moodAvg, 4.5);
console.log("OK month recap");

console.log("\nAll correlation tests passed ✓");
