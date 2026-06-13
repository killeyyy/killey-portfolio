import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import MathTex from "../Math.jsx";
import MatrixGrid from "./MatrixGrid.jsx";
import { inverse, determinant, toTexAt, fmt } from "../../../lib/bmla/linalg.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";

const SEED = {
  2: [["2", "1"], ["3", "4"]],
  3: [["1", "0", "1"], ["2", "1", "1"], ["1", "1", "2"]],
};

/** Step-by-step inverse via Gauss–Jordan on the augmented [A | I]. */
export default function InverseSolver() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(3);
  const [grid, setGrid] = useState(SEED[3]);
  const [run, setRun] = useState(null); // { steps, inverse, singular, det }
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const setCell = (r, c, v) => {
    setGrid((g) => g.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? v : cell))));
    setRun(null);
    setPlaying(false);
  };
  const resize = (size) => {
    setN(size);
    setGrid(SEED[size]);
    setRun(null);
    setPlaying(false);
  };
  const solve = () => {
    const nums = grid.map((row) => row.map((v) => Number(v) || 0));
    const res = inverse(nums);
    setRun({ ...res, det: determinant(nums).value });
    setIdx(0);
    bumpStudyActivity();
    if (!reduced && !res.singular) setPlaying(true);
  };

  useEffect(() => {
    if (!playing || !run) return;
    timer.current = setInterval(() => {
      setIdx((i) => {
        if (i >= run.steps.length - 1) { setPlaying(false); return i; }
        return i + 1;
      });
    }, 1100);
    return () => clearInterval(timer.current);
  }, [playing, run]);

  const step = run?.steps[idx];

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Interactive · Matrix inverse [A | I]</p>
      <p className="mb-4 text-sm text-muted">Augment with the identity and row-reduce until the left block is I — the right block becomes A⁻¹.</p>

      <div className="mb-3 inline-flex gap-1 rounded-full border border-line/70 p-1">
        {[2, 3].map((s) => (
          <button key={s} type="button" onClick={() => resize(s)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${n === s ? "bg-crimson text-silver" : "text-muted hover:text-silver"}`}>
            {s}×{s}
          </button>
        ))}
      </div>

      <MatrixGrid grid={grid} onCell={setCell} ariaLabel="matrix entry" />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={solve} className="rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
          Invert
        </button>
        {run && !run.singular && (
          <>
            <button type="button" onClick={() => { setPlaying(false); setIdx((i) => Math.max(0, i - 1)); }} aria-label="Previous step" className="rounded-full border border-line/70 p-2 text-muted hover:text-silver"><StepBack size={15} aria-hidden="true" /></button>
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Auto-play steps"} disabled={reduced} className="rounded-full border border-line/70 p-2 text-muted hover:text-silver">{playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}</button>
            <button type="button" onClick={() => { setPlaying(false); setIdx((i) => Math.min(run.steps.length - 1, i + 1)); }} aria-label="Next step" className="rounded-full border border-line/70 p-2 text-muted hover:text-silver"><StepForward size={15} aria-hidden="true" /></button>
            <button type="button" onClick={() => { setRun(null); setPlaying(false); }} aria-label="Reset" className="rounded-full border border-line/70 p-2 text-muted hover:text-silver"><RotateCcw size={15} aria-hidden="true" /></button>
            <span className="font-mono text-xs text-muted">step {idx + 1}/{run.steps.length}</span>
          </>
        )}
      </div>

      {run?.singular && (
        <p className="mt-4 rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson-bright" aria-live="polite">
          det = {fmt(run.det)} → the matrix is <strong>singular</strong>, so A⁻¹ does not exist.
        </p>
      )}

      {step && !run.singular && (
        <div className="mt-4 rounded-lg border border-line/60 bg-ink/50 p-4" aria-live="polite">
          <p className="mb-1 font-mono text-xs text-cyan">{step.op}</p>
          <MathTex tex={toTexAt(step.matrix, n)} className="text-silver" />
          {idx === run.steps.length - 1 && run.inverse && (
            <p className="mt-2 text-sm font-medium text-jade-bright">Left block is I — the right block is A⁻¹.</p>
          )}
        </div>
      )}
    </div>
  );
}
