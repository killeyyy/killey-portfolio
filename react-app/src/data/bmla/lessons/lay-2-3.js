/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-2-3",
  moduleSlug: "determinants",
  title: "§2.3 — Characterizations of Invertible Matrices",
  objective:
    "Use the Invertible Matrix Theorem: one square matrix being invertible forces a whole list of equivalent properties — so any one of them settles all the others.",
  minutes: 20,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Everything from Chapter 1 and §2.1–2.2 converges here. For a **square** n×n matrix A, the **Invertible Matrix Theorem (IMT)** says the following statements are **all equivalent** — each is true exactly when A is invertible, so proving one proves them all.",
    },
    {
      type: "callout",
      tone: "note",
      title: "The Invertible Matrix Theorem (square A)",
      text: "A is invertible ⇔ A is row-equivalent to **Iₙ** ⇔ A has **n pivot positions** ⇔ **Ax = 0 has only the trivial solution** ⇔ the columns of A are **linearly independent** ⇔ the columns **span ℝⁿ** ⇔ **Ax = b is consistent for every b** ⇔ the linear map x ↦ Ax is **one-to-one** ⇔ it is **onto** ⇔ there is a matrix C with CA = I ⇔ there is a matrix D with AD = I ⇔ **Aᵀ is invertible** ⇔ **det A ≠ 0**.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "How to use it in the exam",
      text: "Pick the **cheapest** condition to check. Often that's: row reduce and **count the pivots** — n pivots ⇒ invertible (and everything else); fewer than n ⇒ singular (and everything else fails). For a known det, det A ≠ 0 is instant.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "The square-matrix fine print",
      text: "The IMT applies **only to square matrices**, and its conditions are **all-or-nothing**: A is either invertible (every condition holds) or singular (every condition fails). There is no in-between — so one failed condition means the matrix is singular, full stop.",
    },
    {
      type: "example",
      title: "Worked example — one check settles it",
      example: {
        prompt: "Is A = [[1, 0, −2], [3, 1, −2], [−5, −1, 9]] invertible? What does that tell us about Ax = 0 and the columns?",
        steps: [
          { text: "Row reduce: R₂ → R₂ − 3R₁, R₃ → R₃ + 5R₁, then clear column 2." },
          { text: "Three pivot positions appear → A is row-equivalent to I₃." },
          { text: "By the IMT, every equivalent statement now follows for free." },
        ],
        answerTex: "\\text{Invertible} \\Rightarrow Ax=0\\text{ has only } x=0,\\ \\text{columns independent and span } \\mathbb{R}^3.",
      },
    },
    {
      type: "prose",
      text: "A linear transformation T(x) = Ax is **invertible** exactly when A is, and then T⁻¹(x) = A⁻¹x. So invertibility, unique solutions, independence, spanning, one-to-one and onto are — for a square matrix — six faces of the same coin.",
    },
  ],
};
