/** @type {import("../curriculum.js").Exercise} */
// Ex 2.2 — Quadratic Functions; Translation & Reflection.
// #13–16 parabolas, #31–34 point transformations, #35–38 root-graph
// transformations, #51/54/57/59 applications. #67 appended when its page arrives.
export default {
  slug: "ex-2-2",
  section: "2.2",
  chapter: 2,
  title: "Quadratic Functions · Translation & Reflection",
  source: "Calculus with Applications (Brief Version)",
  problems: [
    {
      num: 13,
      topic: "parabola · vertex/intercepts",
      prompt: "Graph the parabola; give its vertex, axis, x-intercepts, and y-intercept.",
      promptTex: "y = x^2 + 5x + 6",
      steps: [
        { text: "Vertex x-coordinate is −b/(2a):" },
        { tex: "x=-\\frac{5}{2},\\qquad y=\\left(-\\tfrac52\\right)^2+5\\left(-\\tfrac52\\right)+6=-\\tfrac14" },
        { text: "x-intercepts (set y = 0 and factor):" },
        { tex: "x^2+5x+6=(x+2)(x+3)=0 \\;\\Rightarrow\\; x=-2,\\,-3" },
        { text: "y-intercept is y(0) = 6; a > 0 so it opens up." },
      ],
      answerTex: "\\text{Vertex }\\left(-\\tfrac52,-\\tfrac14\\right),\\ \\text{axis }x=-\\tfrac52,\\ x\\text{-int }-2,\\,-3,\\ y\\text{-int }6",
    },
    {
      num: 14,
      topic: "parabola · vertex/intercepts",
      prompt: "Graph the parabola; give its vertex, axis, x-intercepts, and y-intercept.",
      promptTex: "y = x^2 + 4x - 5",
      steps: [
        { tex: "x=-\\frac{4}{2}=-2,\\qquad y=(-2)^2+4(-2)-5=-9" },
        { tex: "x^2+4x-5=(x+5)(x-1)=0 \\;\\Rightarrow\\; x=-5,\\,1" },
        { text: "y-intercept −5; opens up." },
      ],
      answerTex: "\\text{Vertex }(-2,-9),\\ \\text{axis }x=-2,\\ x\\text{-int }-5,\\,1,\\ y\\text{-int }-5",
    },
    {
      num: 15,
      topic: "parabola · vertex/intercepts",
      prompt: "Graph the parabola; give its vertex, axis, x-intercepts, and y-intercept.",
      promptTex: "y = -2x^2 - 12x - 16",
      steps: [
        { tex: "x=-\\frac{-12}{2(-2)}=-3,\\qquad y=-2(9)-12(-3)-16=2" },
        { text: "x-intercepts (divide through by −2):" },
        { tex: "x^2+6x+8=(x+2)(x+4)=0 \\;\\Rightarrow\\; x=-2,\\,-4" },
        { text: "y-intercept −16; a < 0 so it opens down." },
      ],
      answerTex: "\\text{Vertex }(-3,2),\\ \\text{axis }x=-3,\\ x\\text{-int }-2,\\,-4,\\ y\\text{-int }-16",
    },
    {
      num: 16,
      topic: "parabola · vertex/intercepts",
      prompt: "Graph the parabola; give its vertex, axis, x-intercepts, and y-intercept.",
      promptTex: "y = -3x^2 - 6x + 4",
      steps: [
        { tex: "x=-\\frac{-6}{2(-3)}=-1,\\qquad y=-3(1)-6(-1)+4=7" },
        { text: "x-intercepts (use the quadratic formula on 3x² + 6x − 4 = 0):" },
        { tex: "x=\\frac{-3\\pm\\sqrt{21}}{3}\\approx 0.53,\\,-2.53" },
        { text: "y-intercept 4; opens down." },
      ],
      answerTex: "\\text{Vertex }(-1,7),\\ \\text{axis }x=-1,\\ x\\text{-int }\\tfrac{-3\\pm\\sqrt{21}}{3},\\ y\\text{-int }4",
    },
    {
      num: 31,
      topic: "graph transformation",
      prompt:
        "On the given graph the three labeled points are (−1, 4), (−3, −2), (5, 0). Sketch **y = −f(x)** and give the new coordinates of those three points.",
      steps: [
        { text: "y = −f(x) reflects the graph across the x-axis: (x, y) → (x, −y)." },
        { tex: "(-1,4)\\to(-1,-4),\\quad (-3,-2)\\to(-3,2),\\quad (5,0)\\to(5,0)" },
      ],
      answerTex: "(-1,-4),\\ (-3,2),\\ (5,0)",
    },
    {
      num: 32,
      topic: "graph transformation",
      prompt:
        "With labeled points (−1, 4), (−3, −2), (5, 0), sketch **y = f(x − 2) + 2** and give the new coordinates.",
      steps: [
        { text: "f(x − 2) shifts right 2; the + 2 shifts up 2: (x, y) → (x + 2, y + 2)." },
        { tex: "(-1,4)\\to(1,6),\\quad (-3,-2)\\to(-1,0),\\quad (5,0)\\to(7,2)" },
      ],
      answerTex: "(1,6),\\ (-1,0),\\ (7,2)",
    },
    {
      num: 33,
      topic: "graph transformation",
      prompt:
        "With labeled points (−1, 4), (−3, −2), (5, 0), sketch **y = f(−x)** and give the new coordinates.",
      steps: [
        { text: "y = f(−x) reflects across the y-axis: (x, y) → (−x, y)." },
        { tex: "(-1,4)\\to(1,4),\\quad (-3,-2)\\to(3,-2),\\quad (5,0)\\to(-5,0)" },
      ],
      answerTex: "(1,4),\\ (3,-2),\\ (-5,0)",
    },
    {
      num: 34,
      topic: "graph transformation",
      prompt:
        "With labeled points (−1, 4), (−3, −2), (5, 0), sketch **y = f(2 − x) + 2** and give the new coordinates.",
      steps: [
        { text: "Write 2 − x = −(x − 2): reflect across the y-axis, shift right 2, then up 2. A point (a, b) maps to (2 − a, b + 2)." },
        { tex: "(-1,4)\\to(3,6),\\quad (-3,-2)\\to(5,0),\\quad (5,0)\\to(-3,2)" },
      ],
      answerTex: "(3,6),\\ (5,0),\\ (-3,2)",
    },
    {
      num: 35,
      topic: "graph by transformation",
      prompt: "Graph without a calculator — describe the transformation, the starting point, and the domain/range.",
      promptTex: "f(x)=\\sqrt{x-2}+2",
      steps: [
        { text: "Start from y = √x (corner at the origin, rising to the right). Shift right 2 and up 2." },
        { tex: "\\text{start }(2,2),\\ \\text{rising right};\\quad \\text{domain }x\\ge 2,\\ \\text{range }y\\ge 2" },
      ],
      answerTex: "\\sqrt{x}\\ \\text{shifted right 2, up 2: start }(2,2),\\ x\\ge2,\\ y\\ge2",
    },
    {
      num: 36,
      topic: "graph by transformation",
      prompt: "Graph without a calculator — describe the transformation, the starting point, and the domain/range.",
      promptTex: "f(x)=\\sqrt{x+2}-3",
      steps: [
        { text: "From y = √x, shift left 2 and down 3." },
        { tex: "\\text{start }(-2,-3),\\ \\text{rising right};\\quad \\text{domain }x\\ge -2,\\ \\text{range }y\\ge -3" },
      ],
      answerTex: "\\sqrt{x}\\ \\text{shifted left 2, down 3: start }(-2,-3),\\ x\\ge-2,\\ y\\ge-3",
    },
    {
      num: 37,
      topic: "graph by transformation",
      prompt: "Graph without a calculator — describe the transformation, the starting point, and the domain/range.",
      promptTex: "f(x)=-\\sqrt{2-x}-2",
      steps: [
        { text: "Write 2 − x = −(x − 2). From y = √x: reflect across the y-axis (opens left from x = 2), reflect across the x-axis (leading minus → goes downward), then shift down 2." },
        { tex: "\\text{start }(2,-2),\\ \\text{falling left};\\quad \\text{domain }x\\le 2,\\ \\text{range }y\\le -2" },
      ],
      answerTex: "\\text{start }(2,-2),\\ \\text{opens down-left},\\ x\\le 2,\\ y\\le -2",
    },
    {
      num: 38,
      topic: "graph by transformation",
      prompt: "Graph without a calculator — describe the transformation, the starting point, and the domain/range.",
      promptTex: "f(x)=-\\sqrt{2-x}+2",
      steps: [
        { text: "Same shape as #37 (reflect over both axes, opening down-left from x = 2), but shifted up 2 instead of down." },
        { tex: "\\text{start }(2,2),\\ \\text{falling left};\\quad \\text{domain }x\\le 2,\\ \\text{range }y\\le 2" },
      ],
      answerTex: "\\text{start }(2,2),\\ \\text{opens down-left},\\ x\\le 2,\\ y\\le 2",
    },
    {
      num: 51,
      topic: "profit · break-even · max revenue/profit",
      prompt:
        "C(x) is the cost to produce x batches of widgets and R(x) the revenue (in thousands of dollars). Find (b) the minimum break-even quantity, (c) the maximum revenue, and (d) the maximum profit.",
      promptTex: "R(x)=-\\tfrac{4}{5}x^2+10x,\\qquad C(x)=2x+15",
      steps: [
        { text: "(b) Break even where R = C:" },
        { tex: "-\\tfrac{4}{5}x^2+10x=2x+15 \\;\\Rightarrow\\; -0.8x^2+8x-15=0 \\;\\Rightarrow\\; x=2.5,\\ 7.5" },
        { text: "Minimum break-even quantity = 2.5 batches." },
        { text: "(c) Maximum revenue at the vertex of R, x = −b/(2a) = 10/1.6 = 6.25:" },
        { tex: "R(6.25)=-0.8(6.25)^2+10(6.25)=31.25 \\;\\Rightarrow\\; \\$31{,}250" },
        { text: "(d) Profit P = R − C = −0.8x² + 8x − 15; vertex at x = 5:" },
        { tex: "P(5)=-0.8(25)+8(5)-15=5 \\;\\Rightarrow\\; \\$5{,}000" },
      ],
      answerTex: "(b)\\,2.5\\text{ batches}\\quad (c)\\,\\$31{,}250\\,(x{=}6.25)\\quad (d)\\,\\$5{,}000\\,(x{=}5)",
    },
    {
      num: 54,
      topic: "maximizing revenue",
      prompt:
        "A charter flight charges $200 per person plus $4 per person for each unsold seat; the plane holds 100. Let x = unsold seats. (a) Find the total revenue R(x). (c) Find the unsold seats that maximize revenue. (d) Find the maximum revenue. (e) Explain why leaving some seats empty can make sense.",
      steps: [
        { text: "People flying = 100 − x; price per ticket = 200 + 4x. Multiply:" },
        { tex: "R(x)=(100-x)(200+4x)=-4x^2+200x+20{,}000" },
        { text: "(c) Vertex: x = −b/(2a) = −200/(−8) = 25 unsold seats." },
        { tex: "(d)\\ R(25)=-4(625)+200(25)+20{,}000=\\$22{,}500" },
        { text: "(e) A full plane earns R(0) = $20,000, but the surcharge for empty seats lifts revenue to $22,500 at 25 empty seats — the higher fare more than offsets the lost passengers." },
      ],
      answerTex: "(a)\\,R(x)=-4x^2+200x+20{,}000\\quad (c)\\,25\\text{ seats}\\quad (d)\\,\\$22{,}500",
    },
    {
      num: 57,
      topic: "maximizing revenue",
      prompt:
        "An 80-unit complex is full at $800 rent; each $25 increase leaves one more unit vacant. Let x = number of $25 increases. Find (a) the rent per apartment, (b) the number rented, (c) total revenue R(x), (d) the x that maximizes revenue, and (e) the maximum revenue.",
      steps: [
        { tex: "(a)\\ \\text{rent}=800+25x\\qquad (b)\\ \\text{rented}=80-x" },
        { text: "(c) Revenue = rent × number rented:" },
        { tex: "R(x)=(800+25x)(80-x)=-25x^2+1200x+64{,}000" },
        { text: "(d) Vertex: x = −1200/(−50) = 24 increases." },
        { tex: "(e)\\ R(24)=(800+600)(80-24)=1400\\cdot 56=\\$78{,}400" },
      ],
      answerTex: "(a)\\,800+25x\\ \\ (b)\\,80-x\\ \\ (c)\\,-25x^2+1200x+64{,}000\\ \\ (d)\\,x=24\\ \\ (e)\\,\\$78{,}400",
    },
    {
      num: 59,
      topic: "quadratic model · application",
      prompt:
        "The survival function for life after 65 is S(x) = 1 − 0.058x − 0.076x², with x in decades (the probability of living at least x decades past 65). (a) Find the median (x with S = 0.50). (b) Find the age beyond which virtually nobody lives (S = 0).",
      promptTex: "S(x)=1-0.058x-0.076x^2",
      steps: [
        { text: "(a) Set S(x) = 0.50, i.e. 0.076x² + 0.058x − 0.5 = 0, and take the positive root:" },
        { tex: "x=\\frac{-0.058+\\sqrt{0.058^2+4(0.076)(0.5)}}{2(0.076)}\\approx 2.21\\ \\text{decades}" },
        { text: "≈ 2.21 decades past 65 → about age 65 + 22 ≈ 87 years." },
        { text: "(b) Set S(x) = 0, i.e. 0.076x² + 0.058x − 1 = 0:" },
        { tex: "x=\\frac{-0.058+\\sqrt{0.058^2+4(0.076)(1)}}{2(0.076)}\\approx 3.27\\ \\text{decades}" },
        { text: "≈ 3.27 decades past 65 → about age 65 + 33 ≈ 98 years." },
      ],
      answerTex: "(a)\\approx 2.21\\text{ decades }(\\approx\\text{age }87)\\quad (b)\\approx 3.27\\text{ decades }(\\approx\\text{age }98)",
    },
    {
      num: 67,
      topic: "quadratic model · application",
      prompt:
        "A car's stopping distance y (in feet) at x mph is `y = 0.056057x² + 1.06657x`. (a) Find the stopping distance at 25 mph. (b) How fast can you drive and still be sure of stopping within 150 ft?",
      steps: [
        { text: "(a) Substitute x = 25:" },
        { tex: "y=0.056057(25)^2+1.06657(25)\\approx 35.04+26.66\\approx 61.7\\ \\text{ft}" },
        { text: "(b) Set y = 150 and solve the quadratic for x (positive root):" },
        { tex: "0.056057x^2+1.06657x-150=0 \\;\\Rightarrow\\; x=\\frac{-1.06657+\\sqrt{1.06657^2+4(0.056057)(150)}}{2(0.056057)}\\approx 43.1" },
        { text: "So you can drive at most about 43 mph." },
      ],
      answerTex: "(a)\\approx 61.7\\text{ ft}\\quad (b)\\approx 43\\text{ mph}",
    },
  ],
};
