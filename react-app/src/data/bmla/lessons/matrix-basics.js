/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "matrix-basics",
  moduleSlug: "matrices",
  title: "Matrices, Notation & Multiplication",
  objective: "By the end you can read matrix dimensions, add/scale matrices, and multiply two matrices correctly.",
  minutes: 14,
  tools: ["flashcards:matrix-terms", "quiz:matrix-basics"],
  blocks: [
    {
      type: "prose",
      text: "A **matrix** is just a grid of numbers arranged in rows and columns. We describe its size as **rows × columns** — read that order out loud every time and half the exam mistakes disappear.",
    },
    {
      type: "math",
      tex: "A=\\begin{bmatrix}1&2&3\\\\4&5&6\\end{bmatrix}\\quad\\text{is a }2\\times3\\text{ matrix.}",
    },
    {
      type: "callout",
      tone: "tip",
      title: "The one rule for multiplication",
      text: "You can multiply **A·B** only when the **columns of A** equal the **rows of B**. An (m×n)·(n×p) gives an (m×p) result. If the inner numbers don't match, it's undefined — write that, don't guess.",
    },
    {
      type: "prose",
      text: "Each entry of the product is a **dot product**: row *i* of A with column *j* of B.",
    },
    {
      type: "example",
      title: "Worked example — 2×2 product",
      example: {
        prompt: "Compute A·B.",
        steps: [
          { tex: "A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix},\\; B=\\begin{bmatrix}5&6\\\\7&8\\end{bmatrix}" },
          { text: "Top-left = (row 1 of A)·(col 1 of B) = 1·5 + 2·7 = 19." },
          { tex: "AB=\\begin{bmatrix}1\\cdot5+2\\cdot7 & 1\\cdot6+2\\cdot8\\\\3\\cdot5+4\\cdot7 & 3\\cdot6+4\\cdot8\\end{bmatrix}" },
        ],
        answerTex: "AB=\\begin{bmatrix}19&22\\\\43&50\\end{bmatrix}",
      },
    },
    {
      type: "callout",
      tone: "warn",
      text: "Matrix multiplication is **not commutative**: usually **AB ≠ BA**. Order matters.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "These are original practice problems for learning. This product never contains answers to your live, graded coursework.",
    },
    { type: "practice", practice: { bankId: "matrix-basics", count: 4 } },
  ],
};
