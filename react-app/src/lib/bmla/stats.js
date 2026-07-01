// Quiz performance tracking — feeds the dashboard "weak spots" panel.
// One namespaced object holds per-area accuracy so the dashboard reads a single key.
import { get, set } from "./storage.js";
import { curriculum } from "../../data/bmla/curriculum.js";

const KEY = "quizStats";

/** Lecture/section practice banks → label + the lesson to practise them in. */
export const TOPIC_AREAS = {
  lec1: { label: "§1.1 Systems of Linear Equations", lessonSlug: "lay-1-1" },
  lec2: { label: "§1.2 Row Reduction & Echelon Forms", lessonSlug: "lay-1-2" },
  lec3: { label: "§1.3 Vector Equations", lessonSlug: "lay-1-3" },
  "ax-b": { label: "§1.4 The Matrix Equation Ax = b", lessonSlug: "lay-1-4" },
  solset: { label: "§1.5 Solution Sets", lessonSlug: "lay-1-5" },
  lindep: { label: "§1.7 Linear Independence", lessonSlug: "lay-1-7" },
  "lt-intro": { label: "§1.8 Linear Transformations", lessonSlug: "lay-1-8" },
  "lt-matrix": { label: "§1.9 Matrix of a Transformation", lessonSlug: "lay-1-9" },
  // Past-paper archetypes (recorded from /bmla/papers timed tests).
  "paper-rref": { label: "Papers · RREF & solution sets", lessonSlug: "lay-1-2" },
  "paper-param": { label: "Papers · Parametric solutions", lessonSlug: "lay-1-5" },
  "paper-consist": { label: "Papers · Consistency analysis", lessonSlug: "lay-1-1" },
  "paper-lindep": { label: "Papers · Linear independence", lessonSlug: "lay-1-7" },
  "paper-lintrans": { label: "Papers · Linear transformations", lessonSlug: "lay-1-8" },
  "paper-span": { label: "Papers · Span & combinations", lessonSlug: "lay-1-3" },
  "paper-elem": { label: "Papers · Elementary matrices", lessonSlug: "lay-2-2" },
  "paper-inverse": { label: "Papers · Matrix inverse", lessonSlug: "lay-2-2" },
  "paper-det": { label: "Papers · Determinants", lessonSlug: "determinants-cofactor" },
  "paper-invert": { label: "Papers · Invertibility", lessonSlug: "lay-2-3" },
};

const areaKey = (moduleSlug, topic) => (topic ? `topic:${topic}` : `mod:${moduleSlug}`);

/** Record one completed quiz attempt (cumulative correct/total + best %). */
export function recordQuiz(moduleSlug, topic, correct, total) {
  if (!total) return;
  const stats = get(KEY, {});
  const k = areaKey(moduleSlug, topic);
  const prev = stats[k] || { moduleSlug, topic: topic || null, attempts: 0, correct: 0, total: 0, bestPct: 0 };
  const pct = Math.round((correct / total) * 100);
  stats[k] = {
    moduleSlug,
    topic: topic || null,
    attempts: prev.attempts + 1,
    correct: prev.correct + correct,
    total: prev.total + total,
    bestPct: Math.max(prev.bestPct, pct),
    lastPct: pct,
  };
  set(KEY, stats);
  return stats;
}

export function getQuizStats() {
  return get(KEY, {});
}

/** Attempted practice areas with overall accuracy + a label + where to practise. */
export function practiceAreas() {
  const stats = getQuizStats();
  const moduleLabel = Object.fromEntries(curriculum.map((m) => [m.slug, m.title]));
  const firstLesson = Object.fromEntries(curriculum.map((m) => [m.slug, m.lessonSlugs?.[0] || null]));
  return Object.values(stats).map((s) => {
    const area = s.topic && TOPIC_AREAS[s.topic];
    return {
      label: area ? area.label : moduleLabel[s.moduleSlug] || s.moduleSlug,
      lessonSlug: area ? area.lessonSlug : firstLesson[s.moduleSlug],
      accuracy: s.total ? Math.round((s.correct / s.total) * 100) : 0,
      attempts: s.attempts,
      bestPct: s.bestPct,
    };
  });
}
