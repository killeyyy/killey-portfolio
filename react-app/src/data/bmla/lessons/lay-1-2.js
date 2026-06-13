/** @type {import("../curriculum.js").Lesson} */
// Mirrors Lecture 2 (11 Jun) — Row Reduction and Echelon Forms, Lay §1.2.
// Same definitions, the 5-step algorithm, the 3×6 reduce-to-RREF example,
// basic/free variables, Examples 4–5, Theorem 2, and the (a)–(d) consistency
// questions exactly as taught — so practice matches the real quizzes/exam.
export default {
  slug: "lay-1-2",
  moduleSlug: "matrices",
  title: "§1.2 — Row Reduction & Echelon Forms",
  objective:
    "Recognise echelon and reduced echelon form, locate pivot positions and columns, run the five-step row-reduction algorithm (forward + backward phase), describe a solution set with basic and free variables, and use the Existence & Uniqueness Theorem to answer consistency questions.",
  minutes: 26,
  tools: ["rref"],
  blocks: [
    {
      type: "prose",
      text: "§1.1 gave us the row operations; §1.2 turns them into a precise **algorithm**. First, two target shapes. A **leading entry** of a row is its leftmost nonzero entry. A matrix is in **echelon form (REF)** when it forms a staircase — three conditions:",
    },
    {
      type: "callout",
      tone: "note",
      title: "Echelon form (REF) — three conditions",
      text: "**(1)** All nonzero rows are above any rows of all zeros. **(2)** Each leading entry is in a column to the *right* of the leading entry of the row above it. **(3)** All entries in a column *below* a leading entry are zero.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Reduced echelon form (RREF) — two more conditions",
      text: "Add to the three above: **(4)** the leading entry of every nonzero row is **1**, and **(5)** each leading 1 is the *only* nonzero entry in its column. So an RREF has 0's both **below and above** every leading 1.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Theorem 1 — Uniqueness of the Reduced Echelon Form",
      text: "Any nonzero matrix can be row reduced to *more than one* echelon form (depending on your moves), **but** each matrix is row equivalent to **one and only one** reduced echelon matrix. The RREF is unique — the echelon form is not.",
    },
    {
      type: "prose",
      text: "Because the RREF is unique, the leading positions never move. A **pivot position** is a location that holds a leading entry in *any* echelon form (equivalently, a leading 1 in the RREF). A **pivot column** is a column containing a pivot position, and the nonzero number used there to clear the column is a **pivot**. Below, ■ marks pivot positions and * is any value:",
    },
    {
      type: "math",
      tex: "\\left[\\begin{array}{ccccc}\\blacksquare&*&*&*&*\\\\0&\\blacksquare&*&*&*\\\\0&0&0&\\blacksquare&*\\\\0&0&0&0&0\\end{array}\\right]\\qquad\\xrightarrow{\\ \\text{RREF}\\ }\\qquad\\left[\\begin{array}{ccccc}1&0&*&0&*\\\\0&1&*&0&*\\\\0&0&0&1&*\\\\0&0&0&0&0\\end{array}\\right]",
    },
    {
      type: "example",
      title: "Locating pivot columns",
      example: {
        prompt: "Row reduce A to echelon form and locate its pivot columns. (The pivots used are 1, 2 and −5 — note they are not the original entries.)",
        steps: [
          { tex: "A=\\left[\\begin{array}{ccccc}0&-3&-6&4&9\\\\-1&-2&-1&3&1\\\\-2&-3&0&3&-1\\\\1&4&5&-9&-7\\end{array}\\right]" },
          { text: "Swap a nonzero entry to the top of the leftmost column, then clear below; repeat on the submatrix." },
          { tex: "\\sim\\left[\\begin{array}{ccccc}1&4&5&-9&-7\\\\0&2&4&-6&-6\\\\0&0&0&-5&0\\\\0&0&0&0&0\\end{array}\\right]" },
        ],
        answerTex: "\\text{pivot columns: }1,\\;2,\\;4",
      },
    },
    {
      type: "callout",
      tone: "note",
      title: "The five-step row-reduction algorithm",
      text: "**Forward phase (→ echelon form):** **1.** Select the pivot column (leftmost nonzero column). **2.** Choose a nonzero pivot in it (interchange rows if needed). **3.** Use replacement to create zeros in all positions below the pivot. **4.** Ignore the pivot row and repeat steps 1–3 on the remaining submatrix. **Backward phase (→ RREF):** **5.** Starting from the rightmost pivot and working up/left, create zeros above each pivot; scale each pivot to 1.",
    },
    {
      type: "example",
      title: "Worked example — all the way to RREF",
      example: {
        prompt: "Reduce the matrix to echelon form, then to reduced echelon form.",
        steps: [
          { tex: "\\left[\\begin{array}{ccccc|c}0&3&-6&6&4&-5\\\\3&-7&8&-5&8&9\\\\3&-9&12&-9&6&15\\end{array}\\right]" },
          { text: "Forward phase — swap to get a pivot, clear below, repeat. This reaches an echelon form:" },
          { tex: "\\sim\\left[\\begin{array}{ccccc|c}3&-9&12&-9&6&15\\\\0&2&-4&4&2&-6\\\\0&0&0&0&1&4\\end{array}\\right]" },
          { text: "Backward phase — clear above each pivot (right to left) and scale pivots to 1:" },
        ],
        answerTex: "\\left[\\begin{array}{ccccc|c}1&0&-2&3&0&-24\\\\0&1&-2&2&0&-7\\\\0&0&0&0&1&4\\end{array}\\right]",
      },
    },
    {
      type: "prose",
      text: "Now read the answer off the RREF. Variables sitting in **pivot columns** are **basic variables**; the rest are **free variables**. Solve each equation for its basic variable in terms of the free ones — that is the **general (parametric) solution**.",
    },
    {
      type: "example",
      title: "General solution & specific solutions",
      example: {
        prompt: "An augmented matrix reduces to the RREF below. Describe all solutions, then read off two specific ones.",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&0&-5&1\\\\0&1&\\ \\ 1&4\\\\0&0&\\ \\ 0&0\\end{array}\\right]\\;\\Longrightarrow\\;\\begin{aligned}x_1-5x_3&=1\\\\x_2+x_3&=4\\\\0&=0\\end{aligned}" },
          { text: "Pivot columns 1, 2 → x₁, x₂ are basic; column 3 has no pivot → x₃ is free." },
          { text: "Solve for the basic variables: x₁ = 1 + 5x₃, x₂ = 4 − x₃, x₃ free. (Third equation 0 = 0 adds no restriction.)" },
          { text: "Choose x₃ = 0 → (1, 4, 0); choose x₃ = 1 → (6, 3, 1). Each choice of the free variable gives one solution." },
        ],
        answerTex: "x_1=1+5x_3,\\quad x_2=4-x_3,\\quad x_3\\ \\text{free}\\;\\Rightarrow\\;\\text{infinitely many}",
      },
    },
    {
      type: "example",
      title: "Example 4 — two free variables",
      example: {
        prompt: "Find the general solution of the system whose augmented matrix is in echelon form below.",
        steps: [
          { tex: "\\left[\\begin{array}{ccccc|c}1&6&2&-5&-2&-4\\\\0&0&2&-8&-1&3\\\\0&0&0&0&1&7\\end{array}\\right]\\;\\sim\\;\\left[\\begin{array}{ccccc|c}1&6&0&3&0&0\\\\0&0&1&-4&0&5\\\\0&0&0&0&1&7\\end{array}\\right]" },
          { text: "Pivot columns 1, 3, 5 → x₁, x₃, x₅ basic; x₂ and x₄ are free." },
          { text: "Corresponding system: x₁ + 6x₂ + 3x₄ = 0, x₃ − 4x₄ = 5, x₅ = 7." },
        ],
        answerTex: "x_1=-6x_2-3x_4,\\ \\ x_2\\ \\text{free},\\ \\ x_3=5+4x_4,\\ \\ x_4\\ \\text{free},\\ \\ x_5=7",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Parametric descriptions — and the convention",
      text: "The free variables act as **parameters** — solving a system means finding a parametric description of its solution set (or showing the set is empty). A consistent system with free variables has *many* parametric descriptions; by convention we always use the **free variables** as the parameters. Back-substitution from an echelon form also works, but reducing fully to RREF is the safer hand method.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Theorem 2 — Existence & Uniqueness",
      text: "A linear system is **consistent** ⇔ the rightmost (augmented) column is **not** a pivot column — i.e. no echelon row of the form [0 … 0 | b] with b ≠ 0. If consistent, the solution is **unique** when there are **no free variables**, and there are **infinitely many** solutions when there is **at least one** free variable.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "A pivot in the **last** column of an augmented matrix is fatal: it encodes 0 = nonzero, so the system is **inconsistent**. Always check that column before describing a solution.",
    },
    {
      type: "prose",
      text: "Lecture wrap-up — consistency questions worth internalising. The most a matrix can have is **one pivot per row and per column**, so the number of pivots ≤ min(rows, cols): a 4×6 *or* a 6×4 matrix has at most **4** pivots. A **consistent** system of 3 equations in 4 unknowns must have a free variable (4 unknowns, at most 3 pivots), so it has **infinitely many** solutions. And if a 4×6 coefficient matrix has 3 pivot columns but the system is **inconsistent**, the augmented matrix gains a pivot in its last column — **4** pivot columns in total.",
    },
    {
      type: "prose",
      text: "Drill the staircase in the solver until it's automatic — every later topic (inverses, eigenvectors, Markov, Simplex) bottoms out in row reduction. Then test yourself on the lecture's own examples below.",
    },
    { type: "practice", practice: { topic: "lec2", count: 6 } },
  ],
};
