// Derivations for Tend (custom trackers), weekly category intentions and
// activity tags. Pure functions over plain data — node-testable, journey.js
// style: everything computed, nothing stored.
import { addDays, rangeKeys, weekStartKey } from "./dates.js";
import { entriesForDay } from "./insights.js";

export function dayValue(log, dateKey, trackerId) {
  return log[dateKey]?.[trackerId] || 0;
}

export function dayGoal(tracker) {
  return tracker.kind === "check" ? 1 : tracker.target || 0;
}

/** 0..1 — how full today's leaf is. With no goal, anything > 0 is full. */
export function dayFill(tracker, value) {
  const goal = dayGoal(tracker);
  if (!goal) return value > 0 ? 1 : 0;
  return Math.min(1, value / goal);
}

/** The 7 day keys of the week containing `dateKey`. */
export function weekKeys(dateKey, weekStart = 1) {
  const start = weekStartKey(dateKey, weekStart);
  return rangeKeys(start, addDays(start, 6));
}

/**
 * One tracker's week. The goal falls back gently: explicit weekTarget,
 * else daily target × 7 (check trackers count tended days, default 7).
 */
export function weekSummary(log, tracker, dateKey, weekStart = 1) {
  const keys = weekKeys(dateKey, weekStart);
  const values = keys.map((k) => dayValue(log, k, tracker.id));
  const isCheck = tracker.kind === "check";
  const total = isCheck
    ? values.filter((v) => v > 0).length
    : values.reduce((s, v) => s + v, 0);
  const goal = tracker.weekTarget || (isCheck ? 7 : (tracker.target || 0) * 7);
  return {
    keys,
    values,
    total,
    goal,
    fills: values.map((v) => dayFill(tracker, v)),
    met: goal > 0 && total >= goal,
  };
}

/** Minutes per category across the week containing `dateKey`. */
export function categoryWeekMinutes(months, dateKey, weekStart = 1) {
  const out = {};
  for (const k of weekKeys(dateKey, weekStart)) {
    for (const e of entriesForDay(months, k)) {
      out[e.categoryId] = (out[e.categoryId] || 0) + e.minutes;
    }
  }
  return out;
}

/** Minutes per tag across the given day keys, largest first. */
export function tagMinutes(months, dayKeys, limit = 6) {
  const sums = {};
  for (const k of dayKeys) {
    for (const e of entriesForDay(months, k)) {
      for (const tag of e.tags || []) sums[tag] = (sums[tag] || 0) + e.minutes;
    }
  }
  return Object.entries(sums)
    .map(([tag, minutes]) => ({ tag, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit);
}

/** Most-used activity tags across the given day keys, frequency-sorted. */
export function recentTags(months, dayKeys, limit = 6) {
  const freq = {};
  for (const k of dayKeys) {
    for (const e of entriesForDay(months, k)) {
      for (const tag of e.tags || []) freq[tag] = (freq[tag] || 0) + 1;
    }
  }
  return Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, limit);
}
