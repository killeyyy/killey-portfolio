// ============================================================
// BMLA Mastery — curriculum.
// Module/topic structure mirrors the ACTUAL course coverage
// (derived from the assignment TOPIC outline only — no problems,
// data, or solutions reproduced). All lessons & practice here are
// ORIGINAL and never contain answers to live graded coursework.
// ============================================================

/**
 * @typedef {"prose"|"math"|"example"|"callout"|"practice"} BlockType
 * @typedef {Object} Block
 * @property {BlockType} type
 * @property {string=} text
 * @property {string=} tex
 * @property {string=} title
 * @property {("note"|"tip"|"warn"|"integrity")=} tone
 * @property {{prompt:string, steps:{tex?:string,text?:string}[], answerTex?:string}=} example
 * @property {{bankId:string, count?:number}=} practice
 *
 * @typedef {Object} Lesson
 * @property {string} slug
 * @property {string} moduleSlug
 * @property {string} title
 * @property {string} objective
 * @property {number} minutes
 * @property {string[]=} tools
 * @property {Block[]} blocks
 *
 * @typedef {Object} Module
 * @property {string} slug
 * @property {string} title
 * @property {string} summary
 * @property {string} icon
 * @property {string} accent            literal text-* class
 * @property {("intro"|"core"|"advanced")} level
 * @property {string=} ref              textbook chapter classification (Lay/Budnick)
 * @property {string[]} topics          numbered subtopics (display)
 * @property {string[]} lessonSlugs     authored lessons available now
 */

/** @type {Module[]} */
export const curriculum = [
  {
    slug: "matrices",
    ref: "Lay Ch. 1.1–1.2",
    title: "Linear Systems & Matrix Foundations",
    summary: "Row-reduce anything, read pivots & rank, and multiply matrices without slips.",
    icon: "Grid3x3", accent: "text-crimson-bright", level: "intro",
    topics: ["Systems of linear equations", "Gaussian elimination · REF/RREF", "Augmented matrices", "Pivots, rank & consistency", "Unique / none / infinite solutions", "Matrix multiplication"],
    lessonSlugs: ["lay-1-1", "lay-1-2", "lay-2-1"],
  },
  {
    slug: "vectors",
    ref: "Lay Ch. 1.3–1.7",
    title: "Vectors & Vector Spaces",
    summary: "Linear combinations, span, independence, and the equation Ax = b.",
    icon: "Move3d", accent: "text-violet-bright", level: "intro",
    topics: ["Vector operations", "Linear combinations & span", "Ax = b and existence", "Over/under-determined systems"],
    lessonSlugs: ["lay-1-3", "lay-1-4"],
  },
  {
    slug: "determinants",
    ref: "Lay Ch. 2–3",
    title: "Determinants & Inverses",
    summary: "Cofactor expansion, determinant rules, invertibility, and solving by inverse.",
    icon: "SquareDivide", accent: "text-gold", level: "core",
    topics: ["Cofactor expansion", "Determinant properties (det of AB, Aᵀ, A⁻¹, kA, Aⁿ)", "Invertibility & singularity", "Solve systems by inversion", "Cramer's rule"],
    lessonSlugs: ["lay-2-2", "lay-2-3", "determinants-cofactor", "cramers-rule"],
  },
  {
    slug: "transformations",
    ref: "Lay Ch. 1.8–1.9",
    title: "Linear Transformations",
    summary: "Standard matrices, one-to-one & onto, and the geometric maps of the plane.",
    icon: "FlipHorizontal2", accent: "text-cyan", level: "core",
    topics: ["Linear operators", "One-to-one (injective) & range (onto)", "Standard matrix & change of basis", "Inverse operators", "Reflection / rotation / projection / shear / scaling"],
    lessonSlugs: ["linear-transformations", "geometric-transformations"],
  },
  {
    slug: "eigen",
    ref: "Lay Ch. 5",
    title: "Eigenvalues & Diagonalization",
    summary: "Characteristic equation, eigenspaces, and matrix powers in closed form.",
    icon: "Sparkles", accent: "text-magenta", level: "advanced",
    topics: ["Eigenvalues & eigenvectors", "Characteristic equation", "Eigenspaces · algebraic vs geometric multiplicity", "Eigen-behaviour under A², A⁻¹, A+cI", "Diagonalization · Aⁿ via PDⁿP⁻¹"],
    lessonSlugs: ["eigenvalues", "diagonalization"],
  },
  {
    slug: "applied",
    ref: "Lay Ch. 4.9 · Budnick",
    title: "Applied & Stochastic Models",
    summary: "Where the algebra pays off: input-output economics and Markov chains.",
    icon: "TrendingUp", accent: "text-jade-bright", level: "core",
    topics: ["Cost · revenue · break-even", "Leontief input-output / equilibrium pricing", "Markov chains: transition matrices", "State evolution & steady-state vectors"],
    lessonSlugs: ["break-even", "markov-chains"],
  },
  {
    slug: "linear-programming",
    ref: "Budnick Ch. 10–11",
    title: "Linear Programming & Simplex",
    summary: "The heavy hitter: model it, solve it graphically and by Simplex, and read the tableau.",
    icon: "Spline", accent: "text-crimson-bright", level: "advanced",
    topics: ["LP formulation (standard form)", "Graphical method", "Simplex (two-phase · Big-M)", "Reading tableaux: optimal / unbounded / infeasible / multiple / degenerate", "Duality & primal recovery"],
    lessonSlugs: ["lp-graphical", "simplex-method"],
  },
  {
    slug: "networks",
    ref: "Budnick Ch. 12",
    title: "Transportation & Assignment",
    summary: "Allocation models: balance supply & demand, then optimize the schedule.",
    icon: "Network", accent: "text-violet-bright", level: "advanced",
    topics: ["Transportation problem (balanced & unbalanced)", "NW-corner · least-cost · stepping-stone", "Assignment problem · Hungarian method", "Minimum-cost schedules"],
    lessonSlugs: ["transportation-problem", "assignment-hungarian"],
  },
];

export const product = {
  name: "BMLA Mastery",
  tagline: "Business Maths & Linear Algebra — finally click.",
  promise:
    "Short cinematic lessons, worked examples, and interactive tools that turn the real exam topics — from row reduction to Simplex — into things you can actually do. Original content, randomized practice, built by a student who's in it with you.",
};

/** Modules with at least one authored lesson today (rest are on the roadmap). */
export const availableModules = curriculum.filter((m) => m.lessonSlugs.length > 0);
