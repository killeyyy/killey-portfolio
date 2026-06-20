// ============================================================
// Calculus — Solved.  A private worked-solutions archive that
// mirrors the BMLA vault: passcode-gated, noindexed, owner-only.
//
// Structure follows the standard Calculus I sequence (Functions →
// Limits & Continuity). `numbers` is the exact problem set Hassan
// is working through per exercise; full question text + step-by-step
// solutions are authored one problem at a time in ./exercises/<slug>.js
// and merged in by problem number.
// ============================================================

/**
 * @typedef {Object} SolutionStep
 * @property {string=} text   prose for this step (markdown-lite via <Rich>)
 * @property {string=} tex    KaTeX for this step
 *
 * @typedef {Object} SolvedProblem
 * @property {number} num            problem number within the exercise
 * @property {string=} topic         short tag (e.g. "shifting", "limit laws")
 * @property {string=} prompt        full question text (markdown-lite)
 * @property {string=} promptTex     question rendered as standalone KaTeX
 * @property {SolutionStep[]=} steps worked solution, revealed progressively
 * @property {string=} answerTex     final answer (KaTeX, highlighted)
 * @property {string=} answer        final answer (plain text)
 *
 * @typedef {Object} Exercise
 * @property {string} slug
 * @property {string} section        e.g. "2.1"
 * @property {number} chapter
 * @property {string} title
 * @property {string} source
 * @property {SolvedProblem[]} problems   solved entries (subset of `numbers`)
 */

export const calcProduct = {
  name: "Calculus — Solved",
  tagline: "Worked solutions to my Calculus exercises — full questions, step by step.",
  source: "Calculus with Applications (Brief Version) — Lial, Greenwell & Ritchey",
  promise:
    "Every assigned problem, solved cleanly: the full question, a step-by-step walkthrough you can reveal one move at a time, and the boxed final answer. Built one problem at a time so each solution is right, not rushed.",
};

/** The exercise list + the exact problem numbers per exercise (102 total).
 *  Section titles follow Lial's "Calculus with Applications" (Ch.1 Linear
 *  Functions, Ch.2 Nonlinear Functions); verified against the source PDF. */
export const calcExercises = [
  {
    slug: "ex-1-2",
    chapter: 1,
    section: "1.2",
    title: "Linear Functions & Applications",
    numbers: [19, 20, 21, 22, 24, 25, 27, 29, 30, 32, 33, 34, 35, 38, 43, 45, 48],
  },
  {
    slug: "ex-2-1",
    chapter: 2,
    section: "2.1",
    title: "Properties of Functions",
    numbers: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 43, 72, 73, 74, 75, 76, 79, 80],
  },
  {
    slug: "ex-2-2",
    chapter: 2,
    section: "2.2",
    title: "Quadratic Functions · Translation & Reflection",
    numbers: [13, 14, 15, 16, 31, 32, 33, 34, 35, 36, 37, 38, 51, 54, 57, 59, 67],
  },
  {
    slug: "ex-2-3",
    chapter: 2,
    section: "2.3",
    title: "Polynomial & Rational Functions",
    numbers: [3, 4, 5, 6, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 47, 48, 58],
  },
  {
    slug: "ex-2-4",
    chapter: 2,
    section: "2.4",
    title: "Exponential Functions",
    numbers: [3, 4, 5, 6, 7, 8, 9, 10, 11, 29, 30, 31, 32, 37, 41, 47, 52],
  },
  {
    slug: "ex-2-5",
    chapter: 2,
    section: "2.5",
    title: "Logarithmic Functions",
    numbers: [75, 76, 87],
  },
  {
    slug: "ex-2-6",
    chapter: 2,
    section: "2.6",
    title: "Applications: Growth & Decay · Mathematics of Finance",
    numbers: [23, 29, 35, 39, 41, 43, 44, 45],
  },
];

/** Grand total of problems queued across all exercises (102). */
export const totalProblems = calcExercises.reduce((n, e) => n + e.numbers.length, 0);
