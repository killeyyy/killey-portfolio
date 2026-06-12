// Node logic tests for Money (savings + income + expenses).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

const { savingsForMonth } = await import("../src/lib/insights.js");

const savings = {
  defaultGoal: 1000,
  months: {
    "2026-06": {
      goal: 500,
      entries: [
        { id: "1", date: "2026-06-02", amount: 200 }, // legacy: no kind = saved
        { id: "2", date: "2026-06-05", amount: 150, kind: "save" },
        { id: "3", date: "2026-06-06", amount: 900, kind: "income" },
        { id: "4", date: "2026-06-08", amount: 300, kind: "expense" },
        { id: "5", date: "2026-06-09", amount: 100, kind: "expense" },
      ],
    },
  },
};

const m = savingsForMonth(savings, "2026-06");
assert.equal(m.goal, 500);
assert.equal(m.saved, 350); // legacy 200 + explicit save 150 — never income/expense
assert.equal(m.income, 900);
assert.equal(m.spent, 400);
assert.equal(m.entries.length, 5);
console.log("OK kinds split + legacy entries count as saved");

// Empty month falls back to the default goal with clean zeros.
const empty = savingsForMonth(savings, "2026-07");
assert.deepEqual(
  { goal: empty.goal, saved: empty.saved, income: empty.income, spent: empty.spent },
  { goal: 1000, saved: 0, income: 0, spent: 0 },
);
console.log("OK empty month defaults");

// The goal-ring math (saved/goal) must be immune to big incomes/expenses.
assert.ok(m.saved < m.goal, "ring under 100% despite income 900");
console.log("OK goal ring immune to cash flow");

console.log("\nAll money tests passed ✓");
