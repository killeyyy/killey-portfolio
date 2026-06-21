export { calcExercises, calcProduct, totalProblems } from "./curriculum.js";
import { calcExercises } from "./curriculum.js";

/** Light metadata for lists/landing (full solutions stay code-split). */
export const exerciseIndex = calcExercises.map((e) => ({
  slug: e.slug,
  section: e.section,
  chapter: e.chapter,
  title: e.title,
  total: e.numbers.length,
}));

const loaders = {
  "ex-1-2": () => import("./exercises/ex-1-2.js"),
  "ex-2-1": () => import("./exercises/ex-2-1.js"),
  "ex-2-2": () => import("./exercises/ex-2-2.js"),
  "ex-2-3": () => import("./exercises/ex-2-3.js"),
  "ex-2-4": () => import("./exercises/ex-2-4.js"),
  "ex-2-5": () => import("./exercises/ex-2-5.js"),
  "ex-2-6": () => import("./exercises/ex-2-6.js"),
};

/** Code-split exercise loader. Resolves to the exercise object or null. */
export function loadExercise(slug) {
  const load = loaders[slug];
  return load ? load().then((m) => m.default) : Promise.resolve(null);
}
