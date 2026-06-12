// Richer-stats derivations: mood×habit links, time-of-day profile, monthly
// recap. journey.js style — computed on the fly, nothing stored. DNA: only
// positive framing leaves this module — habits are surfaced when days WITH
// them feel brighter; the reverse is never reported.
import { entriesForDay } from "./insights.js";
import { journalHasContent } from "./journey.js";

/**
 * Habits whose days carry a noticeably brighter mood (correlation, framed
 * as observation). Requires enough samples on BOTH sides to say anything.
 * → [{ habit, lift, days }] sorted by lift, top 3.
 */
export function moodHabitLinks({ habits, habitLog, journal, dayKeys, minSamples = 4, minLift = 0.3 }) {
  const links = [];
  const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  for (const h of habits.filter((x) => !x.archivedAt)) {
    const withMood = [];
    const withoutMood = [];
    for (const k of dayKeys) {
      const mood = journal[k]?.mood;
      if (!mood) continue;
      ((habitLog[k] || []).includes(h.id) ? withMood : withoutMood).push(mood);
    }
    if (withMood.length < minSamples || withoutMood.length < minSamples) continue;
    const lift = avg(withMood) - avg(withoutMood);
    if (lift >= minLift) {
      links.push({ habit: h, lift: Math.round(lift * 10) / 10, days: withMood.length });
    }
  }
  return links.sort((a, b) => b.lift - a.lift).slice(0, 3);
}

export const DAY_BUCKETS = [
  { id: "dawn", label: "Dawn", emoji: "🌅" }, //  4–11
  { id: "daylight", label: "Daylight", emoji: "☀️" }, // 11–15
  { id: "golden", label: "Golden hour", emoji: "🌇" }, // 15–19
  { id: "night", label: "Night", emoji: "🌙" }, // 19–4
];

function bucketOf(hour) {
  if (hour >= 4 && hour < 11) return "dawn";
  if (hour >= 11 && hour < 15) return "daylight";
  if (hour >= 15 && hour < 19) return "golden";
  return "night";
}

/** Where logged minutes land across the day (entry `at` is local). */
export function timeOfDay(months, dayKeys) {
  const sums = { dawn: 0, daylight: 0, golden: 0, night: 0 };
  let total = 0;
  for (const k of dayKeys) {
    for (const e of entriesForDay(months, k)) {
      sums[bucketOf(new Date(e.at).getHours())] += e.minutes;
      total += e.minutes;
    }
  }
  const buckets = DAY_BUCKETS.map((b) => ({
    ...b,
    minutes: sums[b.id],
    pct: total ? Math.round((sums[b.id] / total) * 100) : 0,
  }));
  const peak = total ? buckets.reduce((a, b) => (b.minutes > a.minutes ? b : a)) : null;
  return { buckets, total, peak };
}

/**
 * One month, gathered: active days, fullest day, leading category, habit
 * ticks, journal days, average mood. Future days never count against her.
 */
export function monthRecap({ days, categories, habitLog, journal, today }) {
  const upTo = days.filter((d) => d.key <= today);
  const activeDays = upTo.filter((d) => d.total > 0).length;
  const best = upTo.reduce((a, d) => (!a || d.total > a.total ? d : a), null);

  const byCat = {};
  for (const d of upTo) {
    for (const [id, m] of Object.entries(d.byCategory)) byCat[id] = (byCat[id] || 0) + m;
  }
  const topId = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topCat = categories.find((c) => c.id === topId);

  let ticks = 0;
  let journalDays = 0;
  const moods = [];
  for (const d of upTo) {
    ticks += (habitLog[d.key] || []).length;
    if (journalHasContent(journal[d.key])) journalDays += 1;
    if (journal[d.key]?.mood) moods.push(journal[d.key].mood);
  }
  return {
    activeDays,
    daysSoFar: upTo.length,
    bestDay: best && best.total > 0 ? { key: best.key, total: best.total } : null,
    top: topCat ? { category: topCat, minutes: byCat[topId] } : null,
    ticks,
    journalDays,
    moodAvg: moods.length
      ? Math.round((moods.reduce((s, v) => s + v, 0) / moods.length) * 10) / 10
      : null,
  };
}
