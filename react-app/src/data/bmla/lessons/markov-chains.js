/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "markov-chains",
  moduleSlug: "applied",
  title: "Markov Chains & Steady States",
  objective: "By the end you can evolve a state vector with a transition matrix and find the steady state — the λ = 1 eigenvector.",
  minutes: 16,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "A **Markov chain** models a system hopping between states (market shares, weather, customers switching brands). The **transition matrix** P holds the probabilities; each **column sums to 1** (everything has to go somewhere).",
    },
    { type: "math", tex: "\\vec{x}_{k+1}=P\\,\\vec{x}_k\\qquad\\Rightarrow\\qquad \\vec{x}_k=P^{k}\\vec{x}_0" },
    {
      type: "prose",
      text: "The **steady state** q is where the system settles: applying P changes nothing. That's literally an eigenvector equation with λ = 1:",
    },
    { type: "math", tex: "P\\vec{q}=\\vec{q}\\;\\Longleftrightarrow\\;(P-I)\\vec{q}=\\vec{0},\\qquad \\text{entries of }\\vec{q}\\text{ sum to }1" },
    {
      type: "example",
      title: "Worked example — brand switching",
      example: {
        prompt: "Each month 90% of brand A's customers stay (10% leave to B); 80% of B's stay (20% switch to A). Long-run shares?",
        steps: [
          { tex: "P=\\begin{bmatrix}0.9&0.2\\\\0.1&0.8\\end{bmatrix}\\quad(\\text{columns sum to }1\\;\\checkmark)" },
          { tex: "(P-I)\\vec{q}=\\vec{0}:\\;\\;-0.1q_1+0.2q_2=0\\;\\Rightarrow\\;q_1=2q_2" },
          { text: "Impose q₁ + q₂ = 1: then 3q₂ = 1." },
        ],
        answerTex: "\\vec{q}=\\begin{bmatrix}2/3\\\\1/3\\end{bmatrix}\\;\\;\\Rightarrow\\;\\;A\\text{ settles at }66.7\\%,\\;B\\text{ at }33.3\\%",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "The two-step exam recipe",
      text: "1) Solve (P − I)q = 0 by row reduction. 2) **Normalize** so the entries sum to 1 — forgetting the normalization is the #1 mark-loser here.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Why it converges: a regular stochastic matrix has λ = 1 as its biggest eigenvalue; every other |λ| < 1, so those directions die off as you raise P to powers — diagonalization explains the whole story.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "Check the convention in the question: if the matrix is written with **rows** summing to 1, the evolution is xᵀP and the steady state solves qᵀP = qᵀ. Same math, transposed.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice — never live coursework answers.",
    },
    { type: "practice", practice: { bankId: "applied", count: 2 } },
  ],
};
