/** @type {import("../curriculum.js").Lesson} */
// Lay §1.4 — The Matrix Equation Ax = b. Grounded in the course's own
// "Linear combination / Span" notes (Theorem 4 + the worked examples).
// Structured, visual, interactive — original wording, no verbatim text.
export default {
  slug: "lay-1-4",
  moduleSlug: "vectors",
  title: "§1.4 — The Matrix Equation Ax = b",
  objective:
    "Read Ax as a linear combination of the columns of A, move freely between the matrix equation, the vector equation and the augmented system, decide when Ax = b has a solution, and use Theorem 4 to tell when the columns of A span ℝᵐ.",
  minutes: 22,
  tools: ["span", "rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.4 · Part 1", title: "Three ways to say the same thing" },
    {
      type: "definition",
      term: "The product Ax",
      text: "If A has columns a₁, …, aₙ and x has entries x₁, …, xₙ, then Ax is the **linear combination of the columns of A weighted by the entries of x**.",
      tex: "A\\vec{x}=x_1\\vec{a}_1+x_2\\vec{a}_2+\\dots+x_n\\vec{a}_n",
    },
    {
      type: "theorem",
      name: "matrix ⇔ vector ⇔ system",
      text: "For an m × n matrix A with columns a₁, …, aₙ and b in ℝᵐ, the matrix equation **Ax = b** has the same solution set as the vector equation x₁a₁ + … + xₙaₙ = b, which has the same solution set as the system with augmented matrix [a₁ … aₙ | b]. So all three are the *same question* in different clothes.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "The existence rule",
      text: "**Ax = b has a solution if and only if b is a linear combination of the columns of A** — equivalently, b lies in the span of those columns. Every \"does a solution exist?\" question becomes \"row-reduce [A | b] and check for consistency.\"",
    },
    {
      type: "example",
      title: "Worked example — when there is no solution",
      example: {
        prompt: "Is b a linear combination of the columns of A?  A = [1 −4 2; 0 3 5; −2 8 −4], b = (3, −7, −3).",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&-4&2&3\\\\0&3&5&-7\\\\-2&8&-4&-3\\end{array}\\right]\\;\\xrightarrow{R_3+2R_1}\\;\\left[\\begin{array}{ccc|c}1&-4&2&3\\\\0&3&5&-7\\\\0&0&0&3\\end{array}\\right]" },
          { text: "The bottom row says 0 = 3 — impossible. The system is inconsistent." },
        ],
        answerTex: "0=3\\ \\Rightarrow\\ A\\vec{x}=\\vec{b}\\ \\text{has no solution}\\ \\Rightarrow\\ \\vec{b}\\ \\text{is NOT a combination of the columns.}",
      },
    },
    {
      type: "example",
      title: "Worked example — when it does work",
      example: {
        prompt: "Is b a linear combination of a₁ = (1, −2, 0), a₂ = (0, 1, 2), a₃ = (5, −6, 8), with b = (2, −1, 6)?",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&0&5&2\\\\-2&1&-6&-1\\\\0&2&8&6\\end{array}\\right]\\;\\xrightarrow[\\;R_3-2R_2\\;]{R_2+2R_1}\\;\\left[\\begin{array}{ccc|c}1&0&5&2\\\\0&1&4&3\\\\0&0&0&0\\end{array}\\right]" },
          { text: "No contradiction row → consistent. Column 3 has no pivot → x₃ is free, so there are infinitely many weights." },
        ],
        answerTex: "x_1=2-5x_3,\\ x_2=3-4x_3,\\ x_3\\ \\text{free}\\ \\Rightarrow\\ \\vec{b}\\ \\text{IS a combination of }\\vec{a}_1,\\vec{a}_2,\\vec{a}_3.",
      },
    },
    {
      type: "checkpoint",
      q: "Ax = b has a solution if and only if…",
      options: ["b = 0", "b is a linear combination of the columns of A", "A is square", "A has a pivot in every column"],
      correctIndex: 1,
      hint: "Ax is a combination of A's columns; b must be reachable that way.",
      explanation: "Ax is always a linear combination of the columns of A, so b is reachable exactly when it is such a combination — i.e. [A | b] is consistent.",
    },

    { type: "heading", eyebrow: "Section 1.4 · Part 2", title: "When does Ax = b work for EVERY b?" },
    {
      type: "theorem",
      name: "4 · Existence / spanning",
      text: "Let A be m × n. These four statements are **logically equivalent** — for a given A they are all true or all false together: **(a)** for each b in ℝᵐ, Ax = b has a solution; **(b)** each b in ℝᵐ is a linear combination of the columns of A; **(c)** the columns of A span ℝᵐ; **(d)** A has a pivot position in every row.",
    },
    { type: "figure", name: "span-line-plane", caption: "The columns of A reach exactly their span. They fill all of ℝᵐ only when there's a pivot in every row." },
    {
      type: "example",
      title: "Do the columns span ℝ³?",
      example: {
        prompt: "Is Ax = b consistent for every b?  A = [1 3 4; −4 2 −6; −3 −2 −7].",
        steps: [
          { tex: "\\left[\\begin{array}{ccc}1&3&4\\\\-4&2&-6\\\\-3&-2&-7\\end{array}\\right]\\;\\xrightarrow[\\;R_3+3R_1\\;]{R_2+4R_1}\\;\\left[\\begin{array}{ccc}1&3&4\\\\0&14&10\\\\0&7&5\\end{array}\\right]\\;\\xrightarrow{R_3-\\tfrac12 R_2}\\;\\left[\\begin{array}{ccc}1&3&4\\\\0&14&10\\\\0&0&0\\end{array}\\right]" },
          { text: "Only 2 pivots in 3 rows — the third row has no pivot. By Theorem 4(d), the columns do NOT span ℝ³." },
        ],
        answerTex: "\\text{No pivot in every row}\\ \\Rightarrow\\ \\text{columns don't span }\\mathbb{R}^3\\ \\Rightarrow\\ A\\vec{x}=\\vec{b}\\ \\text{fails for some }\\vec{b}.",
      },
    },
    {
      type: "callout",
      tone: "warn",
      text: "Spanning is about **rows**, not columns: the columns of an m × n matrix span ℝᵐ only when there's a pivot in **every row**. So a 4 × 3 matrix can *never* span ℝ⁴ (at most 3 pivots for 4 rows).",
    },
    {
      type: "checkpoint",
      variant: "tryit",
      q: "A is 3 × 4 and reduces to an echelon form with pivots in only 2 rows. Does Ax = b have a solution for every b in ℝ³?",
      options: ["Yes, always", "No — a row has no pivot, so the columns don't span ℝ³", "Only if b = 0", "Only if A is square"],
      correctIndex: 1,
      hint: "Theorem 4(d): you need a pivot in every row.",
      explanation: "Two pivots in three rows means one row has none, so the columns span only a plane in ℝ³ — some b are unreachable.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    {
      type: "prose",
      text: "Use the **span checker** to test any A and b yourself (it row-reduces [A | b] and reports the verdict), then take the practice set.",
    },
    { type: "practice", practice: { topic: "ax-b", count: 6 } },
  ],
};
