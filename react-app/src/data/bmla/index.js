export { curriculum, product, availableModules } from "./curriculum.js";

/** Light lesson metadata for lists/dashboard (full content stays code-split).
 *  Order here = the recommended learning path. Lay §1.1–§2.3 lead the syllabus. */
export const lessonIndex = [
  { slug: "lay-1-1", moduleSlug: "matrices", title: "§1.1 — Systems of Linear Equations", minutes: 24, lecture: { n: 1, date: "09 Jun" } },
  { slug: "lay-1-2", moduleSlug: "matrices", title: "§1.2 — Row Reduction & Echelon Forms", minutes: 26, lecture: { n: 2, date: "11 Jun" } },
  { slug: "lay-2-1", moduleSlug: "matrices", title: "§2.1 — Matrix Operations", minutes: 22 },
  { slug: "lay-1-3", moduleSlug: "vectors", title: "§1.3 — Vector Equations", minutes: 24, lecture: { n: 3, date: "13 Jun" } },
  { slug: "lay-1-4", moduleSlug: "vectors", title: "§1.4 — The Matrix Equation Ax = b", minutes: 22, lecture: { n: "3b", date: "13 Jun" } },
  { slug: "lay-1-5", moduleSlug: "vectors", title: "§1.5 — Solution Sets of Linear Systems", minutes: 22, lecture: { n: "4a", date: "16 Jun" } },
  { slug: "lay-1-7", moduleSlug: "vectors", title: "§1.7 — Linear Independence", minutes: 22, lecture: { n: "4b", date: "16 Jun" } },
  { slug: "lay-1-8", moduleSlug: "transformations", title: "§1.8 — Introduction to Linear Transformations", minutes: 22, lecture: { n: "5a", date: "18 Jun" } },
  { slug: "lay-1-9", moduleSlug: "transformations", title: "§1.9 — The Matrix of a Linear Transformation", minutes: 20, lecture: { n: "5b", date: "18 Jun" } },
  { slug: "lay-2-2", moduleSlug: "determinants", title: "§2.2 — The Inverse of a Matrix", minutes: 22 },
  { slug: "lay-2-3", moduleSlug: "determinants", title: "§2.3 — Characterizations of Invertible Matrices", minutes: 20 },
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
  "lay-1-1": () => import("./lessons/lay-1-1.js"),
  "lay-1-2": () => import("./lessons/lay-1-2.js"),
  "lay-1-3": () => import("./lessons/lay-1-3.js"),
  "lay-1-4": () => import("./lessons/lay-1-4.js"),
  "lay-1-5": () => import("./lessons/lay-1-5.js"),
  "lay-1-7": () => import("./lessons/lay-1-7.js"),
  "lay-1-8": () => import("./lessons/lay-1-8.js"),
  "lay-1-9": () => import("./lessons/lay-1-9.js"),
  "lay-2-1": () => import("./lessons/lay-2-1.js"),
  "lay-2-2": () => import("./lessons/lay-2-2.js"),
  "lay-2-3": () => import("./lessons/lay-2-3.js"),
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
