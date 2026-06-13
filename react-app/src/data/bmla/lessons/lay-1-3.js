/** @type {import("../curriculum.js").Lesson} */
// Mirrors Lecture 3 (13 Jun) — Vector Equations, Lay §1.3.
// Structured + visual (span figure) + interactive (progressive examples,
// checkpoints, span solver), grounded in the lecture's own examples/numbers.
export default {
  slug: "lay-1-3",
  moduleSlug: "vectors",
  title: "§1.3 — Vector Equations",
  objective:
    "Work with vectors in ℝⁿ, write linear combinations, turn a vector equation into an augmented system, decide whether b is a linear combination of given vectors, and describe Span{v₁,…,vₚ} geometrically.",
  minutes: 24,
  tools: ["span", "rref", "flashcards"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.3 · Part 1", title: "Vectors in ℝⁿ" },
    {
      type: "definition",
      term: "Column vector & equality",
      text: "A matrix with one column is a **vector**; a vector in **ℝⁿ** is a column of n real numbers. Two vectors are **equal** iff their *corresponding entries* are equal — order matters: [4; 7] ≠ [7; 4], while [a; 5] = [2; b] forces a = 2, b = 5.",
    },
    {
      type: "prose",
      text: "Two operations: the **sum** u + v adds corresponding entries; the **scalar multiple** cu multiplies every entry by c. Geometrically, u + v is the fourth vertex of the parallelogram with vertices 0, u and v (the *parallelogram rule*).",
    },
    { type: "math", tex: "\\begin{bmatrix}1\\\\-2\\end{bmatrix}+\\begin{bmatrix}2\\\\5\\end{bmatrix}=\\begin{bmatrix}3\\\\3\\end{bmatrix},\\qquad 5\\begin{bmatrix}3\\\\-1\\end{bmatrix}=\\begin{bmatrix}15\\\\-5\\end{bmatrix}" },
    {
      type: "checkpoint",
      q: "Compute the sum:",
      tex: "\\begin{bmatrix}1\\\\-2\\end{bmatrix}+\\begin{bmatrix}2\\\\5\\end{bmatrix}",
      options: ["[3; 3]", "[3; 7]", "[−1; 3]", "[2; −10]"],
      correctIndex: 0,
      explanation: "Add corresponding entries: (1+2, −2+5) = (3, 3).",
    },

    { type: "heading", eyebrow: "Section 1.3 · Part 2", title: "Linear combinations" },
    {
      type: "definition",
      term: "Linear combination & weights",
      text: "Given vectors v₁, …, vₚ and **weights** c₁, …, cₚ (any reals — including 0 or negatives), the vector y = c₁v₁ + … + cₚvₚ. This single idea is the heartbeat of the course.",
      tex: "\\vec{y}=c_1\\vec{v}_1+c_2\\vec{v}_2+\\dots+c_p\\vec{v}_p",
    },
    {
      type: "example",
      title: "Linear combinations in ℝ²",
      example: {
        prompt: "With v₁ = (2, 1) and v₂ = (−2, 2), write each target as a linear combination of v₁ and v₂.",
        steps: [
          { tex: "\\vec{b}=\\begin{bmatrix}-4\\\\1\\end{bmatrix}=-1\\begin{bmatrix}2\\\\1\\end{bmatrix}+1\\begin{bmatrix}-2\\\\2\\end{bmatrix}" },
          { tex: "\\vec{c}=\\begin{bmatrix}6\\\\6\\end{bmatrix}=4\\begin{bmatrix}2\\\\1\\end{bmatrix}+1\\begin{bmatrix}-2\\\\2\\end{bmatrix}" },
        ],
        answerTex: "\\vec{b}=-\\vec{v}_1+\\vec{v}_2,\\qquad \\vec{c}=4\\vec{v}_1+\\vec{v}_2",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "The bridge — vector equation ⇔ augmented system",
      text: "Asking \"is b a linear combination of a₁, …, aₙ?\" is *exactly* asking \"does the system with augmented matrix [a₁ … aₙ | b] have a solution?\" The weights you're hunting for *are* the solution. So **b is a linear combination ⇔ that system is consistent**.",
    },
    {
      type: "example",
      title: "Worked example — is b a linear combination?",
      example: {
        prompt: "Let a₁ = (1, 0, 3), a₂ = (4, 2, 14), a₃ = (3, 6, 10), b = (−1, 8, −5). Is b a linear combination of a₁, a₂, a₃?",
        steps: [
          { tex: "x_1\\begin{bmatrix}1\\\\0\\\\3\\end{bmatrix}+x_2\\begin{bmatrix}4\\\\2\\\\14\\end{bmatrix}+x_3\\begin{bmatrix}3\\\\6\\\\10\\end{bmatrix}=\\begin{bmatrix}-1\\\\8\\\\-5\\end{bmatrix}" },
          { text: "This is the system x₁ + 4x₂ + 3x₃ = −1, 2x₂ + 6x₃ = 8, 3x₁ + 14x₂ + 10x₃ = −5." },
          { tex: "\\left[\\begin{array}{ccc|c}1&4&3&-1\\\\0&2&6&8\\\\3&14&10&-5\\end{array}\\right]\\;\\sim\\;\\left[\\begin{array}{ccc|c}1&0&0&1\\\\0&1&0&-2\\\\0&0&1&2\\end{array}\\right]" },
        ],
        answerTex: "x=(1,-2,2)\\;\\Rightarrow\\;\\vec{b}=\\vec{a}_1-2\\vec{a}_2+2\\vec{a}_3\\;\\;(\\text{yes})",
      },
    },
    {
      type: "checkpoint",
      q: "b is a linear combination of a₁, …, aₙ exactly when…",
      options: ["b = 0", "the system [a₁ … aₙ | b] is consistent", "the aᵢ are independent", "n ≥ 3"],
      correctIndex: 1,
      explanation: "A solution to that system gives the weights; consistency ⇔ b lies in the span.",
    },

    { type: "heading", eyebrow: "Section 1.3 · Part 3", title: "Span" },
    {
      type: "definition",
      term: "Span{v₁, …, vₚ}",
      text: "The set of *all* linear combinations of v₁, …, vₚ — every vector x₁v₁ + … + xₚvₚ for scalars xᵢ. So b lies in the span exactly when the corresponding system is consistent.",
    },
    { type: "figure", name: "span-line-plane", caption: "One vector spans a line through the origin; two independent vectors span a plane through the origin." },
    {
      type: "callout",
      tone: "note",
      title: "Geometry of span",
      text: "**Span{v}** (one nonzero vector) is the **line** through 0 along v. **Span{v₁, v₂}**: if v₂ is a *multiple* of v₁ they are dependent and the span collapses to a **line**; if neither is a multiple of the other they are independent and the span is a **plane** through 0. Span always contains 0 (all weights = 0).",
    },
    {
      type: "example",
      title: "Is b in the plane spanned by the columns?",
      example: {
        prompt: "Columns a₁ = (1, 3, 0), a₂ = (2, 1, 5); b = (8, 3, 17). Is b in Span{a₁, a₂}?",
        steps: [
          { tex: "\\left[\\begin{array}{cc|c}1&2&8\\\\3&1&3\\\\0&5&17\\end{array}\\right]\\;\\xrightarrow{-3R_1+R_2}\\;\\left[\\begin{array}{cc|c}1&2&8\\\\0&-5&-21\\\\0&5&17\\end{array}\\right]\\;\\xrightarrow{R_2+R_3}\\;\\left[\\begin{array}{cc|c}1&2&8\\\\0&-5&-21\\\\0&0&-4\\end{array}\\right]" },
          { text: "The bottom row says 0 = −4 — a pivot in the last column. The system is inconsistent." },
        ],
        answerTex: "0=-4\\ \\text{(inconsistent)}\\;\\Rightarrow\\;\\vec{b}\\notin\\operatorname{Span}\\{\\vec{a}_1,\\vec{a}_2\\}",
      },
    },
    {
      type: "example",
      title: "For what value of h is y in the span?",
      example: {
        prompt: "v₁ = (1, −1, −2), v₂ = (5, −4, −7), v₃ = (−3, 1, 0), y = (−4, 3, h). For which h is y in Span{v₁, v₂, v₃}?",
        steps: [
          { tex: "\\left[\\begin{array}{ccc|c}1&5&-3&-4\\\\-1&-4&1&3\\\\-2&-7&0&h\\end{array}\\right]\\;\\xrightarrow[\\;2R_1+R_3\\;]{R_1+R_2}\\;\\left[\\begin{array}{ccc|c}1&5&-3&-4\\\\0&1&-2&-1\\\\0&3&-6&h-8\\end{array}\\right]" },
          { tex: "\\xrightarrow{-3R_2+R_3}\\;\\left[\\begin{array}{ccc|c}1&5&-3&-4\\\\0&1&-2&-1\\\\0&0&0&\\,h-5\\end{array}\\right]" },
          { text: "Consistent ⇔ no pivot in the last column ⇔ h − 5 = 0." },
        ],
        answerTex: "\\vec{y}\\in\\operatorname{Span}\\{\\vec{v}_1,\\vec{v}_2,\\vec{v}_3\\}\\iff h=5",
      },
    },
    {
      type: "checkpoint",
      q: "Reducing [v₁ v₂ | b] gives the bottom row [0 0 | −4]. Is b in Span{v₁, v₂}?",
      options: ["Yes", "No — the system is inconsistent", "Only if b = 0", "Cannot tell"],
      correctIndex: 1,
      explanation: "0 = −4 is impossible, so b is not a linear combination of v₁, v₂.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    {
      type: "prose",
      text: "Use the **span checker** to test any vectors and b yourself, then lock the ideas in with the lecture's own practice set and flashcards below.",
    },
    { type: "practice", practice: { topic: "lec3", count: 6 } },
  ],
};
