/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "eigenvalues",
  moduleSlug: "eigen",
  title: "Eigenvalues & Eigenvectors",
  objective: "By the end you can find eigenvalues from the characteristic equation and the eigenvectors that go with them.",
  minutes: 17,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "An **eigenvector** is a direction the matrix doesn't rotate — it only stretches it by a factor **λ**, the **eigenvalue**. That one idea powers diagonalization, Markov chains, and half of Chapter 5.",
    },
    { type: "math", tex: "A\\vec{x}=\\lambda\\vec{x},\\qquad \\vec{x}\\neq\\vec{0}" },
    {
      type: "prose",
      text: "To find the eigenvalues, move everything to one side: (A − λI)x = 0 has a nonzero solution exactly when the matrix is singular — so set the **characteristic equation**:",
    },
    { type: "math", tex: "\\det(A-\\lambda I)=0" },
    {
      type: "example",
      title: "Worked example — 2×2 from scratch",
      example: {
        prompt: "Find the eigenvalues and eigenvectors of A.",
        steps: [
          { tex: "A=\\begin{bmatrix}4&1\\\\2&3\\end{bmatrix},\\quad \\det(A-\\lambda I)=(4-\\lambda)(3-\\lambda)-2" },
          { tex: "\\lambda^2-7\\lambda+10=0\\;\\Rightarrow\\;(\\lambda-5)(\\lambda-2)=0" },
          { text: "For λ = 5: (A − 5I)x = 0 gives −x₁ + x₂ = 0 → direction (1, 1)." },
          { text: "For λ = 2: (A − 2I)x = 0 gives 2x₁ + x₂ = 0 → direction (1, −2)." },
        ],
        answerTex: "\\lambda_1=5,\\;\\vec{v}_1=\\begin{bmatrix}1\\\\1\\end{bmatrix};\\qquad \\lambda_2=2,\\;\\vec{v}_2=\\begin{bmatrix}1\\\\-2\\end{bmatrix}",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Free marks",
      text: "**Triangular matrix?** The eigenvalues are sitting on the diagonal — no characteristic equation needed. And the **sum** of eigenvalues equals the trace, the **product** equals det A. Use both to check your work.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Behaviour under matrix functions: if Ax = λx, then **A²x = λ²x**, **A⁻¹x = (1/λ)x**, and **(A + cI)x = (λ + c)x** — same eigenvector every time. These one-liners are classic exam sub-parts.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice — never live coursework answers.",
    },
    { type: "practice", practice: { bankId: "eigen", count: 4 } },
  ],
};
