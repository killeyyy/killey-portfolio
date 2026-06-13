/** @type {import("../curriculum.js").Lesson} */
// Mirrors Lecture 1 (09 Jun) — Systems of Linear Equations, Lay §1.1.
// Same definitions, notation, examples and numbers used in class, so practice
// here lines up with the real quizzes and exam.
export default {
  slug: "lay-1-1",
  moduleSlug: "matrices",
  title: "§1.1 — Systems of Linear Equations",
  objective:
    "Recognise a linear equation and a linear system, picture the three possible outcomes (unique / none / infinitely many), record a system as a coefficient and augmented matrix, solve it with the three elementary row operations, and answer the two fundamental questions — existence and uniqueness.",
  minutes: 24,
  tools: ["rref"],
  blocks: [
    {
      type: "prose",
      text: "A **linear equation** in the variables x₁, x₂, …, xₙ is any equation that can be written in the form below, where the **coefficients** a₁, …, aₙ and the **constant term** b are real (or complex) numbers. The defining feature: every variable appears only to the **first power** — no x², no product xᵢxⱼ, no √x, no sin x.",
    },
    { type: "math", tex: "a_1x_1+a_2x_2+\\dots+a_nx_n=b" },
    {
      type: "prose",
      text: "Sometimes an equation only *looks* nonlinear until you rearrange it. Both of these are linear — the second has the irrational constant 2√6, which is fine, because a constant is allowed to be any real number:",
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
      type: "prose",
      text: "A **system of linear equations** (a *linear system*) is a collection of one or more linear equations in the same variables. A **solution** is a list (s₁, …, sₙ) that makes *every* equation true at once when substituted for x₁, …, xₙ. The **solution set** is the set of all such solutions, and two systems are **equivalent** when they have the *same* solution set.",
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
    {
      type: "prose",
      text: "Start with the simplest case: **two equations in two variables**. Each equation is a line in the plane (2-space), so solving the system means finding where the two lines meet. There are exactly three things two lines can do — and they map onto the only three things a linear system can do.",
    },
    {
      type: "example",
      title: "Three two-line systems, three outcomes",
      example: {
        prompt: "Solve each system graphically and read off how many solutions it has.",
        steps: [
          { text: "**Cross once → one (unique) solution.** The lines x₁ + x₂ = 10 and −x₁ + x₂ = 0 intersect at a single point." },
          { tex: "x_1+x_2=10,\\ \\ -x_1+x_2=0\\;\\Longrightarrow\\;\\{(5,5)\\}" },
          { text: "**Parallel → no solution.** x₁ − 2x₂ = −3 and 2x₁ − 4x₂ = 8 have the same slope but never meet (the left sides are multiples, the right sides are not)." },
          { text: "**Same line → infinitely many solutions.** x₁ + x₂ = 3 and −2x₁ − 2x₂ = −6 are the *same* line (one is −2 times the other), so every point on it is a solution." },
        ],
        answerTex: "\\text{unique}\\;\\;|\\;\\;\\text{none}\\;\\;|\\;\\;\\text{infinitely many}",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Basic fact — only three possibilities, always",
      text: "A system of linear equations has **(1)** no solution, **(2)** exactly one solution, or **(3)** infinitely many solutions — never two, never seven. This holds for *every* linear system, not just two-by-two ones. A system with at least one solution is **consistent**; a system with none is **inconsistent**. Rule of thumb for two-by-two: equations not multiples of each other → unique; left sides multiples but right sides not → none; whole equations multiples of each other → infinitely many.",
    },
    {
      type: "prose",
      text: "For bigger systems we record everything compactly in a **matrix**. The **coefficient matrix** holds the aᵢⱼ; the **augmented matrix** appends the right-hand constants as a final column (the bar). The size of a matrix is m × n — m rows, n columns, rows always first; the augmented matrix below is 3 × 4.",
    },
    {
      type: "math",
      tex: "\\begin{aligned}x_1-2x_2+x_3&=0\\\\2x_2-8x_3&=8\\\\-4x_1+5x_2+9x_3&=-9\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&2&-8&8\\\\-4&5&9&-9\\end{array}\\right]",
    },
    {
      type: "prose",
      text: "To solve, we replace the system with a simpler **equivalent** one using three reversible moves on the equations: add a multiple of one equation to another, interchange two equations, or multiply an equation by a nonzero constant. On the augmented matrix these are exactly the **elementary row operations**.",
    },
    {
      type: "callout",
      tone: "note",
      title: "The three elementary row operations",
      text: "**Replacement** — replace a row by the sum of itself and a multiple of another (Rᵢ → Rᵢ + k·Rⱼ). **Interchange** — swap two rows (Rᵢ ↔ Rⱼ). **Scaling** — multiply every entry of a row by a nonzero constant (Rᵢ → k·Rᵢ, k ≠ 0). Each is reversible, so the new matrix is **row equivalent** to the old — and row-equivalent augmented matrices have the *same solution set*.",
    },
    {
      type: "example",
      title: "Warm-up in matrix notation",
      example: {
        prompt: "Solve the 2×2 system, watching the matrix pass through triangular then diagonal form.",
        steps: [
          { tex: "\\begin{aligned}x_1-2x_2&=-1\\\\-x_1+3x_2&=3\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{cc|c}1&-2&-1\\\\-1&3&3\\end{array}\\right]" },
          { text: "Add row 1 to row 2 (R₂ → R₂ + R₁) — this is *triangular* form, and the second row already reads x₂ = 2." },
          { tex: "\\left[\\begin{array}{cc|c}1&-2&-1\\\\0&1&2\\end{array}\\right]" },
          { text: "Add 2 times row 2 to row 1 (R₁ → R₁ + 2R₂) — now *diagonal* form, and you read both answers straight off." },
          { tex: "\\left[\\begin{array}{cc|c}1&0&3\\\\0&1&2\\end{array}\\right]" },
        ],
        answerTex: "x_1=3,\\quad x_2=2",
      },
    },
    {
      type: "example",
      title: "Worked example — full row elimination",
      example: {
        prompt: "Solve the 3×3 system from above by row reduction, then verify the answer.",
        steps: [
          { text: "Keep x₁ in row 1 and clear it from row 3: R₃ → R₃ + 4R₁, giving −3x₂ + 13x₃ = −9." },
          { tex: "\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&2&-8&8\\\\0&-3&13&-9\\end{array}\\right]" },
          { text: "Scale row 2 to make its leading coefficient 1: R₂ → ½R₂, giving x₂ − 4x₃ = 4." },
          { text: "Clear x₂ from row 3: R₃ → R₃ + 3R₂, giving x₃ = 3 — the matrix is now in triangular form." },
          { tex: "\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&1&-4&4\\\\0&0&1&3\\end{array}\\right]" },
          { text: "Back-substitute (or keep eliminating upward) to reach diagonal form: x₂ = 16, then x₁ = 29." },
          { tex: "\\left[\\begin{array}{ccc|c}1&0&0&29\\\\0&1&0&16\\\\0&0&1&3\\end{array}\\right]" },
          { text: "Check by substituting (29, 16, 3): 29 − 2(16) + 3 = 0, 2(16) − 8(3) = 8, −4(29) + 5(16) + 9(3) = −9. All three agree." },
        ],
        answerTex: "x_1=29,\\quad x_2=16,\\quad x_3=3",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "The two fundamental questions",
      text: "Every result in this chapter is built to answer two questions about a linear system. **Existence:** is the system consistent — does at least one solution exist? **Uniqueness:** if a solution exists, is it the only one? Reaching a triangular form with a leading entry in *every* variable column (like the example above) means the system is **consistent with a unique solution**.",
    },
    {
      type: "prose",
      text: "Inconsistency shows itself as a contradiction row. Reduce the system below and the bottom row becomes 0 = 5⁄2 — impossible — so the system has **no solution**.",
    },
    {
      type: "math",
      tex: "\\begin{aligned}x_2-4x_3&=8\\\\2x_1-3x_2+2x_3&=1\\\\5x_1-8x_2+7x_3&=1\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{ccc|c}2&-3&2&1\\\\0&1&-4&8\\\\0&0&0&\\tfrac{5}{2}\\end{array}\\right]\\;\\Longrightarrow\\;0=\\tfrac{5}{2}\\ \\text{(inconsistent)}",
    },
    {
      type: "example",
      title: "Existence as a condition on a parameter",
      example: {
        prompt: "For what value of h is the system consistent?",
        steps: [
          { tex: "\\begin{aligned}3x_1-9x_2&=4\\\\-2x_1+6x_2&=h\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{cc|c}3&-9&4\\\\-2&6&h\\end{array}\\right]" },
          { text: "Scale row 1: R₁ → ⅓R₁, then clear column 1: R₂ → R₂ + 2R₁." },
          { tex: "\\left[\\begin{array}{cc|c}1&-3&\\tfrac{4}{3}\\\\0&0&\\,h+\\tfrac{8}{3}\\end{array}\\right]\\;\\Longrightarrow\\;0=h+\\tfrac{8}{3}" },
          { text: "Row 2 says 0 = h + 8⁄3. That can only be true — and the system consistent — when h + 8⁄3 = 0." },
        ],
        answerTex: "h=-\\tfrac{8}{3}",
      },
    },
    {
      type: "prose",
      text: "Use the **interactive solver** below to drill this: type any augmented matrix, step through each elementary row operation, and read off the existence/uniqueness verdict. Then test yourself on the lecture's own examples in the practice set.",
    },
    { type: "practice", practice: { topic: "lec1", count: 6 } },
  ],
};
