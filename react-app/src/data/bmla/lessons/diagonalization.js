/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "diagonalization",
  moduleSlug: "eigen",
  title: "Diagonalization & Matrix Powers",
  objective: "By the end you can diagonalize a matrix as PDP⁻¹ and compute Aⁿ in closed form — the classic 15-mark question.",
  minutes: 18,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "**Diagonalization** rewrites A in its most honest coordinates: P holds the eigenvectors (columns), D holds the eigenvalues (diagonal).",
    },
    { type: "math", tex: "A=PDP^{-1},\\qquad D=\\begin{bmatrix}\\lambda_1&0\\\\0&\\lambda_2\\end{bmatrix}" },
    {
      type: "prose",
      text: "Why bother? **Powers become trivial.** The P's collapse in the middle, and only the diagonal gets raised:",
    },
    { type: "math", tex: "A^{n}=PD^{n}P^{-1},\\qquad D^{n}=\\begin{bmatrix}\\lambda_1^{n}&0\\\\0&\\lambda_2^{n}\\end{bmatrix}" },
    {
      type: "example",
      title: "The exam recipe (memorize this order)",
      example: {
        prompt: "Diagonalize A and compute Aⁿ.",
        steps: [
          { text: "1) Eigenvalues: solve det(A − λI) = 0." },
          { text: "2) Eigenvectors: for each λ, solve (A − λI)x = 0." },
          { text: "3) Build P from the eigenvectors as columns; D from the λ's **in the same order**." },
          { text: "4) Find P⁻¹ (2×2: swap diagonal, negate off-diagonal, divide by det P)." },
          { tex: "5)\\;A^{n}=P\\,D^{n}\\,P^{-1}\\;\\text{— multiply once, answer in closed form.}" },
        ],
        answerTex: "\\text{Check: } PDP^{-1} \\text{ must reproduce } A.",
      },
    },
    {
      type: "callout",
      tone: "warn",
      title: "When it's impossible",
      text: "A is diagonalizable only if it has **n linearly independent eigenvectors**. A repeated eigenvalue whose eigenspace is too small (geometric multiplicity < algebraic) kills it — state that explicitly for full marks.",
    },
    {
      type: "callout",
      tone: "note",
      text: "This is also the engine behind **Markov chains**: the steady state is the eigenvector for λ = 1, and Aⁿ explains why the chain forgets where it started.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice — built to make you faster, not to hand in.",
    },
    { type: "practice", practice: { bankId: "eigen", count: 4 } },
  ],
};
