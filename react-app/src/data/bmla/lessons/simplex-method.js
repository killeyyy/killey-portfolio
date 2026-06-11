/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "simplex-method",
  moduleSlug: "linear-programming",
  title: "The Simplex Method",
  objective: "By the end you can set up a Simplex tableau, pivot correctly, and read the final tableau like a story.",
  minutes: 20,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "**Simplex** is the corner-point theorem industrialized: start at a corner, hop along edges to better corners, stop when no neighbor improves. The bookkeeping happens in a **tableau**.",
    },
    {
      type: "prose",
      text: "**Step 0 — standard form.** Turn every ≤ constraint into an equation with a **slack variable** (unused capacity):",
    },
    { type: "math", tex: "2x+y\\le 10 \\;\\Rightarrow\\; 2x+y+s_1=10,\\quad s_1\\ge 0" },
    {
      type: "example",
      title: "The pivot loop (this is the whole algorithm)",
      example: {
        prompt: "One Simplex iteration, in order.",
        steps: [
          { text: "1) **Entering variable:** the most negative coefficient in the Z-row (biggest improvement per unit)." },
          { text: "2) **Leaving variable:** the minimum ratio test — divide each RHS by its positive entry in the entering column; smallest ratio leaves (keeps everything feasible)." },
          { text: "3) **Pivot:** make the pivot element 1, clear the rest of its column with row operations (exactly Gaussian elimination!)." },
          { text: "4) Repeat until the Z-row has **no negative coefficients** → optimal." },
        ],
        answerTex: "\\text{Optimal when every }Z\\text{-row coefficient} \\ge 0.",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Reading the final tableau",
      text: "Basic variables (identity columns) take their RHS values; everything else is 0. **Z** sits in the corner. A zero coefficient for a *non-basic* variable in the Z-row signals **multiple optima**; no positive ratio in the entering column signals **unbounded**.",
    },
    {
      type: "prose",
      text: "Constraints with **≥ or =** can't start from slack alone — that's where **Big-M / two-phase** come in: add artificial variables with a huge penalty so the algorithm is forced to drive them out. If an artificial variable survives at the end, the problem is **infeasible**.",
    },
    {
      type: "callout",
      tone: "note",
      text: "**Duality** preview: every max-LP has a shadow min-LP over the same data; the optimal values match, and the dual's solution reads off your final tableau. It's how you'll recover the primal in the toughest question.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Practice below randomizes each attempt — these are never your graded problems.",
    },
    { type: "practice", practice: { bankId: "linear-programming", count: 5 } },
  ],
};
