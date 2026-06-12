// Granted garden wishes — an append-only log so XP and achievements from
// past weeks can never be lost: { [questId]: { at, xp } }.
import * as storage from "../lib/storage.js";

export function getWishes() {
  return storage.get("wishes", {});
}

export function setWishes(wishes) {
  storage.set("wishes", wishes);
}
