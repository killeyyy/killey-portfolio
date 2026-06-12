/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-1-3",
  moduleSlug: "vectors",
  title: "§1.3 — Vector Equations",
  objective:
    "Work with vectors in ℝⁿ, write a linear combination, recast a vector equation as an augmented system, and describe Span{v₁,…,vₚ} geometrically.",
  minutes: 22,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "A vector in **ℝⁿ** is just a column of n real numbers. Two vectors are **equal** only if matching entries agree. Two operations: add **entry-by-entry**, and **scale** by multiplying every entry by a scalar.",
    },
    { type: "math", tex: "\\vec{u}+\\vec{v}=\\begin{bmatrix}u_1\\\\u_2\\end{bmatrix}+\\begin{bmatrix}v_1\\\\v_2\\end{bmatrix}=\\begin{bmatrix}u_1+v_1\\\\u_2+v_2\\end{bmatrix},\\qquad c\\vec{u}=\\begin{bmatrix}cu_1\\\\cu_2\\end{bmatrix}" },
    {
      type: "prose",
      text: "A **linear combination** of vectors v₁,…,vₚ with **weights** c₁,…,cₚ (any real numbers, including zero or negatives) is the vector y = c₁v₁ + … + cₚvₚ. This single idea is the heartbeat of the whole course.",
    },
    { type: "math", tex: "\\vec{y}=c_1\\vec{v}_1+c_2\\vec{v}_2+\\dots+c_p\\vec{v}_p" },
    {
      type: "callout",
      tone: "tip",
      title: "The bridge to Chapter 1",
      text: "Asking \"is b a linear combination of v₁,…,vₚ?\" is **exactly** the same as asking \"does the system with augmented matrix [v₁ v₂ … vₚ | b] have a solution?\" The weights you're hunting for are the solution. So every span question becomes a row-reduction.",
    },
    {
      type: "example",
      title: "Worked example — is b a linear combination?",
      example: {
        prompt: "Let v₁ = (1, −2, −5), v₂ = (2, 5, 6), b = (7, 4, −3). Is b a combination of v₁, v₂?",
        steps: [
          { tex: "[\\,\\vec{v}_1\\ \\vec{v}_2\\mid \\vec{b}\\,]=\\left[\\begin{array}{cc|c}1&2&7\\\\-2&5&4\\\\-5&6&-3\\end{array}\\right]" },
          { text: "Row reduce. Rows 1–2 give c₁ = 3, c₂ = 2; row 3 checks out consistent." },
        ],
        answerTex: "\\vec{b}=3\\vec{v}_1+2\\vec{v}_2\\;\\Rightarrow\\;\\text{yes}",
      },
    },
    {
      type: "prose",
      text: "The **span** of v₁,…,vₚ — written **Span{v₁,…,vₚ}** — is the set of *all* linear combinations of them. So b is in the span exactly when the system above is consistent.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Geometry of span",
      text: "In ℝ³: **Span{v}** (one nonzero vector) is the **line** through the origin along v. **Span{u, v}** (two vectors, neither a multiple of the other) is the **plane** through the origin containing both. Span always contains the zero vector — set all weights to 0.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "Weights can be **any** real numbers — that's why a span is an infinite set (a whole line or plane), not just the few vectors you started with.",
    },
  ],
};
