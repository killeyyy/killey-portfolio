// ============================================================
// ORIGINAL exam-style questions — one per module, written in the
// real exam format (parts + marks) with fresh numbers and full
// step-by-step solutions. Modeled on question TYPES only; never
// reproductions of past papers, assignments, or textbook problems.
// ============================================================

/**
 * @typedef {Object} ExamQuestion
 * @property {string} moduleSlug
 * @property {number} marks
 * @property {string} prompt
 * @property {{text?:string, tex?:string}[]} solution  full worked steps
 * @property {string=} answerTex
 */

/** @type {ExamQuestion[]} */
export const examQuestions = [
  {
    moduleSlug: "matrices",
    marks: 10,
    prompt:
      "Consider the system: x + y = 2; x + 2y + z = 3; x + y + (k² − 4)z = k. Find all values of k for which the system has (a) a unique solution, (b) no solution, (c) infinitely many solutions. Justify with row reduction.",
    solution: [
      { text: "Eliminate x: R₂ → R₂ − R₁ gives y + z = 1; R₃ → R₃ − R₁ gives:" },
      { tex: "(k^2-4)\\,z = k-2" },
      { text: "Everything hinges on that z-coefficient. Boundary cases: k² − 4 = 0 → k = ±2." },
      { text: "k = 2: the row reads 0·z = 0 → z is free → **infinitely many** solutions (y = 1 − z, x = 2 − y)." },
      { text: "k = −2: the row reads 0·z = −4 → contradiction → **no solution**." },
      { tex: "k\\neq\\pm2:\\;\\; z=\\frac{k-2}{k^2-4}=\\frac{1}{k+2}\\;\\;\\Rightarrow\\;\\text{unique solution (back-substitute for } y, x\\text{)}." },
    ],
    answerTex: "\\text{(a) } k\\neq\\pm2 \\quad\\text{(b) } k=-2 \\quad\\text{(c) } k=2",
  },
  {
    moduleSlug: "vectors",
    marks: 8,
    prompt:
      "Let v₁ = (1, 2, −1), v₂ = (2, 1, 1) and b = (4, 5, −1). Determine whether b ∈ Span{v₁, v₂}; if so, express b as a linear combination of v₁ and v₂.",
    solution: [
      { tex: "c_1\\begin{bmatrix}1\\\\2\\\\-1\\end{bmatrix}+c_2\\begin{bmatrix}2\\\\1\\\\1\\end{bmatrix}=\\begin{bmatrix}4\\\\5\\\\-1\\end{bmatrix}" },
      { text: "Rows 1–2: c₁ + 2c₂ = 4 and 2c₁ + c₂ = 5. Solving: c₁ = 2, c₂ = 1." },
      { text: "Check row 3: −c₁ + c₂ = −2 + 1 = −1 ✓ consistent." },
    ],
    answerTex: "b=2\\,\\vec{v}_1+\\vec{v}_2\\;\\Rightarrow\\; b\\in\\text{Span}\\{\\vec{v}_1,\\vec{v}_2\\}",
  },
  {
    moduleSlug: "determinants",
    marks: 8,
    prompt:
      "A is a 3×3 matrix with det A = 5. Evaluate, with justification: (a) det(2A), (b) det(A⁻¹), (c) det(AᵀA), (d) det(A³).",
    solution: [
      { tex: "\\det(2A)=2^{3}\\det A = 8\\cdot 5 = 40\\;\\;(\\text{scales every row of a }3\\times3)" },
      { tex: "\\det(A^{-1})=1/\\det A = 1/5" },
      { tex: "\\det(A^{T}A)=\\det A^{T}\\cdot\\det A = 5\\cdot 5 = 25" },
      { tex: "\\det(A^{3})=(\\det A)^{3}=125" },
    ],
    answerTex: "40,\\;\\;1/5,\\;\\;25,\\;\\;125",
  },
  {
    moduleSlug: "transformations",
    marks: 8,
    prompt:
      "T first reflects the plane across the line y = x, then projects onto the x-axis. (a) Find the standard matrix of T. (b) Is T one-to-one? Justify.",
    solution: [
      { tex: "F=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\;(\\text{reflect }y=x),\\qquad P=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}\\;(\\text{project on }x)" },
      { text: "Reflection happens first → it sits rightmost in the product:" },
      { tex: "A=PF=\\begin{bmatrix}1&0\\\\0&0\\end{bmatrix}\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix}" },
      { text: "(b) det A = 0 and the second column has no pivot → columns dependent → not one-to-one (e.g. T(1,0) = (0,0) = T(0,0))." },
    ],
    answerTex: "A=\\begin{bmatrix}0&1\\\\0&0\\end{bmatrix};\\;\\;T\\text{ is not one-to-one}",
  },
  {
    moduleSlug: "eigen",
    marks: 12,
    prompt:
      "Let A = [[2, 3], [0, 5]]. (a) Find the eigenvalues and eigenvectors. (b) Diagonalize A as PDP⁻¹. (c) Give a closed-form expression for Aⁿ.",
    solution: [
      { text: "(a) Triangular → eigenvalues are the diagonal: λ = 2 and λ = 5." },
      { tex: "\\lambda=2:\\;(A-2I)=\\begin{bmatrix}0&3\\\\0&3\\end{bmatrix}\\Rightarrow \\vec{v}_1=\\begin{bmatrix}1\\\\0\\end{bmatrix}" },
      { tex: "\\lambda=5:\\;(A-5I)=\\begin{bmatrix}-3&3\\\\0&0\\end{bmatrix}\\Rightarrow \\vec{v}_2=\\begin{bmatrix}1\\\\1\\end{bmatrix}" },
      { tex: "(b)\\;P=\\begin{bmatrix}1&1\\\\0&1\\end{bmatrix},\\;D=\\begin{bmatrix}2&0\\\\0&5\\end{bmatrix},\\;P^{-1}=\\begin{bmatrix}1&-1\\\\0&1\\end{bmatrix}" },
      { tex: "(c)\\;A^{n}=PD^{n}P^{-1}=\\begin{bmatrix}2^{n}&5^{n}-2^{n}\\\\0&5^{n}\\end{bmatrix}" },
    ],
    answerTex: "A^{n}=\\begin{bmatrix}2^{n}&5^{n}-2^{n}\\\\0&5^{n}\\end{bmatrix}",
  },
  {
    moduleSlug: "applied",
    marks: 10,
    prompt:
      "Two brands share a market. Each month 80% of A's customers stay with A (20% switch to B) and 70% of B's stay (30% switch to A). (a) Write the transition matrix. (b) Find the steady-state market shares.",
    solution: [
      { tex: "P=\\begin{bmatrix}0.8&0.3\\\\0.2&0.7\\end{bmatrix}\\;\\;(\\text{columns sum to }1)" },
      { tex: "(P-I)\\vec{q}=\\vec{0}:\\;-0.2q_1+0.3q_2=0\\;\\Rightarrow\\;q_1=\\tfrac{3}{2}q_2" },
      { text: "Normalize: q₁ + q₂ = 1 → (3/2)q₂ + q₂ = 1 → q₂ = 2/5, q₁ = 3/5." },
    ],
    answerTex: "\\vec{q}=\\begin{bmatrix}0.6\\\\0.4\\end{bmatrix}\\;\\Rightarrow\\;A:60\\%,\\;B:40\\%",
  },
  {
    moduleSlug: "linear-programming",
    marks: 12,
    prompt:
      "A workshop makes desks (profit 2,000/unit) and chairs (profit 3,000/unit). Wood limits: x + y ≤ 8; labour: x + 2y ≤ 12 (x desks, y chairs, both ≥ 0). (a) Formulate the LP. (b) Solve graphically and state the optimal production plan.",
    solution: [
      { tex: "\\max Z=2x+3y\\;\\text{(thousands)}\\quad\\text{s.t.}\\quad x+y\\le 8,\\;\\;x+2y\\le 12,\\;\\;x,y\\ge 0" },
      { text: "Corners of the feasible region: (0,0), (8,0), (0,6), and the intersection of x + y = 8 with x + 2y = 12 → y = 4, x = 4." },
      { tex: "Z(0,0)=0,\\;\\;Z(8,0)=16,\\;\\;Z(4,4)=20,\\;\\;Z(0,6)=18" },
    ],
    answerTex: "\\text{Make }4\\text{ desks}+4\\text{ chairs};\\;Z^{*}=20{,}000",
  },
  {
    moduleSlug: "networks",
    marks: 10,
    prompt:
      "Two warehouses (supplies 30, 40) ship to three stores (demands 20, 25, 25). Unit costs: W₁ = [4, 6, 8], W₂ = [5, 3, 7]. (a) Verify the problem is balanced. (b) Find the initial solution by the North-West Corner method and its total cost. (c) Is the solution non-degenerate?",
    solution: [
      { text: "(a) Supply 30 + 40 = 70 = 20 + 25 + 25 demand ✓ balanced." },
      { text: "(b) NW corner: x₁₁ = 20 (D₁ done), x₁₂ = 10 (W₁ done), x₂₂ = 15 (D₂ done), x₂₃ = 25 (all done)." },
      { tex: "\\text{Cost}=20(4)+10(6)+15(3)+25(7)=80+60+45+175" },
      { text: "(c) Basic cells = 4 = m + n − 1 = 2 + 3 − 1 ✓ non-degenerate." },
    ],
    answerTex: "\\text{Total cost}=360",
  },
];

export const examByModule = Object.fromEntries(examQuestions.map((q) => [q.moduleSlug, q]));
