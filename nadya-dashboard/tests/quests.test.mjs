// Node logic tests for garden wishes (lib/quests.js + models/wishes.js).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

// localStorage shim — quests read activity shards through the storage seam.
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

const { weeklyQuests, WISH_XP } = await import("../src/lib/quests.js");
const wishesModel = await import("../src/models/wishes.js");

// Fixture week: today Wed 2026-06-10, week starts Mon 2026-06-08.
const TODAY = "2026-06-10";
// Past four weeks of steady study activity (Mon/Wed/Fri = 12 active days)
// so the show-up target and the category wish have a rhythm to read.
const may = {};
const jun = {};
for (const k of [
  "2026-05-11", "2026-05-13", "2026-05-15",
  "2026-05-18", "2026-05-20", "2026-05-22",
  "2026-05-25", "2026-05-27", "2026-05-29",
  "2026-06-01", "2026-06-03", "2026-06-05",
]) {
  (k.startsWith("2026-05") ? may : jun)[k] = [
    { id: k, categoryId: "study", minutes: 60, at: 0 },
  ];
}
jun["2026-06-08"] = [{ id: "a", categoryId: "study", minutes: 90, at: 0 }];
mem.set("nadya:act:2026-05", JSON.stringify(may));
mem.set("nadya:act:2026-06", JSON.stringify(jun));

const base = {
  habits: [
    { id: "h1", name: "Skincare", emoji: "🧴" },
    { id: "h2", name: "Walk", emoji: "🚶‍♀️" },
  ],
  habitLog: { "2026-06-08": ["h1"], "2026-06-09": ["h1"] },
  journal: { "2026-06-09": { highlight: "good day", grateful: [] } },
  trackers: [{ id: "t1", name: "Water", emoji: "💧", kind: "count", target: 8 }],
  trackerLog: { "2026-06-08": { t1: 8 }, "2026-06-09": { t1: 3 } },
  categories: [
    { id: "study", label: "Study", productive: true, archived: false },
    { id: "rest", label: "Rest", productive: false, archived: false },
  ],
  weekStart: 1,
  today: TODAY,
};

// ---- shape + determinism ----
const q1 = weeklyQuests(base);
const q2 = weeklyQuests(base);
assert.equal(q1.length, 3);
assert.deepEqual(q1.map((q) => q.id), q2.map((q) => q.id));
for (const q of q1) {
  assert.ok(q.id.startsWith("2026-06-08:"));
  assert.equal(q.xp, WISH_XP);
  assert.equal(typeof q.title, "string");
  assert.ok(q.target > 0);
}
console.log("OK shape + determinism");

// ---- show-up wish: always present, target from her own rhythm (3..6) ----
const showup = q1.find((q) => q.id === "2026-06-08:showup");
assert.ok(showup);
assert.ok(showup.target >= 3 && showup.target <= 6);
assert.equal(showup.target, 3); // 12 past active days / 4 weeks = 3
// active so far: 8th (log+tick), 9th (tick+journal), 10th (nothing) → 2
assert.equal(showup.progress, 2);
assert.equal(showup.done, false);
console.log("OK show-up wish");

// ---- different week → different wish ids (the week turns, nothing carries) ----
const nextWeek = weeklyQuests({ ...base, today: "2026-06-17" });
assert.ok(nextWeek.every((q) => q.id.startsWith("2026-06-15:")));
console.log("OK weekly rotation");

// ---- progress math for rotating wishes (whichever were picked) ----
for (const q of q1) {
  if (q.id === "2026-06-08:habit:h1") assert.equal(q.progress, 2);
  if (q.id === "2026-06-08:habit:h2") assert.equal(q.progress, 0);
  if (q.id === "2026-06-08:tracker:t1") assert.equal(q.progress, 1); // only the 8th hit 8
  if (q.id === "2026-06-08:journal") assert.equal(q.progress, 1);
  if (q.id === "2026-06-08:cat:study") {
    assert.equal(q.unit, "minutes");
    assert.equal(q.progress, 90);
    assert.ok(q.target >= 60); // gentle floor
  }
}
console.log("OK rotating wish progress");

// ---- empty profile still gets wishes (show-up + journal at least) ----
const fresh = weeklyQuests({
  habits: [], habitLog: {}, journal: {}, trackers: [], trackerLog: {},
  categories: [], weekStart: 1, today: TODAY,
});
assert.ok(fresh.length >= 2);
assert.ok(fresh.some((q) => q.id.endsWith(":showup")));
assert.equal(fresh.find((q) => q.id.endsWith(":showup")).target, 3); // floor, never punishing
console.log("OK empty profile");

// ---- money wish: only exists once a goal does; one drop grants it ----
const savings = {
  defaultGoal: 0,
  months: {
    "2026-06": {
      goal: 500,
      entries: [
        { id: "1", date: "2026-06-09", amount: 100, kind: "save" }, // this week
        { id: "2", date: "2026-06-09", amount: 900, kind: "income" }, // not a drop
      ],
    },
  },
};
// Shrink the pool so both rotating slots are forced: journal + save.
const moneyBase = {
  habits: [], habitLog: {}, journal: {}, trackers: [], trackerLog: {},
  categories: [], weekStart: 1, today: TODAY,
};
const withMoney = weeklyQuests({ ...moneyBase, savings });
const saveWish = withMoney.find((q) => q.id === "2026-06-08:save");
assert.ok(saveWish, "save wish joins the pool when a goal exists");
assert.equal(saveWish.target, 1);
assert.equal(saveWish.progress, 1); // the save-kind drop counts, income doesn't
assert.equal(saveWish.done, true);
// No goal → the wish never appears (it must not introduce unchosen features).
const noGoal = weeklyQuests({ ...moneyBase, savings: { defaultGoal: 0, months: {} } });
assert.equal(noGoal.some((q) => q.id.endsWith(":save")), false);
// And income alone doesn't grant it.
const incomeOnly = weeklyQuests({
  ...moneyBase,
  savings: {
    defaultGoal: 500,
    months: { "2026-06": { goal: 500, entries: [{ id: "2", date: "2026-06-09", amount: 900, kind: "income" }] } },
  },
});
assert.equal(incomeOnly.find((q) => q.id === "2026-06-08:save").progress, 0);
console.log("OK money wish");

// ---- granted log: append-only round trip ----
wishesModel.setWishes({ "2026-06-08:showup": { at: 1, xp: 25 } });
const w = wishesModel.getWishes();
assert.equal(w["2026-06-08:showup"].xp, 25);
wishesModel.setWishes({ ...w, "2026-06-08:journal": { at: 2, xp: 25 } });
assert.equal(Object.keys(wishesModel.getWishes()).length, 2);
console.log("OK granted log round-trip");

console.log("\nAll wishes tests passed ✓");
