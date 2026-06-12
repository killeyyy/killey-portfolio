// Weekly "garden wishes" — gentle quests derived from her own data. The same
// week always wishes for the same things (seeded by the week-start key), so
// quest definitions need no storage; only the granted log persists
// (models/wishes.js). DNA: wishes invite, never scold — targets sit at or
// below her usual rhythm, and an ungranted wish simply fades when the week
// turns. Nothing is lost, nothing goes red.
import * as activitiesModel from "../models/activities.js";
import { addDays, rangeKeys, todayKey, weekStartKey } from "./dates.js";
import { journalHasContent } from "./journey.js";
import { dayFill } from "./tend.js";
import { formatMinutes } from "./format.js";

export const WISH_XP = 25;

// Deterministic 0..1 from a string seed + salt (same trick as the garden).
function rand(seed, salt) {
  let h = salt;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const x = Math.sin(h) * 43758.5453;
  return x - Math.floor(x);
}

/** Flat { dateKey: entries[] } across every stored month shard. */
function allActivityDays() {
  const days = {};
  for (const mKey of activitiesModel.listShardMonths()) {
    Object.assign(days, activitiesModel.getMonth(mKey));
  }
  return days;
}

/**
 * The current week's wishes: always the show-up wish, plus two rotating ones
 * picked from whatever she actually has (habits, trackers, productive
 * categories, journal). → [{ id, emoji, title, desc, target, progress, unit,
 * xp, done }]
 */
export function weeklyQuests({
  habits = [],
  habitLog = {},
  journal = {},
  trackers = [],
  trackerLog = {},
  categories = [],
  weekStart = 1,
  today = todayKey(),
}) {
  const start = weekStartKey(today, weekStart);
  const sofar = rangeKeys(start, addDays(start, 6)).filter((k) => k <= today);
  const past = rangeKeys(addDays(start, -28), addDays(start, -1));
  const actDays = allActivityDays();

  const activeOn = (k) =>
    (actDays[k]?.length || 0) > 0 ||
    (habitLog[k]?.length || 0) > 0 ||
    journalHasContent(journal[k]);

  const pool = [];

  // Always: showing up — target follows her own recent rhythm, rounded gently.
  const pastActive = past.filter(activeOn).length;
  const showTarget = Math.max(3, Math.min(6, Math.round(pastActive / 4)));
  pool.push({
    id: `${start}:showup`,
    emoji: "🌅",
    fixed: true,
    title: `Show up ${showTarget} days`,
    desc: "Any log, tick or page counts.",
    target: showTarget,
    progress: sofar.filter(activeOn).length,
    unit: "days",
  });

  // Rotating: one habit, four gentle check-ins.
  const liveHabits = habits.filter((h) => !h.archivedAt);
  if (liveHabits.length) {
    const h = liveHabits[Math.floor(rand(start, 1) * liveHabits.length)];
    pool.push({
      id: `${start}:habit:${h.id}`,
      emoji: h.emoji || "🌿",
      title: `Tend “${h.name}” 4 days`,
      desc: "Four check-ins, any four days.",
      target: 4,
      progress: sofar.filter((k) => (habitLog[k] || []).includes(h.id)).length,
      unit: "days",
    });
  }

  // Rotating: one tracker — days that reach its daily intention.
  const liveTrackers = trackers.filter((t) => !t.archivedAt);
  if (liveTrackers.length) {
    const t = liveTrackers[Math.floor(rand(start, 2) * liveTrackers.length)];
    pool.push({
      id: `${start}:tracker:${t.id}`,
      emoji: t.emoji || "💧",
      title: `Fill ${t.name}'s leaves 4 days`,
      desc: "Days that reach the daily intention.",
      target: 4,
      progress: sofar.filter((k) => dayFill(t, trackerLog[k]?.[t.id] || 0) >= 1).length,
      unit: "days",
    });
  }

  // Rotating: gentle hours for a productive category she already visits —
  // ~60% of her 4-week average, so the aim is beatable by design.
  const minsFor = (catId, keys) =>
    keys.reduce(
      (s, k) =>
        s +
        (actDays[k] || [])
          .filter((e) => e.categoryId === catId)
          .reduce((a, e) => a + e.minutes, 0),
      0,
    );
  const seenCats = categories.filter(
    (c) => c.productive && !c.archived && minsFor(c.id, past) > 0,
  );
  if (seenCats.length) {
    const c = seenCats[Math.floor(rand(start, 3) * seenCats.length)];
    const target = Math.max(60, Math.round((minsFor(c.id, past) / 4) * 0.6 / 30) * 30);
    pool.push({
      id: `${start}:cat:${c.id}`,
      emoji: "⏳",
      title: `Give ${c.label} ${formatMinutes(target)}`,
      desc: "Across the whole week, any pace.",
      target,
      progress: minsFor(c.id, sofar),
      unit: "minutes",
    });
  }

  // Rotating: evening pages.
  pool.push({
    id: `${start}:journal`,
    emoji: "🕯️",
    title: "Write 3 evening pages",
    desc: "A gratitude or a highlight counts.",
    target: 3,
    progress: sofar.filter((k) => journalHasContent(journal[k])).length,
    unit: "days",
  });

  // The show-up wish plus two seeded picks from the rest.
  const rest = pool.filter((w) => !w.fixed);
  const picks = [];
  let salt = 7;
  while (picks.length < Math.min(2, rest.length)) {
    const i = Math.floor(rand(start, salt++) * rest.length);
    picks.push(rest.splice(i, 1)[0]);
  }
  return [pool.find((w) => w.fixed), ...picks].map((w) => ({
    ...w,
    xp: WISH_XP,
    done: w.progress >= w.target,
  }));
}
