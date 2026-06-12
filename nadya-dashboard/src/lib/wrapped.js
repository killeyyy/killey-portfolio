// Weekly Wrapped data — stats for the most recent COMPLETE week.
// Pure derivation from stored data (reads shards directly, like journey.js).
import * as activitiesModel from "../models/activities.js";
import { addDays, monthKeyOf, rangeKeys, todayKey, weekStartKey } from "./dates.js";
import {
  dailyTotals, habitAdherence, periodTotals, productiveShare,
} from "./insights.js";
import { entryXP, journalHasContent } from "./journey.js";

/** { start, end } day keys of the last fully finished week. */
export function lastCompleteWeek(today = todayKey(), weekStart = 1) {
  const start = addDays(weekStartKey(today, weekStart), -7);
  return { start, end: addDays(start, 6) };
}

export function computeWrapped({ categories, habits, habitLog, journal, savings, weekStart = 1, today = todayKey() }) {
  const { start, end } = lastCompleteWeek(today, weekStart);
  const dayKeys = rangeKeys(start, end);

  const months = {};
  for (const mk of new Set(dayKeys.map(monthKeyOf))) {
    months[mk] = activitiesModel.getMonth(mk);
  }
  const days = dailyTotals(months, dayKeys, categories);
  const totals = periodTotals(days);
  const share = productiveShare(totals);

  const topEntry = Object.entries(totals.byCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topEntry
    ? { category: categories.find((c) => c.id === topEntry[0]) || null, minutes: topEntry[1] }
    : null;

  const best = [...days].sort((a, b) => b.productive - a.productive || b.total - a.total)[0];
  const bestDay = best && best.total > 0 ? best : null;

  const active = habits.filter((h) => !h.archivedAt);
  const champion =
    active
      .map((h) => ({ habit: h, adherence: habitAdherence(habitLog, h, dayKeys, end) }))
      .filter((x) => x.adherence.ticked > 0)
      .sort((a, b) => b.adherence.pct - a.adherence.pct)[0] || null;
  const ticks = dayKeys.reduce((s, k) => s + (habitLog[k]?.length || 0), 0);

  const moods = dayKeys.map((k) => journal[k]?.mood).filter(Boolean);
  const moodAvg = moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : null;
  const gratitudes = dayKeys.reduce(
    (s, k) => s + (journal[k]?.grateful || []).filter((g) => g.trim()).length,
    0,
  );
  const journaledDays = dayKeys.filter((k) => journalHasContent(journal[k])).length;
  const loggedDays = days.filter((d) => d.total > 0).length;

  const savingsEntries = Object.values(savings?.months || {})
    .flatMap((m) => m.entries || [])
    .filter((e) => e.date >= start && e.date <= end);
  const saved = savingsEntries.reduce((s, e) => s + (e.amount || 0), 0);

  let xp = ticks * 10 + journaledDays * 15 + savingsEntries.length * 10;
  for (const k of dayKeys) {
    for (const e of months[monthKeyOf(k)]?.[k] || []) xp += entryXP(e);
  }

  return {
    start, end, dayKeys, days, totals, share,
    topCategory, bestDay, champion, ticks,
    moodAvg, gratitudes, journaledDays, loggedDays,
    saved, savingsCount: savingsEntries.length, xp,
    hasData: totals.total > 0 || ticks > 0 || journaledDays > 0,
  };
}

/**
 * Rule-based weekly persona — the shareable identity claim (Duolingo-tier
 * concept). First matching rule wins; every persona is a compliment.
 */
export function weeklyPersona(w) {
  const top = w.topCategory?.category;
  if ((w.share ?? 0) >= 60 && w.ticks >= 5) {
    return { emoji: "🧗‍♀️", name: "The Quiet Climber", desc: "Steady hours, kept promises, calm mind." };
  }
  if (w.moodAvg >= 4 && w.gratitudes >= 9) {
    return { emoji: "🌞", name: "The Sunlit Soul", desc: "Good days, and the grace to notice them." };
  }
  if (top?.id === "social") {
    return { emoji: "💞", name: "The Heart of the Room", desc: "This week was made of people you love." };
  }
  if (top?.id === "entertainment") {
    return { emoji: "🍿", name: "The Story Collector", desc: "A week rich in worlds besides this one." };
  }
  if (w.saved > 0) {
    return { emoji: "🏗️", name: "The Future Builder", desc: "Quietly stacking bricks for tomorrow." };
  }
  if (w.loggedDays >= 6) {
    return { emoji: "📜", name: "The Faithful Chronicler", desc: "Six days witnessed and written down." };
  }
  if (w.journaledDays >= 3) {
    return { emoji: "🕯️", name: "The Gentle Noticer", desc: "You kept paying attention. That's rare." };
  }
  return { emoji: "🌱", name: "The Fresh Page", desc: "A soft week — and a brand new one ahead." };
}

/** Minutes → a relatable equivalent line ("≈ 9 episodes of focus"). */
export function funEquivalent(minutes) {
  if (minutes >= 240) return `≈ ${Math.round(minutes / 120)} movies' worth`;
  if (minutes >= 90) return `≈ ${Math.round(minutes / 45)} episodes' worth`;
  if (minutes >= 30) return `≈ ${Math.round(minutes / 4)} songs' worth`;
  return null;
}
