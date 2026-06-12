// XP, levels, day-streak, achievements and the weekly star path — ALL derived
// from existing data, so the journey is retroactive and nothing new is stored
// or migrated. Design rule (from Nadya): progress feels fun and rewarding,
// never like failure — there are no decay/wilt/loss mechanics anywhere.
import * as activitiesModel from "../models/activities.js";
import * as trackersModel from "../models/trackers.js";
import * as storage from "./storage.js";
import { addDays, rangeKeys, todayKey, weekStartKey } from "./dates.js";

export const LEVEL_NAMES = [
  "Seedling", "Sprout", "Leaflet", "Bud", "First Bloom", "Bloom",
  "Wildflower", "Bouquet", "Rose Garden", "Radiant Rose", "Eternal Bloom",
];

/** Cumulative XP needed to reach level index i (0-based): 0, 100, 300, 600… */
export function xpFloor(i) {
  return 50 * i * (i + 1);
}

export function journalHasContent(e) {
  return Boolean(e && (e.highlight?.trim() || e.mood || e.grateful?.some((g) => g.trim())));
}

/** XP for a single activity entry (shared with the weekly Wrapped). */
export function entryXP(e) {
  return 5 + Math.min(15, Math.round((e.minutes || 0) / 10));
}

/** Flat { dateKey: entries[] } across every stored month shard. */
function allActivityDays() {
  const days = {};
  for (const mKey of activitiesModel.listShardMonths()) {
    Object.assign(days, activitiesModel.getMonth(mKey));
  }
  return days;
}

export function computeJourney({ habits, habitLog, journal, savings, dailyTarget = 180, categories = [] }) {
  const today = todayKey();
  const actDays = allActivityDays();
  const productiveIds = new Set(categories.filter((c) => c.productive).map((c) => c.id));

  // ---- XP ----
  let xp = 0;
  let totalLogs = 0;
  let earlyBird = false;
  const productiveByDay = {};
  for (const [day, entries] of Object.entries(actDays)) {
    for (const e of entries) {
      totalLogs += 1;
      xp += entryXP(e);
      if (new Date(e.at).getHours() < 8) earlyBird = true;
      if (productiveIds.has(e.categoryId)) {
        productiveByDay[day] = (productiveByDay[day] || 0) + e.minutes;
      }
    }
  }
  let totalTicks = 0;
  for (const ids of Object.values(habitLog)) totalTicks += ids.length;
  xp += totalTicks * 10;

  const journalDays = Object.keys(journal).filter((k) => journalHasContent(journal[k]));
  xp += journalDays.length * 15;
  const moodDays = Object.keys(journal).filter((k) => journal[k]?.mood).length;

  let goalsMet = 0;
  let savingsEntries = 0;
  for (const m of Object.values(savings.months || {})) {
    savingsEntries += (m.entries || []).length;
    // Only money put aside counts toward the goal (income/expense entries
    // are ledger lines, not savings; legacy entries have no kind = saved).
    const saved = (m.entries || []).reduce(
      (s, e) => s + (!e.kind || e.kind === "save" ? e.amount || 0 : 0),
      0,
    );
    if (m.goal > 0 && saved >= m.goal) goalsMet += 1;
  }
  xp += savingsEntries * 10 + goalsMet * 50;

  // Granted garden wishes (lib/quests.js) — read straight from storage like
  // the activity shards; the log only grows, so this XP never goes back down.
  const wishes = storage.get("wishes", {});
  const wishCount = Object.keys(wishes).length;
  for (const w of Object.values(wishes)) xp += w.xp || 25;

  // Tend (custom trackers) joins the journey: +5 XP per day with any care,
  // and intention-met days feed two achievements. Read like the shards.
  const trackers = trackersModel.getTrackers();
  const trackerLog = trackersModel.getLog();
  let tendDays = 0;
  let intentionDays = 0;
  for (const day of Object.values(trackerLog)) {
    const entries = Object.entries(day);
    if (!entries.length) continue;
    tendDays += 1;
    const met = entries.some(([id, v]) => {
      const t = trackers.find((x) => x.id === id);
      const goal = t ? (t.kind === "check" ? 1 : t.target || 0) : 0;
      return goal > 0 && v >= goal;
    });
    if (met) intentionDays += 1;
  }
  xp += tendDays * 5;

  // ---- level ----
  let levelIndex = 0;
  while (xp >= xpFloor(levelIndex + 1)) levelIndex += 1;
  const levelName = LEVEL_NAMES[Math.min(levelIndex, LEVEL_NAMES.length - 1)];
  const nextName = LEVEL_NAMES[Math.min(levelIndex + 1, LEVEL_NAMES.length - 1)];

  // ---- day streak: any log, tick or journal counts as showing up ----
  const activeDay = (k) =>
    (actDays[k]?.length || 0) > 0 || (habitLog[k]?.length || 0) > 0 || journalHasContent(journal[k]);
  let streak = 0;
  let cursor = activeDay(today) ? today : addDays(today, -1);
  while (activeDay(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  // ---- "golden day": habits ticked + journal + productive goal, same day ----
  const goldenDay = Object.keys(productiveByDay).some(
    (k) => productiveByDay[k] >= dailyTarget && (habitLog[k]?.length || 0) > 0 && journalHasContent(journal[k]),
  );

  // ---- achievements (locked ones are invitations, not failures) ----
  const achievements = [
    { id: "first-step", emoji: "🌱", title: "First step", desc: "Log your first activity", earned: totalLogs >= 1 },
    { id: "streak-3", emoji: "✨", title: "Three in a row", desc: "3-day streak", earned: streak >= 3 || bestEver(actDays, habitLog, journal) >= 3 },
    { id: "streak-7", emoji: "🔥", title: "One full week", desc: "7-day streak", earned: streak >= 7 || bestEver(actDays, habitLog, journal) >= 7 },
    { id: "streak-30", emoji: "🌙", title: "A whole month", desc: "30-day streak", earned: streak >= 30 || bestEver(actDays, habitLog, journal) >= 30 },
    { id: "logs-50", emoji: "📚", title: "Fifty moments", desc: "50 activities logged", earned: totalLogs >= 50 },
    { id: "logs-250", emoji: "🏆", title: "Time historian", desc: "250 activities logged", earned: totalLogs >= 250 },
    { id: "journal-7", emoji: "💗", title: "Grateful heart", desc: "7 days journaled", earned: journalDays.length >= 7 },
    { id: "journal-30", emoji: "📔", title: "Storyteller", desc: "30 days journaled", earned: journalDays.length >= 30 },
    { id: "mood-7", emoji: "🌈", title: "Self-aware", desc: "Mood logged 7 days", earned: moodDays >= 7 },
    { id: "golden-day", emoji: "🌟", title: "Golden day", desc: "Goal + habits + journal in one day", earned: goldenDay },
    { id: "saver", emoji: "💰", title: "Goal getter", desc: "Meet a monthly savings goal", earned: goalsMet >= 1 },
    { id: "early-bird", emoji: "🌅", title: "Early bird", desc: "Log something before 8 am", earned: earlyBird },
    { id: "wish-1", emoji: "🌠", title: "First wish", desc: "Grant a garden wish", earned: wishCount >= 1 },
    { id: "wish-10", emoji: "✨", title: "Wish keeper", desc: "10 wishes granted", earned: wishCount >= 10 },
    { id: "wish-25", emoji: "🌌", title: "Star gardener", desc: "25 wishes granted", earned: wishCount >= 25 },
    { id: "tend-7", emoji: "💧", title: "Well watered", desc: "Meet a tracker's intention 7 days", earned: intentionDays >= 7 },
    { id: "tend-30", emoji: "🪴", title: "Caretaker", desc: "Tend your trackers 30 days", earned: tendDays >= 30 },
  ];

  // ---- weekly star path (last 8 weeks, oldest → newest) ----
  const thisWeekStart = weekStartKey(today, 1);
  const weeks = [];
  for (let w = -7; w <= 0; w++) {
    const start = addDays(thisWeekStart, w * 7);
    const days = rangeKeys(start, addDays(start, 6)).filter((k) => k <= today);
    const loggedDays = days.filter((k) => (actDays[k]?.length || 0) > 0).length;
    const journaled = days.filter((k) => journalHasContent(journal[k])).length;
    const tickDays = days.filter((k) => (habitLog[k]?.length || 0) > 0).length;
    const stars = (loggedDays >= 4 ? 1 : 0) + (tickDays >= 4 ? 1 : 0) + (journaled >= 3 ? 1 : 0);
    weeks.push({ start, stars, isCurrent: w === 0, loggedDays, tickDays, journaled });
  }

  return {
    xp, levelIndex, levelName, nextName,
    levelFloor: xpFloor(levelIndex), nextFloor: xpFloor(levelIndex + 1),
    streak, achievements, weeks,
    earnedCount: achievements.filter((a) => a.earned).length,
  };
}

// Best historical streak (so a broken streak never un-earns a badge).
function bestEver(actDays, habitLog, journal) {
  const active = new Set([
    ...Object.keys(actDays).filter((k) => actDays[k]?.length),
    ...Object.keys(habitLog).filter((k) => habitLog[k]?.length),
    ...Object.keys(journal).filter((k) => journalHasContent(journal[k])),
  ]);
  let best = 0;
  let run = 0;
  let prev = null;
  for (const k of [...active].sort()) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    if (run > best) best = run;
    prev = k;
  }
  return best;
}

/**
 * Mawar's Garden: every week since her first recorded day becomes a flower.
 * stars use the same criteria as the journey path; quiet weeks grow a small
 * sprout (never an empty plot — no failure-shaming). Flower color follows the
 * week's dominant category.
 */
export function weeklyGarden({ habits, habitLog, journal, categories = [], weekStart = 1, today = todayKey() }) {
  const actDays = allActivityDays();
  const activeKeys = [
    ...Object.keys(actDays).filter((k) => actDays[k]?.length),
    ...Object.keys(habitLog).filter((k) => habitLog[k]?.length),
    ...Object.keys(journal).filter((k) => journalHasContent(journal[k])),
  ].sort();
  if (!activeKeys.length) return [];

  const thisWeekStart = weekStartKey(today, weekStart);
  const plots = [];
  let start = weekStartKey(activeKeys[0], weekStart);
  while (start <= thisWeekStart) {
    const days = rangeKeys(start, addDays(start, 6)).filter((k) => k <= today);
    const loggedDays = days.filter((k) => (actDays[k]?.length || 0) > 0).length;
    const tickDays = days.filter((k) => (habitLog[k]?.length || 0) > 0).length;
    const journaled = days.filter((k) => journalHasContent(journal[k])).length;
    const stars =
      (loggedDays >= 4 ? 1 : 0) + (tickDays >= 4 ? 1 : 0) + (journaled >= 3 ? 1 : 0);

    const minutesByCat = {};
    for (const k of days) {
      for (const e of actDays[k] || []) {
        minutesByCat[e.categoryId] = (minutesByCat[e.categoryId] || 0) + e.minutes;
      }
    }
    const domId = Object.entries(minutesByCat).sort((a, b) => b[1] - a[1])[0]?.[0];
    const color = categories.find((c) => c.id === domId)?.color || "rose";

    plots.push({ start, stars, color, isCurrent: start === thisWeekStart });
    start = addDays(start, 7);
  }
  return plots;
}
