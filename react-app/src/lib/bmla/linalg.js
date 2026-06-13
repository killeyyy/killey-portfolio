// Pure linear-algebra helpers (no React) — unit-testable.
const EPS = 1e-10;
const clean = (x) => (Math.abs(x) < EPS ? 0 : Math.abs(x - Math.round(x)) < EPS ? Math.round(x) : x);

export function fmt(x) {
  const v = clean(x);
  if (Number.isInteger(v)) return String(v);
  return String(parseFloat(v.toFixed(3)));
}

/** Matrix (array of rows) → TeX augmented array (last column after the bar). */
export function toTex(m, augmented = true) {
  const cols = m[0].length;
  const spec = augmented ? `${"c".repeat(cols - 1)}|c` : "c".repeat(cols);
  const body = m.map((row) => row.map(fmt).join("&")).join("\\\\");
  return `\\left[\\begin{array}{${spec}}${body}\\end{array}\\right]`;
}

/**
 * Gaussian elimination to RREF with a recorded step list.
 * @param {number[][]} input
 * @returns {{steps:{op:string, matrix:number[][]}[], result:number[][]}}
 */
export function rref(input) {
  const m = input.map((r) => r.map(Number));
  const rows = m.length;
  const cols = m[0].length;
  const steps = [{ op: "Start", matrix: m.map((r) => [...r]) }];
  const push = (op) => steps.push({ op, matrix: m.map((r) => r.map(clean)) });

  let pivotRow = 0;
  for (let col = 0; col < cols - 1 && pivotRow < rows; col++) {
    // find best pivot (partial pivoting for stability)
    let best = pivotRow;
    for (let r = pivotRow + 1; r < rows; r++) {
      if (Math.abs(m[r][col]) > Math.abs(m[best][col])) best = r;
    }
    if (Math.abs(m[best][col]) < EPS) continue; // free column

    if (best !== pivotRow) {
      [m[pivotRow], m[best]] = [m[best], m[pivotRow]];
      push(`R${pivotRow + 1} ↔ R${best + 1}`);
    }
    const p = m[pivotRow][col];
    if (Math.abs(p - 1) > EPS) {
      for (let c = 0; c < cols; c++) m[pivotRow][c] /= p;
      push(`R${pivotRow + 1} → R${pivotRow + 1} ÷ ${fmt(p)}`);
    }
    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const k = m[r][col];
      if (Math.abs(k) < EPS) continue;
      for (let c = 0; c < cols; c++) m[r][c] -= k * m[pivotRow][c];
      push(`R${r + 1} → R${r + 1} − (${fmt(k)})·R${pivotRow + 1}`);
    }
    pivotRow++;
  }
  return { steps, result: m.map((r) => r.map(clean)) };
}

/** Classify an augmented RREF system: "unique" | "none" | "infinite". */
export function classify(rrefMatrix) {
  const cols = rrefMatrix[0].length;
  let pivots = 0;
  for (const row of rrefMatrix) {
    const lead = row.slice(0, cols - 1).findIndex((x) => Math.abs(x) > EPS);
    if (lead === -1) {
      if (Math.abs(row[cols - 1]) > EPS) return "none";
    } else pivots++;
  }
  return pivots === cols - 1 ? "unique" : "infinite";
}

/** Matrix → TeX with a vertical bar after `leftCols` columns (0/undefined = none). */
export function toTexAt(m, leftCols = 0) {
  const cols = m[0].length;
  const spec =
    leftCols > 0 && leftCols < cols
      ? "c".repeat(leftCols) + "|" + "c".repeat(cols - leftCols)
      : "c".repeat(cols);
  const body = m.map((row) => row.map(fmt).join("&")).join("\\\\");
  return `\\left[\\begin{array}{${spec}}${body}\\end{array}\\right]`;
}

const trace = (m) => m.reduce((s, row, i) => s + row[i], 0);
const minor = (m, i, j) => m.filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j));

/** Determinant by cofactor expansion along row 1, with display steps for 2×2 / 3×3. */
export function determinant(m) {
  const n = m.length;
  const M = m.map((r) => r.map(Number));
  if (n === 1) return { value: clean(M[0][0]), steps: [{ tex: `\\det = ${fmt(M[0][0])}` }] };
  if (n === 2) {
    const v = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    return {
      value: clean(v),
      steps: [
        { text: "2×2 rule: det = ad − bc", tex: `\\det${toTexAt(M)} = (${fmt(M[0][0])})(${fmt(M[1][1])}) - (${fmt(M[0][1])})(${fmt(M[1][0])}) = ${fmt(v)}` },
      ],
    };
  }
  if (n === 3) {
    const [a, b, c] = M[0];
    const m11 = minor(M, 0, 0), m12 = minor(M, 0, 1), m13 = minor(M, 0, 2);
    const d11 = M[1][1] * M[2][2] - M[1][2] * M[2][1];
    const d12 = M[1][0] * M[2][2] - M[1][2] * M[2][0];
    const d13 = M[1][0] * M[2][1] - M[1][1] * M[2][0];
    const value = a * d11 - b * d12 + c * d13;
    return {
      value: clean(value),
      steps: [
        { text: "Cofactor expansion along row 1 (sign pattern + − +):", tex: `\\det = (${fmt(a)})${toTexAt(m11)} - (${fmt(b)})${toTexAt(m12)} + (${fmt(c)})${toTexAt(m13)}` },
        { text: "Evaluate each 2×2 minor:", tex: `= (${fmt(a)})(${fmt(d11)}) - (${fmt(b)})(${fmt(d12)}) + (${fmt(c)})(${fmt(d13)})` },
        { tex: `= ${fmt(clean(value))}` },
      ],
    };
  }
  // n ≥ 4: recurse along row 1 (value only)
  let v = 0;
  for (let j = 0; j < n; j++) v += (j % 2 ? -1 : 1) * M[0][j] * determinant(minor(M, 0, j)).value;
  return { value: clean(v), steps: [{ tex: `\\det = ${fmt(clean(v))}` }] };
}

/** Inverse via Gauss–Jordan on [A | I]. Returns steps (n×2n), inverse or null. */
export function inverse(m) {
  const n = m.length;
  const A = m.map((r, i) => [...r.map(Number), ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  const steps = [{ op: "Augment with the identity: [A | I]", matrix: A.map((r) => r.map(clean)) }];
  const push = (op) => steps.push({ op, matrix: A.map((r) => r.map(clean)) });

  let pivotRow = 0;
  for (let col = 0; col < n && pivotRow < n; col++) {
    let best = pivotRow;
    for (let r = pivotRow + 1; r < n; r++) if (Math.abs(A[r][col]) > Math.abs(A[best][col])) best = r;
    if (Math.abs(A[best][col]) < EPS) return { steps, inverse: null, singular: true };
    if (best !== pivotRow) {
      [A[pivotRow], A[best]] = [A[best], A[pivotRow]];
      push(`R${pivotRow + 1} ↔ R${best + 1}`);
    }
    const p = A[pivotRow][col];
    if (Math.abs(p - 1) > EPS) {
      for (let c = 0; c < 2 * n; c++) A[pivotRow][c] /= p;
      push(`R${pivotRow + 1} → R${pivotRow + 1} ÷ ${fmt(p)}`);
    }
    for (let r = 0; r < n; r++) {
      if (r === pivotRow) continue;
      const k = A[r][col];
      if (Math.abs(k) < EPS) continue;
      for (let c = 0; c < 2 * n; c++) A[r][c] -= k * A[pivotRow][c];
      push(`R${r + 1} → R${r + 1} − (${fmt(k)})·R${pivotRow + 1}`);
    }
    pivotRow++;
  }
  const inv = A.map((r) => r.slice(n).map(clean));
  return { steps, inverse: inv, singular: false };
}

/** Real eigenvalues for a 2×2 or 3×3 integer matrix, plus the characteristic data. */
export function eigenvalues(m) {
  const n = m.length;
  if (n === 2) {
    const tr = trace(m), det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
    const disc = tr * tr - 4 * det;
    if (disc < -EPS) return { n, tr, det, disc, values: [], distinct: [], real: false };
    const s = Math.sqrt(Math.max(0, disc));
    const values = [(tr + s) / 2, (tr - s) / 2].map(clean);
    return { n, tr, det, disc, values, distinct: dedupe(values), real: true };
  }
  if (n === 3) {
    const c2 = trace(m); // λ³ − c2 λ² + c1 λ − c0
    const c1 = (m[0][0] * m[1][1] - m[0][1] * m[1][0]) + (m[0][0] * m[2][2] - m[0][2] * m[2][0]) + (m[1][1] * m[2][2] - m[1][2] * m[2][1]);
    const c0 = determinant(m).value;
    const { values, allReal } = cubicRealRoots(-c2, c1, -c0);
    return { n, c2, c1, c0, values: values.map(clean), distinct: dedupe(values), real: allReal };
  }
  return { n, values: [], distinct: [], real: false };
}

/** One eigenvector (basis of the eigenspace) for eigenvalue λ, scaled to integers when possible. */
export function eigenvectorFor(m, lambda) {
  const n = m.length;
  const B = m.map((row, i) => [...row.map((v, j) => v - (i === j ? lambda : 0)), 0]);
  const { result } = rref(B);
  const pivotCols = [];
  for (const row of result) {
    const lead = row.slice(0, n).findIndex((x) => Math.abs(x) > EPS);
    if (lead !== -1) pivotCols.push(lead);
  }
  const freeCol = [...Array(n).keys()].find((c) => !pivotCols.includes(c));
  if (freeCol === undefined) return null;
  const vec = Array(n).fill(0);
  vec[freeCol] = 1;
  for (const row of result) {
    const lead = row.slice(0, n).findIndex((x) => Math.abs(x) > EPS);
    if (lead === -1) continue;
    let s = 0;
    for (let c = 0; c < n; c++) if (c !== lead) s += row[c] * vec[c];
    vec[lead] = -s;
  }
  return integerize(vec).map(clean);
}

/** Weights for [v₁ … vₚ | b] when the system is consistent & unique; else null. */
export function readWeights(rrefResult, nVars) {
  const weights = Array(nVars).fill(0);
  let pivots = 0;
  for (const row of rrefResult) {
    const lead = row.slice(0, nVars).findIndex((x) => Math.abs(x) > EPS);
    if (lead === -1) continue;
    pivots++;
    weights[lead] = clean(row[row.length - 1]);
  }
  return pivots === nVars ? weights : null;
}

// ── helpers ────────────────────────────────────────────────────────────────
function dedupe(vals) {
  const out = [];
  for (const v of vals.map(clean)) if (!out.some((x) => Math.abs(x - v) < 1e-6)) out.push(v);
  return out;
}

/** Real roots of a monic cubic λ³ + aλ² + bλ + c. Tries integer roots, then numeric. */
function cubicRealRoots(a, b, c) {
  const f = (x) => x * x * x + a * x * x + b * x + c;
  // integer roots (monic, integer coeffs ⇒ rational roots are integers dividing c)
  let root = null;
  const bound = Math.ceil(1 + Math.max(Math.abs(a), Math.abs(b), Math.abs(c)));
  for (let x = -bound; x <= bound && root === null; x++) if (Math.abs(f(x)) < EPS) root = x;
  // numeric fallback: scan for a sign change, then bisect
  if (root === null) {
    let prev = -bound, fp = f(prev);
    for (let x = -bound + 0.01; x <= bound; x += 0.01) {
      const fx = f(x);
      if (fp === 0 || fp * fx < 0) { root = bisect(f, prev, x); break; }
      prev = x; fp = fx;
    }
    if (root === null) return { values: [], allReal: false };
  }
  // deflate: λ³+aλ²+bλ+c = (λ−root)(λ²+pλ+q)
  const p = a + root, q = b + p * root;
  const disc = p * p - 4 * q;
  if (disc < -EPS) return { values: [clean(root)], allReal: false };
  const s = Math.sqrt(Math.max(0, disc));
  return { values: [root, (-p + s) / 2, (-p - s) / 2].map(clean), allReal: true };
}

function bisect(f, lo, hi) {
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

/** Scale a vector to small integers when every entry is (close to) rational with a tiny denominator. */
function integerize(vec) {
  for (let k = 1; k <= 12; k++) {
    if (vec.every((x) => Math.abs(x * k - Math.round(x * k)) < 1e-6)) {
      return vec.map((x) => Math.round(x * k));
    }
  }
  return vec.map(clean);
}
