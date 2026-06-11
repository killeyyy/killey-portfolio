/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "geometric-transformations",
  moduleSlug: "transformations",
  title: "Geometric Transformations of the Plane",
  objective: "By the end you can write the matrix for any rotation, reflection, projection, shear or scaling — and compose them in the right order.",
  minutes: 14,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Every classic move of the plane is a 2×2 matrix. The exam catalog:",
    },
    {
      type: "math",
      tex: "\\text{Rotation by }\\theta:\\;\\begin{bmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{bmatrix}\\qquad \\text{Scaling by }k:\\;\\begin{bmatrix}k&0\\\\0&k\\end{bmatrix}",
    },
    {
      type: "math",
      tex: "\\text{Reflect }x\\text{-axis}:\\;\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}\\quad \\text{Reflect }y=x:\\;\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\quad \\text{Project on }x:\\;\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}\\quad \\text{Shear}:\\;\\begin{bmatrix}1&k\\\\0&1\\end{bmatrix}",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Don't memorize — derive",
      text: "Stuck? Ask **where do e₁ = (1,0) and e₂ = (0,1) land?** Those images are the columns. Rotation by 90°: e₁→(0,1), e₂→(−1,0) — matrix written in five seconds.",
    },
    {
      type: "example",
      title: "Worked example — composition order",
      example: {
        prompt: "First rotate 90° counter-clockwise, then reflect across the x-axis. One matrix?",
        steps: [
          { tex: "R=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix},\\qquad F=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}" },
          { text: "Composition applies **right-to-left**: x ↦ F(R(x)) means compute F·R, not R·F." },
          { tex: "FR=\\begin{bmatrix}1&0\\\\0&-1\\end{bmatrix}\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}=\\begin{bmatrix}0&-1\\\\-1&0\\end{bmatrix}" },
        ],
        answerTex: "FR=\\begin{bmatrix}0&-1\\\\-1&0\\end{bmatrix}\\;\\;(\\text{reflection across }y=-x)",
      },
    },
    {
      type: "callout",
      tone: "warn",
      text: "Order matters — FR ≠ RF in general. The transformation applied **first** sits **closest to x** (rightmost). Examiners bait this every year.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Sanity-check with determinants: rotations have det = 1 (preserve area & orientation), reflections det = −1 (flip orientation), projections det = 0 (squash — not invertible).",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice below.",
    },
    { type: "practice", practice: { bankId: "transformations", count: 3 } },
  ],
};
