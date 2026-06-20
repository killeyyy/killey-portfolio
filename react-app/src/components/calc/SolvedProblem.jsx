import { useState } from "react";
import { ChevronRight, Eye, CheckCircle2, Circle, ListChecks } from "lucide-react";
import Math from "../bmla/Math.jsx";
import { Rich } from "../bmla/blocks.jsx";
import { isReviewed, markReviewed } from "../../lib/calc/progress.js";

/** One fully worked textbook problem: the question, a step-by-step solution you
 *  reveal one move at a time, and the boxed final answer. Reviewed state persists. */
export default function SolvedProblem({ problem, problemId }) {
  const steps = problem.steps || [];
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const [reviewed, setReviewed] = useState(() => isReviewed(problemId));
  const allShown = shown >= steps.length;

  function toggleReviewed() {
    const next = !reviewed;
    setReviewed(next);
    markReviewed(problemId, next);
  }

  return (
    <section id={`p-${problem.num}`} className="scroll-mt-24 rounded-xl2 border border-line/70 bg-surface/50 p-5">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-crimson/15 px-2 font-mono text-xs font-semibold text-crimson-bright">
            {problem.num}
          </span>
          {problem.topic && (
            <span className="rounded-full border border-gold/30 bg-gold/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
              {problem.topic}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={toggleReviewed}
          aria-pressed={reviewed}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            reviewed ? "border-jade/50 text-jade-bright" : "border-line/70 text-muted hover:text-silver"
          }`}
        >
          {reviewed ? <CheckCircle2 size={13} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
          {reviewed ? "Reviewed" : "Mark reviewed"}
        </button>
      </div>

      {/* question */}
      <div className="mt-3">
        {problem.prompt && <p className="text-sm leading-relaxed text-silver"><Rich text={problem.prompt} /></p>}
        {problem.promptTex && <div className="mt-2"><Math tex={problem.promptTex} className="text-silver" /></div>}
      </div>

      {/* solution */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-1.5 text-sm font-medium text-silver transition-colors hover:bg-crimson/90"
        >
          <ListChecks size={14} aria-hidden="true" /> Show solution
        </button>
      ) : (
        <div className="mt-4">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-crimson-bright">Solution</p>

          {steps.length > 0 && (
            <ol className="space-y-2 border-l border-crimson/30 pl-4">
              {steps.slice(0, shown).map((s, i) => (
                <li key={i} className="fade-step text-sm text-muted">
                  {s.text && <Rich text={s.text} />}
                  {s.tex && <Math tex={s.tex} />}
                </li>
              ))}
            </ol>
          )}

          {!allShown && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setShown(shown + 1)} className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-1.5 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
                <ChevronRight size={14} aria-hidden="true" /> Show step {shown + 1}
              </button>
              {steps.length > 1 && (
                <button type="button" onClick={() => setShown(steps.length)} className="rounded-full border border-line/70 px-4 py-1.5 text-sm text-muted transition-colors hover:text-silver">
                  Show all steps
                </button>
              )}
            </div>
          )}

          {allShown && (problem.answerTex || problem.answer) && (
            <div className="mt-4 rounded-lg border border-jade/40 bg-jade/10 p-3">
              <p className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-jade-bright">
                <Eye size={12} aria-hidden="true" /> Answer
              </p>
              {problem.answerTex && <Math tex={problem.answerTex} className="text-silver" />}
              {problem.answer && <p className="text-sm text-silver"><Rich text={problem.answer} /></p>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
