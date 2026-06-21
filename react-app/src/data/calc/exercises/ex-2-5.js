/** @type {import("../curriculum.js").Exercise} */
// Ex 2.5 — Logarithmic Functions.
// #75 inflation doubling, #76 interest doubling/tripling, #87 population doubling.
export default {
  slug: "ex-2-5",
  section: "2.5",
  chapter: 2,
  title: "Logarithmic Functions",
  source: "Calculus with Applications (Brief Version)",
  problems: [
    {
      num: 75,
      topic: "doubling time · logarithms",
      prompt:
        "With annual compounding, find the time for the general price level to double at inflation rates (a) 3%, (b) 6%, (c) 8%. (d) Check with the rule of 70 or 72.",
      steps: [
        { text: "Doubling means (1 + r)^t = 2, so t = ln 2 ⁄ ln(1 + r)." },
        { tex: "(a)\\ t=\\frac{\\ln 2}{\\ln 1.03}\\approx 23.4\\ \\text{yr}\\quad (b)\\ \\frac{\\ln 2}{\\ln 1.06}\\approx 11.9\\ \\text{yr}\\quad (c)\\ \\frac{\\ln 2}{\\ln 1.08}\\approx 9.0\\ \\text{yr}" },
        { text: "(d) Rule of 72: 72/3 = 24, 72/6 = 12, 72/8 = 9 — each close to the exact value above." },
      ],
      answerTex: "(a)\\approx 23.4\\text{ yr}\\quad (b)\\approx 11.9\\text{ yr}\\quad (c)\\approx 9.0\\text{ yr}",
    },
    {
      num: 76,
      topic: "doubling/tripling time",
      prompt:
        "$15,000 earns **7%** compounded annually (interest credited at year-end). (a) Years to at least double. (b) Years to at least triple. (c) Check (a) with the rule of 70 or 72.",
      steps: [
        { text: "(a) Need (1.07)^t ≥ 2:" },
        { tex: "t=\\frac{\\ln 2}{\\ln 1.07}\\approx 10.24 \\;\\Rightarrow\\; 11\\text{ years (credited annually)}" },
        { text: "(b) Need (1.07)^t ≥ 3:" },
        { tex: "t=\\frac{\\ln 3}{\\ln 1.07}\\approx 16.24 \\;\\Rightarrow\\; 17\\text{ years}" },
        { text: "(c) Rule of 70: 70/7 = 10 years — matches the ≈10.24 doubling time." },
      ],
      answerTex: "(a)\\,11\\text{ years}\\quad (b)\\,17\\text{ years}\\quad (c)\\,70/7=10",
    },
    {
      num: 87,
      topic: "exponential model · logarithms",
      prompt:
        "(a) Hispanic population (millions) is `h(t) = 37.79(1.021)^t`, t = years since 2000. Find the year it reaches double the 2005 value of 42.69 million. (b) Asian population is `a(t) = 11.14(1.023)^t`; find the year it doubles the 2005 value of 12.69 million.",
      steps: [
        { text: "(a) Double of 42.69 is 85.38. Solve 37.79(1.021)^t = 85.38:" },
        { tex: "(1.021)^t=\\frac{85.38}{37.79}=2.259 \\;\\Rightarrow\\; t=\\frac{\\ln 2.259}{\\ln 1.021}\\approx 39.2" },
        { text: "t ≈ 39 → about the year 2039." },
        { text: "(b) Double of 12.69 is 25.38. Solve 11.14(1.023)^t = 25.38:" },
        { tex: "(1.023)^t=\\frac{25.38}{11.14}=2.278 \\;\\Rightarrow\\; t=\\frac{\\ln 2.278}{\\ln 1.023}\\approx 36.2" },
        { text: "t ≈ 36 → about the year 2036." },
      ],
      answerTex: "(a)\\ t\\approx 39.2\\ (\\text{year }2039)\\quad (b)\\ t\\approx 36.2\\ (\\text{year }2036)",
    },
  ],
};
