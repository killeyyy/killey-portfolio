// "Reviewed" tracking for solved calculus problems — feeds the per-exercise
// and landing-page progress counters. One namespaced map: problemId -> true.
import { get, set } from "./storage.js";

const KEY = "reviewed";

export function getReviewed() {
  return get(KEY, {});
}

export function isReviewed(id) {
  return !!get(KEY, {})[id];
}

export function markReviewed(id, on = true) {
  const r = get(KEY, {});
  if (on) r[id] = true;
  else delete r[id];
  set(KEY, r);
  return r;
}

export function reviewedCount() {
  return Object.keys(get(KEY, {})).length;
}
