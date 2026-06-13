import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import MathTex from "../Math.jsx";
import MatrixGrid from "./MatrixGrid.jsx";
import { rref, classify, readWeights, toTexAt, fmt } from "../../../lib/bmla/linalg.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";

// Default = the lecture's "is b in the span of the columns?" example (answer: no).
const DEFAULT = [
  ["1", "2", "8"],
  ["3", "1", "3"],
  ["0", "5", "17"],
];

/** Decide whether b is a linear combination of v₁…vₚ (the columns), and find the weights. */
export default function SpanChecker() {
  const [grid, setGrid] = useState(DEFAULT);
  const [out, setOut] = useState(null);
  const rows = grid.length;
  const cols = grid[0].length;
  const nVecs = cols - 1;

  const setCell = (r, c, v) => {
    setGrid((g) => g.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? v : cell))));
    setOut(null);
  };
  const resize = (dr, dc) => {
    const R = Math.min(4, Math.max(2, rows + dr));
    const C = Math.min(5, Math.max(2, cols + dc));
    setGrid(Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => grid[r]?.[c] ?? "0")));
    setOut(null);
  };
  const check = () => {
    const m = grid.map((row) => row.map((v) => Number(v) || 0));
    const { result } = rref(m);
    const verdict = classify(result);
    setOut({ result, verdict, weights: verdict !== "none" ? readWeights(result, cols - 1) : null });
    bumpStudyActivity();
  };

  const Btn = ({ onClick, label, children }) => (
    <button type="button" onClick={onClick} aria-label={label} className="inline-flex items-center gap-1 rounded-full border border-line/70 px-2.5 py-1 text-xs text-muted hover:text-silver">
      {children}
    </button>
  );

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Interactive · Span / vector-equation checker</p>
      <p className="mb-4 text-sm text-muted">
        Columns 1–{nVecs} are the vectors v₁…v<sub>{nVecs}</sub>; the last (gold) column is b. Is b a linear combination of them?
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">vectors</span>
        <Btn onClick={() => resize(0, 1)} label="Add a vector"><Plus size={12} aria-hidden="true" /></Btn>
        <Btn onClick={() => resize(0, -1)} label="Remove a vector"><Minus size={12} aria-hidden="true" /></Btn>
        <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-muted">dimension</span>
        <Btn onClick={() => resize(1, 0)} label="Add a row"><Plus size={12} aria-hidden="true" /></Btn>
        <Btn onClick={() => resize(-1, 0)} label="Remove a row"><Minus size={12} aria-hidden="true" /></Btn>
      </div>

      <MatrixGrid grid={grid} onCell={setCell} accent={[cols - 1]} ariaLabel="augmented entry" />

      <button type="button" onClick={check} className="mt-4 rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
        Is b in the span?
      </button>

      {out && (
        <div className="mt-4 space-y-3" aria-live="polite">
          <div className="rounded-lg border border-line/60 bg-ink/50 p-4">
            <p className="mb-1 text-xs text-cyan">Reduced row echelon form of [v₁ … vₚ | b]</p>
            <MathTex tex={toTexAt(out.result, cols - 1)} className="text-silver" />
          </div>
          {out.verdict === "none" ? (
            <p className="text-sm font-medium text-crimson-bright">A row reads 0 = nonzero — the system is inconsistent, so b is <strong>not</strong> in the span.</p>
          ) : out.weights ? (
            <p className="text-sm font-medium text-jade-bright">
              b <strong>is</strong> in the span. Weights: {out.weights.map((w, i) => `x${i + 1} = ${fmt(w)}`).join(",  ")}.
            </p>
          ) : (
            <p className="text-sm font-medium text-gold">b <strong>is</strong> in the span — with a free variable, there are infinitely many weight combinations.</p>
          )}
        </div>
      )}
    </div>
  );
}
