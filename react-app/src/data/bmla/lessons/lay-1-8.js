/** @type {import("../curriculum.js").Lesson} */
// Lecture 5a (18 Jun) — Lay §1.8 Introduction to Linear Transformations.
// Grounded in the lecture's own examples; original wording.
export default {
  slug: "lay-1-8",
  moduleSlug: "transformations",
  title: "§1.8 — Introduction to Linear Transformations",
  objective:
    "See a matrix as a function that sends vectors to vectors (T(x) = Ax), use the domain/codomain/image/range vocabulary, solve image and pre-image questions, and recognise the two linearity properties.",
  minutes: 22,
  tools: ["span", "rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.8 · Part 1", title: "A matrix is a function" },
    {
      type: "prose",
      text: "A function sends each input to a unique output. A **transformation** does the same — but the inputs and outputs are *vectors*. Multiplying a vector x by a matrix A produces a new vector Ax, so a matrix *acts as a function*: the **matrix transformation** T(x) = Ax.",
    },
    {
      type: "definition",
      term: "Transformation T : ℝⁿ → ℝᵐ",
      text: "A rule that assigns to each vector x in ℝⁿ (the **domain**) a vector T(x) in ℝᵐ (the **codomain**). T(x) is the **image** of x; the set of all images is the **range**. For a matrix transformation T(x) = Ax, the product is defined only when the number of columns of A equals the number of entries of x.",
    },
    {
      type: "example",
      title: "A matrix transformation",
      example: {
        prompt: "Let A = [1 0; 2 1; 0 1] and T(x) = Ax, so T : ℝ² → ℝ³. Find the image of x = (2, 1).",
        steps: [
          { tex: "T(\\vec x)=A\\vec x=\\left[\\begin{array}{cc}1&0\\\\2&1\\\\0&1\\end{array}\\right]\\begin{bmatrix}2\\\\1\\end{bmatrix}" },
        ],
        answerTex: "T(\\vec x)=\\begin{bmatrix}2\\\\5\\\\1\\end{bmatrix}\\in\\mathbb{R}^3",
      },
    },
    {
      type: "example",
      title: "Image, pre-image, and range",
      example: {
        prompt: "Let A = [1 −2 3; −5 10 −15], T : ℝ³ → ℝ², b = (2, −10), c = (3, 0). (a) Find an x with T(x) = b. (b) Is it unique? (c) Is c in the range of T?",
        steps: [
          { text: "(a) Solve Ax = b: [1 −2 3 | 2; −5 10 −15 | −10] ~ [1 −2 3 | 2; 0 0 0 | 0] → x₁ = 2x₂ − 3x₃ + 2, with x₂, x₃ free. Take x₂ = x₃ = 1:" },
          { tex: "\\vec x=\\begin{bmatrix}1\\\\1\\\\1\\end{bmatrix}\\ \\text{maps to}\\ \\vec b=\\begin{bmatrix}2\\\\-10\\end{bmatrix}\\quad(\\text{a pre-image of }\\vec b)" },
          { text: "(b) Free variables exist → more than one x maps to b. Not unique." },
          { text: "(c) Solve Ax = c: [1 −2 3 | 3; −5 10 −15 | 0] ~ [1 −2 3 | 0; 0 0 0 | 1] → 0 = 1, inconsistent." },
        ],
        answerTex: "\\text{(a) }(1,1,1)\\ \\text{(b) not unique \\ (c) } \\vec c\\ \\text{is NOT in the range of }T.",
      },
    },
    {
      type: "checkpoint",
      q: "The set of all images T(x) of a transformation T is called its…",
      options: ["domain", "codomain", "range", "kernel"],
      correctIndex: 2,
      hint: "Image of one x vs the collection of all images.",
      explanation: "T(x) is the image of a single x; the range is the set of *all* images.",
    },

    { type: "heading", eyebrow: "Section 1.8 · Part 2", title: "Linearity" },
    {
      type: "prose",
      text: "Matrix multiplication distributes over sums and pulls out scalars: A(u + v) = Au + Av and A(cu) = c·Au. (For example, with A = [1 2; 3 4], u = (1, −1), v = (2, 3): both A(u+v) and Au + Av equal (7, 17).) Those two properties are exactly what 'linear' means.",
    },
    {
      type: "definition",
      term: "Linear transformation",
      text: "A transformation T is **linear** if **(1)** T(u + v) = T(u) + T(v) for all u, v, and **(2)** T(cu) = c·T(u) for all u and scalars c. **Every matrix transformation is linear.**",
    },
    {
      type: "theorem",
      name: "consequences of linearity",
      text: "If T is linear then **T(0) = 0** and, more generally, **T(cu + dv) = c·T(u) + d·T(v)** — and the same for any linear combination. (Proof of the first: T(0) = T(0·u) = 0·T(u) = 0.)",
    },
    {
      type: "checkpoint",
      variant: "tryit",
      q: "Solving Ax = c gives the row [0 0 0 | 1]. Is c in the range of T(x) = Ax?",
      options: ["Yes", "No — Ax = c is inconsistent, so nothing maps to c", "Only if c = 0", "Cannot tell"],
      correctIndex: 1,
      hint: "c is in the range ⇔ Ax = c has a solution.",
      explanation: "0 = 1 is impossible, so no x maps to c — c is outside the range.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    { type: "prose", text: "Use the solver for the image/pre-image computations, then take the practice set." },
    { type: "practice", practice: { topic: "lt-intro", count: 6 } },
  ],
};
