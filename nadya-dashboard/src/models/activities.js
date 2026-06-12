// Activity entries, month-sharded under "act:YYYY-MM" — the only unbounded
// data, so each shard stays a small write and views load only what they need.
// Shard shape: { "YYYY-MM-DD": [{ id, categoryId, minutes, note, at }] }
import * as storage from "../lib/storage.js";
import { monthKeyOf } from "../lib/dates.js";

const shardKey = (mKey) => `act:${mKey}`;

// Parsed-shard cache: journey/quests/wrapped re-read every shard per compute,
// so repeated JSON.parse dominates as history grows. ANY storage write to an
// act:* key (here, sync pull, backup import) invalidates via the write hook —
// coherent by construction. Shards are immutable-by-convention: callers
// always build new objects (addEntry/removeEntry), never mutate in place.
const cache = new Map();
storage._setWriteHook((key) => {
  if (key.startsWith("act:")) cache.delete(key.slice(4));
});

export function getMonth(mKey) {
  if (cache.has(mKey)) return cache.get(mKey);
  const shard = storage.get(shardKey(mKey), {});
  cache.set(mKey, shard);
  return shard;
}

export function setMonth(mKey, shard) {
  storage.set(shardKey(mKey), shard); // hook clears the stale entry first
  cache.set(mKey, shard);
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
