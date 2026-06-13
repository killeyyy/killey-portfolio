// One-page formula & theorem reference for BMLA (MTS 212) — last-minute revision.
// Concise, original wording + standard (non-copyrightable) formulas. Mirrors the
// eight curriculum modules and the Lay/Budnick coverage.

/**
 * @typedef {{ term: string, body?: string, tex?: string }} RefItem
 * @typedef {{ id: string, title: string, ref: string, accent: string, items: RefItem[] }} RefSection
 */

/** @type {RefSection[]} */
export const referenceSections = [
  {
    id: "systems",
    title: "Systems & Row Reduction",
    ref: "Lay §1.1–§1.2",
    accent: "text-crimson-bright",
    items: [
      { term: "Linear equation", body: "Every variable to the first power only — no products, powers, roots or transcendentals.", tex: "a_1x_1+a_2x_2+\\dots+a_nx_n=b" },
      { term: "Three outcomes (always)", body: "A linear system has exactly one solution, no solution, or infinitely many — never any other count." },
      { term: "Consistent / inconsistent", body: "Consistent = at least one solution (one or infinitely many). Inconsistent = no solution." },
      { term: "Elementary row operations", body: "Replacement (Rᵢ → Rᵢ + k·Rⱼ), Interchange (Rᵢ ↔ Rⱼ), Scaling (Rᵢ → k·Rᵢ, k ≠ 0). They preserve the solution set." },
      { term: "Echelon form (REF)", body: "(1) zero rows at the bottom; (2) each leading entry right of the one above; (3) zeros below each leading entry." },
      { term: "Reduced echelon (RREF)", body: "Also: (4) each leading entry is 1; (5) it is the only nonzero in its column. The RREF of a matrix is unique (Theorem 1)." },
      { term: "Pivot / basic / free", body: "Pivot column = column with a leading entry. Pivot-column variables are basic; the rest are free." },
      { term: "Existence & Uniqueness (Thm 2)", body: "Consistent ⇔ the rightmost column is NOT a pivot column (no row [0…0 | b], b ≠ 0). If consistent: unique when no free variables, infinitely many when ≥ 1 free variable." },
      { term: "Max pivots", body: "At most one per row and per column.", tex: "\\#\\text{pivots}\\le\\min(m,n)" },
    ],
  },
  {
    id: "vectors",
    title: "Vectors, Span & Independence",
    ref: "Lay §1.3–§1.7",
    accent: "text-violet-bright",
    items: [
      { term: "Linear combination", tex: "\\vec{y}=c_1\\vec{v}_1+\\dots+c_p\\vec{v}_p\\quad(c_i\\ \\text{any reals})" },
      { term: "The bridge", body: "x₁a₁ + … + xₙaₙ = b has the same solution set as the system with augmented matrix [a₁ … aₙ | b]. So b is a linear combination ⇔ that system is consistent." },
      { term: "Span", body: "Span{v₁,…,vₚ} = all linear combinations. Span{v} is a line through 0; Span{v₁,v₂} is a line if dependent, a plane if independent." },
      { term: "Ax as a combination", tex: "A\\vec{x}=x_1\\vec{a}_1+\\dots+x_n\\vec{a}_n" },
      { term: "Ax = b solvable for every b", body: "⇔ the columns of A span ℝᵐ ⇔ A has a pivot in every row." },
      { term: "Homogeneous Ax = 0", body: "Always has the trivial solution. Only the trivial one ⇔ A has a pivot in every column (no free variables)." },
      { term: "Solution set of Ax = b", body: "If consistent: x = p + (solution of Ax = 0), a particular solution plus the null-space (parametric vector form)." },
      { term: "Linear independence", body: "{v₁,…,vₚ} is independent if c₁v₁ + … + cₚvₚ = 0 forces all cᵢ = 0. Shortcut: p > n ⇒ dependent; a set containing 0 is dependent." },
    ],
  },
  {
    id: "matrix-ops",
    title: "Matrix Operations & Inverse",
    ref: "Lay §2.1–§2.3",
    accent: "text-gold",
    items: [
      { term: "Product defined", body: "AB exists when #cols(A) = #rows(B); size (rows A) × (cols B). Not commutative: AB ≠ BA in general." },
      { term: "Transpose & inverse of a product", tex: "(AB)^{T}=B^{T}A^{T},\\qquad (AB)^{-1}=B^{-1}A^{-1}" },
      { term: "2×2 inverse", tex: "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}" },
      { term: "Inverse by row reduction", body: "Row reduce [A | I]. If A ~ I, the right block becomes A⁻¹; otherwise A is singular." },
      { term: "Invertible Matrix Theorem (key links)", body: "For square A: invertible ⇔ A ~ I ⇔ n pivots ⇔ Ax = 0 only trivial ⇔ columns independent ⇔ columns span ℝⁿ ⇔ det A ≠ 0." },
    ],
  },
  {
    id: "determinants",
    title: "Determinants",
    ref: "Lay Ch. 3",
    accent: "text-cyan",
    items: [
      { term: "2×2 determinant", tex: "\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc" },
      { term: "Cofactor expansion", body: "Expand along any row/column: det A = Σ aᵢⱼ·Cᵢⱼ with cofactor Cᵢⱼ = (−1)^{i+j}·Mᵢⱼ. Pick the row/column with the most zeros." },
      { term: "Triangular matrix", body: "Determinant = product of the diagonal entries." },
      { term: "Row-operation effects", body: "Replacement: unchanged. Interchange: ×(−1). Scaling a row by k: ×k." },
      { term: "Products & scaling", tex: "\\det(AB)=\\det A\\,\\det B,\\qquad \\det(kA)=k^{n}\\det A" },
      { term: "Singular test", body: "A is invertible ⇔ det A ≠ 0; det A = 0 ⇔ singular." },
      { term: "Cramer's Rule", tex: "x_i=\\dfrac{\\det A_i(\\vec b)}{\\det A}\\quad(A_i\\ \\text{replaces col } i \\text{ by } \\vec b)" },
    ],
  },
  {
    id: "eigen",
    title: "Eigenvalues & Diagonalization",
    ref: "Lay Ch. 5",
    accent: "text-jade-bright",
    items: [
      { term: "Definition", tex: "A\\vec{v}=\\lambda\\vec{v},\\quad \\vec{v}\\ne 0" },
      { term: "Find eigenvalues", body: "Solve the characteristic equation.", tex: "\\det(A-\\lambda I)=0" },
      { term: "Find eigenvectors", body: "For each λ, solve (A − λI)x = 0 — the eigenspace is the null space of A − λI." },
      { term: "Triangular matrix", body: "Eigenvalues are the diagonal entries." },
      { term: "Trace & determinant", body: "Sum of eigenvalues = trace(A); product of eigenvalues = det(A)." },
      { term: "Diagonalizable", body: "A = PDP⁻¹ exists ⇔ A has n linearly independent eigenvectors (geometric = algebraic multiplicity for every λ). n distinct eigenvalues ⇒ always diagonalizable." },
      { term: "Matrix powers", tex: "A^{k}=PD^{k}P^{-1}" },
    ],
  },
  {
    id: "lp",
    title: "Linear Programming",
    ref: "Budnick — Graphical & Simplex",
    accent: "text-amber",
    items: [
      { term: "Standard form", body: "≤ constraint adds a slack (≥ 0); ≥ subtracts a surplus and adds an artificial; = adds an artificial." },
      { term: "Corner-point theorem", body: "If an optimum exists, at least one optimal solution is at a corner (vertex) of the feasible region." },
      { term: "Simplex — entering variable", body: "(Maximisation) choose the column with the most negative Cⱼ − Zⱼ." },
      { term: "Simplex — leaving variable", body: "Minimum non-negative ratio bᵢ / aᵢⱼ; ignore rows with aᵢⱼ ≤ 0." },
      { term: "Unbounded", body: "If the entering column has all entries ≤ 0, there is no leaving row → unbounded." },
      { term: "Duality", body: "max cᵀx s.t. Ax ≤ b ↔ min bᵀy s.t. Aᵀy ≥ c, y ≥ 0. Strong duality: optimal values are equal." },
    ],
  },
  {
    id: "networks",
    title: "Transportation & Assignment",
    ref: "Budnick — Network models",
    accent: "text-magenta",
    items: [
      { term: "Balanced transportation", body: "Σ supply = Σ demand. If not, add a dummy row/column with zero costs." },
      { term: "Initial solution methods", body: "North-West Corner, Least-Cost, and VAM (penalty = 2nd-smallest − smallest cost; VAM is usually best)." },
      { term: "Optimality (MODI/u-v)", body: "Set u₁ = 0; for basic cells uᵢ + vⱼ = cᵢⱼ. Optimal when every non-basic Δᵢⱼ = cᵢⱼ − (uᵢ + vⱼ) ≥ 0." },
      { term: "Degeneracy", body: "Basic cells < m + n − 1 → insert an ε allocation." },
      { term: "Assignment (Hungarian)", body: "Subtract row minima, then column minima; cover all zeros with the fewest lines. Optimal when #lines = n; else subtract the smallest uncovered value and repeat." },
    ],
  },
];
