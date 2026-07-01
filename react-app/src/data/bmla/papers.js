// ============================================================
// BMLA past-paper intelligence — the weightage analysis.
//
// Grounded ONLY in Hassan's real papers (no invented content):
//   · Term-1 Exam        — 27 Sep 2016 (questions .docx + solutions PDF)
//   · Midterm            — 12 Jul 2025 (paper + handwritten key)
//   · Midterm            — 11 Mar 2026 (paper + handwritten key, 18 pp)
//   · Quiz 1             — 18 Feb 2026 (page 17 of the 2026 scan)
// Every question item in paper-bank.js cites its source (paper · Q#).
// ============================================================

/** The papers behind the analysis. */
export const PAPER_META = [
  {
    id: "2016",
    label: "Term-1 Exam · 27 Sep 2016",
    format: "4 questions, all compulsory, equal weight",
    source: "BMLA_Term_1_Exam__27_Sep_2016 (questions .docx + solutions PDF)",
  },
  {
    id: "2025",
    label: "Midterm · 12 Jul 2025",
    format: "any 4 of 5, equally weighted · 2 hours",
    source: "BMLA_Midterm__12_Jul_2025_Solutions.pdf",
  },
  {
    id: "2026",
    label: "Midterm · 11 Mar 2026",
    format: "any 6 of 7 · 4 marks each · 24 points · 2 hours",
    source: "BMLA_Midterm__11_Mar_2026_Solutions.pdf",
  },
  {
    id: "quiz26",
    label: "Quiz 1 · 18 Feb 2026",
    format: "1 question · 15 minutes",
    source: "page 17 of the 11 Mar 2026 scan",
  },
];

/**
 * The recurring question archetypes across all papers, with where each
 * appeared. `priority`: "red" = appears in every sitting (must-know),
 * "amber" = appears in the recent midterms (likely).
 * `weight` = share of all question-parts across the papers (%).
 */
export const ARCHETYPES = [
  {
    id: "rref",
    label: "Systems → echelon / RREF → solution set",
    short: "Ax=b via row reduction",
    priority: "red",
    weight: 22,
    seenIn: { 2016: "Q1, Q2", 2025: "Q1, Q2", 2026: "Q1, Q5 · Quiz Q1" },
    lessonSlug: "lay-1-2",
    tip: "Name the echelon AND reduced-echelon form; the pivot columns decide everything.",
  },
  {
    id: "param",
    label: "Parametric solutions (Ax = b and Ax = 0)",
    short: "free variables → x = p + t·v",
    priority: "red",
    weight: 16,
    seenIn: { 2016: "Q2", 2025: "Q1, Q2", 2026: "Q5 · Quiz Q1" },
    lessonSlug: "lay-1-5",
    tip: "Write basic variables in terms of free ones; the homogeneous part is the same v.",
  },
  {
    id: "consist",
    label: "Consistency & parameter analysis (k, α, b-conditions)",
    short: "when unique / infinite / none",
    priority: "red",
    weight: 13,
    seenIn: { 2016: "Q1", 2025: "Q2", 2026: "Q1" },
    lessonSlug: "lay-1-1",
    tip: "Reduce with the parameter symbolic; the last row's [0 … 0 | expr] is the condition.",
  },
  {
    id: "lindep",
    label: "Linear independence + dependency relation",
    short: "independent? write the relation",
    priority: "red",
    weight: 13,
    seenIn: { 2016: "Q3", 2025: "Q1c, Q2f", 2026: "Quiz Q1c" },
    lessonSlug: "lay-1-7",
    tip: "Shortcuts: more vectors than entries → dependent; contains 0 → dependent; two vectors → check multiples.",
  },
  {
    id: "lintrans",
    label: "Linear transformations — linearity, image, preimage, standard matrix",
    short: "T linear? T(u)? T⁻¹(b)? matrix of T",
    priority: "red",
    weight: 13,
    seenIn: { 2016: "Q4", 2025: "Q3", 2026: "Q3" },
    lessonSlug: "lay-1-8",
    tip: "Non-linear killers: |x|, products x₁x₂, added constants. T(0) ≠ 0 is an instant fail.",
  },
  {
    id: "span",
    label: "Span & linear combinations",
    short: "is y in span{v₁,v₂}?",
    priority: "amber",
    weight: 5,
    seenIn: { 2026: "Q2" },
    lessonSlug: "lay-1-3",
    tip: "y ∈ span ⇔ [v₁ v₂ | y] is consistent. Three independent vectors span ℝ³.",
  },
  {
    id: "elem",
    label: "Elementary matrices — identify, invert, find E with EA = B",
    short: "one row-op from I",
    priority: "amber",
    weight: 7,
    seenIn: { 2025: "Q4", 2026: "Q4" },
    lessonSlug: "lay-2-2",
    tip: "Elementary = exactly ONE row op applied to I. Invert by undoing that same op on I.",
  },
  {
    id: "inverse",
    label: "Inverse via Gauss–Jordan + solve Ax = b by A⁻¹",
    short: "[A | I] → [I | A⁻¹]",
    priority: "amber",
    weight: 9,
    seenIn: { 2025: "Q5", 2026: "Q5b, Q6b, Q7" },
    lessonSlug: "lay-2-2",
    tip: "Then x = A⁻¹b — no re-reduction. Triangular matrices invert entry-by-entry.",
  },
  {
    id: "det",
    label: "Determinant via row-ops + properties det(kA), det(A⁻¹), det(Aⁿ)",
    short: "row-ops → triangular → product",
    priority: "amber",
    weight: 7,
    seenIn: { 2025: "Q5c,d", 2026: "Q6a, Q7b" },
    lessonSlug: "determinants-cofactor",
    tip: "Replacement: no change · swap: ×(−1) · scale row by c: ×c. det(kA) = kⁿ det A.",
  },
  {
    id: "invert",
    label: "Invertibility ↔ pivots ↔ nontrivial solutions",
    short: "n pivots ⇔ invertible ⇔ only trivial Ax=0",
    priority: "amber",
    weight: 5,
    seenIn: { 2026: "Q5a" },
    lessonSlug: "lay-2-3",
    tip: "Fewer than n pivots → not invertible → Ax = 0 has nontrivial (free-variable) solutions.",
  },
];

/** Red-first drill order used by the 1-hour plan. */
export const DRILL_ORDER = [
  "rref", "param", "consist", "lindep", "lintrans",
  "span", "elem", "inverse", "det", "invert",
];

/** The 1-hour quick-revision plan (shown on the board). */
export const HOUR_PLAN = [
  { window: "0–20 min", focus: "Core row-reduction", archetypes: ["rref", "param", "consist"] },
  { window: "20–35 min", focus: "Independence & transformations", archetypes: ["lindep", "lintrans"] },
  { window: "35–50 min", focus: "Likely companions", archetypes: ["span", "elem", "inverse", "det", "invert"] },
  { window: "50–60 min", focus: "Full mixed diagnostic → read the per-topic breakdown", archetypes: [] },
];

/** Exam format to train for (latest sitting). */
export const TRAIN_FORMAT = "Latest format (Mar 2026): answer any 6 of 7 · 4 marks each · 2 hours.";
