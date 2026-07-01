// Recomputes every verifiable answer in data/bmla/paper-bank.js with
// lib/bmla/linalg.js and asserts it matches both the stored answer and the
// handwritten keys. Run:  node scripts/verify-paper-bank.mjs
import { rref, classify, determinant, inverse, readWeights } from "../src/lib/bmla/linalg.js";
import { PAPER_BANK } from "../src/data/bmla/paper-bank.js";
import { ARCHETYPES, DRILL_ORDER } from "../src/data/bmla/papers.js";

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => {
  if (cond) { pass++; }
  else { fail++; console.error(`✗ ${name} ${detail}`); }
};
const eq = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const vecEq = (u, v, tol = 1e-9) => u.length === v.length && u.every((x, i) => eq(x, v[i], tol));
const matMul = (A, B) => A.map((row) => B[0].map((_, j) => row.reduce((s, x, k) => s + x * B[k][j], 0)));
const matVec = (A, x) => A.map((row) => row.reduce((s, a, i) => s + a * x[i], 0));
const isId = (M, tol = 1e-9) => M.every((row, i) => row.every((x, j) => eq(x, i === j ? 1 : 0, tol)));
const T = (M) => M[0].map((_, j) => M.map((row) => row[j]));
const item = (id) => PAPER_BANK.find((x) => x.id === id);

// ── structural checks ────────────────────────────────────────────────────
for (const q of PAPER_BANK) {
  ok(`${q.id}: has source`, typeof q.source === "string" && q.source.length > 3);
  ok(`${q.id}: valid archetype`, DRILL_ORDER.includes(q.archetype));
  if (q.qtype === "mcq") {
    ok(`${q.id}: mcq shape`, Array.isArray(q.options) && q.options.length >= 3 && Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.options.length);
  } else {
    ok(`${q.id}: numeric shape`, typeof q.answer === "number" && typeof q.tol === "number");
  }
}
ok("every archetype has bank items", DRILL_ORDER.every((a) => PAPER_BANK.some((q) => q.archetype === a)));
ok("ARCHETYPES matches DRILL_ORDER", ARCHETYPES.length === DRILL_ORDER.length && ARCHETYPES.every((a) => DRILL_ORDER.includes(a.id)));

// ── 2025 Q1: A x = b unique (−1,1,0); Ax=0 trivial; columns independent ──
{
  const A = [[1, 2, -1], [2, 5, -2], [-1, -3, 2]], b = [1, 3, -2];
  const R = rref(A.map((r, i) => [...r, b[i]])).result;
  ok("2025 Q1a: unique", classify(R) === "unique");
  ok("2025 Q1a: x = (−1,1,0)", vecEq(readWeights(R, 3), [-1, 1, 0]));
  ok("2025 Q1a: MCQ index", item("p25-rref-1").correctIndex === 0);
  const H = rref(A.map((r) => [...r, 0])).result;
  ok("2025 Q1b: Ax=0 trivial only", classify(H) === "unique" && vecEq(readWeights(H, 3), [0, 0, 0]));
  ok("2025 Q1c: independent (3 pivots)", !inverse(A).singular);
}

// ── Quiz 1 (Feb 2026): infinite; x = (−1,2,0)+x₃(3,−1,1); 3a₁−a₂+a₃=0 ────
{
  const A = [[1, 2, -1], [2, 5, -1], [-1, -1, 2]], b = [3, 8, -1];
  const R = rref(A.map((r, i) => [...r, b[i]])).result;
  ok("Quiz Q1a: infinite", classify(R) === "infinite");
  ok("Quiz Q1a: particular (−1,2,0)", vecEq(matVec(A, [-1, 2, 0]), b));
  ok("Quiz Q1a: direction (3,−1,1)", vecEq(matVec(A, [3, -1, 1]), [0, 0, 0]));
  ok("Quiz param: x₃=2 → x₁=5", vecEq(matVec(A, [5, 0, 2]), b) && eq(-1 + 3 * 2, item("pqz-param-1").answer));
  const c = [3, -1, 1]; // dependency coefficients = nullspace entries
  const cols = T(A);
  const combo = cols[0].map((_, r) => c[0] * cols[0][r] + c[1] * cols[1][r] + c[2] * cols[2][r]);
  ok("Quiz Q1c: 3a₁−a₂+a₃=0", vecEq(combo, [0, 0, 0]) && eq(item("pqz-lindep-1").answer, 3));
}

// ── 2016 Q1: parametric k system ─────────────────────────────────────────
{
  const sys = (k) => [[1, -2, 1, k], [2, -2, k, 1 - k], [1, -4, -1, 3 + 3 * k]];
  for (const k of [0, 1, 5, -3]) {
    const R = rref(sys(k)).result;
    ok(`2016 Q1: k=${k} unique`, classify(R) === "unique");
    ok(`2016 Q1: k=${k} sol (−k,−½−k,−1)`, vecEq(readWeights(R, 3), [-k, -0.5 - k, -1], 1e-8));
  }
  ok("2016 Q1: x₃ = −1 stored", eq(item("p16-rref-1").answer, -1));
  const R4 = rref(sys(4)).result;
  ok("2016 Q1: k=4 infinite", classify(R4) === "infinite");
  const A4 = [[1, -2, 1], [2, -2, 4], [1, -4, -1]];
  ok("2016 Q1c: particular (−7,−11/2,0)", vecEq(matVec(A4, [-7, -5.5, 0]), [4, 1 - 4, 3 + 12]));
  ok("2016 Q1c: direction (−3,−1,1)", vecEq(matVec(A4, [-3, -1, 1]), [0, 0, 0]));
  ok("2016 Q1c: coeff −3 stored", eq(item("p16-param-2").answer, -3));
}

// ── 2016 Q2: parametric solution + homogeneous ───────────────────────────
{
  const A = [[1, 1, 1], [0, -1, -2], [1, 2, 3]], b = [1, 0, 1];
  const R = rref(A.map((r, i) => [...r, b[i]])).result;
  ok("2016 Q2: infinite", classify(R) === "infinite");
  ok("2016 Q2a: particular (1,0,0)", vecEq(matVec(A, [1, 0, 0]), b));
  ok("2016 Q2a: direction (1,−2,1)", vecEq(matVec(A, [1, -2, 1]), [0, 0, 0]));
}

// ── 2026 Q1: consistency condition b₁ = b₂ + b₃ ; Q1b always consistent ──
{
  const A = [[2, -4, -2], [-5, 1, 1], [7, -5, -3]];
  const rnd = () => Math.round((Math.random() - 0.5) * 20);
  for (let t = 0; t < 6; t++) {
    const b2 = rnd(), b3 = rnd();
    const good = rref(A.map((r, i) => [...r, [b2 + b3, b2, b3][i]])).result;
    ok(`2026 Q1a: b1=b2+b3 consistent (t${t})`, classify(good) !== "none");
    const bad = rref(A.map((r, i) => [...r, [b2 + b3 + 1, b2, b3][i]])).result;
    ok(`2026 Q1a: b1≠b2+b3 inconsistent (t${t})`, classify(bad) === "none");
  }
  const A2 = [[2, -4, -2], [-5, 1, 1], [1, 1, 1]];
  for (let t = 0; t < 6; t++) {
    const b = [rnd(), rnd(), rnd()];
    ok(`2026 Q1b: always consistent (t${t})`, classify(rref(A2.map((r, i) => [...r, b[i]])).result) !== "none");
  }
}

// ── 2025 Q2: α analysis + dependency ─────────────────────────────────────
{
  const A = [[1, 2, -1], [2, 5, -2], [-1, -4, 1]];
  for (const a of [0, 1, 3, -2]) {
    ok(`2025 Q2a: α=${a} inconsistent`, classify(rref(A.map((r, i) => [...r, [a, a, 2][i]])).result) === "none");
  }
  const R2 = rref(A.map((r, i) => [...r, [2, 2, 2][i]])).result;
  ok("2025 Q2b: α=2 infinite", classify(R2) === "infinite");
  ok("2025 Q2b: particular (6,−2,0)", vecEq(matVec(A, [6, -2, 0]), [2, 2, 2]));
  ok("2025 Q2b: x₂ = −2 stored", eq(item("p25-param-1").answer, -2));
  ok("2025 Q2c: direction (1,0,1)", vecEq(matVec(A, [1, 0, 1]), [0, 0, 0]));
  ok("2025 Q2e: coeff matrix singular (never unique)", inverse(A).singular);
  const cols = T(A);
  ok("2025 Q2f: a₁ + a₃ = 0", vecEq(cols[0].map((x, i) => x + cols[2][i]), [0, 0, 0]));
}

// ── 2016 Q3: independence checks ─────────────────────────────────────────
{
  const comb = (vs, cs) => vs[0].map((_, r) => cs.reduce((s, c, i) => s + c * vs[i][r], 0));
  ok("2016 Q3a: v₁+v₂−2v₃=0", vecEq(comb([[3, 2, 2], [1, 0, -2], [2, 1, 0]], [1, 1, -2]), [0, 0, 0]));
  ok("2016 Q3a: c=−2 stored", eq(item("p16-lindep-1").answer, -2));
  ok("2016 Q3c: v₁+v₂+v₃−3v₄=0", vecEq(comb([[1, 1, 1], [2, 3, 5], [3, 5, 0], [2, 3, 2]], [1, 1, 1, -3]), [0, 0, 0]));
  ok("2016 Q3b: (1,2),(1,1) independent", !eq(1 * 1 - 1 * 2, 0)); // det [[1,1],[2,1]] = −1
}

// ── transformations: 2016 Q4 / 2025 Q3 / 2026 Q3 ─────────────────────────
{
  const y = [[1, 2], [1, 1], [2, 1]];
  const Tu = [2 * y[0][0] + 3 * y[1][0] + 5 * y[2][0], 2 * y[0][1] + 3 * y[1][1] + 5 * y[2][1]];
  ok("2016 Q4a: T(2,3,5) = (15,12)", vecEq(Tu, [15, 12]) && eq(item("p16-lt-1").answer, 15));

  ok("2025 Q3a: (1,2)+(0,1) = (1,3)", vecEq([1 + 0, 2 + 1], [1, 3]));
  // 2025 Q3c counterexample: T(x1,x2) = (x2, x1x2, x2)
  const T25 = ([x1, x2]) => [x2, x1 * x2, x2];
  const s = T25([1, 1]).map((v, i) => v + T25([0, 1])[i]);
  ok("2025 Q3c: T(u)+T(v) ≠ T(u+v)", !vecEq(s, T25([1, 2])));

  // 2026 Q3a counterexample: T(x) = (x1 − |x2|, 2x2 + x3)
  const T26 = ([x1, x2, x3]) => [x1 - Math.abs(x2), 2 * x2 + x3];
  const lhs = T26([0, 1, 0]).map((v, i) => v + T26([0, -1, 0])[i]);
  ok("2026 Q3a: additivity fails", !vecEq(lhs, T26([0, 0, 0])) && vecEq(lhs, [-2, 0]));

  // 2026 Q3b preimage
  const M = [[1, -2], [-1, 3], [3, -2]];
  ok("2026 Q3b: T(5,3) = (−1,4,9)", vecEq(matVec(M, [5, 3]), [-1, 4, 9]) && eq(item("p26-lt-2").answer, 5));

  // 2026 Q3c shear: columns are T(e1), T(e2)
  const S = [[1, 3], [0, 1]];
  ok("2026 Q3c: S·e₂ = e₂+3e₁, S·e₁ = e₁", vecEq(matVec(S, [0, 1]), [3, 1]) && vecEq(matVec(S, [1, 0]), [1, 0]));

  // 2016 Q4b-ii: T(0) ≠ 0
  ok("2016 Q4b: T(0) = (0,0,1) ≠ 0", !vecEq([0, -0, 1], [0, 0, 0]));
}

// ── 2026 Q2: span ────────────────────────────────────────────────────────
{
  const aug = (h) => [[1, -3, h], [0, 1, -5], [-2, 8, -3]];
  const R = rref(aug(-3.5)).result;
  ok("2026 Q2a: h=−3.5 consistent", classify(R) !== "none");
  ok("2026 Q2a: weights (−18.5, −5)", vecEq(readWeights(R, 2), [-18.5, -5]));
  const y = [-3.5, -5, -3];
  const combo = [1, 0, -2].map((v, i) => -18.5 * v + -5 * [-3, 1, 8][i]);
  ok("2026 Q2a: c₁v₁+c₂v₂ = y", vecEq(combo, y));
  ok("2026 Q2a: h=0 NOT in span", classify(rref(aug(0)).result) === "none");
  ok("2026 Q2a: stored −3.5", eq(item("p26-span-1").answer, -3.5));
  const M3 = [[1, -3, 0], [0, 1, -5], [-2, 8, -3]];
  ok("2026 Q2b: {v₁,v₂,y} independent (det ≠ 0)", Math.abs(determinant(M3).value) > 1e-9);
}

// ── elementary matrices: 2025 Q4 / 2026 Q4 ───────────────────────────────
{
  // elementary = exactly one row op away from I
  const isElem = (E) => {
    const n = E.length;
    let offDiag = [], scaled = [], swaps = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (i === j) { if (!eq(E[i][j], 1)) scaled.push([i, E[i][j]]); }
      else if (!eq(E[i][j], 0)) offDiag.push([i, j, E[i][j]]);
    }
    if (offDiag.length === 0) return scaled.length <= 1 && scaled.every(([, v]) => Math.abs(v) > 1e-12); // scaling or I
    if (offDiag.length === 1 && scaled.length === 0) return true;               // replacement
    if (offDiag.length === 2 && scaled.length === 2) {                          // swap
      const [[i1, j1], [i2, j2]] = offDiag;
      return i1 === j2 && i2 === j1 && scaled.every(([, v]) => eq(v, 0));
    }
    return false;
  };
  const E1 = [[1, 0, 0], [0, 1, 0], [2, 0, 1]];
  const E2 = [[1, 0, 0], [0, 1, 0], [0, 0, 2]];
  const E4 = [[0, 0, 1], [0, 1, 0], [1, 0, 0]];
  const E5 = [[1, 0, 0], [0, 1, 0], [1, 1, 1]];
  ok("2025 Q4: E1,E2,E4 elementary", isElem(E1) && isElem(E2) && isElem(E4));
  ok("2025 Q4: E5 NOT elementary", !isElem(E5));
  const E1inv = [[1, 0, 0], [0, 1, 0], [-2, 0, 1]];
  ok("2025 Q4c: E1·E1⁻¹ = I", isId(matMul(E1, E1inv)));

  const A = [[3, 4, 1], [2, -7, -1], [8, 1, 5]];
  const B = [[8, 1, 5], [2, -7, -1], [3, 4, 1]];
  const C = [[3, 4, 1], [2, -7, -1], [2, -7, 3]];
  const P13 = [[0, 0, 1], [0, 1, 0], [1, 0, 0]];
  const E2c = [[1, 0, 0], [0, 1, 0], [-2, 0, 1]];
  ok("2026 Q4a: E₁A = B (swap)", vecEq(matMul(P13, A).flat(), B.flat()));
  ok("2026 Q4a: E₂A = C (R₃−2R₁)", vecEq(matMul(E2c, A).flat(), C.flat()));
  ok("2026 Q4: (3,1) entry −2 stored", eq(item("p26-elem-2").answer, -2));
}

// ── inverse / determinant: 2025 Q5, 2026 Q5b/Q6/Q7 ───────────────────────
{
  const A = [[1, 1, 2], [2, 2, 2], [3, 1, 4]];
  const inv = inverse(A);
  const expected = [[-1.5, 0.5, 0.5], [0.5, 0.5, -0.5], [1, -0.5, 0]];
  ok("2025 Q5a: A⁻¹ matches key", !inv.singular && vecEq(inv.inverse.flat(), expected.flat(), 1e-8));
  ok("2025 Q5a: (1,1) = −3/2 stored", eq(item("p25-inv-1").answer, -1.5));
  const x = matVec(inv.inverse, [4, 2, 3]);
  ok("2025 Q5b: x = (−7/2, 3/2, 3)", vecEq(x, [-3.5, 1.5, 3], 1e-8) && eq(item("p25-inv-2").answer, 3));
  ok("2025 Q5c: det = −4", eq(determinant(A).value, -4) && eq(item("p25-det-1").answer, -4));
  const A4 = A.map((r) => r.map((v) => 4 * v));
  ok("2025 Q5d: det(4A) = −256", eq(determinant(A4).value, -256) && eq(item("p25-det-2").answer, -256));
  ok("2025 Q5d: det(4A⁻¹) = −16", eq(64 / -4, -16));

  const M26 = [[6, -8], [-5, 7]];
  const inv26 = inverse(M26);
  ok("2026 Q5b: det = 2, A⁻¹ = [[3.5,4],[2.5,3]]", eq(determinant(M26).value, 2) && vecEq(inv26.inverse.flat(), [3.5, 4, 2.5, 3], 1e-8));

  const Q6 = [[1, 0, 5, 1], [5, 6, 0, 7], [4, 0, 1, 0], [-1, 2, 2, 1]];
  ok("2026 Q6a: det = 216", eq(determinant(Q6).value, 216, 1e-6) && eq(item("p26-det-1").answer, 216));

  // upper-triangular det = product of diagonal (sample values)
  const B = [[2, 3, -1], [0, 5, 4], [0, 0, -3]];
  ok("2026 Q6b: det(triangular) = aeg", eq(determinant(B).value, 2 * 5 * -3));

  const Q7 = [[2, -1, 1, 0], [0, 6, 0, 7], [4, 0, 1, 0], [3, 0, 1, -2]];
  ok("2026 Q7: det = 31", eq(determinant(Q7).value, 31, 1e-6) && eq(item("p26-inv-3").answer, 31));
  const KEY = [[-12, -2, 19, -7], [-7, 4, -7, 14], [48, 8, -45, 28], [6, 1, 6, -12]];
  const Ainv = KEY.map((r) => r.map((v) => v / 31));
  ok("2026 Q7a: A·A⁻¹ = I (key matrix)", isId(matMul(Q7, Ainv), 1e-8));
  ok("2026 Q7b: det(Aᵀ) = det(A)", eq(determinant(T(Q7)).value, 31, 1e-6));
}

// ── invertibility: 2026 Q5a ──────────────────────────────────────────────
{
  const A = [[1, 6, 4], [2, 4, -1], [-1, 2, 5]];
  ok("2026 Q5a: singular", inverse(A).singular && eq(determinant(A).value, 0));
  ok("2026 Q5a: (22,−9,8) in nullspace", vecEq(matVec(A, [22, -9, 8]), [0, 0, 0]) && eq(item("p26-invert-2").answer, 22));
}

console.log(`\n${pass} checks passed, ${fail} failed — bank of ${PAPER_BANK.length} items`);
process.exit(fail ? 1 : 0);
