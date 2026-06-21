import { useState } from "react";
import MathTex from "../Math.jsx";
import MatrixGrid from "./MatrixGrid.jsx";
import { eigenvalues, eigenvectorFor, fmt } from "../../../lib/bmla/linalg.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";

const SEED = {
  2: [["4", "1"], ["2", "3"]],
  3: [["2", "0", "0"], ["1", "2", "1"], ["-1", "0", "1"]],
};

const vecTex = (v) => `\\begin{bmatrix}${v.map(fmt).join("\\\\")}\\end{bmatrix}`;

/** Eigenvalues (characteristic equation) + an eigenvector per distinct λ, for 2×2 / 3×3. */
export default function EigenSolver() {
  const [n, setN] = useState(2);
  const [grid, setGrid] = useState(SEED[2]);
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
    const m = grid.map((row) => row.map((v) => Number(v) || 0));
    const eig = eigenvalues(m);
    const vectors = eig.real ? eig.distinct.map((l) => ({ l, v: eigenvectorFor(m, l) })) : [];
    setOut({ m, eig, vectors });
    bumpStudyActivity();
  };

  const charTex = (eig) =>
    eig.n === 2
      ? `\\lambda^2 - (${fmt(eig.tr)})\\lambda + (${fmt(eig.det)}) = 0`
      : `\\lambda^3 - (${fmt(eig.c2)})\\lambda^2 + (${fmt(eig.c1)})\\lambda - (${fmt(eig.c0)}) = 0`;

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Interactive · Eigenvalues & eigenvectors</p>
      <p className="mb-4 text-sm text-muted">Solve det(A − λI) = 0 for the eigenvalues, then read an eigenvector for each from the null space of A − λI.</p>

      <div className="mb-3 inline-flex gap-1 rounded-full border border-line/70 p-1">
        {[2, 3].map((s) => (
          <button key={s} type="button" onClick={() => resize(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${n === s ? "bg-crimson text-silver" : "text-muted hover:text-silver"}`}>
            {s}×{s}
          </button>
        ))}
      </div>

      <MatrixGrid grid={grid} onCell={setCell} ariaLabel="matrix entry" />

      <button type="button" onClick={compute} className="mt-4 rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
        Find eigenvalues
      </button>

      {out && (
        <div className="mt-4 space-y-3" aria-live="polite">
          <div className="rounded-lg border border-line/60 bg-ink/50 p-4">
            <p className="mb-1 text-xs text-cyan">Characteristic equation</p>
            <MathTex tex={charTex(out.eig)} className="text-silver" />
          </div>
          {out.eig.real ? (
            <>
              <p className="text-sm text-silver">
                Eigenvalues: <span className="font-mono text-jade-bright">{out.eig.values.map(fmt).join(", ")}</span>
              </p>
              <div className="space-y-2">
                {out.vectors.map(({ l, v }) => (
                  <div key={l} className="rounded-lg border border-line/60 bg-ink/50 p-3">
                    {v ? (
                      <MathTex tex={`\\lambda = ${fmt(l)}:\\quad \\vec{v} = ${vecTex(v)}`} className="text-silver" />
                    ) : (
                      <MathTex tex={`\\lambda = ${fmt(l)}`} className="text-silver" />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm text-silver/90">
              This matrix has <strong>complex</strong> eigenvalues — outside the real cases covered in the course. The characteristic equation above still holds.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
