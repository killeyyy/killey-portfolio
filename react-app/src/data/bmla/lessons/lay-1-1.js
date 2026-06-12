/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lay-1-1",
  moduleSlug: "matrices",
  title: "§1.1 — Systems of Linear Equations",
  objective:
    "Recognise a linear system, write its (augmented) matrix, apply the three elementary row operations, and answer the two fundamental questions: does a solution exist, and is it unique?",
  minutes: 22,
  tools: ["rref"],
  blocks: [
    {
      type: "prose",
      text: "A **linear equation** in the variables x₁,…,xₙ is one that can be written as a₁x₁ + a₂x₂ + … + aₙxₙ = b, where the coefficients aᵢ and the constant b are real numbers. The key word is **linear**: every variable appears to the first power only — no x², no xy, no √x, no sin x.",
    },
    { type: "math", tex: "a_1x_1+a_2x_2+\\dots+a_nx_n=b" },
    {
      type: "prose",
      text: "A **system of linear equations** (a *linear system*) is a collection of one or more linear equations in the same variables. A **solution** is a list (s₁,…,sₙ) of numbers that makes *every* equation true at once. The set of all solutions is the **solution set**, and two systems are **equivalent** when they have the same solution set.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Only three possibilities — always",
      text: "A linear system has either **(1)** no solution, **(2)** exactly one solution, or **(3)** infinitely many solutions. Never two, never seven. A system with at least one solution is **consistent**; with none, **inconsistent**. Two lines in a plane make this obvious: they miss (parallel), cross once, or coincide.",
    },
    {
      type: "prose",
      text: "We record the system compactly. The **coefficient matrix** holds the aᵢⱼ; the **augmented matrix** tacks the constants on as a final column, separated by a bar. All the information lives here — the x's are just placeholders.",
    },
    {
      type: "math",
      tex: "\\begin{aligned}x_1-2x_2+\\ \\ x_3&=0\\\\2x_2-8x_3&=8\\\\5x_1\\qquad-5x_3&=10\\end{aligned}\\;\\longrightarrow\\;\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&2&-8&8\\\\5&0&-5&10\\end{array}\\right]",
    },
    {
      type: "prose",
      text: "We solve by replacing the system with a simpler **equivalent** one, using three reversible moves — the **elementary row operations**:",
    },
    {
      type: "callout",
      tone: "note",
      title: "The three elementary row operations",
      text: "**Replacement** — add a multiple of one row to another (Rᵢ → Rᵢ + k·Rⱼ). **Interchange** — swap two rows (Rᵢ ↔ Rⱼ). **Scaling** — multiply a row by a nonzero constant (Rᵢ → k·Rᵢ). Each one is reversible, so the new matrix is **row equivalent** to the old, and row-equivalent augmented matrices have the *same solution set*.",
    },
    {
      type: "example",
      title: "Worked example — solve by row operations",
      example: {
        prompt: "Solve the system above.",
        steps: [
          { text: "Clear the x₁ from row 3: R₃ → R₃ − 5R₁." },
          { tex: "\\left[\\begin{array}{ccc|c}1&-2&1&0\\\\0&2&-8&8\\\\0&10&-10&10\\end{array}\\right]" },
          { text: "Scale R₂ → ½R₂, then clear column 2: R₃ → R₃ − 10R₂, R₁ → R₁ + 2R₂." },
          { text: "Finish to read x₁, x₂, x₃ directly off the last column." },
        ],
        answerTex: "x_1=1,\\quad x_2=0,\\quad x_3=-1",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "The two questions that drive all of Chapter 1",
      text: "**Existence:** is the system consistent (does a solution exist)? **Uniqueness:** if it exists, is it the only one? Everything in §1.1–§1.5 is machinery for answering these two questions reliably.",
    },
    {
      type: "prose",
      text: "Use the **interactive solver** below: type any augmented matrix and watch each elementary row operation applied in turn, with the existence/uniqueness verdict at the end.",
    },
  ],
};
