/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "determinants-cofactor",
  moduleSlug: "determinants",
  title: "Determinants & Cofactor Expansion",
  objective: "By the end you can evaluate any determinant by cofactor expansion and use the properties to shortcut the exam.",
  minutes: 16,
  tools: ["determinant", "flashcards"],
  blocks: [
    {
      type: "prose",
      text: "The **determinant** is one number that tells you whether a square matrix is invertible (det ≠ 0) and how it scales area/volume. For 2×2 it's instant:",
    },
    { type: "math", tex: "\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc" },
    {
      type: "prose",
      text: "For bigger matrices, use **cofactor expansion**: walk along one row or column, multiply each entry by its signed minor. The sign follows the checkerboard `+ − + −…` pattern.",
    },
    { type: "math", tex: "\\det A=\\sum_{j=1}^{n}(-1)^{1+j}\\,a_{1j}\\,M_{1j}" },
    {
      type: "callout",
      tone: "tip",
      title: "Pick the laziest row",
      text: "Expand along whichever row or column has the **most zeros** — every zero kills a whole term. Triangular matrix? The determinant is just the **product of the diagonal**.",
    },
    {
      type: "example",
      title: "Worked example — 3×3 by cofactors",
      example: {
        prompt: "Evaluate the determinant.",
        steps: [
          { tex: "A=\\begin{bmatrix}2&0&1\\\\3&1&2\\\\-1&0&4\\end{bmatrix}\\quad\\text{(expand down column 2 — two zeros!)}" },
          { text: "Only the middle entry survives: sign (+) at position (2,2)." },
          { tex: "\\det A = 1\\cdot\\det\\begin{bmatrix}2&1\\\\-1&4\\end{bmatrix} = 1\\,(8-(-1))" },
        ],
        answerTex: "\\det A = 9",
      },
    },
    {
      type: "prose",
      text: "The properties do half the exam for you: **det(AB) = det A · det B**, **det(Aᵀ) = det A**, **det(A⁻¹) = 1/det A**, and **det(kA) = kⁿ det A** for an n×n matrix (that n trips everyone — scaling the whole matrix scales every row).",
    },
    {
      type: "callout",
      tone: "warn",
      text: "Row operations change the determinant in known ways: a **row swap flips the sign**, scaling a row by k scales det by k, and adding a multiple of one row to another **doesn't change it at all**.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original practice below, randomized every attempt — never answers to live graded work.",
    },
    { type: "practice", practice: { bankId: "determinants", count: 4 } },
  ],
};
