import { useState } from "react";
import MathTex from "../Math.jsx";
import MatrixGrid from "./MatrixGrid.jsx";
import { determinant, fmt } from "../../../lib/bmla/linalg.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";

const SEED = {
  2: [["3", "2"], ["5", "4"]],
  3: [["6", "1", "1"], ["4", "-2", "5"], ["2", "8", "7"]],
};

/** Step-by-step determinant by cofactor expansion (2×2 / 3×3). */
export default function DetSolver() {
  const [n, setN] = useState(3);
  const [grid, setGrid] = useState(SEED[3]);
  const [out, setOut] = useState(null);

  const setCell = (r, c, v) => {
    setGrid((g) => g.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? v : cell))));
    setOut(null);
  };
  const resize = (size) => {
    setN(size);
    setGrid(SEED[size]);
    setOut(null);
  };
  const compute = () => {
    setOut(determinant(grid.map((row) => row.map((v) => Number(v) || 0))));
    bumpStudyActivity();
  };

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Interactive · Determinant (cofactor)</p>
      <p className="mb-4 text-sm text-muted">Edit the matrix, then watch the cofactor expansion along row 1, term by term.</p>

      <div className="mb-3 inline-flex gap-1 rounded-full border border-line/70 p-1">
        {[2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => resize(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${n === s ? "bg-crimson text-silver" : "text-muted hover:text-silver"}`}
          >
            {s}×{s}
          </button>
        ))}
      </div>

      <MatrixGrid grid={grid} onCell={setCell} ariaLabel="matrix entry" />

      <button type="button" onClick={compute} className="mt-4 rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
        Compute determinant
      </button>

      {out && (
        <div className="mt-4 space-y-3" aria-live="polite">
          {out.steps.map((s, i) => (
            <div key={i} className="rounded-lg border border-line/60 bg-ink/50 p-4">
              {s.text && <p className="mb-1 text-xs text-cyan">{s.text}</p>}
              {s.tex && <MathTex tex={s.tex} className="text-silver" />}
            </div>
          ))}
          <p className="text-sm font-medium text-jade-bright">det = {fmt(out.value)}{out.value === 0 ? " — the matrix is singular (no inverse)." : ""}</p>
        </div>
      )}
    </div>
  );
}
