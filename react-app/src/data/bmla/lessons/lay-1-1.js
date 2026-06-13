/** @type {import("../curriculum.js").Lesson} */
// Mirrors Lecture 1 (09 Jun) — Systems of Linear Equations, Lay §1.1.
// Structured (headings), visual (figure), and interactive (progressive
// examples + checkpoints) — grounded in the lecture's own examples/numbers.
export default {
  slug: "lay-1-1",
  moduleSlug: "matrices",
  title: "§1.1 — Systems of Linear Equations",
  objective:
    "Recognise a linear equation and a linear system, picture the three possible outcomes, record a system as an augmented matrix, solve it with the three elementary row operations, and answer the two fundamental questions — existence and uniqueness.",
  minutes: 24,
  tools: ["rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.1 · Part 1", title: "What is a linear equation?" },
    {
      type: "definition",
      term: "Linear equation",
      text: "An equation in x₁, …, xₙ that can be written in the form below, where the coefficients a₁, …, aₙ and the constant b are real numbers. Every variable appears only to the **first power** — no x², no product xᵢxⱼ, no √x, no sin x.",
      tex: "a_1x_1+a_2x_2+\\dots+a_nx_n=b",
    },
    {
      type: "prose",
      text: "Sometimes an equation only *looks* nonlinear until you rearrange it. Both of these are linear — the second even has the irrational constant 2√6, which is fine (a constant can be any real number):",
    },
    {
      type: "math",
      tex: "4x_1-5x_2+2=x_1\\;\\Longrightarrow\\;3x_1-5x_2=-2\\qquad x_2=2(\\sqrt{6}-x_1)+x_3\\;\\Longrightarrow\\;2x_1+x_2-x_3=2\\sqrt{6}",
    },
    {
      type: "prose",
      text: "These two are **not** linear — the first because of the product x₁x₂, the second because of the root √x₁:",
    },
    { type: "math", tex: "4x_1-5x_2=x_1x_2\\qquad\\qquad x_2=2\\sqrt{x_1}-6" },
    {
      type: "checkpoint",
      q: "Which of these is a linear equation?",
      options: ["x₁x₂ = 4", "2x₁ − x₂ = 7", "√x₁ + x₂ = 1", "x₁² = 9"],
      correctIndex: 1,
      hint: "Scan each one for a product of variables, a root, or a power.",
      explanation: "Variables appear only to the first power — no products, roots or powers. (An irrational *constant* would still be fine.)",
    },

    { type: "heading", eyebrow: "Section 1.1 · Part 2", title: "Systems, solutions & the solution set" },
    {
      type: "definition",
      term: "System of linear equations (linear system)",
      text: "A collection of one or more linear equations in the same variables x₁, …, xₙ.",
    },
    {
      type: "definition",
      term: "Solution & solution set",
      text: "A **solution** is a list (s₁, …, sₙ) that makes *every* equation true at once. The **solution set** is the set of all solutions; two systems are **equivalent** when they share the same solution set.",
    },
    {
      type: "example",
      title: "Checking a proposed solution",
      example: {
        prompt: "Show that (5, 6.5, 3) is a solution of the system below — substitute and confirm LHS = RHS in both equations.",
        steps: [
          { tex: "2x_1-x_2+1.5x_3=8\\qquad x_1-4x_3=-7" },
          { tex: "2(5)-(6.5)+1.5(3)=10-6.5+4.5=8\\;\\checkmark" },
          { tex: "(5)-4(3)=5-12=-7\\;\\checkmark" },
        ],
        answerTex: "(5,\\,6.5,\\,3)\\ \\text{satisfies both equations, so it is a solution.}",
      },
    },

    { type: "heading", eyebrow: "Section 1.1 · Part 3", title: "Three possible outcomes" },
    {
      type: "prose",
      text: "Start with the simplest case: **two equations in two variables**. Each equation is a line in the plane, so solving means finding where the two lines meet — and there are exactly three things two lines can do:",
    },
    { type: "figure", name: "three-outcomes", caption: "Two lines either cross once, run parallel, or coincide — the only three outcomes any linear system can have." },
    {
      type: "example",
      title: "Three two-line systems, three outcomes",
      example: {
        prompt: "Solve each system graphically and read off how many solutions it has.",
        steps: [
          { text: "**Cross once → one solution.** x₁ + x₂ = 10 and −x₁ + x₂ = 0 meet at a single point." },
          { tex: "x_1+x_2=10,\\ \\ -x_1+x_2=0\\;\\Longrightarrow\\;\\{(5,5)\\}" },
          { text: "**Parallel → no solution.** x₁ − 2x₂ = −3 and 2x₁ − 4x₂ = 8 share a slope but never meet (left sides are multiples, right sides are not)." },
          { text: "**Same line → infinitely many.** x₁ + x₂ = 3 and −2x₁ − 2x₂ = −6 are the *same* line (one is −2× the other)." },
        ],
        answerTex: "\\text{unique}\\;\\;|\\;\\;\\text{none}\\;\\;|\\;\\;\\text{infinitely many}",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Basic fact — only three possibilities, always",
      text: "A linear system has **(1)** no solution, **(2)** exactly one solution, or **(3)** infinitely many — never two, never seven. This holds for *every* linear system. A system with at least one solution is **consistent**; with none, **inconsistent**.",
    },
    {
      type: "checkpoint",
      q: "Two lines have the same slope but different intercepts. The system has…",
      options: ["one solution", "no solution", "infinitely many solutions", "exactly two solutions"],
      correctIndex: 1,
      explanation: "Same slope, different intercept ⇒ parallel lines that never meet ⇒ inconsistent.",
    },

    { type: "heading", eyebrow: "Section 1.1 · Part 4", title: "Matrix notation & row operations" },
    {
      type: "prose",
      text: "For bigger systems we record everything compactly. The **coefficient matrix** holds the aᵢⱼ; the **augmented matrix** appends the right-hand constants as a final column (the bar). Its size is m × n — rows first; the one below is 3 × 4.",
    },
    {
      type: "math",
      tex: "\\begin{aligned}x_1-2x_2+x_3&=0\\\\2x_2-8x_3&=8\\\\-4x_1+5x_2+9x_3&=-9\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&2&-8&8\\\\-4&5&9&-9\\end{array}\\right]",
    },
    {
      type: "callout",
      tone: "note",
      title: "The three elementary row operations",
      text: "**Replacement** — replace a row by the sum of itself and a multiple of another (Rᵢ → Rᵢ + k·Rⱼ). **Interchange** — swap two rows (Rᵢ ↔ Rⱼ). **Scaling** — multiply a row by a nonzero constant (Rᵢ → k·Rᵢ, k ≠ 0). Each is reversible, so the new matrix is **row equivalent** to the old — and row-equivalent augmented matrices have the *same solution set*.",
    },
    {
      type: "example",
      title: "Warm-up in matrix notation",
      example: {
        prompt: "Solve the 2×2 system, watching it pass through triangular then diagonal form.",
        steps: [
          { tex: "\\begin{aligned}x_1-2x_2&=-1\\\\-x_1+3x_2&=3\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{cc|c}1&-2&-1\\\\-1&3&3\\end{array}\\right]" },
          { text: "Add row 1 to row 2 (R₂ → R₂ + R₁) — *triangular* form; the second row already reads x₂ = 2." },
          { tex: "\\left[\\begin{array}{cc|c}1&-2&-1\\\\0&1&2\\end{array}\\right]" },
          { text: "Add 2 times row 2 to row 1 (R₁ → R₁ + 2R₂) — now *diagonal* form; read both answers straight off." },
          { tex: "\\left[\\begin{array}{cc|c}1&0&3\\\\0&1&2\\end{array}\\right]" },
        ],
        answerTex: "x_1=3,\\quad x_2=2",
      },
    },
    {
      type: "example",
      title: "Worked example — full row elimination",
      example: {
        prompt: "Solve the 3×3 system above by row reduction, then verify the answer.",
        steps: [
          { text: "Keep x₁ in row 1, clear it from row 3: R₃ → R₃ + 4R₁, giving −3x₂ + 13x₃ = −9." },
          { tex: "\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&2&-8&8\\\\0&-3&13&-9\\end{array}\\right]" },
          { text: "Scale row 2 to a leading 1: R₂ → ½R₂, giving x₂ − 4x₃ = 4." },
          { text: "Clear x₂ from row 3: R₃ → R₃ + 3R₂, giving x₃ = 3 — triangular form." },
          { tex: "\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&1&-4&4\\\\0&0&1&3\\end{array}\\right]" },
          { text: "Back-substitute upward to diagonal form: x₂ = 16, then x₁ = 29." },
          { text: "Check (29, 16, 3): 29 − 2(16) + 3 = 0, 2(16) − 8(3) = 8, −4(29) + 5(16) + 9(3) = −9. ✓" },
        ],
        answerTex: "x_1=29,\\quad x_2=16,\\quad x_3=3",
      },
    },

    {
      type: "checkpoint",
      variant: "tryit",
      q: "Solve the system x₁ + x₂ = 5 and x₁ − x₂ = 1. What is x₁?",
      options: ["x₁ = 3", "x₁ = 2", "x₁ = 1", "x₁ = 5"],
      correctIndex: 0,
      hint: "Add the two equations to eliminate x₂.",
      explanation: "Adding gives 2x₁ = 6, so x₁ = 3 (and x₂ = 2).",
    },

    { type: "heading", eyebrow: "Section 1.1 · Part 5", title: "Existence & uniqueness" },
    {
      type: "callout",
      tone: "tip",
      title: "The two fundamental questions",
      text: "Everything in this chapter answers two questions. **Existence:** is the system consistent — does a solution exist? **Uniqueness:** if it exists, is it the only one? A triangular form with a leading entry in *every* variable column means **consistent with a unique solution**.",
    },
    {
      type: "prose",
      text: "Inconsistency shows itself as a contradiction row. Reduce the system below and the bottom row becomes 0 = 5⁄2 — impossible — so there is **no solution**.",
    },
    {
      type: "math",
      tex: "\\begin{aligned}x_2-4x_3&=8\\\\2x_1-3x_2+2x_3&=1\\\\5x_1-8x_2+7x_3&=1\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{ccc|c}2&-3&2&1\\\\0&1&-4&8\\\\0&0&0&\\tfrac{5}{2}\\end{array}\\right]\\;\\Longrightarrow\\;0=\\tfrac{5}{2}",
    },
    {
      type: "example",
      title: "Existence as a condition on a parameter",
      example: {
        prompt: "For what value of h is the system consistent?",
        steps: [
          { tex: "\\begin{aligned}3x_1-9x_2&=4\\\\-2x_1+6x_2&=h\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{cc|c}3&-9&4\\\\-2&6&h\\end{array}\\right]" },
          { text: "Scale row 1 (R₁ → ⅓R₁), then clear column 1 (R₂ → R₂ + 2R₁)." },
          { tex: "\\left[\\begin{array}{cc|c}1&-3&\\tfrac{4}{3}\\\\0&0&\\,h+\\tfrac{8}{3}\\end{array}\\right]\\;\\Longrightarrow\\;0=h+\\tfrac{8}{3}" },
        ],
        answerTex: "h=-\\tfrac{8}{3}",
      },
    },
    {
      type: "checkpoint",
      q: "After row reduction a system gives the row [0 0 0 | 4]. The system is…",
      options: ["consistent, unique", "inconsistent (no solution)", "consistent, infinitely many", "in diagonal form"],
      correctIndex: 1,
      explanation: "That row reads 0 = 4 — impossible — so the system has no solution.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    {
      type: "prose",
      text: "Use the **interactive solver** to step through any augmented matrix, then test yourself on the lecture's own examples below.",
    },
    { type: "practice", practice: { topic: "lec1", count: 6 } },
  ],
};
