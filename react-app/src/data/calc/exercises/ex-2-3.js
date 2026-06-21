/** @type {import("../curriculum.js").Exercise} */
// Ex 2.3 — Polynomial and Rational Functions.
// #3–6 power-graph translations, #27–36 rational asymptotes/intercepts,
// #47/48/58 applications. Original wording, step-by-step.
export default {
  slug: "ex-2-3",
  section: "2.3",
  chapter: 2,
  title: "Polynomial & Rational Functions",
  source: "Calculus with Applications (Brief Version)",
  problems: [
    {
      num: 3,
      topic: "graph by translation",
      prompt: "Sketch the graph using shifts/reflections of a basic power function.",
      promptTex: "f(x)=(x-2)^3+3",
      steps: [
        { text: "Base curve y = x³ (S-shape, inflection at the origin). Shift right 2 and up 3." },
        { tex: "\\text{inflection / center at }(2,3);\\ \\text{increasing cubic}" },
      ],
      answerTex: "y=x^3\\ \\text{shifted right 2, up 3 — center }(2,3)",
    },
    {
      num: 4,
      topic: "graph by translation",
      prompt: "Sketch the graph using shifts/reflections of a basic power function.",
      promptTex: "f(x)=(x+1)^3-2",
      steps: [
        { text: "Base y = x³; shift left 1 and down 2." },
        { tex: "\\text{center at }(-1,-2);\\ \\text{increasing cubic}" },
      ],
      answerTex: "y=x^3\\ \\text{shifted left 1, down 2 — center }(-1,-2)",
    },
    {
      num: 5,
      topic: "graph by translation",
      prompt: "Sketch the graph using shifts/reflections of a basic power function.",
      promptTex: "f(x)=-(x+3)^4+1",
      steps: [
        { text: "Base y = x⁴ (U-shape, min at origin). The leading minus flips it to ∩; shift left 3 and up 1." },
        { tex: "\\text{maximum at }(-3,1);\\ \\text{opens downward}" },
      ],
      answerTex: "y=x^4\\ \\text{reflected, left 3, up 1 — max }(-3,1)",
    },
    {
      num: 6,
      topic: "graph by translation",
      prompt: "Sketch the graph using shifts/reflections of a basic power function.",
      promptTex: "f(x)=-(x-1)^4+2",
      steps: [
        { text: "Base y = x⁴; reflect to ∩, shift right 1 and up 2." },
        { tex: "\\text{maximum at }(1,2);\\ \\text{opens downward}" },
      ],
      answerTex: "y=x^4\\ \\text{reflected, right 1, up 2 — max }(1,2)",
    },
    {
      num: 27,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the vertical & horizontal asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{-4}{x+2}",
      steps: [
        { tex: "\\text{VA: } x+2=0 \\Rightarrow x=-2" },
        { text: "Numerator degree (0) < denominator degree (1) ⇒ horizontal asymptote y = 0." },
        { text: "y-intercept: x = 0 → −4/2 = −2. No x-intercept (constant numerator). No holes." },
      ],
      answerTex: "\\text{VA }x=-2,\\ \\text{HA }y=0,\\ y\\text{-int }(0,-2),\\ \\text{no }x\\text{-int}",
    },
    {
      num: 28,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{-1}{x+3}",
      steps: [
        { tex: "\\text{VA: } x=-3,\\qquad \\text{HA: } y=0" },
        { text: "y-intercept: x = 0 → −1/3. No x-intercept; no holes." },
      ],
      answerTex: "\\text{VA }x=-3,\\ \\text{HA }y=0,\\ y\\text{-int }(0,-\\tfrac13),\\ \\text{no }x\\text{-int}",
    },
    {
      num: 29,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{2}{3+2x}",
      steps: [
        { tex: "\\text{VA: } 3+2x=0 \\Rightarrow x=-\\tfrac32,\\qquad \\text{HA: } y=0" },
        { text: "y-intercept: x = 0 → 2/3. No x-intercept; no holes." },
      ],
      answerTex: "\\text{VA }x=-\\tfrac32,\\ \\text{HA }y=0,\\ y\\text{-int }(0,\\tfrac23),\\ \\text{no }x\\text{-int}",
    },
    {
      num: 30,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{8}{5-3x}",
      steps: [
        { tex: "\\text{VA: } 5-3x=0 \\Rightarrow x=\\tfrac53,\\qquad \\text{HA: } y=0" },
        { text: "y-intercept: x = 0 → 8/5. No x-intercept; no holes." },
      ],
      answerTex: "\\text{VA }x=\\tfrac53,\\ \\text{HA }y=0,\\ y\\text{-int }(0,\\tfrac85),\\ \\text{no }x\\text{-int}",
    },
    {
      num: 31,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{2x}{x-3}",
      steps: [
        { tex: "\\text{VA: } x=3" },
        { text: "Equal degrees ⇒ HA is the ratio of leading coefficients, 2/1:" },
        { tex: "\\text{HA: } y=2" },
        { text: "Both intercepts at the origin: x = 0 gives y = 0, and y = 0 gives x = 0. No holes." },
      ],
      answerTex: "\\text{VA }x=3,\\ \\text{HA }y=2,\\ \\text{intercept }(0,0)",
    },
    {
      num: 32,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{4x}{3-2x}",
      steps: [
        { tex: "\\text{VA: } 3-2x=0 \\Rightarrow x=\\tfrac32" },
        { text: "Equal degrees ⇒ HA = leading-coefficient ratio 4/(−2):" },
        { tex: "\\text{HA: } y=-2" },
        { text: "Intercept at the origin (0, 0). No holes." },
      ],
      answerTex: "\\text{VA }x=\\tfrac32,\\ \\text{HA }y=-2,\\ \\text{intercept }(0,0)",
    },
    {
      num: 33,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{x+1}{x-4}",
      steps: [
        { tex: "\\text{VA: } x=4,\\qquad \\text{HA: } y=1 \\ (\\text{equal degrees, } 1/1)" },
        { text: "y-intercept: x = 0 → 1/(−4) = −1/4. x-intercept: x + 1 = 0 → x = −1. No holes." },
      ],
      answerTex: "\\text{VA }x=4,\\ \\text{HA }y=1,\\ y\\text{-int }(0,-\\tfrac14),\\ x\\text{-int }(-1,0)",
    },
    {
      num: 34,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{x-4}{x+1}",
      steps: [
        { tex: "\\text{VA: } x=-1,\\qquad \\text{HA: } y=1" },
        { text: "y-intercept: x = 0 → −4/1 = −4. x-intercept: x − 4 = 0 → x = 4. No holes." },
      ],
      answerTex: "\\text{VA }x=-1,\\ \\text{HA }y=1,\\ y\\text{-int }(0,-4),\\ x\\text{-int }(4,0)",
    },
    {
      num: 35,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{3-2x}{4x+20}",
      steps: [
        { tex: "\\text{VA: } 4x+20=0 \\Rightarrow x=-5" },
        { text: "Equal degrees ⇒ HA = leading ratio (−2)/4:" },
        { tex: "\\text{HA: } y=-\\tfrac12" },
        { text: "y-intercept: x = 0 → 3/20. x-intercept: 3 − 2x = 0 → x = 3/2. No holes." },
      ],
      answerTex: "\\text{VA }x=-5,\\ \\text{HA }y=-\\tfrac12,\\ y\\text{-int }(0,\\tfrac{3}{20}),\\ x\\text{-int }(\\tfrac32,0)",
    },
    {
      num: 36,
      topic: "rational · asymptotes & intercepts",
      prompt: "Find the asymptotes, any holes, and the intercepts; then sketch.",
      promptTex: "y=\\dfrac{6-3x}{4x+12}",
      steps: [
        { tex: "\\text{VA: } 4x+12=0 \\Rightarrow x=-3" },
        { text: "Equal degrees ⇒ HA = leading ratio (−3)/4:" },
        { tex: "\\text{HA: } y=-\\tfrac34" },
        { text: "y-intercept: x = 0 → 6/12 = 1/2. x-intercept: 6 − 3x = 0 → x = 2. No holes." },
      ],
      answerTex: "\\text{VA }x=-3,\\ \\text{HA }y=-\\tfrac34,\\ y\\text{-int }(0,\\tfrac12),\\ x\\text{-int }(2,0)",
    },
    {
      num: 47,
      topic: "rational model · application",
      prompt:
        "The cost per ton (dollars) to build an oil tanker of x thousand deadweight tons is `C̄(x) = 220,000/(x + 475)`, x > 0. (a) Find C̄ at 25, 50, 100, 200, 300, 400. (b) Find any asymptotes. (c) Find any intercepts. (d) Describe the graph.",
      steps: [
        { text: "(a) Evaluate (≈, to the nearest dollar):" },
        { tex: "\\bar C(25)=\\tfrac{220000}{500}=440,\\ \\bar C(50)\\approx 419,\\ \\bar C(100)\\approx 383" },
        { tex: "\\bar C(200)\\approx 326,\\ \\bar C(300)\\approx 284,\\ \\bar C(400)\\approx 251\\ \\ (\\$/\\text{ton})" },
        { text: "(b) Vertical asymptote x = −475 (outside the domain x > 0); horizontal asymptote y = 0. (c) No x-intercept (constant numerator), and no y-intercept since x > 0. (d) The cost per ton falls from about $463/ton near x = 0 toward 0 as tankers grow larger." },
      ],
      answerTex: "(a)\\ 440,419,383,326,284,251\\ \\$/\\text{ton}\\quad (b)\\ \\text{VA }x=-475,\\ \\text{HA }y=0\\quad (c)\\ \\text{none}",
    },
    {
      num: 48,
      topic: "polynomial model · application",
      prompt:
        "A model of the Laffer curve is `y = x(100 − x)(x² + 500)`, where y is revenue (in hundreds of thousands of dollars) at a tax rate of x percent, 0 ≤ x ≤ 100. Find the revenue at (a) 10%, (b) 40%, (c) 50%, (d) 80%.",
      steps: [
        { tex: "(a)\\ y=10(90)(10^2+500)=900(600)=540{,}000" },
        { tex: "(b)\\ y=40(60)(40^2+500)=2400(2100)=5{,}040{,}000" },
        { tex: "(c)\\ y=50(50)(50^2+500)=2500(3000)=7{,}500{,}000" },
        { tex: "(d)\\ y=80(20)(80^2+500)=1600(6900)=11{,}040{,}000" },
        { text: "Each y is in hundreds of thousands of dollars." },
      ],
      answerTex: "(a)\\,540{,}000\\ (b)\\,5{,}040{,}000\\ (c)\\,7{,}500{,}000\\ (d)\\,11{,}040{,}000\\ (\\text{hundred-thousands of \\$})",
    },
    {
      num: 58,
      topic: "rational model · Michaelis–Menten",
      prompt:
        "The growth rate `f(x) = Kx/(A + x)` (Michaelis–Menten kinetics), where x is the quantity of food. (a) Give a reasonable domain. (b) Describe the graph for K = 5, A = 2. (c) Show y = K is a horizontal asymptote. (d) What does K represent? (e) Show A is the food quantity giving half the maximum growth rate.",
      steps: [
        { text: "(a) x is an amount of food, so x ≥ 0 — domain [0, ∞)." },
        { text: "(b) With K = 5, A = 2, f(x) = 5x/(2 + x): through the origin, rising and leveling off just under y = 5." },
        { text: "(c) Divide numerator and denominator by x:" },
        { tex: "f(x)=\\frac{Kx}{A+x}=\\frac{K}{\\frac{A}{x}+1}\\;\\xrightarrow[x\\to\\infty]{}\\;\\frac{K}{0+1}=K" },
        { text: "so y = K is a horizontal asymptote. (d) K is the maximum (limiting) growth rate as food becomes unlimited." },
        { text: "(e) Set f(x) = K/2 and solve:" },
        { tex: "\\frac{Kx}{A+x}=\\frac{K}{2}\\;\\Rightarrow\\;2x=A+x\\;\\Rightarrow\\;x=A" },
      ],
      answerTex: "(a)\\,x\\ge 0\\quad (c)\\,y\\to K\\quad (d)\\,K=\\text{max growth rate}\\quad (e)\\,f(A)=\\tfrac{K}{2}",
    },
  ],
};
