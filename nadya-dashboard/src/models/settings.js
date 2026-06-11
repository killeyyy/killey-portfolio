import * as storage from "../lib/storage.js";
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from "../data/defaults.js";

export function getSettings() {
  return storage.get("settings", DEFAULT_SETTINGS);
}

export function setSettings(settings) {
  storage.set("settings", settings);
}

export function getCategories() {
  return storage.get("categories", DEFAULT_CATEGORIES);
}

export function setCategories(categories) {
  storage.set("categories", categories);
}

export function getMeta() {
  return storage.get("meta", { schemaVersion: 0, createdAt: Date.now(), lastBackupAt: null });
}

export function patchMeta(patch) {
  const next = { ...getMeta(), ...patch };
  storage.set("meta", next);
  return next;
}
