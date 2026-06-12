// Custom trackers ("Tend") — daily quantities that habits and hours can't
// hold: glasses of water, sleep, prayers, steps…
// trackers   = [{ id, name, emoji, color, kind: "count"|"minutes"|"check",
//                 unit, step, target, weekTarget, createdAt, archivedAt }]
// trackerLog = { "YYYY-MM-DD": { [trackerId]: number } }  (check stores 1)
import * as storage from "../lib/storage.js";

export function getTrackers() {
  return storage.get("trackers", []);
}

export function setTrackers(trackers) {
  storage.set("trackers", trackers);
}

export function getLog() {
  return storage.get("trackerLog", {});
}

export function setLog(log) {
  storage.set("trackerLog", log);
}
