// Habit definitions + one shared tick log:
// habits   = [{ id, name, emoji, color, createdAt, archivedAt }]
// habitLog = { "YYYY-MM-DD": [habitId, ...] }
import * as storage from "../lib/storage.js";

export function getHabits() {
  return storage.get("habits", []);
}

export function setHabits(habits) {
  storage.set("habits", habits);
}

export function getLog() {
  return storage.get("habitLog", {});
}

export function setLog(log) {
  storage.set("habitLog", log);
}
