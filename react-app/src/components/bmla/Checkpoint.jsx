import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import MathTex from "./Math.jsx";
import { Rich } from "./blocks.jsx";
import { cn } from "../../lib/cn.js";
import { bumpStudyActivity } from "../../lib/bmla/progress.js";

/** A single inline "check your understanding" question with instant, colour-coded feedback. */
export default function Checkpoint({ block }) {
  const { q, tex, options = [], correctIndex, explanation } = block;
  const [picked, setPicked] = useState(null);
  const answered = picked !== null;

  function pick(i) {
    if (answered) return;
    setPicked(i);
    bumpStudyActivity();
  }

  return (
    <section className="rounded-xl2 border border-cyan/30 bg-cyan/5 p-5">
      <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
        <HelpCircle size={14} aria-hidden="true" /> Check your understanding
      </p>
      <p className="text-sm leading-relaxed text-silver"><Rich text={q} /></p>
      {tex && <div className="mt-1"><MathTex tex={tex} className="text-silver" /></div>}

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
