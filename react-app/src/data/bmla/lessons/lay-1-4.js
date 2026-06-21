/** @type {import("../curriculum.js").Lesson} */
// Lecture 3b (13 Jun) — Lay §1.4 The Matrix Equation Ax = b.
// Aligned to the lecture's own examples (the system⟺vector⟺matrix bridge,
// Example 1/2, Theorem 3, Example 3 with the b₁−½b₂+b₃=0 condition,
// Theorem 4, Theorem 5). Original wording; no verbatim text reproduced.
export default {
  slug: "lay-1-4",
  moduleSlug: "vectors",
  title: "§1.4 — The Matrix Equation Ax = b",
  objective:
    "Read Ax as a linear combination of the columns of A, move freely between the system, the vector equation and the matrix equation Ax = b, decide when Ax = b has a solution, and use Theorem 4 to tell when the columns of A span ℝᵐ.",
  minutes: 24,
  tools: ["span", "rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.4 · Part 1", title: "System ⟺ vector equation ⟺ matrix equation" },
    {
      type: "prose",
      text: "In §1.3 we rewrote a system as a vector equation. The next step packs the columns into a matrix. The system, the vector equation, and the **matrix equation Ax = b** are three faces of the same thing:",
    },
    {
      type: "math",
      tex: "\\begin{aligned}x_1+2x_2-\\ x_3&=4\\\\-5x_2+3x_3&=1\\end{aligned}\\;\\Longleftrightarrow\\;x_1\\begin{bmatrix}1\\\\0\\end{bmatrix}+x_2\\begin{bmatrix}2\\\\-5\\end{bmatrix}+x_3\\begin{bmatrix}-1\\\\3\\end{bmatrix}=\\begin{bmatrix}4\\\\1\\end{bmatrix}\\;\\Longleftrightarrow\\;\\left[\\begin{array}{ccc}1&2&-1\\\\0&-5&3\\end{array}\\right]\\begin{bmatrix}x_1\\\\x_2\\\\x_3\\end{bmatrix}=\\begin{bmatrix}4\\\\1\\end{bmatrix}",
    },
    {
      type: "definition",
      term: "The product Ax",
      text: "If A has columns a₁, …, aₙ and x has entries x₁, …, xₙ, then Ax is the **linear combination of the columns of A using the entries of x as weights**. (Defined only when the number of columns of A equals the number of entries of x.)",
      tex: "A\\vec{x}=x_1\\vec{a}_1+x_2\\vec{a}_2+\\dots+x_n\\vec{a}_n",
    },
    {
      type: "example",
      title: "Example 1 — compute Ax",
      example: {
        prompt: "Compute the product below.",
        steps: [
          { tex: "\\left[\\begin{array}{ccc}1&2&-1\\\\0&-5&3\\end{array}\\right]\\begin{bmatrix}4\\\\3\\\\7\\end{bmatrix}=4\\begin{bmatrix}1\\\\0\\end{bmatrix}+3\\begin{bmatrix}2\\\\-5\\end{bmatrix}+7\\begin{bmatrix}-1\\\\3\\end{bmatrix}" },
          { tex: "=\\begin{bmatrix}4\\\\0\\end{bmatrix}+\\begin{bmatrix}6\\\\-15\\end{bmatrix}+\\begin{bmatrix}-7\\\\21\\end{bmatrix}" },
        ],
        answerTex: "=\\begin{bmatrix}3\\\\6\\end{bmatrix}",
      },
    },
    {
      type: "example",
      title: "Example 2 — a combination as a matrix times a vector",
      example: {
        prompt: "Write the linear combination 3v₁ − 5v₂ + 7v₃ as a product Ax.",
        steps: [
          { text: "Put v₁, v₂, v₃ into the columns of A and the weights into x." },
        ],
        answerTex: "3\\vec v_1-5\\vec v_2+7\\vec v_3=[\\,\\vec v_1\\ \\vec v_2\\ \\vec v_3\\,]\\begin{bmatrix}3\\\\-5\\\\7\\end{bmatrix}=A\\vec x",
      },
    },
    {
      type: "theorem",
      name: "3 · three equivalent forms",
      text: "For an m × n matrix A with columns a₁, …, aₙ and b in ℝᵐ, the matrix equation **Ax = b** has the same solution set as the vector equation x₁a₁ + … + xₙaₙ = b, which has the same solution set as the system with augmented matrix [a₁ … aₙ | b]. All three are solved the same way — by row reducing that augmented matrix.",
    },

    { type: "heading", eyebrow: "Section 1.4 · Part 2", title: "Existence of solutions" },
    {
      type: "callout",
      tone: "tip",
      title: "The existence rule",
      text: "**Ax = b has a solution if and only if b is a linear combination of the columns of A** — equivalently, b lies in the span of those columns, equivalently [A | b] is consistent.",
    },
    {
      type: "example",
      title: "Example 3 — consistent for every b?",
      example: {
        prompt: "Is Ax = b consistent for all possible b = (b₁, b₂, b₃)?  A = [1 3 4; −4 2 −6; −3 −2 −7].",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&3&4&b_1\\\\-4&2&-6&b_2\\\\-3&-2&-7&b_3\\end{array}\\right]\\;\\xrightarrow[\\;3R_1+R_3\\;]{4R_1+R_2}\\;\\left[\\begin{array}{ccc|c}1&3&4&b_1\\\\0&14&10&b_2+4b_1\\\\0&7&5&b_3+3b_1\\end{array}\\right]" },
          { tex: "\\xrightarrow{R_3-\\tfrac12 R_2}\\;\\left[\\begin{array}{ccc|c}1&3&4&b_1\\\\0&14&10&b_2+4b_1\\\\0&0&0&\\,b_1-\\tfrac12 b_2+b_3\\end{array}\\right]" },
          { text: "The last row forces 0 = b₁ − ½b₂ + b₃. Some b break this, so it is NOT consistent for every b. The reachable b form the plane b₁ − ½b₂ + b₃ = 0 — the span of the columns." },
        ],
        answerTex: "\\text{Consistent only when } b_1-\\tfrac12 b_2+b_3=0\\ \\Rightarrow\\ \\text{the columns span a \\emph{plane}, not all of }\\mathbb{R}^3.",
      },
    },
    {
      type: "theorem",
      name: "4 · existence / spanning",
      text: "Let A be m × n. These are **logically equivalent** (all true or all false for a given A): **(a)** for each b in ℝᵐ, Ax = b has a solution; **(b)** each b in ℝᵐ is a linear combination of the columns of A; **(c)** the columns of A span ℝᵐ; **(d)** A has a pivot position in every row. (Example 3 fails (d): only 2 pivots in 3 rows.)",
    },
    { type: "figure", name: "span-line-plane", caption: "The columns of A reach exactly their span — a line or a plane here, all of ℝᵐ only with a pivot in every row." },
    {
      type: "checkpoint",
      q: "Ax = b has a solution if and only if…",
      options: ["A is square", "b = 0", "b is a linear combination of the columns of A", "A has a pivot in every column"],
      correctIndex: 2,
      hint: "Ax is itself a combination of A's columns.",
      explanation: "b must be reachable as a combination of the columns — i.e. [A | b] is consistent.",
    },
    {
      type: "checkpoint",
      variant: "tryit",
      q: "For Example 3's matrix, for which b is Ax = b consistent?",
      options: ["every b", "only b with b₁ − ½b₂ + b₃ = 0", "only b = 0", "no b"],
      correctIndex: 1,
      hint: "Look at the last row of the reduced augmented matrix.",
      explanation: "The last row reads 0 = b₁ − ½b₂ + b₃, so consistency needs that expression to be 0 — a plane of reachable b.",
    },

    { type: "heading", eyebrow: "Section 1.4 · Part 3", title: "Algebra of the product Ax" },
    {
      type: "theorem",
      name: "5 · properties of Ax",
      text: "For an m × n matrix A, vectors u, v in ℝⁿ and a scalar c: **A(u + v) = Au + Av** and **A(cu) = c(Au)**. (These two properties are exactly 'linearity' — the bridge to §1.8 linear transformations, where T(x) = Ax.)",
    },
    {
      type: "prose",
      text: "Use the **span checker** to test any A and b yourself (it row-reduces [A | b] and reports the verdict), then take the practice set.",
    },
    { type: "practice", practice: { topic: "ax-b", count: 6 } },
  ],
};
