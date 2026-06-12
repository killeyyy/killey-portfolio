// savings = { defaultGoal, months: { "YYYY-MM": { goal, entries: [...] } } }
// entry   = { id, date, amount, note, kind: "save" | "income" | "expense" }
// (entries written before Money 2.0 have no kind — they count as "save")
import * as storage from "../lib/storage.js";

export function getSavings() {
  return storage.get("savings", { defaultGoal: 0, months: {} });
}

export function setSavings(savings) {
  storage.set("savings", savings);
}
