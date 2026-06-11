import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import MathTex from "../Math.jsx";
import { rref, toTex, classify } from "../../../lib/bmla/linalg.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";

const DEFAULT = [
  [1, 2, -1, 3],
  [2, 3, 1, 5],
  [-1, 1, 2, 0],
];

const VERDICT = {
  unique: ["Unique solution", "text-jade-bright"],
  none: ["No solution (inconsistent row)", "text-crimson-bright"],
  infinite: ["Infinitely many solutions (free variable)", "text-gold"],
};

/** Step-by-step Gaussian elimination solver for an augmented system. */
export default function RrefSolver() {
  const reduced = useReducedMotion();
  const [grid, setGrid] = useState(DEFAULT.map((r) => r.map(String)));
  const [run, setRun] = useState(null); // {steps, result, verdict}
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  function setCell(r, c, v) {
    setGrid((g) => g.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? v : cell))));
    setRun(null);
    setPlaying(false);
  }

  function solve() {
    const nums = grid.map((row) => row.map((v) => Number(v) || 0));
    const out = rref(nums);
    setRun({ ...out, verdict: classify(out.result) });
    setIdx(0);
    bumpStudyActivity();
    if (!reduced) setPlaying(true);
  }

  useEffect(() => {
    if (!playing || !run) return;
    timer.current = setInterval(() => {
      setIdx((i) => {
        if (i >= run.steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1100);
    return () => clearInterval(timer.current);
  }, [playing, run]);

  const step = run?.steps[idx];
  const [verdictLabel, verdictCls] = run ? VERDICT[run.verdict] : [];

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Interactive · Row-reduction solver</p>
      <p className="mb-4 text-sm text-muted">Edit the augmented matrix (last column = constants), then step through the exact row operations.</p>

      <div className="overflow-x-auto">
        <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(3.2rem, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((v, c) => (
              <input
                key={`${r}-${c}`}
                value={v}
                inputMode="numeric"
                onChange={(e) => setCell(r, c, e.target.value)}
                aria-label={`Row ${r + 1}, ${c === row.length - 1 ? "constant" : `coefficient ${c + 1}`}`}
                className={`w-full rounded-md border bg-ink px-2 py-1.5 text-center font-mono text-sm text-silver focus:border-crimson/60 ${
                  c === row.length - 1 ? "border-gold/40" : "border-line/70"
                }`}
              />
            )),
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={solve} className="rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
          Row-reduce
        </button>
        {run && (
          <>
            <button type="button" onClick={() => { setPlaying(false); setIdx((i) => Math.max(0, i - 1)); }} aria-label="Previous step" className="rounded-full border border-line/70 p-2 text-muted hover:text-silver">
              <StepBack size={15} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Auto-play steps"} className="rounded-full border border-line/70 p-2 text-muted hover:text-silver" disabled={reduced}>
              {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => { setPlaying(false); setIdx((i) => Math.min(run.steps.length - 1, i + 1)); }} aria-label="Next step" className="rounded-full border border-line/70 p-2 text-muted hover:text-silver">
              <StepForward size={15} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => { setRun(null); setPlaying(false); }} aria-label="Reset" className="rounded-full border border-line/70 p-2 text-muted hover:text-silver">
              <RotateCcw size={15} aria-hidden="true" />
            </button>
            <span className="font-mono text-xs text-muted">step {idx + 1}/{run.steps.length}</span>
          </>
        )}
      </div>

      {step && (
        <div className="mt-4 rounded-lg border border-line/60 bg-ink/50 p-4" aria-live="polite">
          <p className="mb-1 font-mono text-xs text-cyan">{step.op}</p>
          <MathTex tex={toTex(step.matrix)} />
          {idx === run.steps.length - 1 && (
            <p className={`mt-2 text-sm font-medium ${verdictCls}`}>{verdictLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
