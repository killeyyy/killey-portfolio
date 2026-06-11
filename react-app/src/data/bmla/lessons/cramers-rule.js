/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "cramers-rule",
  moduleSlug: "determinants",
  title: "Inverses & Cramer's Rule",
  objective: "By the end you can invert a matrix via [A|I] and solve square systems with Cramer's Rule — and know when NOT to.",
  minutes: 15,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Two exam-favorite ways to solve **Ax = b** when A is square and invertible. **Method 1:** find A⁻¹ by row-reducing the augmented block, then multiply.",
    },
    { type: "math", tex: "[\\,A\\,|\\,I\\,]\\;\\xrightarrow{\\text{RREF}}\\;[\\,I\\,|\\,A^{-1}\\,],\\qquad x=A^{-1}b" },
    {
      type: "prose",
      text: "**Method 2 — Cramer's Rule:** replace one column of A with b, take determinants, divide. Perfect when you only need *one* variable.",
    },
    { type: "math", tex: "x_i=\\frac{\\det A_i}{\\det A}\\qquad (A_i = A\\text{ with column } i \\text{ replaced by } b)" },
    {
      type: "example",
      title: "Worked example — Cramer's on a 2×2",
      example: {
        prompt: "Solve: 2x + y = 7 and x + 3y = 11.",
        steps: [
          { tex: "\\det A=\\det\\begin{bmatrix}2&1\\\\1&3\\end{bmatrix}=6-1=5" },
          { tex: "x=\\frac{\\det\\begin{bmatrix}7&1\\\\11&3\\end{bmatrix}}{5}=\\frac{21-11}{5}=2" },
          { tex: "y=\\frac{\\det\\begin{bmatrix}2&7\\\\1&11\\end{bmatrix}}{5}=\\frac{22-7}{5}=3" },
        ],
        answerTex: "x=2,\\quad y=3",
      },
    },
    {
      type: "callout",
      tone: "warn",
      title: "When Cramer's fails",
      text: "If **det A = 0**, Cramer's Rule is off the table — the system has either no solution or infinitely many. Fall back to row reduction to find out which.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "The **Invertible Matrix Theorem** chains it together: det A ≠ 0 ⇔ A invertible ⇔ unique solution for every b ⇔ pivots in every row & column ⇔ columns independent. One fact unlocks all the others.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Fresh numbers every attempt below — built for skill, not copying.",
    },
    { type: "practice", practice: { bankId: "determinants", count: 4 } },
  ],
};
