import { get, set } from "./storage.js";

// Progress = { done: {lessonSlug:true}, days: {YYYY-MM-DD: count}, minutes: n }
const KEY = "progress";

export function getProgress() {
  return get(KEY, { done: {}, days: {}, minutes: 0 });
}

export function markLessonDone(slug, minutes = 0) {
  const p = getProgress();
  if (!p.done[slug]) {
    p.done[slug] = true;
    p.minutes += minutes;
  }
  bumpActivity(p);
  set(KEY, p);
  return p;
}

export function bumpStudyActivity() {
  const p = getProgress();
  bumpActivity(p);
  set(KEY, p);
  return p;
}

function bumpActivity(p) {
  const day = new Date().toISOString().slice(0, 10);
  p.days[day] = (p.days[day] || 0) + 1;
}

/** Last `n` days of activity counts (oldest → newest) for the Heatmap. */
export function activitySeries(n = 126) {
  const p = getProgress();
  const out = [];
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    out.push(p.days[d.toISOString().slice(0, 10)] || 0);
    d.setDate(d.getDate() + 1);
  }
  return out;
}
