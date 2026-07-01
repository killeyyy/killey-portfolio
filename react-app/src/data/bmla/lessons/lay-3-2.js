/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-3-2",
  moduleSlug: "determinants",
  title: "§3.2 — Properties of Determinants",
  objective:
    "By the end you can compute a determinant by row-reducing to triangular form (no cofactors) and use the algebraic properties — the exact skill 2025 Q5 and 2026 Q6 tested.",
  minutes: 16,
  tools: ["determinant", "quiz"],
  blocks: [
    {
      type: "heading",
      eyebrow: "Section 3.2 · Part 1",
      title: "Row operations change det in three known ways",
    },
    {
      type: "prose",
      text: "Cofactor expansion is slow on big matrices. §3.2's move: **row-reduce to triangular form, then multiply the diagonal** — as long as you track what each operation did to the determinant.",
    },
    {
      type: "theorem",
      title: "Theorem 3 — row operations & det",
      text: "**Replacement** (add a multiple of one row to another): det unchanged. **Interchange** (swap two rows): det changes sign. **Scaling** (multiply a row by k): det is multiplied by k.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "The exam recipe",
      text: "Reduce with **replacements and swaps only** (never scale — one less thing to track). Then det A = (−1)^(number of swaps) × product of the diagonal entries. This is exactly what 2026 Q6(a) asked — `det = 216` came from one swap and a triangular product.",
    },
    {
      type: "example",
      title: "Worked example — det by row reduction (2025 Q5 pattern)",
      example: {
        prompt: "Compute det A without cofactor expansion.",
        steps: [
          { tex: "A=\\begin{bmatrix}1&1&2\\\\2&2&2\\\\3&1&4\\end{bmatrix}" },
          { text: "R₂ → R₂ − 2R₁ and R₃ → R₃ − 3R₁ (replacements — det unchanged):" },
          { tex: "\\begin{bmatrix}1&1&2\\\\0&0&-2\\\\0&-2&-2\\end{bmatrix}" },
          { text: "Swap R₂ ↔ R₃ to get a triangular shape (det flips sign):" },
          { tex: "\\begin{bmatrix}1&1&2\\\\0&-2&-2\\\\0&0&-2\\end{bmatrix}\\quad\\Rightarrow\\quad \\det A = (-1)\\cdot(1)(-2)(-2)" },
        ],
        answerTex: "\\det A = -4",
      },
    },
    {
      type: "heading",
      eyebrow: "Section 3.2 · Part 2",
      title: "The algebraic properties",
    },
    {
      type: "theorem",
      title: "The property pack",
      text: "**det(Aᵀ) = det A** · **det(AB) = det A · det B** · **det(A⁻¹) = 1 / det A** · **det(kA) = kⁿ det A** for n×n · A is **invertible ⇔ det A ≠ 0** · a triangular matrix's det is the **product of its diagonal**.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "The kⁿ trap",
      text: "det(4A) for a 3×3 is **4³ · det A**, not 4 · det A — scaling the matrix scales every one of the n rows. 2025 Q5(d): det A = −4 gave det(4A) = 64·(−4) = **−256** and det(4A⁻¹) = 64/(−4) = **−16**, det(Aⁿ) = (−4)ⁿ.",
    },
    {
      type: "example",
      title: "Worked example — property chase (2026 Q7(b) pattern)",
      example: {
        prompt: "Given det A = 31 for an invertible 4×4 matrix A, find det(Aᵀ), det(A⁻¹) and (Aᵀ)⁻¹ in terms of A⁻¹.",
        steps: [
          { text: "Transpose never changes the determinant:" },
          { tex: "\\det(A^{T}) = \\det A = 31" },
          { tex: "\\det(A^{-1}) = \\tfrac{1}{\\det A} = \\tfrac{1}{31}" },
          { text: "Inverse and transpose commute:" },
          { tex: "(A^{T})^{-1} = (A^{-1})^{T}" },
        ],
        answerTex: "\\det A^{T}=31,\\quad \\det A^{-1}=\\tfrac{1}{31},\\quad (A^{T})^{-1}=(A^{-1})^{T}",
      },
    },
    {
      type: "callout",
      tone: "note",
      title: "Why det ≠ 0 ⇔ invertible",
      text: "Row-reduce A to echelon form U with replacements/swaps: det A = ± (product of pivots). All n pivots present ⇔ product ≠ 0 ⇔ invertible — the same pivot count that runs §2.3's Invertible Matrix Theorem.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original practice below, randomized every attempt — never answers to live graded work.",
    },
    { type: "practice", practice: { bankId: "determinants", count: 4 } },
  ],
};
