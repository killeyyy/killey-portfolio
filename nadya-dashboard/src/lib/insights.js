// Pure aggregation selectors — all chart math lives here so components stay
// dumb. Inputs are passed explicitly (months map, categories, habitLog, ...).
import { addDays, monthKeyOf, toDateKey, todayKey } from "./dates.js";

/** Entries for one day from the loaded shards. */
export function entriesForDay(months, dayKey) {
  return months[monthKeyOf(dayKey)]?.[dayKey] || [];
}

/**
 * Per-day totals over a list of day keys.
 * → [{ key, total, productive, byCategory: { catId: minutes } }]
 */
export function dailyTotals(months, dayKeys, categories) {
  const productiveIds = new Set(categories.filter((c) => c.productive).map((c) => c.id));
  return dayKeys.map((key) => {
    const byCategory = {};
    let total = 0;
    let productive = 0;
    for (const e of entriesForDay(months, key)) {
      byCategory[e.categoryId] = (byCategory[e.categoryId] || 0) + e.minutes;
      total += e.minutes;
      if (productiveIds.has(e.categoryId)) productive += e.minutes;
    }
    return { key, total, productive, byCategory };
  });
}

/** Sum of dailyTotals → { total, productive, byCategory }. */
export function periodTotals(days) {
  const byCategory = {};
  let total = 0;
  let productive = 0;
  for (const d of days) {
    total += d.total;
    productive += d.productive;
    for (const [cat, min] of Object.entries(d.byCategory)) {
      byCategory[cat] = (byCategory[cat] || 0) + min;
    }
  }
  return { total, productive, byCategory };
}

/**
 * Category share for a period, sorted by minutes desc.
 * → [{ category, minutes, pct }] (only categories with minutes > 0)
 */
export function categoryShare(byCategory, categories, total) {
  return categories
    .map((category) => ({ category, minutes: byCategory[category.id] || 0 }))
    .filter((s) => s.minutes > 0)
    .map((s) => ({ ...s, pct: total ? Math.round((s.minutes / total) * 100) : 0 }))
    .sort((a, b) => b.minutes - a.minutes);
}

/** Productive share 0–100 (null when nothing logged). */
export function productiveShare({ total, productive }) {
  return total ? Math.round((productive / total) * 100) : null;
}

/**
 * Habit streaks from the shared tick log.
 * Current = consecutive ticked days ending today (or yesterday, so an
 * unticked "today" doesn't kill the streak before the day is over).
 */
export function habitStreaks(habitLog, habitId, today = todayKey()) {
  const ticked = new Set(
    Object.keys(habitLog).filter((k) => habitLog[k]?.includes(habitId)),
  );
  let current = 0;
  let cursor = ticked.has(today) ? today : addDays(today, -1);
  while (ticked.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  let best = 0;
  let run = 0;
  let prev = null;
  for (const k of [...ticked].sort()) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    if (run > best) best = run;
    prev = k;
  }
  return { current, best };
}

/**
 * Adherence % over dayKeys, only counting days the habit existed.
 * → { ticked, eligible, pct } (pct null when no eligible days)
 */
export function habitAdherence(habitLog, habit, dayKeys, today = todayKey()) {
  const createdKey = toDateKey(new Date(habit.createdAt || 0));
  const eligibleKeys = dayKeys.filter((k) => k >= createdKey && k <= today);
  const ticked = eligibleKeys.filter((k) => habitLog[k]?.includes(habit.id)).length;
  const eligible = eligibleKeys.length;
  return { ticked, eligible, pct: eligible ? Math.round((ticked / eligible) * 100) : null };
}

/** 0/1 values (oldest → newest) for a heatmap over dayKeys. */
export function habitHeatValues(habitLog, habitId, dayKeys) {
  return dayKeys.map((k) => (habitLog[k]?.includes(habitId) ? 1 : 0));
}

/** Savings state for one month. → { goal, saved, entries } */
export function savingsForMonth(savings, mKey) {
  const month = savings.months[mKey];
  const goal = month?.goal ?? savings.defaultGoal ?? 0;
  const entries = month?.entries || [];
  const saved = entries.reduce((sum, e) => sum + (e.amount || 0), 0);
  return { goal, saved, entries };
}
