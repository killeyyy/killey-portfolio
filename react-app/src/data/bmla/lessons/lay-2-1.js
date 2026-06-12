/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-2-1",
  moduleSlug: "matrices",
  title: "§2.1 — Matrix Operations",
  objective:
    "Add and scale matrices, multiply matrices using the row–column rule, and use the algebra (and its traps) for powers and the transpose.",
  minutes: 22,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Write A = [aᵢⱼ] for the entry in row i, column j. **Sum** and **scalar multiple** are entry-by-entry, and only matrices of the *same size* can be added. The **diagonal entries** are a₁₁, a₂₂, …; a matrix of zeros is **0**.",
    },
    {
      type: "prose",
      text: "**Multiplication** is the one to get right. If A is m×n and B is n×p, then AB is **m×p**, and the entry in row i, column j of AB is the dot product of **row i of A** with **column j of B** (the *row–column rule*).",
    },
    { type: "math", tex: "(AB)_{ij}=a_{i1}b_{1j}+a_{i2}b_{2j}+\\dots+a_{in}b_{nj}" },
    {
      type: "callout",
      tone: "tip",
      title: "Dimensions first",
      text: "AB is defined only when the **inner** dimensions match: (m×**n**)(**n**×p). The **outer** dimensions give the result: m×p. Write the sizes under the matrices before you compute anything — it kills most errors instantly.",
    },
    {
      type: "example",
      title: "Worked example — the row–column rule",
      example: {
        prompt: "Compute AB.",
        steps: [
          { tex: "A=\\begin{bmatrix}2&3\\\\1&-5\\end{bmatrix}\\;(2\\times2),\\quad B=\\begin{bmatrix}4&3&6\\\\1&-2&3\\end{bmatrix}\\;(2\\times3)\\Rightarrow AB\\text{ is }2\\times3" },
          { text: "Row 1 · Col 1 = 2·4 + 3·1 = 11; Row 1 · Col 2 = 2·3 + 3·(−2) = 0; …" },
          { tex: "AB=\\begin{bmatrix}11&0&21\\\\1&13&-9\\end{bmatrix}" },
        ],
        answerTex: "AB=\\begin{bmatrix}11&0&21\\\\1&13&-9\\end{bmatrix}",
      },
    },
    {
      type: "callout",
      tone: "warn",
      title: "Three traps the exam loves",
      text: "**(1)** AB ≠ BA in general (order matters; BA may not even be defined). **(2)** AB = AC does **not** let you cancel A. **(3)** AB = 0 does **not** force A = 0 or B = 0. Memorize these as 'what you *cannot* do'.",
    },
    {
      type: "prose",
      text: "What *does* hold: associativity A(BC) = (AB)C, distributivity A(B + C) = AB + AC, and the identity **Iₐ** with 1's on the diagonal acts like the number 1: AI = A and IA = A. **Powers** Aᵏ = A·A···A (k factors) make sense only for **square** A.",
    },
    {
      type: "prose",
      text: "The **transpose** Aᵀ flips rows into columns: (Aᵀ)ᵢⱼ = aⱼᵢ. Two rules that get tested: (Aᵀ)ᵀ = A, and the product reverses — **(AB)ᵀ = BᵀAᵀ** (not AᵀBᵀ).",
    },
    { type: "math", tex: "(AB)^{T}=B^{T}A^{T}" },
  ],
};
