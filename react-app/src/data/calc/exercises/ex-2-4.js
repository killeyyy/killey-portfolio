/** @type {import("../curriculum.js").Exercise} */
// Ex 2.4 — Exponential Functions.
// #3–11 identify/match (form, growth/decay, intercept, asymptote, equivalences),
// #29–32 graphs, #37/41/47/52 interest, inflation, growth, decay.
export default {
  slug: "ex-2-4",
  section: "2.4",
  chapter: 2,
  title: "Exponential Functions",
  source: "Calculus with Applications (Brief Version)",
  problems: [
    {
      num: 3,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): give the form, whether it rises or falls, the y-intercept, and the asymptote.",
      promptTex: "y = 3^{x}",
      steps: [{ text: "Basic growth: increasing, with horizontal asymptote y = 0 and y-intercept (0, 1)." }],
      answerTex: "\\text{Increasing; }y\\text{-int }(0,1);\\ \\text{HA }y=0",
    },
    {
      num: 4,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): give the form, growth/decay, y-intercept, and asymptote.",
      promptTex: "y = 3^{-x}",
      steps: [
        { text: "3^(−x) = (1/3)^x — decay (decreasing), asymptote y = 0, y-intercept (0, 1)." },
        { text: "Equivalent to #8." },
      ],
      answerTex: "\\text{Decreasing; }y\\text{-int }(0,1);\\ \\text{HA }y=0",
    },
    {
      num: 5,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): simplify first, then give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = \\left(\\tfrac{1}{3}\\right)^{1-x}",
      steps: [
        { text: "Simplify:" },
        { tex: "\\left(\\tfrac13\\right)^{1-x}=\\tfrac13\\cdot 3^{x}=3^{x-1}" },
        { text: "Increasing; asymptote y = 0; y-intercept (0, 1/3). Equivalent to #11." },
      ],
      answerTex: "=3^{x-1}:\\ \\text{increasing; }y\\text{-int }(0,\\tfrac13);\\ \\text{HA }y=0",
    },
    {
      num: 6,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): simplify, then give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = 3^{x+1}",
      steps: [
        { tex: "3^{x+1}=3\\cdot 3^{x}" },
        { text: "Increasing; asymptote y = 0; y-intercept (0, 3). Equivalent to #7." },
      ],
      answerTex: "\\text{Increasing; }y\\text{-int }(0,3);\\ \\text{HA }y=0",
    },
    {
      num: 7,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): simplify, then give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = 3(3)^{x}",
      steps: [
        { tex: "3(3)^{x}=3^{x+1}" },
        { text: "Identical to #6: increasing; y-intercept (0, 3); asymptote y = 0." },
      ],
      answerTex: "=3^{x+1}:\\ \\text{increasing; }y\\text{-int }(0,3);\\ \\text{HA }y=0",
    },
    {
      num: 8,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): simplify, then give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = \\left(\\tfrac{1}{3}\\right)^{x}",
      steps: [
        { tex: "\\left(\\tfrac13\\right)^{x}=3^{-x}" },
        { text: "Decreasing; asymptote y = 0; y-intercept (0, 1). Equivalent to #4." },
      ],
      answerTex: "=3^{-x}:\\ \\text{decreasing; }y\\text{-int }(0,1);\\ \\text{HA }y=0",
    },
    {
      num: 9,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = 2 - 3^{-x}",
      steps: [
        { text: "As x → ∞, 3^(−x) → 0 so y → 2 (asymptote y = 2, approached from below); as x → −∞, y → −∞. So it is increasing." },
        { tex: "y\\text{-intercept } (0,\\,2-1)=(0,1)" },
      ],
      answerTex: "\\text{Increasing; }y\\text{-int }(0,1);\\ \\text{HA }y=2",
    },
    {
      num: 10,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = -2 + 3^{-x}",
      steps: [
        { text: "As x → ∞, 3^(−x) → 0 so y → −2 (asymptote y = −2); as x → −∞, y → ∞. So it is decreasing." },
        { tex: "y\\text{-intercept } (0,\\,-2+1)=(0,-1)" },
      ],
      answerTex: "\\text{Decreasing; }y\\text{-int }(0,-1);\\ \\text{HA }y=-2",
    },
    {
      num: 11,
      topic: "match graph (A–F)",
      prompt: "Match to the correct graph (A–F): give growth/decay, y-intercept, and asymptote.",
      promptTex: "y = 3^{x-1}",
      steps: [{ text: "Increasing; asymptote y = 0; y-intercept (0, 1/3). Equivalent to #5." }],
      answerTex: "\\text{Increasing; }y\\text{-int }(0,\\tfrac13);\\ \\text{HA }y=0",
    },
    {
      num: 29,
      topic: "graph an exponential",
      prompt: "Graph the function; give the horizontal asymptote and y-intercept.",
      promptTex: "y = 5e^{x} + 2",
      steps: [
        { text: "Start from y = eˣ (increasing, asymptote y = 0). Stretch ×5, then shift up 2." },
        { tex: "\\text{HA } y=2;\\ \\ y\\text{-int }(0,7);\\ \\ \\text{increasing}" },
      ],
      answerTex: "\\text{increasing, HA }y=2,\\ y\\text{-int }(0,7)",
    },
    {
      num: 30,
      topic: "graph an exponential",
      prompt: "Graph the function; give the horizontal asymptote and y-intercept.",
      promptTex: "y = -2e^{x} - 3",
      steps: [
        { text: "y = eˣ reflected and stretched (×−2), then down 3. As x → −∞, y → −3; as x → ∞, y → −∞." },
        { tex: "\\text{HA } y=-3;\\ \\ y\\text{-int }(0,-5);\\ \\ \\text{decreasing}" },
      ],
      answerTex: "\\text{decreasing, HA }y=-3,\\ y\\text{-int }(0,-5)",
    },
    {
      num: 31,
      topic: "graph an exponential",
      prompt: "Graph the function; give the horizontal asymptote and y-intercept.",
      promptTex: "y = -3e^{-2x} + 2",
      steps: [
        { text: "As x → ∞, e^(−2x) → 0 so y → 2 (asymptote y = 2); as x → −∞, y → −∞ — increasing." },
        { tex: "y\\text{-int }(0,-1)" },
      ],
      answerTex: "\\text{increasing, HA }y=2,\\ y\\text{-int }(0,-1)",
    },
    {
      num: 32,
      topic: "graph an exponential",
      prompt: "Graph the function; give the horizontal asymptote and y-intercept.",
      promptTex: "y = 4e^{-x/2} - 1",
      steps: [
        { text: "As x → ∞, e^(−x/2) → 0 so y → −1 (asymptote y = −1); as x → −∞, y → ∞ — decreasing." },
        { tex: "y\\text{-int }(0,3)" },
      ],
      answerTex: "\\text{decreasing, HA }y=-1,\\ y\\text{-int }(0,3)",
    },
    {
      num: 37,
      topic: "compound interest",
      prompt:
        "Find the interest earned on **$10,000** invested for **5 years** at **4%**, compounded (a) annually, (b) semiannually, (c) quarterly, (d) monthly, (e) continuously.",
      steps: [
        { text: "Use A = P(1 + r/n)^{nt} (and A = Pe^{rt} for continuous); interest = A − P. Here P = 10,000, r = 0.04, t = 5." },
        { tex: "(a)\\ 10000(1.04)^5=12166.53 \\Rightarrow \\$2166.53" },
        { tex: "(b)\\ 10000(1.02)^{10}=12189.94 \\Rightarrow \\$2189.94" },
        { tex: "(c)\\ 10000(1.01)^{20}=12201.90 \\Rightarrow \\$2201.90" },
        { tex: "(d)\\ 10000\\left(1+\\tfrac{0.04}{12}\\right)^{60}=12209.67 \\Rightarrow \\$2209.67" },
        { tex: "(e)\\ 10000e^{0.2}=12214.03 \\Rightarrow \\$2214.03" },
      ],
      answerTex: "(a)\\,\\$2166.53\\ (b)\\,\\$2189.94\\ (c)\\,\\$2201.90\\ (d)\\,\\$2209.67\\ (e)\\,\\$2214.03",
    },
    {
      num: 41,
      topic: "continuous compounding",
      prompt:
        "With continuous compounding, find the cost of a **$10** item in **3 years** at inflation rates (a) 3%, (b) 4%, (c) 5%.",
      steps: [
        { text: "Use A = Pe^{rt} with P = 10, t = 3." },
        { tex: "(a)\\ 10e^{0.09}\\approx\\$10.94\\quad (b)\\ 10e^{0.12}\\approx\\$11.27\\quad (c)\\ 10e^{0.15}\\approx\\$11.62" },
      ],
      answerTex: "(a)\\,\\$10.94\\quad (b)\\,\\$11.27\\quad (c)\\,\\$11.62",
    },
    {
      num: 47,
      topic: "exponential growth model",
      prompt:
        "World population (millions) since 1960 fits `A(t) = 3100e^{0.0166t}`, t = years since 1960. (a) Compare A to the actual 1970 figure of 3686 million. (b) Approximate the 2000 population (actual ≈ 6115). (c) Estimate the 2015 population.",
      steps: [
        { tex: "(a)\\ A(10)=3100e^{0.166}\\approx 3660\\ \\text{million}" },
        { text: "≈3660 million vs. the actual 3686 — within about 26 million (≈0.7% low)." },
        { tex: "(b)\\ A(40)=3100e^{0.664}\\approx 6022\\ \\text{million}" },
        { tex: "(c)\\ A(55)=3100e^{0.913}\\approx 7725\\ \\text{million}" },
      ],
      answerTex: "(a)\\approx 3660\\text{M (vs }3686)\\quad (b)\\approx 6022\\text{M}\\quad (c)\\approx 7725\\text{M}",
    },
    {
      num: 52,
      topic: "exponential decay",
      prompt:
        "A radioactive sample has `Q(t) = 1000·5^{−0.3t}` grams, with t in months. (a) How much remains after 6 months? (b) When does it drop to 8 g?",
      steps: [
        { text: "(a) Substitute t = 6:" },
        { tex: "Q(6)=1000\\cdot 5^{-1.8}\\approx 1000(0.0552)\\approx 55.2\\ \\text{g}" },
        { text: "(b) Set Q = 8 and solve for t:" },
        { tex: "5^{-0.3t}=0.008 \\;\\Rightarrow\\; -0.3t=\\log_5 0.008=-3 \\;\\Rightarrow\\; t=10\\ \\text{months}" },
      ],
      answerTex: "(a)\\approx 55.2\\text{ g}\\quad (b)\\,10\\text{ months}",
    },
  ],
};
