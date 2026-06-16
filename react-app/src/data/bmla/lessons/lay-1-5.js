/** @type {import("../curriculum.js").Lesson} */
// Lay §1.5 — Solution Sets of Linear Systems. Grounded in the course's
// "Solution set" notes (homogeneous Ax=0, parametric vector form, the
// p + v_h structure). Original wording; no verbatim text reproduced.
export default {
  slug: "lay-1-5",
  moduleSlug: "vectors",
  title: "§1.5 — Solution Sets of Linear Systems",
  objective:
    "Solve a homogeneous system Ax = 0, write its solution set in parametric vector form, and see how the solution set of a consistent Ax = b is a translate p + (solutions of Ax = 0).",
  minutes: 22,
  tools: ["rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.5 · Part 1", title: "Homogeneous systems" },
    {
      type: "definition",
      term: "Homogeneous vs non-homogeneous",
      text: "A system **Ax = 0** (right-hand side the zero vector) is **homogeneous** — it *always* has the **trivial solution** x = 0. A system **Ax = b** with b ≠ 0 is **non-homogeneous**.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "When is there more than the trivial solution?",
      text: "**Ax = 0 has a nontrivial solution if and only if the system has at least one free variable.** (More unknowns than pivots ⇒ a whole line/plane of solutions through the origin.)",
    },
    {
      type: "example",
      title: "Worked example — a homogeneous system",
      example: {
        prompt: "Find the solution set of x₁ + 3x₂ − 5x₃ = 0, x₁ + 4x₂ − 8x₃ = 0, −3x₁ − 7x₂ + 9x₃ = 0, and describe it geometrically.",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&3&-5&0\\\\1&4&-8&0\\\\-3&-7&9&0\\end{array}\\right]\\;\\sim\\;\\left[\\begin{array}{ccc|c}1&0&4&0\\\\0&1&-3&0\\\\0&0&0&0\\end{array}\\right]" },
          { text: "Pivots in columns 1, 2 → x₁, x₂ basic; x₃ is free: x₁ = −4x₃, x₂ = 3x₃." },
        ],
        answerTex: "\\vec{x}=x_3\\begin{bmatrix}-4\\\\3\\\\1\\end{bmatrix}\\;\\Rightarrow\\;\\operatorname{Span}\\left\\{\\begin{bmatrix}-4\\\\3\\\\1\\end{bmatrix}\\right\\}\\ \\text{— a line through the origin.}",
      },
    },
    {
      type: "definition",
      term: "Parametric vector form",
      text: "Writing the solution as a sum of the free variables times fixed direction vectors — e.g. x = x₃·(−4, 3, 1) above. The free variables are the parameters.",
    },
    {
      type: "checkpoint",
      q: "Ax = 0 has a nontrivial solution if and only if…",
      options: ["A is square", "the system has at least one free variable", "b ≠ 0", "A has a pivot in every row"],
      correctIndex: 1,
      hint: "Nontrivial solutions come from columns without a pivot.",
      explanation: "A free variable (a non-pivot column) lets you scale a nonzero solution — so Ax = 0 has infinitely many solutions.",
    },

    { type: "heading", eyebrow: "Section 1.5 · Part 2", title: "Non-homogeneous: particular + homogeneous" },
    {
      type: "example",
      title: "Worked example — same A, nonzero b",
      example: {
        prompt: "Solve x₁ + 3x₂ − 5x₃ = 4, x₁ + 4x₂ − 8x₃ = 7, −3x₁ − 7x₂ + 9x₃ = −6.",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&3&-5&4\\\\1&4&-8&7\\\\-3&-7&9&-6\\end{array}\\right]\\;\\sim\\;\\left[\\begin{array}{ccc|c}1&0&4&-5\\\\0&1&-3&3\\\\0&0&0&0\\end{array}\\right]" },
          { text: "x₁ = −5 − 4x₃, x₂ = 3 + 3x₃, x₃ free. Split into a constant part plus the free-variable part." },
        ],
        answerTex: "\\vec{x}=\\begin{bmatrix}-5\\\\3\\\\0\\end{bmatrix}+x_3\\begin{bmatrix}-4\\\\3\\\\1\\end{bmatrix}=\\vec{p}+x_3\\vec{v}_h",
      },
    },
    {
      type: "theorem",
      name: "structure of solutions",
      text: "Suppose Ax = b is consistent, and let p be one (particular) solution. Then the **whole** solution set is { p + vₕ : vₕ solves Ax = 0 }. So the solution set of Ax = b is the solution set of Ax = 0 **translated** by p.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Geometric picture",
      text: "The homogeneous solution set passes through the **origin** (a line, plane, …). The matching non-homogeneous set is a **parallel** copy through the point p — same direction(s), shifted off the origin.",
    },
    {
      type: "checkpoint",
      variant: "tryit",
      q: "A consistent system Ax = b has exactly one free variable. Its solution set is geometrically…",
      options: ["a single point", "a line (p + a one-vector span)", "a plane", "all of ℝ³"],
      correctIndex: 1,
      hint: "One free variable → one direction vector.",
      explanation: "One free variable gives x = p + t·v — a line through p in the direction of the homogeneous solution.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    { type: "prose", text: "Reduce these in the solver, then take the practice set." },
    { type: "practice", practice: { topic: "solset", count: 6 } },
  ],
};
