/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "transportation-problem",
  moduleSlug: "networks",
  title: "The Transportation Problem",
  objective: "By the end you can balance a transportation table, build an initial solution (NW-corner / least-cost), and test it for optimality.",
  minutes: 18,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Ship goods from **sources** (supplies) to **destinations** (demands) at minimum cost. The data is a cost table with supply down the side and demand along the bottom.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Step 0 — balance it",
      text: "Total supply must equal total demand. If not, add a **dummy row or column** with zero costs to absorb the difference. Skipping this invalidates everything after.",
    },
    {
      type: "example",
      title: "Initial solution — two methods",
      example: {
        prompt: "How to get a starting (basic feasible) solution.",
        steps: [
          { text: "**North-West Corner:** start top-left; allocate min(supply, demand); cross out the exhausted row/column; step right or down; repeat. Fast, ignores cost." },
          { text: "**Least-Cost:** allocate as much as possible to the **cheapest** cell first, then the next cheapest, crossing out as you go. Slower, but starts closer to optimal." },
          { text: "Either way you should end with **m + n − 1 allocated (basic) cells** for an m×n table." },
        ],
        answerTex: "\\#\\text{basic cells}=m+n-1\\;\\;(\\text{fewer} \\Rightarrow \\text{degenerate — add a zero allocation})",
      },
    },
    {
      type: "prose",
      text: "**Optimality test (MODI / stepping-stone):** assign potentials uᵢ, vⱼ with **uᵢ + vⱼ = cᵢⱼ on basic cells** (set u₁ = 0). For each empty cell compute the improvement index **Δᵢⱼ = cᵢⱼ − uᵢ − vⱼ**. All Δ ≥ 0 → optimal. Any Δ < 0 → trace its **closed loop** through basic cells, shift the smallest allocation around the loop, and re-test.",
    },
    {
      type: "callout",
      tone: "tip",
      text: "The loop only turns at **basic cells**, alternates + / − corners, and the smallest allocation on a − corner is what moves. Draw it — markers love a clean loop diagram.",
    },
    {
      type: "callout",
      tone: "note",
      text: "VAM (Vogel's) is the third starter method: compute row/column **penalties** (difference between two cheapest costs) and satisfy the biggest penalty first. Best start of the three; more bookkeeping.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice — never live coursework answers.",
    },
    { type: "practice", practice: { bankId: "networks", count: 4 } },
  ],
};
