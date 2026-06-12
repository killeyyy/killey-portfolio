// JSON export/import — the safety net for localStorage-only persistence.
import * as storage from "./storage.js";
import { CURRENT_SCHEMA } from "./migrations.js";
import { monthKeyOf, todayKey } from "./dates.js";

export function buildExport() {
  // Merge month shards into one flat { dateKey: [entries] } map.
  const activities = {};
  for (const key of storage.listKeys("act:")) {
    Object.assign(activities, storage.get(key, {}));
  }
  return {
    app: "nadya-dashboard",
    schemaVersion: CURRENT_SCHEMA,
    exportedAt: new Date().toISOString(),
    data: {
      settings: storage.get("settings"),
      categories: storage.get("categories", []),
      activities,
      habits: storage.get("habits", []),
      habitLog: storage.get("habitLog", {}),
      trackers: storage.get("trackers", []),
      trackerLog: storage.get("trackerLog", {}),
      wishes: storage.get("wishes", {}),
      savings: storage.get("savings", { defaultGoal: 0, months: {} }),
      journal: storage.get("journal", {}),
    },
  };
}

/** Trigger a file download of the current data (caller stamps meta.lastBackupAt). */
export function downloadExport() {
  const payload = buildExport();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // Filename follows the brand; the "nadya-dashboard" identifier INSIDE the
  // file must never change (old backups carry it).
  a.download = `petalfall-backup-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Parse + validate an exported file. Throws with a readable message. */
export function parseImport(text) {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  if (payload?.app !== "nadya-dashboard" || !payload?.data) {
    // NB: the "nadya-dashboard" app identifier above must never change —
    // every existing backup file carries it.
    throw new Error("That file doesn't look like a Petalfall backup.");
  }
  if ((payload.schemaVersion || 0) > CURRENT_SCHEMA) {
    throw new Error("That backup is from a newer version of the app.");
  }
  return payload;
}

/** Replace-mode import: wipe the namespace, write the payload, re-shard. */
export function applyImport(payload) {
  const { data } = payload;
  storage.clearAll();
  if (data.settings) storage.set("settings", data.settings);
  storage.set("categories", data.categories || []);
  storage.set("habits", data.habits || []);
  storage.set("habitLog", data.habitLog || {});
  storage.set("trackers", data.trackers || []);
  storage.set("trackerLog", data.trackerLog || {});
  storage.set("wishes", data.wishes || {});
  storage.set("savings", data.savings || { defaultGoal: 0, months: {} });
  storage.set("journal", data.journal || {});
  // Re-shard the flat activities map by month.
  const shards = {};
  for (const [dateKey, entries] of Object.entries(data.activities || {})) {
    const mKey = monthKeyOf(dateKey);
    shards[mKey] = shards[mKey] || {};
    shards[mKey][dateKey] = entries;
  }
  for (const [mKey, shard] of Object.entries(shards)) {
    storage.set(`act:${mKey}`, shard);
  }
  storage.set("meta", {
    schemaVersion: CURRENT_SCHEMA,
    createdAt: Date.now(),
    lastBackupAt: Date.now(),
  });
}
