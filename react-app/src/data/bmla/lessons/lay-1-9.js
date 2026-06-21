/** @type {import("../curriculum.js").Lesson} */
// Lecture 5b (18 Jun) — Lay §1.9 The Matrix of a Linear Transformation.
// Grounded in the lecture's own examples; original wording.
export default {
  slug: "lay-1-9",
  moduleSlug: "transformations",
  title: "§1.9 — The Matrix of a Linear Transformation",
  objective:
    "Build the standard matrix of a linear transformation from what it does to the identity columns, A = [T(e₁) … T(eₙ)], and use it to write T(x) = Ax.",
  minutes: 20,
  tools: ["flashcards"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.9 · Part 1", title: "Knowing T on the basis is enough" },
    {
      type: "callout",
      tone: "tip",
      title: "Why the identity columns matter",
      text: "Any x splits along the identity columns: x = x₁e₁ + … + xₙeₙ (where eⱼ is the jth column of Iₙ). Because T is **linear**, T(x) = x₁·T(e₁) + … + xₙ·T(eₙ). So if you know T(e₁), …, T(eₙ), you know T on *every* x.",
    },
    {
      type: "theorem",
      name: "matrix of a linear transformation",
      text: "Let T : ℝⁿ → ℝᵐ be linear. There is a **unique** matrix A with T(x) = Ax for all x. It is the m × n matrix whose jth column is T(eⱼ): **A = [T(e₁) … T(eₙ)]** — the **standard matrix** of T.",
      tex: "A=[\\,T(\\vec e_1)\\ \\ T(\\vec e_2)\\ \\cdots\\ T(\\vec e_n)\\,]",
    },
    {
      type: "example",
      title: "Build T from T(e₁) and T(e₂)",
      example: {
        prompt: "T : ℝ² → ℝ³ is linear with T(e₁) = (5, −7, 2) and T(e₂) = (−3, 8, 0). Find a formula for T(x) and the standard matrix.",
        steps: [
          { tex: "T(\\vec x)=x_1T(\\vec e_1)+x_2T(\\vec e_2)=x_1\\begin{bmatrix}5\\\\-7\\\\2\\end{bmatrix}+x_2\\begin{bmatrix}-3\\\\8\\\\0\\end{bmatrix}" },
          { text: "Collect the entries; the coefficients of x₁, x₂ become the columns of A." },
        ],
        answerTex: "T(\\vec x)=\\begin{bmatrix}5x_1-3x_2\\\\-7x_1+8x_2\\\\2x_1\\end{bmatrix},\\qquad A=\\left[\\begin{array}{cc}5&-3\\\\-7&8\\\\2&0\\end{array}\\right]",
      },
    },

    { type: "heading", eyebrow: "Section 1.9 · Part 2", title: "Reading off the standard matrix" },
    {
      type: "example",
      title: "Dilation",
      example: {
        prompt: "Find the standard matrix of the dilation T(x) = 3x on ℝ².",
        steps: [
          { tex: "T(\\vec e_1)=3\\vec e_1=\\begin{bmatrix}3\\\\0\\end{bmatrix},\\qquad T(\\vec e_2)=3\\vec e_2=\\begin{bmatrix}0\\\\3\\end{bmatrix}" },
        ],
        answerTex: "A=\\left[\\begin{array}{cc}3&0\\\\0&3\\end{array}\\right]",
      },
    },
    {
      type: "example",
      title: "From a formula to the matrix",
      example: {
        prompt: "Find the standard matrix of T([x₁, x₂]) = (x₁ − 2x₂, 4x₁, 3x₁ + 2x₂).",
        steps: [
          { text: "Plug in e₁ = (1, 0) and e₂ = (0, 1):" },
          { tex: "T(\\vec e_1)=\\begin{bmatrix}1\\\\4\\\\3\\end{bmatrix},\\qquad T(\\vec e_2)=\\begin{bmatrix}-2\\\\0\\\\2\\end{bmatrix}" },
        ],
        answerTex: "A=[\\,T(\\vec e_1)\\ T(\\vec e_2)\\,]=\\left[\\begin{array}{cc}1&-2\\\\4&0\\\\3&2\\end{array}\\right]",
      },
    },
    {
      type: "callout",
      tone: "note",
      title: "Geometric transformations of ℝ²",
      text: "Reflections, rotations, shears and scalings are all linear, so each has a standard matrix — found the same way, by tracking where e₁ and e₂ go. See the *Geometric Transformations of the Plane* lesson for the catalogue.",
    },
    {
      type: "checkpoint",
      q: "The jth column of the standard matrix of a linear transformation T is…",
      options: ["the jth entry of x", "T(eⱼ), where eⱼ is the jth identity column", "the jth row of A", "always eⱼ"],
      correctIndex: 1,
      hint: "A = [T(e₁) … T(eₙ)].",
      explanation: "Each column records where T sends the corresponding identity column eⱼ.",
    },
    {
      type: "checkpoint",
      variant: "tryit",
      q: "T : ℝ² → ℝ² is linear with T(e₁) = (2, 0) and T(e₂) = (0, 2). What is its standard matrix?",
      options: ["[2 0; 0 2]", "[2 2; 0 0]", "[1 0; 0 1]", "[0 2; 2 0]"],
      correctIndex: 0,
      hint: "Put T(e₁) and T(e₂) in as columns.",
      explanation: "A = [T(e₁) T(e₂)] = [2 0; 0 2] — the dilation by 2.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    { type: "prose", text: "Lock in the standard-matrix recipe with the practice set and flashcards." },
    { type: "practice", practice: { topic: "lt-matrix", count: 6 } },
  ],
};
