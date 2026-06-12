// Node logic tests for seed packets (data/packs.js + lib/seeds.js).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

const { SEED_PACKETS, PROMPT_PACKS } = await import("../src/data/packs.js");
const { planPacket, promptForDay } = await import("../src/lib/seeds.js");
const { COLOR_META, DEFAULT_CATEGORIES } = await import("../src/data/defaults.js");

// ---- content sanity: every packet is plantable as written ----
const packetIds = SEED_PACKETS.map((p) => p.id);
assert.equal(new Set(packetIds).size, packetIds.length);
for (const p of SEED_PACKETS) {
  assert.ok(p.name && p.emoji && p.tagline && p.items.length >= 2, p.id);
  for (const item of p.items) {
    assert.ok(["habit", "tracker", "intention"].includes(item.kind), `${p.id}: kind`);
    if (item.kind === "intention") {
      // intentions must point at a default category, or they'd silently skip
      assert.ok(
        DEFAULT_CATEGORIES.some((c) => c.id === item.categoryId),
        `${p.id}: ${item.categoryId}`,
      );
      assert.ok(item.minutes >= 30, `${p.id}: gentle but real`);
    } else {
      assert.ok(item.name && item.emoji, `${p.id}: item name/emoji`);
      assert.ok(COLOR_META[item.color], `${p.id}: color ${item.color}`);
    }
    if (item.kind === "tracker") {
      assert.ok(["count", "minutes", "check"].includes(item.trackerKind), `${p.id}: trackerKind`);
    }
  }
}
for (const p of PROMPT_PACKS) {
  assert.ok(p.prompts.length >= 4, p.id);
  assert.ok(p.prompts.every((q) => q.length <= 80), `${p.id}: prompts fit on a phone line`);
}
console.log("OK packet content sanity");

// ---- planting: dedupe by name, never overwrite intentions ----
const focus = SEED_PACKETS.find((p) => p.id === "deep-focus");
const empty = planPacket(focus, { habits: [], trackers: [], categories: DEFAULT_CATEGORIES });
assert.equal(empty.newHabits.length, 2);
assert.equal(empty.newTrackers.length, 1);
assert.equal(empty.catPatches.length, 1);
assert.equal(empty.skipped, 0);
assert.equal(empty.planted, 4);
const t = empty.newTrackers[0];
assert.equal(t.kind, "minutes");
assert.ok(t.id && t.createdAt && t.archivedAt === null);

const partial = planPacket(focus, {
  habits: [{ id: "x", name: "plan TOMORROW", archivedAt: null }],
  trackers: [{ id: "y", name: "Reading", archivedAt: null }],
  categories: DEFAULT_CATEGORIES.map((c) =>
    c.id === "study" ? { ...c, weeklyTarget: 600 } : c,
  ),
});
assert.equal(partial.newHabits.length, 1); // only Phone-away hour
assert.equal(partial.newTrackers.length, 0);
assert.equal(partial.catPatches.length, 0); // existing 600 intention untouched
assert.equal(partial.skipped, 3);
console.log("OK planting dedupe + intention safety");

// ---- archived things don't block replanting ----
const replant = planPacket(focus, {
  habits: [{ id: "x", name: "Plan tomorrow", archivedAt: 123 }],
  trackers: [],
  categories: DEFAULT_CATEGORIES,
});
assert.equal(replant.newHabits.length, 2);
console.log("OK archived doesn't block");

// ---- prompts: deterministic per day, varies across the set ----
const pack = PROMPT_PACKS[0];
assert.equal(promptForDay(pack, "2026-06-12"), promptForDay(pack, "2026-06-12"));
const week = ["2026-06-08", "2026-06-09", "2026-06-10", "2026-06-11", "2026-06-12", "2026-06-13"];
assert.ok(new Set(week.map((k) => promptForDay(pack, k))).size > 1);
assert.equal(promptForDay(undefined, "2026-06-12"), null);
console.log("OK nightly prompts");

console.log("\nAll seed-packet tests passed ✓");
