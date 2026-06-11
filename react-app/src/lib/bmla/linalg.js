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
