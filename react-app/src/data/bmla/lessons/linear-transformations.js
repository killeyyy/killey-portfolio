/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "linear-transformations",
  moduleSlug: "transformations",
  title: "Linear Transformations: One-to-One & Onto",
  objective: "By the end you can find the standard matrix of any linear map and test whether it's one-to-one and/or onto.",
  minutes: 16,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "A **linear transformation** is a function that respects addition and scaling: T(u + v) = T(u) + T(v) and T(cu) = cT(u). Every linear map from ℝⁿ to ℝᵐ is secretly a matrix multiplication: **T(x) = Ax**.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Finding the standard matrix (free marks)",
      text: "Feed T the standard basis vectors. **The columns of A are T(e₁), T(e₂), …** — that's the entire technique.",
    },
    { type: "math", tex: "A=\\big[\\,T(\\vec{e}_1)\\;\\;T(\\vec{e}_2)\\;\\cdots\\;T(\\vec{e}_n)\\,\\big]" },
    {
      type: "example",
      title: "Worked example — standard matrix + tests",
      example: {
        prompt: "T(x₁, x₂) = (x₁ + 2x₂, 3x₁ − x₂, x₂). Find A; is T one-to-one? Onto?",
        steps: [
          { tex: "T(\\vec{e}_1)=(1,3,0),\\quad T(\\vec{e}_2)=(2,-1,1)" },
          { tex: "A=\\begin{bmatrix}1&2\\\\3&-1\\\\0&1\\end{bmatrix}\\;\\;(3\\times2:\\;\\mathbb{R}^2\\to\\mathbb{R}^3)" },
          { text: "Row-reduce: pivots in both columns → columns independent → **one-to-one** ✓" },
          { text: "Only 2 pivots for 3 rows → can't hit all of ℝ³ → **not onto** ✗" },
        ],
        answerTex: "\\text{One-to-one: yes.}\\quad\\text{Onto: no.}",
      },
    },
    {
      type: "callout",
      tone: "note",
      title: "The two tests, memorized",
      text: "**One-to-one** ⇔ pivot in **every column** (columns independent ⇔ only the trivial solution to Ax = 0). **Onto** ⇔ pivot in **every row** (columns span ℝᵐ). A square matrix that's either is automatically both — that's the Invertible Matrix Theorem again.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "Shape intuition: a **wide** matrix (more columns than rows) is never one-to-one; a **tall** matrix (more rows than columns) is never onto. State the reason (pivot count), not just the rule.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice — never live coursework answers.",
    },
    { type: "practice", practice: { bankId: "transformations", count: 3 } },
  ],
};
