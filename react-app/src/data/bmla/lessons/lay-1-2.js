/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-1-2",
  moduleSlug: "matrices",
  title: "§1.2 — Row Reduction & Echelon Forms",
  objective:
    "Recognise echelon and reduced echelon form, locate pivot positions, run the row-reduction algorithm, and describe solution sets using basic and free variables.",
  minutes: 24,
  tools: ["rref"],
  blocks: [
    {
      type: "prose",
      text: "Row operations are the *engine*; echelon form is the *destination*. A matrix is in **echelon form (REF)** when it has a staircase shape:",
    },
    {
      type: "callout",
      tone: "note",
      title: "Echelon form — three conditions",
      text: "**(1)** All nonzero rows sit above any all-zero rows. **(2)** Each row's leading entry (first nonzero, the **leading entry**) is in a column to the right of the leading entry of the row above. **(3)** All entries below a leading entry are zero.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Reduced echelon form — two more",
      text: "**Reduced** echelon form (**RREF**) adds: **(4)** every leading entry is **1**, and **(5)** each leading 1 is the *only* nonzero entry in its column. Crucial fact: **the RREF of a matrix is unique** — echelon forms vary with your moves, but everyone lands on the same reduced form.",
    },
    {
      type: "prose",
      text: "A **pivot position** is a location that holds a leading 1 in the RREF; the column containing it is a **pivot column**. The number that ends up there during reduction is the **pivot**.",
    },
    {
      type: "math",
      tex: "\\left[\\begin{array}{cccc}\\boxed{1}&0&*&0\\\\0&\\boxed{1}&*&0\\\\0&0&0&\\boxed{1}\\end{array}\\right]\\quad\\text{pivot columns: 1, 2, 4}",
    },
    {
      type: "prose",
      text: "**The row-reduction algorithm** has two phases. *Forward* (to echelon form): pick the leftmost nonzero column, make a pivot there (swap if needed), and create zeros below it; cover that row and repeat. *Backward*: starting from the rightmost pivot, scale each pivot to 1 and clear the entries **above** it. The result is the unique RREF.",
    },
    {
      type: "prose",
      text: "Now read the solution. Variables tied to pivot columns are **basic variables**; the rest are **free variables**. Solve each equation for its basic variable in terms of the free ones — that's the **parametric description** of the solution set.",
    },
    {
      type: "example",
      title: "Worked example — a free variable",
      example: {
        prompt: "Suppose row reduction gives the RREF below. Describe all solutions.",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&0&-5&1\\\\0&1&\\ \\ 1&4\\\\0&0&\\ \\ 0&0\\end{array}\\right]" },
          { text: "Pivot columns 1, 2 → x₁, x₂ basic; column 3 has no pivot → x₃ is free." },
          { text: "Row 1: x₁ = 1 + 5x₃.  Row 2: x₂ = 4 − x₃.  x₃ = x₃ (free)." },
        ],
        answerTex: "\\begin{bmatrix}x_1\\\\x_2\\\\x_3\\end{bmatrix}=\\begin{bmatrix}1\\\\4\\\\0\\end{bmatrix}+x_3\\begin{bmatrix}5\\\\-1\\\\1\\end{bmatrix},\\;\\;x_3\\in\\mathbb{R}\\;\\Rightarrow\\;\\text{infinitely many}",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Existence & Uniqueness Theorem",
      text: "A system is **consistent** ⇔ the rightmost (augmented) column is **not** a pivot column — i.e. no row of the form [0 … 0 | b] with b ≠ 0. If consistent, the solution is **unique** when there are **no free variables**, and there are **infinitely many** solutions when at least one free variable exists.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "A pivot in the **last** column of an augmented matrix is the death sentence: it encodes 0 = nonzero, so the system is **inconsistent**. Always check that column before declaring a solution.",
    },
    {
      type: "prose",
      text: "Practise the mechanics in the solver below until the staircase is automatic — speed here pays off in every later topic (inverses, eigenvectors, Markov, Simplex all reduce to row reduction).",
    },
  ],
};
