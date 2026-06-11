export { curriculum, product, availableModules } from "./curriculum.js";

/** Light lesson metadata for lists/dashboard (full content stays code-split). */
export const lessonIndex = [
  { slug: "matrix-basics", moduleSlug: "matrices", title: "Matrices, Notation & Multiplication", minutes: 14 },
  { slug: "gaussian-elimination", moduleSlug: "matrices", title: "Gaussian Elimination & RREF", minutes: 18 },
  { slug: "vector-basics", moduleSlug: "vectors", title: "Vectors, Combinations & Span", minutes: 15 },
  { slug: "break-even", moduleSlug: "applied", title: "Cost, Revenue & Break-Even", minutes: 12 },
];

const loaders = {
  "matrix-basics": () => import("./lessons/matrix-basics.js"),
  "gaussian-elimination": () => import("./lessons/gaussian-elimination.js"),
  "vector-basics": () => import("./lessons/vector-basics.js"),
  "break-even": () => import("./lessons/break-even.js"),
};

/** Code-split lesson loader. Resolves to the lesson object or null. */
export function loadLesson(slug) {
  const load = loaders[slug];
  return load ? load().then((m) => m.default) : Promise.resolve(null);
}
