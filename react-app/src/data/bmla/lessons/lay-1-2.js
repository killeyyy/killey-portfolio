/** @type {import("../curriculum.js").Lesson} */
// Mirrors Lecture 2 (11 Jun) — Row Reduction and Echelon Forms, Lay §1.2.
// Structured + visual (echelon figure) + interactive (progressive examples,
// checkpoints), grounded in the lecture's own examples.
export default {
  slug: "lay-1-2",
  moduleSlug: "matrices",
  title: "§1.2 — Row Reduction & Echelon Forms",
  objective:
    "Recognise echelon and reduced echelon form, locate pivot positions and columns, run the five-step row-reduction algorithm, describe a solution set with basic and free variables, and use the Existence & Uniqueness Theorem.",
  minutes: 26,
  tools: ["rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.2 · Part 1", title: "Echelon forms" },
    {
      type: "prose",
      text: "§1.1 gave us the row operations; §1.2 turns them into a precise **algorithm** with two target shapes. A **leading entry** of a row is its leftmost nonzero entry.",
    },
    {
      type: "definition",
      term: "Echelon form (REF) — three conditions",
      text: "**(1)** All nonzero rows are above any rows of all zeros. **(2)** Each leading entry is in a column to the *right* of the leading entry of the row above it. **(3)** All entries in a column *below* a leading entry are zero.",
    },
    {
      type: "definition",
      term: "Reduced echelon form (RREF) — two more conditions",
      text: "Add to the three above: **(4)** the leading entry of every nonzero row is **1**, and **(5)** each leading 1 is the *only* nonzero entry in its column. So an RREF has 0's both *below and above* every leading 1.",
    },
    { type: "figure", name: "echelon-stairs", caption: "The leading entries form a staircase down and to the right; everything below them is zero." },
    {
      type: "theorem",
      name: "1 · Uniqueness of the RREF",
      text: "A matrix can be row reduced to *more than one* echelon form (depending on your moves), **but** it is row equivalent to **one and only one** reduced echelon matrix. The RREF is unique — the echelon form is not.",
    },
    {
      type: "checkpoint",
      q: "Which condition is required for *reduced* echelon form but NOT for plain echelon form?",
      options: ["Nonzero rows sit above zero rows", "Leading entries step to the right", "Each leading entry is 1 and the only nonzero in its column", "Zeros below each leading entry"],
      correctIndex: 2,
      hint: "Plain echelon form doesn't require the leading entries to be 1.",
      explanation: "Conditions (4) and (5) — leading 1's with zeros above and below — are what make it *reduced*.",
    },

    { type: "heading", eyebrow: "Section 1.2 · Part 2", title: "Pivots & the algorithm" },
    {
      type: "prose",
      text: "Because the RREF is unique, the leading positions never move. A **pivot position** holds a leading entry in any echelon form (a leading 1 in the RREF); a **pivot column** contains one; the nonzero number used there to clear the column is a **pivot**. Below, ■ marks pivot positions and * is any value:",
    },
    {
      type: "math",
      tex: "\\left[\\begin{array}{ccccc}\\blacksquare&*&*&*&*\\\\0&\\blacksquare&*&*&*\\\\0&0&0&\\blacksquare&*\\\\0&0&0&0&0\\end{array}\\right]\\qquad\\xrightarrow{\\ \\text{RREF}\\ }\\qquad\\left[\\begin{array}{ccccc}1&0&*&0&*\\\\0&1&*&0&*\\\\0&0&0&1&*\\\\0&0&0&0&0\\end{array}\\right]",
    },
    {
      type: "callout",
      tone: "note",
      title: "The five-step row-reduction algorithm",
      text: "**Forward phase (→ echelon):** **1.** pick the pivot column (leftmost nonzero). **2.** choose a nonzero pivot (interchange rows if needed). **3.** create zeros below the pivot. **4.** cover the pivot row and repeat on the submatrix. **Backward phase (→ RREF):** **5.** from the rightmost pivot, clear above each pivot and scale it to 1.",
    },
    {
      type: "example",
      title: "Locating pivot columns",
      example: {
        prompt: "Row reduce A to echelon form and find its pivot columns. (The pivots used are 1, 2 and −5.)",
        steps: [
          { tex: "A=\\left[\\begin{array}{ccccc}0&-3&-6&4&9\\\\-1&-2&-1&3&1\\\\-2&-3&0&3&-1\\\\1&4&5&-9&-7\\end{array}\\right]" },
          { text: "Swap a nonzero entry to the top of the leftmost column, clear below, repeat on the submatrix:" },
          { tex: "\\sim\\left[\\begin{array}{ccccc}1&4&5&-9&-7\\\\0&2&4&-6&-6\\\\0&0&0&-5&0\\\\0&0&0&0&0\\end{array}\\right]" },
        ],
        answerTex: "\\text{pivot columns: }1,\\;2,\\;4",
      },
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
      type: "checkpoint",
      variant: "tryit",
      q: "A 3×5 augmented matrix is in echelon form with pivots in columns 1, 2 and 4. How many free variables does the system have?",
      options: ["0", "1", "2", "3"],
      correctIndex: 1,
      hint: "There are 4 variable columns (the 5th is the constant); count the ones with no pivot.",
      explanation: "Variables sit in columns 1–4; pivots fill 3 of them, leaving column 3 free → 1 free variable.",
    },

    { type: "heading", eyebrow: "Section 1.2 · Part 3", title: "Reading the solution" },
    {
      type: "definition",
      term: "Basic vs free variables",
      text: "Variables in **pivot columns** are **basic**; the rest are **free**. Solve each basic variable in terms of the free ones to get the **general (parametric) solution**.",
    },
    {
      type: "example",
      title: "General solution & specific solutions",
      example: {
        prompt: "An augmented matrix reduces to the RREF below. Describe all solutions, then read off two specific ones.",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&0&-5&1\\\\0&1&\\ \\ 1&4\\\\0&0&\\ \\ 0&0\\end{array}\\right]\\;\\Longrightarrow\\;\\begin{aligned}x_1-5x_3&=1\\\\x_2+x_3&=4\\\\0&=0\\end{aligned}" },
          { text: "Pivot columns 1, 2 → x₁, x₂ basic; column 3 has no pivot → x₃ is free." },
          { text: "Solve the basic variables: x₁ = 1 + 5x₃, x₂ = 4 − x₃, x₃ free." },
          { text: "Choose x₃ = 0 → (1, 4, 0); choose x₃ = 1 → (6, 3, 1)." },
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
          { text: "System: x₁ + 6x₂ + 3x₄ = 0, x₃ − 4x₄ = 5, x₅ = 7." },
        ],
        answerTex: "x_1=-6x_2-3x_4,\\ \\ x_2\\ \\text{free},\\ \\ x_3=5+4x_4,\\ \\ x_4\\ \\text{free},\\ \\ x_5=7",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Parametric descriptions — and the convention",
      text: "The free variables act as **parameters**. A consistent system with free variables has *many* parametric descriptions; by convention we always use the **free variables** as the parameters. Reducing fully to RREF is the safer hand method (vs back-substitution).",
    },
    {
      type: "checkpoint",
      q: "A consistent system has at least one free variable. How many solutions does it have?",
      options: ["exactly one", "none", "infinitely many", "exactly two"],
      correctIndex: 2,
      explanation: "Each value of the free variable gives a different solution → infinitely many.",
    },

    { type: "heading", eyebrow: "Section 1.2 · Part 4", title: "Existence & uniqueness" },
    {
      type: "theorem",
      name: "2 · Existence & Uniqueness",
      text: "A system is **consistent** ⇔ the rightmost column is **not** a pivot column (no echelon row [0 … 0 | b] with b ≠ 0). If consistent: **unique** when there are no free variables, **infinitely many** when there is at least one free variable.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "A pivot in the **last** column of an augmented matrix is fatal: it encodes 0 = nonzero, so the system is **inconsistent**. Always check that column before describing a solution.",
    },
    {
      type: "prose",
      text: "Consistency questions worth internalising: a matrix has at most **one pivot per row and per column**, so #pivots ≤ min(rows, cols) — a 4×6 *or* 6×4 matrix has at most **4**. A consistent 3-equation, 4-unknown system must have a free variable → **infinitely many** solutions. And a 4×6 coefficient matrix with 3 pivot columns whose system is **inconsistent** gains a pivot in its last column → **4** pivot columns total.",
    },
    {
      type: "checkpoint",
      q: "What is the largest possible number of pivots in a 4 × 6 matrix?",
      options: ["4", "6", "10", "24"],
      correctIndex: 0,
      explanation: "At most one pivot per row and per column → min(4, 6) = 4.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    {
      type: "prose",
      text: "Drill the staircase in the solver until it's automatic — every later topic reduces to row reduction. Then test yourself on the lecture's own examples.",
    },
    { type: "practice", practice: { topic: "lec2", count: 6 } },
  ],
};
