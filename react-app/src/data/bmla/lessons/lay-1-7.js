/** @type {import("../curriculum.js").Lesson} */
// Lay §1.7 — Linear Independence. Grounded in the course's "Linear
// Dependence" notes (definition, link to Ax = 0, the worked examples and
// shortcut properties). Original wording; no verbatim text reproduced.
export default {
  slug: "lay-1-7",
  moduleSlug: "vectors",
  title: "§1.7 — Linear Independence",
  objective:
    "Test a set of vectors for linear independence via Ax = 0, find a linear dependence relation when one exists, and apply the quick shortcuts (two-vector multiples, p > n, the zero vector).",
  minutes: 22,
  tools: ["span", "rref"],
  blocks: [
    { type: "heading", eyebrow: "Section 1.7 · Part 1", title: "Independent or dependent?" },
    {
      type: "definition",
      term: "Linear independence",
      text: "A set {v₁, …, vₚ} in ℝⁿ is **linearly independent** if x₁v₁ + … + xₚvₚ = 0 has *only* the trivial solution. It is **linearly dependent** if some weights c₁, …, cₚ — *not all zero* — give c₁v₁ + … + cₚvₚ = 0 (a **dependence relation**).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "It's just a homogeneous system",
      text: "Put the vectors as columns: A = [v₁ … vₚ]. Then the set is **independent ⇔ Ax = 0 has only the trivial solution** (a pivot in every column), and **dependent ⇔ Ax = 0 has a nontrivial solution** (a free variable).",
    },
    {
      type: "example",
      title: "Worked example — find the dependence relation",
      example: {
        prompt: "Is {v₁, v₂, v₃} dependent, where v₁ = (1, 2, 3), v₂ = (4, 5, 6), v₃ = (2, 1, 0)? If so, give a relation.",
        steps: [
          { tex: "[\\,\\vec v_1\\ \\vec v_2\\ \\vec v_3\\,]=\\left[\\begin{array}{ccc}1&4&2\\\\2&5&1\\\\3&6&0\\end{array}\\right]\\;\\sim\\;\\left[\\begin{array}{ccc}1&0&-2\\\\0&1&1\\\\0&0&0\\end{array}\\right]" },
          { text: "x₃ is free → nontrivial solutions exist → dependent. Take x₃ = 1: x₁ = 2, x₂ = −1." },
        ],
        answerTex: "2\\vec v_1-\\vec v_2+\\vec v_3=\\vec 0\\quad(\\text{a linear dependence relation})",
      },
    },
    {
      type: "example",
      title: "Worked example — an independent set",
      example: {
        prompt: "Are the columns of [0 −8 5; 3 −7 4; −1 5 −4] linearly independent?",
        steps: [
          { text: "Row-reduce (or take the determinant). The determinant is −24 ≠ 0, so there is a pivot in every column." },
          { tex: "\\det\\left[\\begin{array}{ccc}0&-8&5\\\\3&-7&4\\\\-1&5&-4\\end{array}\\right]=-24\\neq 0" },
        ],
        answerTex: "\\text{Pivot in every column}\\ \\Rightarrow\\ A\\vec x=\\vec 0\\ \\text{only trivially}\\ \\Rightarrow\\ \\text{independent.}",
      },
    },
    {
      type: "checkpoint",
      q: "A set {v₁, …, vₚ} is linearly independent when…",
      options: ["some nonzero weights give a zero combination", "x₁v₁ + … + xₚvₚ = 0 forces every xᵢ = 0", "one vector is a multiple of another", "p > n"],
      correctIndex: 1,
      hint: "Independence = only the trivial solution.",
      explanation: "Independence means the *only* way to combine them to 0 is with all-zero weights.",
    },

    { type: "heading", eyebrow: "Section 1.7 · Part 2", title: "Shortcuts you should know cold" },
    {
      type: "theorem",
      name: "characterization",
      text: "A set of **two or more** vectors is linearly dependent **if and only if at least one of the vectors is a linear combination of the others**.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Three instant tests",
      text: "**Two vectors** are dependent ⇔ one is a scalar multiple of the other. **Too many vectors:** any set with **p > n** (more vectors than entries) is automatically dependent. **Zero vector:** any set containing **0** is automatically dependent.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Independence vs spanning — don't mix them up",
      text: "Columns **independent ⇔ pivot in every column** (uniqueness of Ax = 0). Columns **span ℝᵐ ⇔ pivot in every row** (existence for Ax = b). Different conditions, different direction.",
    },
    {
      type: "checkpoint",
      variant: "tryit",
      q: "Is a set of 5 vectors in ℝ³ linearly independent or dependent?",
      options: ["independent", "dependent", "depends on the vectors", "cannot tell"],
      correctIndex: 1,
      hint: "Compare the number of vectors to the number of entries.",
      explanation: "p = 5 > n = 3, so the set must be dependent — there aren't enough pivot rows for 5 independent columns.",
    },

    { type: "heading", eyebrow: "Practice", title: "Drill it" },
    { type: "prose", text: "Stack the vectors as columns in the span solver to see the pivots, then take the practice set." },
    { type: "practice", practice: { topic: "lindep", count: 6 } },
  ],
};
