/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-2-2",
  moduleSlug: "determinants",
  title: "§2.2 — The Inverse of a Matrix",
  objective:
    "Define the inverse, use the 2×2 formula, solve Ax = b by inversion, apply the inverse rules, and compute A⁻¹ with the [A | I] algorithm.",
  minutes: 22,
  tools: ["rref"],
  blocks: [
    {
      type: "prose",
      text: "An n×n matrix A is **invertible** (or **nonsingular**) if there is a matrix C with CA = I **and** AC = I. That C is unique, we call it **A⁻¹**, and a matrix with no such inverse is **singular**.",
    },
    { type: "math", tex: "A^{-1}A=I\\quad\\text{and}\\quad AA^{-1}=I" },
    {
      type: "callout",
      tone: "tip",
      title: "The 2×2 formula (memorize)",
      text: "For a 2×2 matrix, swap the diagonal, negate the off-diagonal, divide by the determinant ad − bc. If ad − bc = 0 the matrix is **singular** (no inverse).",
    },
    { type: "math", tex: "A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\Rightarrow A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}" },
    {
      type: "callout",
      tone: "note",
      title: "Why we care: instant solving",
      text: "If A is invertible, the equation **Ax = b** has the one and only solution **x = A⁻¹b** for every b. (Left-multiply both sides by A⁻¹.) It's the cleanest existence-and-uniqueness result in the course.",
    },
    {
      type: "prose",
      text: "Three rules to keep straight: **(A⁻¹)⁻¹ = A**; the product reverses, **(AB)⁻¹ = B⁻¹A⁻¹**; and **(Aᵀ)⁻¹ = (A⁻¹)ᵀ**. The reversal in (AB)⁻¹ mirrors putting on socks then shoes — to undo, take off shoes then socks.",
    },
    { type: "math", tex: "(AB)^{-1}=B^{-1}A^{-1}" },
    {
      type: "prose",
      text: "**Finding A⁻¹ in general** uses elementary matrices: each row operation is itself left-multiplication by an elementary matrix. Row-reducing A to I records the product of those operations — which is exactly A⁻¹. Mechanically:",
    },
    {
      type: "example",
      title: "The [A | I] → [I | A⁻¹] algorithm",
      example: {
        prompt: "Augment A with the identity, then row reduce.",
        steps: [
          { text: "Write the block [ A | I ]." },
          { text: "Row reduce the whole block until the left side becomes I." },
          { tex: "[\\,A\\mid I\\,]\\;\\xrightarrow{\\text{RREF}}\\;[\\,I\\mid A^{-1}\\,]" },
          { text: "If the left side can't reach I (a zero row appears), A is **singular** — stop, there is no inverse." },
        ],
        answerTex: "\\text{The right-hand block is } A^{-1}.",
      },
    },
    {
      type: "callout",
      tone: "warn",
      text: "There is no 'division' by a matrix. Never write b/A. Solve Ax = b as x = A⁻¹b — and only when A is square and invertible.",
    },
    {
      type: "prose",
      text: "Use the solver below on the [A | I] block to watch the identity emerge on the right.",
    },
  ],
};
