/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "lp-graphical",
  moduleSlug: "linear-programming",
  title: "LP Formulation & the Graphical Method",
  objective: "By the end you can turn a word problem into an LP and solve any 2-variable case with the corner-point theorem.",
  minutes: 16,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Every linear program has three parts: **decision variables** (what you choose), an **objective** (what you maximize/minimize), and **constraints** (what limits you). Write those three lines first — formulation marks are the easiest in the paper.",
    },
    { type: "math", tex: "\\max Z=4x+3y\\quad\\text{s.t.}\\quad 2x+y\\le 10,\\;\\; x+3y\\le 15,\\;\\; x,y\\ge 0" },
    {
      type: "callout",
      tone: "tip",
      title: "Corner-point theorem",
      text: "If an optimum exists, it lives at a **vertex** of the feasible region. So you never search the whole region — just evaluate Z at each corner and pick the best.",
    },
    {
      type: "example",
      title: "Worked example — solve the LP above",
      example: {
        prompt: "Maximize Z = 4x + 3y subject to the constraints shown.",
        steps: [
          { text: "Sketch both lines; the feasible region is the quadrilateral with corners (0,0), (5,0), (3,4), (0,5)." },
          { text: "The interesting corner is the intersection: solve 2x + y = 10 and x + 3y = 15 → x = 3, y = 4." },
          { tex: "Z(0,0)=0,\\quad Z(5,0)=20,\\quad Z(3,4)=24,\\quad Z(0,5)=15" },
        ],
        answerTex: "\\text{Optimal at } (3,4)\\text{ with } Z^{*}=24",
      },
    },
    {
      type: "prose",
      text: "Special cases to name-check: **unbounded** (region open in the improving direction), **infeasible** (constraints contradict), and **multiple optima** (objective line parallel to a binding constraint — the whole edge is optimal).",
    },
    {
      type: "callout",
      tone: "warn",
      text: "Graphical only works for **two variables**. Three or more → Simplex (next lesson). Examiners love asking why.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original practice with reshuffled values — sharpen the skill, then do your own coursework.",
    },
    { type: "practice", practice: { bankId: "linear-programming", count: 4 } },
  ],
};
