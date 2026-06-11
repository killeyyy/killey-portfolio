/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "vector-basics",
  moduleSlug: "vectors",
  title: "Vectors, Combinations & Span",
  objective: "By the end you can form linear combinations, and explain span and linear independence in plain words.",
  minutes: 15,
  tools: ["quiz:vectors", "flashcards:matrix-terms"],
  blocks: [
    {
      type: "prose",
      text: "A **vector** is a list of numbers you can add and scale. In business math it's a bundle (prices, quantities); in geometry it's an arrow. Same rules either way.",
    },
    { type: "math", tex: "\\vec{v}=\\begin{bmatrix}2\\\\-1\\\\3\\end{bmatrix},\\qquad 2\\vec{v}=\\begin{bmatrix}4\\\\-2\\\\6\\end{bmatrix}" },
    {
      type: "prose",
      text: "A **linear combination** mixes vectors with scalar weights. The **span** is *every* point you can reach with those combinations.",
    },
    { type: "math", tex: "c_1\\vec{v}_1+c_2\\vec{v}_2+\\dots+c_k\\vec{v}_k" },
    {
      type: "callout",
      tone: "tip",
      title: "Independence in one sentence",
      text: "Vectors are **linearly independent** if the only way to combine them into the zero vector is to use all-zero weights. If one is a combo of the others, they're **dependent** (redundant).",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original explanations + randomized practice. No graded-coursework answers, ever.",
    },
    { type: "practice", practice: { bankId: "vectors", count: 3 } },
  ],
};
