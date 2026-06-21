/** @type {import("../curriculum.js").Exercise} */
// Ex 2.6 — Applications: Growth and Decay; Mathematics of Finance.
// #23 sales (limited growth), #29 bacteria growth, #35 half-life, #39 decay,
// #41 radioactivity decay, #43–45 Newton's Law of Cooling.
export default {
  slug: "ex-2-6",
  section: "2.6",
  chapter: 2,
  title: "Applications: Growth & Decay · Mathematics of Finance",
  source: "Calculus with Applications (Brief Version)",
  problems: [
    {
      num: 23,
      topic: "limited growth model",
      prompt:
        "Sales of a new CD player are `S(x) = 1000 − 800e^{−x}` (x = years on the market). (a) Sales in year 0. (b) When do sales reach 500 units? (c) Will sales ever reach 1000? (d) Is there a limit on sales?",
      steps: [
        { tex: "(a)\\ S(0)=1000-800e^{0}=1000-800=200\\ \\text{units}" },
        { text: "(b) Set S = 500 and solve:" },
        { tex: "800e^{-x}=500 \\Rightarrow e^{-x}=0.625 \\Rightarrow x=-\\ln 0.625\\approx 0.47\\ \\text{yr}" },
        { text: "(c) S = 1000 needs 800e^(−x) = 0, impossible — sales approach but never reach 1000. (d) As x → ∞, e^(−x) → 0, so the limiting sales level is 1000 units (horizontal asymptote)." },
      ],
      answerTex: "(a)\\,200\\quad (b)\\approx 0.47\\text{ yr}\\quad (c)\\,\\text{no}\\quad (d)\\,\\text{limit }1000\\text{ units}",
    },
    {
      num: 29,
      topic: "exponential growth · date-coding",
      prompt:
        "Bacteria in a product number `f(t) = 500e^{0.1t}` (millions), t = days after packing. (a) The product is unsafe once the count reaches 3000 million — how long does that take? (b) If t = 0 is January 1, what use-by date should be printed?",
      steps: [
        { text: "(a) Set f(t) = 3000 and solve:" },
        { tex: "500e^{0.1t}=3000 \\Rightarrow e^{0.1t}=6 \\Rightarrow t=\\frac{\\ln 6}{0.1}\\approx 17.9\\ \\text{days}" },
        { text: "(b) About 17.9 days after January 1 → roughly January 18." },
      ],
      answerTex: "(a)\\approx 17.9\\text{ days}\\quad (b)\\approx \\text{January 18}",
    },
    {
      num: 35,
      topic: "half-life",
      prompt:
        "Plutonium-241 has a half-life of about 13 years. (a) How much of a 4 g sample remains after 100 years? (b) How long until a 4 g sample decays to 0.1 g?",
      steps: [
        { text: "Use A(t) = A₀(1/2)^{t/13} with A₀ = 4." },
        { tex: "(a)\\ A(100)=4\\left(\\tfrac12\\right)^{100/13}\\approx 4(0.00483)\\approx 0.0193\\ \\text{g}" },
        { text: "(b) Set A(t) = 0.1 and solve:" },
        { tex: "\\left(\\tfrac12\\right)^{t/13}=0.025 \\Rightarrow \\frac{t}{13}=\\frac{\\ln 0.025}{\\ln 0.5}\\approx 5.32 \\Rightarrow t\\approx 69.2\\ \\text{yr}" },
      ],
      answerTex: "(a)\\approx 0.0193\\text{ g}\\quad (b)\\approx 69.2\\text{ years}",
    },
    {
      num: 39,
      topic: "exponential decay",
      prompt:
        "A satellite's radioactive power supply outputs `y = 40e^{−0.004t}` watts (t in days). (a) Power after 180 days. (b) When is the power half its original strength? (c) Will the power ever be completely gone?",
      steps: [
        { tex: "(a)\\ y=40e^{-0.004(180)}=40e^{-0.72}\\approx 19.5\\ \\text{watts}" },
        { text: "(b) Half of 40 is 20:" },
        { tex: "40e^{-0.004t}=20 \\Rightarrow e^{-0.004t}=0.5 \\Rightarrow t=\\frac{\\ln 0.5}{-0.004}\\approx 173\\ \\text{days}" },
        { text: "(c) No — e^(−0.004t) is always positive, so y → 0 as t grows but never actually reaches 0. The power keeps shrinking but is never completely gone." },
      ],
      answerTex: "(a)\\approx 19.5\\text{ W}\\quad (b)\\approx 173\\text{ days}\\quad (c)\\,\\text{never 0}",
    },
    {
      num: 41,
      topic: "exponential decay · application",
      prompt:
        "The percent of radioactive iodine still in contaminated hay after t days is `P(t) = 100e^{−0.1t}`. (a) Percent after 4 days. (b) Percent after 10 days. (c) Days until it falls to 10% of the original. (d) Days until it falls to 1%.",
      steps: [
        { tex: "(a)\\ P(4)=100e^{-0.4}\\approx 67.0\\%" },
        { tex: "(b)\\ P(10)=100e^{-1}\\approx 36.8\\%" },
        { text: "(c) Set P = 10:" },
        { tex: "100e^{-0.1t}=10 \\Rightarrow e^{-0.1t}=0.1 \\Rightarrow t=\\frac{\\ln 0.1}{-0.1}\\approx 23\\ \\text{days}" },
        { text: "(d) Set P = 1:" },
        { tex: "e^{-0.1t}=0.01 \\Rightarrow t=\\frac{\\ln 0.01}{-0.1}\\approx 46\\ \\text{days}" },
      ],
      answerTex: "(a)\\approx 67.0\\%\\ (b)\\approx 36.8\\%\\ (c)\\approx 23\\text{ days}\\ (d)\\approx 46\\text{ days}",
    },
    {
      num: 43,
      topic: "Newton's Law of Cooling",
      prompt: "Using `f(t) = T₀ + Ce^{−kt}`, find the temperature when t = 9, given T₀ = 18, C = 5, k = 0.6.",
      steps: [
        { tex: "f(9)=18+5e^{-0.6(9)}=18+5e^{-5.4}\\approx 18+0.023\\approx 18.02" },
      ],
      answerTex: "f(9)\\approx 18.02^{\\circ}",
    },
    {
      num: 44,
      topic: "Newton's Law of Cooling",
      prompt:
        "Using `f(t) = T₀ + Ce^{−kt}` with C = 100, k = 0.1 (t in minutes), how long does a hot coffee take to cool to 25°C in a 20°C room?",
      steps: [
        { text: "Room temperature is T₀ = 20. Set f(t) = 25:" },
        { tex: "20+100e^{-0.1t}=25 \\Rightarrow e^{-0.1t}=0.05 \\Rightarrow t=\\frac{\\ln 0.05}{-0.1}\\approx 30\\ \\text{min}" },
      ],
      answerTex: "t\\approx 30\\text{ minutes}",
    },
    {
      num: 45,
      topic: "Newton's Law of Cooling",
      prompt:
        "Using `f(t) = T₀ + Ce^{−kt}` with C = −14.6, k = 0.6 (t in hours), how long does a frozen pizza take to thaw to 10°C in an 18°C room?",
      steps: [
        { text: "Room temperature is T₀ = 18. Set f(t) = 10:" },
        { tex: "18-14.6e^{-0.6t}=10 \\Rightarrow e^{-0.6t}=\\frac{8}{14.6}\\approx 0.548 \\Rightarrow t=\\frac{\\ln 0.548}{-0.6}\\approx 1.0\\ \\text{hr}" },
      ],
      answerTex: "t\\approx 1.0\\text{ hour}",
    },
  ],
};
