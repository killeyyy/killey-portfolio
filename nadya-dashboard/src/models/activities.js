// Activity entries, month-sharded under "act:YYYY-MM" — the only unbounded
// data, so each shard stays a small write and views load only what they need.
// Shard shape: { "YYYY-MM-DD": [{ id, categoryId, minutes, note, at }] }
import * as storage from "../lib/storage.js";
import { monthKeyOf } from "../lib/dates.js";

const shardKey = (mKey) => `act:${mKey}`;

export function getMonth(mKey) {
  return storage.get(shardKey(mKey), {});
}

export function setMonth(mKey, shard) {
  storage.set(shardKey(mKey), shard);
}

/** Returns the updated shard for the entry's month. */
export function addEntry(dateKey, entry) {
  const mKey = monthKeyOf(dateKey);
  const shard = getMonth(mKey);
  const next = { ...shard, [dateKey]: [...(shard[dateKey] || []), entry] };
  setMonth(mKey, next);
  return next;
}

export function removeEntry(dateKey, id) {
  const mKey = monthKeyOf(dateKey);
  const shard = getMonth(mKey);
  const list = (shard[dateKey] || []).filter((e) => e.id !== id);
  const next = { ...shard };
  if (list.length) next[dateKey] = list;
  else delete next[dateKey];
  setMonth(mKey, next);
  return next;
}

/** Month keys ("YYYY-MM") of every stored shard. */
export function listShardMonths() {
  return storage.listKeys("act:").map((k) => k.slice(4));
}
