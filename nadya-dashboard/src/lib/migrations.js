import * as storage from "./storage.js";
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from "../data/defaults.js";

export const CURRENT_SCHEMA = 1;

// Sequential upgrades: MIGRATIONS[v] brings data from v-1 to v.
// v1 = first run: seed defaults (no-ops if data already exists).
const MIGRATIONS = {
  1: () => {
    if (!storage.get("settings")) storage.set("settings", DEFAULT_SETTINGS);
    if (!storage.get("categories")) storage.set("categories", DEFAULT_CATEGORIES);
  },
};

/** Run before first render (see main.jsx). */
export function migrate() {
  const meta = storage.get("meta") || { schemaVersion: 0, createdAt: Date.now(), lastBackupAt: null };
  let v = meta.schemaVersion || 0;
  while (v < CURRENT_SCHEMA) {
    v += 1;
    MIGRATIONS[v]?.();
  }
  if (v !== meta.schemaVersion) storage.set("meta", { ...meta, schemaVersion: v });
}
