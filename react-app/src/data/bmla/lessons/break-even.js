/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "break-even",
  moduleSlug: "business-math",
  title: "Cost, Revenue & Break-Even",
  objective: "By the end you can build cost/revenue functions and find the break-even quantity two ways.",
  minutes: 12,
  tools: ["break-even", "quiz:break-even"],
  blocks: [
    {
      type: "prose",
      text: "Every business-math problem here is the same shape: **total cost** rises with a fixed part plus a per-unit part; **revenue** rises with price per unit. Where they cross is **break-even**.",
    },
    { type: "math", tex: "C(q)=F+vq,\\qquad R(q)=pq,\\qquad \\text{Profit }=R(q)-C(q)" },
    {
      type: "callout",
      tone: "tip",
      title: "Break-even shortcut",
      text: "Set R = C and solve: the break-even quantity is fixed cost ÷ contribution margin.",
    },
    { type: "math", tex: "q^{*}=\\dfrac{F}{\\,p-v\\,}" },
    {
      type: "example",
      title: "Worked example",
      example: {
        prompt: "Fixed cost 1200, unit cost 8, sell price 20. Break-even quantity?",
        steps: [
          { text: "Contribution margin = p − v = 20 − 8 = 12 per unit." },
          { tex: "q^{*}=\\frac{1200}{20-8}=\\frac{1200}{12}" },
        ],
        answerTex: "q^{*}=100\\text{ units}",
      },
    },
    {
      type: "callout",
      tone: "note",
      text: "Play with the **interactive break-even chart** below — drag the sliders and watch the crossover point move.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original practice, randomized values. Learning tool — not a coursework answer key.",
    },
    { type: "practice", practice: { bankId: "break-even", count: 4 } },
  ],
};
