export { curriculum, product, availableModules } from "./curriculum.js";

/** Light lesson metadata for lists/dashboard (full content stays code-split).
 *  Order here = the recommended learning path (prev/next navigation). */
export const lessonIndex = [
  { slug: "matrix-basics", moduleSlug: "matrices", title: "Matrices, Notation & Multiplication", minutes: 14 },
  { slug: "gaussian-elimination", moduleSlug: "matrices", title: "Gaussian Elimination & RREF", minutes: 18 },
  { slug: "vector-basics", moduleSlug: "vectors", title: "Vectors, Combinations & Span", minutes: 15 },
  { slug: "determinants-cofactor", moduleSlug: "determinants", title: "Determinants & Cofactor Expansion", minutes: 16 },
  { slug: "cramers-rule", moduleSlug: "determinants", title: "Inverses & Cramer's Rule", minutes: 15 },
  { slug: "linear-transformations", moduleSlug: "transformations", title: "Linear Transformations: One-to-One & Onto", minutes: 16 },
  { slug: "geometric-transformations", moduleSlug: "transformations", title: "Geometric Transformations of the Plane", minutes: 14 },
  { slug: "eigenvalues", moduleSlug: "eigen", title: "Eigenvalues & Eigenvectors", minutes: 17 },
  { slug: "diagonalization", moduleSlug: "eigen", title: "Diagonalization & Matrix Powers", minutes: 18 },
  { slug: "break-even", moduleSlug: "applied", title: "Cost, Revenue & Break-Even", minutes: 12 },
  { slug: "markov-chains", moduleSlug: "applied", title: "Markov Chains & Steady States", minutes: 16 },
  { slug: "lp-graphical", moduleSlug: "linear-programming", title: "LP Formulation & the Graphical Method", minutes: 16 },
  { slug: "simplex-method", moduleSlug: "linear-programming", title: "The Simplex Method", minutes: 20 },
  { slug: "transportation-problem", moduleSlug: "networks", title: "The Transportation Problem", minutes: 18 },
  { slug: "assignment-hungarian", moduleSlug: "networks", title: "The Assignment Problem & Hungarian Method", minutes: 17 },
];

const loaders = {
  "matrix-basics": () => import("./lessons/matrix-basics.js"),
  "gaussian-elimination": () => import("./lessons/gaussian-elimination.js"),
  "vector-basics": () => import("./lessons/vector-basics.js"),
  "determinants-cofactor": () => import("./lessons/determinants-cofactor.js"),
  "cramers-rule": () => import("./lessons/cramers-rule.js"),
  "linear-transformations": () => import("./lessons/linear-transformations.js"),
  "geometric-transformations": () => import("./lessons/geometric-transformations.js"),
  eigenvalues: () => import("./lessons/eigenvalues.js"),
  diagonalization: () => import("./lessons/diagonalization.js"),
  "break-even": () => import("./lessons/break-even.js"),
  "markov-chains": () => import("./lessons/markov-chains.js"),
  "lp-graphical": () => import("./lessons/lp-graphical.js"),
  "simplex-method": () => import("./lessons/simplex-method.js"),
  "transportation-problem": () => import("./lessons/transportation-problem.js"),
  "assignment-hungarian": () => import("./lessons/assignment-hungarian.js"),
};

/** Code-split lesson loader. Resolves to the lesson object or null. */
export function loadLesson(slug) {
  const load = loaders[slug];
  return load ? load().then((m) => m.default) : Promise.resolve(null);
}
