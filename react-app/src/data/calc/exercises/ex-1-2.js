/** @type {import("../curriculum.js").Exercise} */
// Ex 1.2 — Linear Functions & Applications.
// Solutions authored from the source book; original wording, math shown step by
// step. Problem numbers tracked in curriculum.js.
export default {
  slug: "ex-1-2",
  section: "1.2",
  chapter: 1,
  title: "Linear Functions & Applications",
  source: "Calculus with Applications (Brief Version)",
  problems: [
    {
      num: 19,
      topic: "linear cost function",
      prompt:
        "Write a linear cost function (name every variable): a Lake Tahoe resort rents snowboards for a flat **$10** fee plus **$2.25** for each hour.",
      steps: [
        { text: "**Name the variables.** Let *x* = the number of hours rented and *C*(*x*) = the total cost in dollars." },
        { text: "**Fixed cost.** The $10 fee is paid once regardless of time — the constant term." },
        { text: "**Marginal cost.** The $2.25 per hour is the rate of change — the slope." },
        { text: "Assemble `C(x) = (marginal cost)·x + (fixed cost)`:" },
        { tex: "C(x) = 2.25x + 10" },
      ],
      answerTex: "\\boxed{\\,C(x) = 2.25x + 10\\,}\\qquad x=\\text{hours},\\ C(x)=\\text{dollars}",
    },
    {
      num: 20,
      topic: "linear cost function",
      prompt:
        "Write a linear cost function (name every variable): a music-download site charges a **$10** registration fee plus **99¢** for each song.",
      steps: [
        { text: "Let *x* = the number of songs downloaded and *C*(*x*) = the total cost in dollars." },
        { text: "The $10 sign-up fee is the fixed cost; each song adds $0.99 (the marginal cost)." },
        { tex: "C(x) = 0.99x + 10" },
      ],
      answerTex: "\\boxed{\\,C(x) = 0.99x + 10\\,}\\qquad x=\\text{songs},\\ C(x)=\\text{dollars}",
    },
    {
      num: 21,
      topic: "linear cost function",
      prompt:
        "Write a linear cost function (name every variable): a parking garage charges **$2** plus **75¢** per half-hour.",
      steps: [
        { text: "Let *x* = the number of **half-hours** parked and *C*(*x*) = the total cost in dollars (the rate is per half-hour, so count time in half-hour blocks)." },
        { text: "The flat $2 is fixed; each half-hour adds $0.75 (marginal cost)." },
        { tex: "C(x) = 0.75x + 2" },
      ],
      answerTex: "\\boxed{\\,C(x) = 0.75x + 2\\,}\\qquad x=\\text{half-hours},\\ C(x)=\\text{dollars}",
    },
    {
      num: 22,
      topic: "linear cost function",
      prompt:
        "Write a linear cost function (name every variable): a one-day car rental costs **$44** plus **28¢** per mile.",
      steps: [
        { text: "Let *x* = the number of miles driven and *C*(*x*) = the total cost in dollars." },
        { text: "The $44 day charge is fixed; each mile adds $0.28 (marginal cost)." },
        { tex: "C(x) = 0.28x + 44" },
      ],
      answerTex: "\\boxed{\\,C(x) = 0.28x + 44\\,}\\qquad x=\\text{miles},\\ C(x)=\\text{dollars}",
    },
    {
      num: 24,
      topic: "find the cost function",
      prompt:
        "Assuming a linear cost function, find it: the **fixed cost is $35**, and producing **8 items costs $395**.",
      steps: [
        { text: "Write `C(x) = mx + b`. The fixed cost is the constant, so *b* = 35." },
        { text: "Use `C(8) = 395` to solve for the marginal cost *m*:" },
        { tex: "8m + 35 = 395 \\;\\Rightarrow\\; 8m = 360 \\;\\Rightarrow\\; m = 45" },
      ],
      answerTex: "\\boxed{\\,C(x) = 45x + 35\\,}",
    },
    {
      num: 25,
      topic: "find the cost function",
      prompt:
        "Assuming a linear cost function, find it: the **marginal cost is $75**, and producing **50 items costs $4300**.",
      steps: [
        { text: "The marginal cost is the slope, so *m* = 75: `C(x) = 75x + b`." },
        { text: "Use `C(50) = 4300` to solve for the fixed cost *b*:" },
        { tex: "75(50) + b = 4300 \\;\\Rightarrow\\; 3750 + b = 4300 \\;\\Rightarrow\\; b = 550" },
      ],
      answerTex: "\\boxed{\\,C(x) = 75x + 550\\,}",
    },
    {
      num: 27,
      topic: "supply & demand",
      prompt:
        "A youth wristwatch has demand `p = D(q) = 16 − 1.25q` and supply `p = S(q) = 0.75q`, where *p* is the price in dollars and *q* the quantity in **hundreds**. Find the prices in (a)–(c), the quantities demanded in (d)–(f), the quantities supplied in (h)–(j), and the equilibrium in (l).",
      steps: [
        { text: "Prices come from the demand function p = 16 − 1.25q (q is in hundreds):" },
        { tex: "(a)\\ \\ q=0:\\quad p = 16 - 1.25(0) = \\$16" },
        { tex: "(b)\\ \\ 400\\text{ watches }(q=4):\\quad p = 16 - 1.25(4) = \\$11" },
        { tex: "(c)\\ \\ 800\\text{ watches }(q=8):\\quad p = 16 - 1.25(8) = \\$6" },
        { text: "Quantities demanded — set each price equal to the demand and solve for q:" },
        { tex: "(d)\\ \\ 8 = 16 - 1.25q \\;\\Rightarrow\\; q = 6.4 \\;\\Rightarrow\\; 640\\text{ watches}" },
        { tex: "(e)\\ \\ 10 = 16 - 1.25q \\;\\Rightarrow\\; q = 4.8 \\;\\Rightarrow\\; 480\\text{ watches}" },
        { tex: "(f)\\ \\ 12 = 16 - 1.25q \\;\\Rightarrow\\; q = 3.2 \\;\\Rightarrow\\; 320\\text{ watches}" },
        { text: "Quantities supplied — solve p = 0.75q for q (so q = p ⁄ 0.75):" },
        { tex: "(h)\\ \\ \\$0:\\quad q = 0 \\;\\Rightarrow\\; 0\\text{ watches}" },
        { tex: "(i)\\ \\ \\$10:\\quad q = \\tfrac{10}{0.75} \\approx 13.33 \\;\\Rightarrow\\; \\approx 1333\\text{ watches}" },
        { tex: "(j)\\ \\ \\$20:\\quad q = \\tfrac{20}{0.75} \\approx 26.67 \\;\\Rightarrow\\; \\approx 2667\\text{ watches}" },
        { text: "(l) Equilibrium — set supply equal to demand:" },
        { tex: "0.75q = 16 - 1.25q \\;\\Rightarrow\\; 2q = 16 \\;\\Rightarrow\\; q = 8,\\qquad p = 0.75(8) = 6" },
      ],
      answerTex: "\\boxed{\\,\\text{Equilibrium: } q = 8\\ (800\\text{ watches}),\\ \\ p = \\$6\\,}",
    },
    {
      num: 29,
      topic: "supply & demand · equilibrium",
      prompt:
        "For butter-pecan ice cream the supply is `p = S(q) = (2/5)q` and the demand is `p = D(q) = 100 − (2/5)q`, where *p* is in dollars and *q* is the number of 10-gallon tubs. (a) Sketch both on one set of axes. (b) Find the equilibrium quantity and price.",
      steps: [
        { text: "(a) Two lines: supply through the origin with slope 2⁄5; demand starting at (0, 100) with slope −2⁄5. They meet at the equilibrium." },
        { text: "(b) Set supply equal to demand:" },
        { tex: "\\tfrac{2}{5}q = 100 - \\tfrac{2}{5}q \\;\\Rightarrow\\; \\tfrac{4}{5}q = 100 \\;\\Rightarrow\\; q = 125" },
        { tex: "p = \\tfrac{2}{5}(125) = 50" },
      ],
      answerTex: "\\boxed{\\,q = 125\\text{ tubs},\\quad p = \\$50\\,}",
    },
    {
      num: 30,
      topic: "supply & demand · equilibrium",
      prompt:
        "For sugar the supply is `p = S(q) = 1.4q − 0.6` and the demand is `p = D(q) = −2q + 3.2`, where *p* is the price per pound and *q* is in thousands of pounds. (a) Graph both. (b) Find the equilibrium quantity and price.",
      steps: [
        { text: "(b) Set the two prices equal and solve for *q*:" },
        { tex: "1.4q - 0.6 = -2q + 3.2 \\;\\Rightarrow\\; 3.4q = 3.8 \\;\\Rightarrow\\; q = \\tfrac{3.8}{3.4} \\approx 1.12" },
        { tex: "p = 1.4(1.118) - 0.6 \\approx 0.96" },
      ],
      answerTex: "\\boxed{\\,q \\approx 1.12\\text{ thousand lb},\\quad p \\approx \\$0.96/\\text{lb}\\,}",
    },
    {
      num: 32,
      topic: "find the demand function",
      prompt:
        "The supply of walnuts is `p = S(q) = 0.25q + 3.6` (*p* in $/lb, *q* in bushels). The equilibrium price is **$5.85**, and demand is **4 bushels when the price is $7.60**. Assuming demand is linear, find its equation.",
      steps: [
        { text: "**Find the equilibrium quantity** from supply at price $5.85:" },
        { tex: "5.85 = 0.25q + 3.6 \\;\\Rightarrow\\; 0.25q = 2.25 \\;\\Rightarrow\\; q = 9" },
        { text: "So demand passes through the equilibrium point (9, 5.85) and the given point (4, 7.60). Slope:" },
        { tex: "m = \\frac{5.85 - 7.60}{9 - 4} = \\frac{-1.75}{5} = -0.35" },
        { text: "Point-slope through (4, 7.60):" },
        { tex: "p - 7.60 = -0.35(q - 4) \\;\\Rightarrow\\; p = -0.35q + 9" },
      ],
      answerTex: "\\boxed{\\,D(q) = 9 - 0.35q\\,}",
    },
    {
      num: 33,
      topic: "cost · break-even · profit",
      prompt:
        "Joanne's marginal cost per T-shirt is **$3.50**, her total cost for **60 shirts is $300**, and she sells them at **$9** each. (a) Find the linear cost function. (b) Find the break-even quantity. (c) How many shirts give a **$500** profit?",
      steps: [
        { text: "(a) Slope = marginal cost = 3.5, so `C(x) = 3.5x + b`. Use C(60) = 300:" },
        { tex: "3.5(60) + b = 300 \\;\\Rightarrow\\; 210 + b = 300 \\;\\Rightarrow\\; b = 90" },
        { tex: "C(x) = 3.5x + 90,\\qquad R(x) = 9x" },
        { text: "(b) Break even when R(x) = C(x):" },
        { tex: "9x = 3.5x + 90 \\;\\Rightarrow\\; 5.5x = 90 \\;\\Rightarrow\\; x \\approx 16.4" },
        { text: "She must make and sell **17 shirts** to break even (16 still shows a small loss)." },
        { text: "(c) Profit P(x) = R − C = 5.5x − 90. Set equal to 500:" },
        { tex: "5.5x - 90 = 500 \\;\\Rightarrow\\; 5.5x = 590 \\;\\Rightarrow\\; x \\approx 107.3 \\to 108" },
      ],
      answerTex: "C(x)=3.5x+90;\\quad \\text{break-even}\\approx 17\\text{ shirts};\\quad \\$500\\text{ profit at }108\\text{ shirts}",
    },
    {
      num: 34,
      topic: "cost · break-even · profit",
      prompt:
        "Alfred's fixed cost for a poetry volume is **$525**, his total cost for **1000 copies is $2675**, and the books sell for **$4.95** each. (a) Find the linear cost function. (b) Find the break-even quantity. (c) How many books give a **$1000** profit?",
      steps: [
        { text: "(a) `C(x) = mx + 525`. Use C(1000) = 2675:" },
        { tex: "1000m + 525 = 2675 \\;\\Rightarrow\\; 1000m = 2150 \\;\\Rightarrow\\; m = 2.15" },
        { tex: "C(x) = 2.15x + 525,\\qquad R(x) = 4.95x" },
        { text: "(b) Break even when R = C:" },
        { tex: "4.95x = 2.15x + 525 \\;\\Rightarrow\\; 2.8x = 525 \\;\\Rightarrow\\; x = 187.5 \\to 188" },
        { text: "(c) Profit P(x) = 2.8x − 525 = 1000:" },
        { tex: "2.8x = 1525 \\;\\Rightarrow\\; x \\approx 544.6 \\to 545" },
      ],
      answerTex: "C(x)=2.15x+525;\\quad \\text{break-even }188\\text{ books};\\quad \\$1000\\text{ profit at }545\\text{ books}",
    },
    {
      num: 35,
      topic: "marginal cost",
      prompt:
        "Making **100 cups** of coffee costs **$11.02**; making **400 cups** costs **$40.12**. Treat the cost C(x) as linear in *x* (cups). (a) Find C(x). (b) The fixed cost. (c) Cost of 1000 cups. (d) Cost of 1001 cups. (e) Marginal cost of the 1001st cup. (f) Marginal cost of any cup — what does it mean?",
      steps: [
        { text: "(a) Use the two points (100, 11.02) and (400, 40.12). Slope:" },
        { tex: "m = \\frac{40.12 - 11.02}{400 - 100} = \\frac{29.10}{300} = 0.097" },
        { tex: "11.02 = 0.097(100) + b \\;\\Rightarrow\\; b = 1.32 \\;\\Rightarrow\\; C(x) = 0.097x + 1.32" },
        { text: "(b) The fixed cost is the constant term:" },
        { tex: "b = \\$1.32" },
        { tex: "(c)\\ \\ C(1000) = 0.097(1000) + 1.32 = \\$98.32" },
        { tex: "(d)\\ \\ C(1001) = 0.097(1001) + 1.32 \\approx \\$98.42" },
        { tex: "(e)\\ \\ \\text{1001st cup}: \\ C(1001) - C(1000) \\approx \\$0.097" },
        { text: "(f) For a linear cost, the marginal cost of any cup is just the slope — about $0.097, i.e. roughly 9.7 cents per extra cup." },
      ],
      answerTex: "C(x)=0.097x+1.32;\\ \\text{fixed }\\$1.32;\\ C(1000)=\\$98.32;\\ C(1001)\\approx\\$98.42;\\ \\text{marginal}\\approx\\$0.097",
    },
    {
      num: 38,
      topic: "break-even · profit",
      prompt:
        "Producing *x* religious medals costs `C(x) = 12x + 39`; revenue is `R(x) = 25x` (dollars). (a) Find the break-even quantity. (b) Find the profit from 250 units. (c) How many units give a **$130** profit?",
      steps: [
        { text: "(a) Break even when R(x) = C(x):" },
        { tex: "25x = 12x + 39 \\;\\Rightarrow\\; 13x = 39 \\;\\Rightarrow\\; x = 3" },
        { text: "(b) Profit P(x) = R − C = 13x − 39. At x = 250:" },
        { tex: "P(250) = 13(250) - 39 = 3250 - 39 = 3211" },
        { text: "(c) Set P(x) = 130:" },
        { tex: "13x - 39 = 130 \\;\\Rightarrow\\; 13x = 169 \\;\\Rightarrow\\; x = 13" },
      ],
      answerTex: "\\text{break-even }3\\text{ units};\\quad P(250)=\\$3211;\\quad \\$130\\text{ profit at }13\\text{ units}",
    },
    {
      num: 43,
      topic: "marginal profit",
      prompt:
        "A product has a **fixed cost of $400** and a **break-even quantity of 80**. Find the marginal profit (the slope of the linear profit function).",
      steps: [
        { text: "The profit function is linear: P(x) = mx + b. Producing nothing loses the fixed cost, so P(0) = −400 ⇒ b = −400." },
        { text: "At the break-even quantity, profit is zero: P(80) = 0. The slope is the rise over run from (0, −400) to (80, 0):" },
        { tex: "m = \\frac{0 - (-400)}{80 - 0} = \\frac{400}{80} = 5" },
      ],
      answerTex: "\\boxed{\\,\\text{marginal profit} = \\$5\\text{ per unit}\\,}",
    },
    {
      num: 45,
      topic: "temperature conversion",
      prompt:
        "Using the conversion formulas `C = (5/9)(F − 32)` and `F = (9/5)C + 32`, convert: (a) 58°F to Celsius, (b) −20°F to Celsius, (c) 50°C to Fahrenheit.",
      steps: [
        { tex: "(a)\\ C = \\tfrac{5}{9}(58 - 32) = \\tfrac{5}{9}(26) \\approx 14.4^{\\circ}\\text{C}" },
        { tex: "(b)\\ C = \\tfrac{5}{9}(-20 - 32) = \\tfrac{5}{9}(-52) \\approx -28.9^{\\circ}\\text{C}" },
        { tex: "(c)\\ F = \\tfrac{9}{5}(50) + 32 = 90 + 32 = 122^{\\circ}\\text{F}" },
      ],
      answerTex: "(a)\\approx 14.4^{\\circ}\\text{C}\\quad (b)\\approx -28.9^{\\circ}\\text{C}\\quad (c)\\,122^{\\circ}\\text{F}",
    },
    {
      num: 48,
      topic: "linear cost · applications",
      prompt:
        "Each off-campus center has a **fixed cost of $486,000** plus a **marginal cost of $1140 per student**. (a) Write the cost C(x) for one center as a function of the number of students *x*. (b) Find the cost for 500 students. (c) With a **$1,000,000** cap, find the most students a center can support.",
      steps: [
        { text: "(a) Fixed cost is the constant, marginal cost is the slope:" },
        { tex: "C(x) = 1140x + 486{,}000" },
        { tex: "(b)\\ C(500) = 1140(500) + 486{,}000 = 570{,}000 + 486{,}000 = 1{,}056{,}000" },
        { text: "(c) Set C(x) = 1,000,000 and round **down** (can't exceed the cap):" },
        { tex: "1140x + 486{,}000 = 1{,}000{,}000 \\;\\Rightarrow\\; 1140x = 514{,}000 \\;\\Rightarrow\\; x \\approx 450.9" },
        { text: "450 students cost $999,000 (within budget); 451 would push past $1,000,000." },
      ],
      answerTex: "C(x)=1140x+486{,}000;\\quad C(500)=\\$1{,}056{,}000;\\quad \\text{max }450\\text{ students}",
    },
  ],
};
