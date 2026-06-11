import { useState } from "react";
import { FileText, Eye, EyeOff } from "lucide-react";
import MathTex from "./Math.jsx";
import { Rich } from "./blocks.jsx";
import { examByModule } from "../../data/bmla/exam-style.js";
import { bumpStudyActivity } from "../../lib/bmla/progress.js";

/** Original exam-style question for a module, in real exam format (marks +
 *  parts), with a deliberate "attempt first" solution reveal. */
export default function ExamStyle({ moduleSlug }) {
  const q = examByModule[moduleSlug];
  const [open, setOpen] = useState(false);
  if (!q) return null;

  return (
    <section className="rounded-xl2 border border-violet/40 bg-violet/10 p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-violet-bright">
          <FileText size={14} aria-hidden="true" /> Exam-style question
        </p>
        <span className="rounded-full border border-violet/40 px-2.5 py-0.5 font-mono text-[10px] text-violet-bright">
          {q.marks} marks
        </span>
      </div>
      <p className="text-sm leading-relaxed text-silver">{q.prompt}</p>
      <p className="mt-2 text-xs text-muted">
        Original question, exam format. Attempt it on paper first — that's where the marks are made.
      </p>

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) bumpStudyActivity();
        }}
        aria-expanded={open}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet/50 px-5 py-2 text-sm text-violet-bright transition-colors hover:bg-violet/15"
      >
        {open ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
        {open ? "Hide solution" : "Reveal full solution"}
      </button>

      {open && (
        <ol className="mt-4 space-y-2 border-l border-violet/40 pl-4">
          {q.solution.map((s, i) => (
            <li key={i} className="text-sm text-muted">
              {s.text && <Rich text={s.text} />}
              {s.tex && <MathTex tex={s.tex} />}
            </li>
          ))}
          {q.answerTex && (
            <li className="list-none rounded-lg border border-jade/40 bg-jade/10 p-3">
              <MathTex tex={q.answerTex} />
            </li>
          )}
        </ol>
      )}
    </section>
  );
}
