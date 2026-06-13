/** @type {import("../curriculum.js").Lesson} */
// Mirrors Lecture 3 (13 Jun) — Vector Equations, Lay §1.3.
// Same definitions, the ℝ² linear-combination examples, the
// vector-equation ⇔ augmented-system bridge, the b = a₁ − 2a₂ + 2a₃ solve,
// Span geometry, the "is b in the span" inconsistent example (0 = −4),
// and the parameter problem (y ∈ Span ⇔ h = 5) — exactly as taught.
export default {
  slug: "lay-1-3",
  moduleSlug: "vectors",
  title: "§1.3 — Vector Equations",
  objective:
    "Work with vectors in ℝⁿ (equality, sums, scalar multiples), write linear combinations, turn a vector equation into an augmented system, decide whether b is a linear combination of given vectors, and describe Span{v₁,…,vₚ} geometrically.",
  minutes: 24,
  tools: ["span", "rref", "flashcards"],
  blocks: [
    {
      type: "prose",
      text: "A matrix with only one column is a **column vector**, or simply a **vector**. A vector in **ℝⁿ** is a column of n real numbers. Two vectors are **equal** if and only if their *corresponding entries* are equal — so order matters: [4; 7] ≠ [7; 4], while [a; 5] = [2; b] forces a = 2 and b = 5.",
    },
    {
      type: "prose",
      text: "Two operations. The **sum** u + v adds corresponding entries; the **scalar multiple** cu multiplies every entry by c. Geometrically, u + v is the fourth vertex of the parallelogram with vertices 0, u and v (the **parallelogram rule**).",
    },
    { type: "math", tex: "\\begin{bmatrix}1\\\\-2\\end{bmatrix}+\\begin{bmatrix}2\\\\5\\end{bmatrix}=\\begin{bmatrix}3\\\\3\\end{bmatrix},\\qquad 5\\begin{bmatrix}3\\\\-1\\end{bmatrix}=\\begin{bmatrix}15\\\\-5\\end{bmatrix}" },
    {
      type: "prose",
      text: "A **linear combination** of vectors v₁, …, vₚ with **weights** c₁, …, cₚ (any real numbers — including zero or negatives) is the vector y = c₁v₁ + c₂v₂ + … + cₚvₚ. This single idea is the heartbeat of the whole course.",
    },
    { type: "math", tex: "\\vec{y}=c_1\\vec{v}_1+c_2\\vec{v}_2+\\dots+c_p\\vec{v}_p" },
    {
      type: "example",
      title: "Linear combinations in ℝ²",
      example: {
        prompt: "With v₁ = (2, 1) and v₂ = (−2, 2), write each target as a linear combination of v₁ and v₂.",
        steps: [
          { tex: "\\vec{b}=\\begin{bmatrix}-4\\\\1\\end{bmatrix}=-1\\begin{bmatrix}2\\\\1\\end{bmatrix}+1\\begin{bmatrix}-2\\\\2\\end{bmatrix}=\\begin{bmatrix}-2\\\\-1\\end{bmatrix}+\\begin{bmatrix}-2\\\\2\\end{bmatrix}" },
          { tex: "\\vec{c}=\\begin{bmatrix}6\\\\6\\end{bmatrix}=4\\begin{bmatrix}2\\\\1\\end{bmatrix}+1\\begin{bmatrix}-2\\\\2\\end{bmatrix}=\\begin{bmatrix}8\\\\4\\end{bmatrix}+\\begin{bmatrix}-2\\\\2\\end{bmatrix}" },
        ],
        answerTex: "\\vec{b}=-\\vec{v}_1+\\vec{v}_2,\\qquad \\vec{c}=4\\vec{v}_1+\\vec{v}_2",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "The bridge — vector equation ⇔ augmented system",
      text: "Asking \"is b a linear combination of a₁, …, aₙ?\" is **exactly** asking \"does the system with augmented matrix [a₁ a₂ … aₙ | b] have a solution?\" The weights you're hunting for *are* the solution. So **b is a linear combination of a₁, …, aₙ ⇔ that system is consistent** — and every span question becomes a row reduction.",
    },
    {
      type: "example",
      title: "Worked example — is b a linear combination?",
      example: {
        prompt: "Let a₁ = (1, 0, 3), a₂ = (4, 2, 14), a₃ = (3, 6, 10), b = (−1, 8, −5). Is b a linear combination of a₁, a₂, a₃?",
        steps: [
          { tex: "x_1\\begin{bmatrix}1\\\\0\\\\3\\end{bmatrix}+x_2\\begin{bmatrix}4\\\\2\\\\14\\end{bmatrix}+x_3\\begin{bmatrix}3\\\\6\\\\10\\end{bmatrix}=\\begin{bmatrix}-1\\\\8\\\\-5\\end{bmatrix}" },
          { text: "This vector equation is the system x₁ + 4x₂ + 3x₃ = −1, 2x₂ + 6x₃ = 8, 3x₁ + 14x₂ + 10x₃ = −5." },
          { tex: "\\left[\\begin{array}{ccc|c}1&4&3&-1\\\\0&2&6&8\\\\3&14&10&-5\\end{array}\\right]\\;\\sim\\;\\left[\\begin{array}{ccc|c}1&0&0&1\\\\0&1&0&-2\\\\0&0&1&2\\end{array}\\right]" },
        ],
        answerTex: "x=(1,-2,2)\\;\\Rightarrow\\;\\vec{b}=\\vec{a}_1-2\\vec{a}_2+2\\vec{a}_3\\;\\;(\\text{yes})",
      },
    },
    {
      type: "callout",
      tone: "note",
      title: "Span — two equivalent definitions",
      text: "For v₁, …, vₚ in ℝⁿ, **Span{v₁, …, vₚ}** is the set of *all* linear combinations of them — equivalently, the collection of every vector that can be written as x₁v₁ + … + xₚvₚ for scalars x₁, …, xₚ. So b lies in the span exactly when the corresponding system is consistent.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Geometry of span",
      text: "**Span{v}** (one nonzero vector) is the **line** through the origin along v — all multiples cv. **Span{v₁, v₂}**: if v₂ is a *multiple* of v₁ the two are dependent and the span collapses to a **line** (Span{v₁,v₂} = Span{v₁}); if neither is a multiple of the other they are independent and the span is a **plane** through the origin. Span always contains 0 (take all weights = 0).",
    },
    {
      type: "example",
      title: "Is b in the plane spanned by the columns of A?",
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
      type: "prose",
      text: "Use the **solver** to row-reduce any of these augmented matrices yourself, then lock the ideas in with the lecture's own practice set and flashcards below.",
    },
    { type: "practice", practice: { topic: "lec3", count: 6 } },
  ],
};
