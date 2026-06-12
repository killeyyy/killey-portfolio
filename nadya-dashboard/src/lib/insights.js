// Pure aggregation selectors — all chart math lives here so components stay
// dumb. Inputs are passed explicitly (months map, categories, habitLog, ...).
import { addDays, monthKeyOf, parseKey, rangeKeys, toDateKey, todayKey, weekStartKey } from "./dates.js";
import { formatMinutes } from "./format.js";

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
/**
 * Habits still inviting a tick today: daily habits always; weekly-rhythm
 * habits only until they've met their timesPerWeek this week (a tick made
 * today keeps them in the list so the ring credits it). Ticking a satisfied
 * habit stays allowed everywhere — this only shapes the Today ring and the
 * all-done celebration, so rhythm habits never read as missing.
 */
export function habitsDueToday(habits, habitLog, today = todayKey(), weekStart = 1) {
  const weekSoFar = rangeKeys(weekStartKey(today, weekStart), today);
  return habits.filter((h) => {
    if (h.archivedAt) return false;
    const perWeek = h.timesPerWeek || 7;
    if (perWeek >= 7) return true;
    if (habitLog[today]?.includes(h.id)) return true;
    const weekTicks = weekSoFar.filter((k) => habitLog[k]?.includes(h.id)).length;
    return weekTicks < perWeek;
  });
}

export function habitAdherence(habitLog, habit, dayKeys, today = todayKey()) {
  const createdKey = toDateKey(new Date(habit.createdAt || 0));
  const eligibleKeys = dayKeys.filter((k) => k >= createdKey && k <= today);
  const ticked = eligibleKeys.filter((k) => habitLog[k]?.includes(habit.id)).length;
  if (!eligibleKeys.length) return { ticked, eligible: 0, pct: null };
  // Weekly-rhythm habits (timesPerWeek < 7) are measured against their own
  // rhythm, not against every day; doing extra caps at 100 — never penalized.
  const perWeek = habit.timesPerWeek || 7;
  const eligible = Math.max(1, Math.round((eligibleKeys.length * perWeek) / 7));
  return { ticked, eligible, pct: Math.min(100, Math.round((ticked / eligible) * 100)) };
}

/** 0/1 values (oldest → newest) for a heatmap over dayKeys. */
export function habitHeatValues(habitLog, habitId, dayKeys) {
  return dayKeys.map((k) => (habitLog[k]?.includes(habitId) ? 1 : 0));
}

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const hasJournal = (e) =>
  Boolean(e && (e.highlight?.trim() || e.mood || e.grateful?.some((g) => g.trim())));

/**
 * Up to 3 short insight lines for Stats. POSITIVE FRAMING ONLY (Nadya's rule:
 * the app never reminds her of failures) — negative deltas simply say nothing.
 */
export function buildInsights({ trendDays, days, totals, prevTotals, habits, habitLog, journal, today, trackers = [], trackerLog = {} }) {
  const out = [];

  const delta = totals.productive - prevTotals.productive;
  if (prevTotals.total > 0 && delta >= 30) {
    out.push(`Productive time is up ${formatMinutes(delta)} on the previous period 🎉`);
  }

  // Power weekday over the wider trend window.
  const byDow = Array.from({ length: 7 }, () => ({ sum: 0, n: 0 }));
  for (const d of trendDays) {
    const dow = parseKey(d.key).getDay();
    byDow[dow].sum += d.productive;
    byDow[dow].n += 1;
  }
  const best = byDow
    .map((x, i) => ({ i, avg: x.n ? x.sum / x.n : 0 }))
    .sort((a, b) => b.avg - a.avg)[0];
  if (best && best.avg >= 45) out.push(`${DOW[best.i]}s are your power days ⚡`);

  // Strongest habit over the displayed period.
  const strongest = habits
    .filter((h) => !h.archivedAt)
    .map((h) => ({ h, a: habitAdherence(habitLog, h, days.map((d) => d.key), today) }))
    .filter(({ a }) => a.eligible >= 5 && a.pct >= 60)
    .sort((x, y) => y.a.pct - x.a.pct)[0];
  if (strongest) {
    out.push(`"${strongest.h.name}" is your strongest habit — ${strongest.a.pct}% kept 💪`);
  }

  // A tracker on a roll: intention met several days running (ending now-ish).
  for (const t of trackers.filter((x) => !x.archivedAt)) {
    const goal = t.kind === "check" ? 1 : t.target || 0;
    if (!goal) continue;
    let streak = 0;
    let day = (trackerLog[today]?.[t.id] || 0) >= goal ? today : addDays(today, -1);
    while ((trackerLog[day]?.[t.id] || 0) >= goal) {
      streak += 1;
      day = addDays(day, -1);
    }
    if (streak >= 3) {
      out.push(`${t.emoji} ${t.name} has met its intention ${streak} days running 🌿`);
      break; // one tracker line max — insights stay scannable
    }
  }

  // Journaling run ending today/yesterday.
  let run = 0;
  let cursor = hasJournal(journal[today]) ? today : addDays(today, -1);
  while (hasJournal(journal[cursor])) {
    run += 1;
    cursor = addDays(cursor, -1);
  }
  if (run >= 3) out.push(`${run} days of journaling in a row 💗`);

  // Mood, only when it's good news.
  const moods = days.map((d) => journal[d.key]?.mood).filter(Boolean);
  if (moods.length >= 3 && moods.reduce((a, b) => a + b, 0) / moods.length >= 3.8) {
    out.push("Mostly good days this period 🙂");
  }

  return out.slice(0, 3);
}

/** Mood values (1–5) for days that have one, in day order. */
export function moodPoints(journal, dayKeys) {
  return dayKeys.map((k) => journal[k]?.mood).filter(Boolean);
}

/** Avg total minutes per weekday over the given daily totals, in week order. */
export function weekdayProfile(trendDays, weekStart = 1) {
  const byDow = Array.from({ length: 7 }, () => ({ sum: 0, n: 0 }));
  for (const d of trendDays) {
    const dow = parseKey(d.key).getDay();
    byDow[dow].sum += d.total;
    byDow[dow].n += 1;
  }
  const order = [];
  for (let i = 0; i < 7; i++) order.push((weekStart + i) % 7);
  return order.map((dow) => ({
    label: DOW[dow].slice(0, 2),
    avg: byDow[dow].n ? Math.round(byDow[dow].sum / byDow[dow].n) : 0,
  }));
}

/**
 * Money state for one month. Entries carry kind "save" | "income" | "expense";
 * legacy entries have no kind and count as "save", so `saved` keeps meaning
 * "put aside toward the goal" — rings, XP and goal confetti stay truthful.
 * → { goal, saved, income, spent, entries }
 */
export function savingsForMonth(savings, mKey) {
  const month = savings.months[mKey];
  const goal = month?.goal ?? savings.defaultGoal ?? 0;
  const entries = month?.entries || [];
  let saved = 0;
  let income = 0;
  let spent = 0;
  for (const e of entries) {
    const v = e.amount || 0;
    if (e.kind === "income") income += v;
    else if (e.kind === "expense") spent += v;
    else saved += v;
  }
  return { goal, saved, income, spent, entries };
}
