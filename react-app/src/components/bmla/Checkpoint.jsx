import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, Sparkles } from "lucide-react";
import MathTex from "./Math.jsx";
import { Rich } from "./blocks.jsx";
import { cn } from "../../lib/cn.js";
import { bumpStudyActivity } from "../../lib/bmla/progress.js";
import { useLessonProgress } from "./LessonProgress.jsx";

/** Inline "check your understanding" / "now you try" question with instant,
 *  colour-coded feedback, an optional hint, and tally registration. */
export default function Checkpoint({ block, cpId }) {
  const { q, tex, options = [], correctIndex, explanation, hint, label, variant } = block;
  const [picked, setPicked] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const answered = picked !== null;
  const progress = useLessonProgress();

  useEffect(() => {
    progress?.register(cpId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpId]);

  function pick(i) {
    if (answered) return;
    setPicked(i);
    progress?.report(cpId, i === correctIndex);
    bumpStudyActivity();
  }

  const tryit = variant === "tryit";
  const accent = tryit ? "border-violet/30 bg-violet/5" : "border-cyan/30 bg-cyan/5";
  const HeaderIcon = tryit ? Sparkles : HelpCircle;
  const headerCls = tryit ? "text-violet-bright" : "text-cyan";

  return (
    <section className={`rounded-xl2 border p-5 ${accent}`}>
      <p className={`mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] ${headerCls}`}>
        <HeaderIcon size={14} aria-hidden="true" /> {label || (tryit ? "Now you try" : "Check your understanding")}
      </p>
      <p className="text-sm leading-relaxed text-silver"><Rich text={q} /></p>
      {tex && <div className="mt-1"><MathTex tex={tex} className="text-silver" /></div>}

      {hint && !answered && (
        <div className="mt-2">
          {showHint ? (
            <p className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-silver/90">
              <Lightbulb size={12} className="mr-1 inline text-gold" aria-hidden="true" /> <Rich text={hint} />
            </p>
          ) : (
            <button type="button" onClick={() => setShowHint(true)} className="inline-flex items-center gap-1 text-xs text-gold hover:underline">
              <Lightbulb size={12} aria-hidden="true" /> Need a hint?
            </button>
          )}
        </div>
      )}

      <div className="mt-3 grid gap-2">
        {options.map((opt, i) => {
          const correct = answered && i === correctIndex;
          const wrong = answered && picked === i && i !== correctIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={answered}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                correct && "border-jade-bright/60 bg-jade/15 text-jade-bright",
                wrong && "border-crimson/60 bg-crimson/15 text-crimson-bright",
                !answered && "border-line/70 text-silver hover:border-cyan/50",
                answered && !correct && !wrong && "border-line/40 text-muted",
              )}
            >
              {correct && <CheckCircle2 size={15} className="shrink-0" aria-hidden="true" />}
              {wrong && <XCircle size={15} className="shrink-0" aria-hidden="true" />}
              <Rich text={opt} />
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-3 min-h-[1.5rem] text-sm">
        {answered && (
          <p className={picked === correctIndex ? "text-jade-bright" : "text-crimson-bright"}>
            {picked === correctIndex ? "Correct! " : "Not quite. "}
            {explanation && <span className="text-muted"><Rich text={explanation} /></span>}
          </p>
        )}
      </div>
    </section>
  );
}
