// savings = { defaultGoal, months: { "YYYY-MM": { goal, entries: [{ id, date, amount, note }] } } }
import * as storage from "../lib/storage.js";

export function getSavings() {
  return storage.get("savings", { defaultGoal: 0, months: {} });
}

export function setSavings(savings) {
  storage.set("savings", savings);
}
