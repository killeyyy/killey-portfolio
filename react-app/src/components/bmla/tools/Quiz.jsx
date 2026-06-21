import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { questMcqs } from "../../../data/bmla/quest-import.js";
import { get, set } from "../../../lib/bmla/storage.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";
import { recordQuiz } from "../../../lib/bmla/stats.js";
import { cn } from "../../../lib/cn.js";

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** MCQ practice drawn from KILLEYYY's own question bank, shuffled per attempt.
 *  Pass `topic` to narrow to a single lecture/section bank (e.g. "lec1"). */
export default function Quiz({ moduleSlug, count = 5, topic }) {
  const [nonce, setNonce] = useState(0);
  const questions = useMemo(() => {
    const bank = questMcqs.filter(
      (q) => q.moduleSlug === moduleSlug && (!topic || q.topic === topic),
    );
    return shuffled(bank).slice(0, Math.min(count, bank.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug, count, topic, nonce]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions.length) return null;
  const q = questions[i];
  const answered = picked !== null;

  function pick(idx) {
    if (answered) return;
    setPicked(idx);
    if (idx === q.correctIndex) setScore((s) => s + 1);
    bumpStudyActivity();
  }

  function next() {
    if (i + 1 >= questions.length) {
      const key = `quiz:${moduleSlug}${topic ? `:${topic}` : ""}`;
      const prev = get(key, { best: 0, attempts: 0 });
      set(key, {
        best: Math.max(prev.best, Math.round(((score) / questions.length) * 100)),
        attempts: prev.attempts + 1,
      });
      recordQuiz(moduleSlug, topic, score, questions.length);
      setDone(true);
    } else {
      setI(i + 1);
      setPicked(null);
    }
  }

  function retry() {
    setNonce((n) => n + 1);
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-xl2 border border-line/70 bg-surface/50 p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Practice complete</p>
        <p className={cn("mt-2 font-serif text-fluid-2xl font-semibold", pct >= 70 ? "text-jade-bright" : "text-crimson-bright")}>
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-muted">{pct >= 70 ? "Solid — keep the streak going." : "Worth another pass — questions reshuffle every attempt."}</p>
        <button type="button" onClick={retry} className="mt-4 inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-silver hover:bg-crimson/90">
          <RotateCcw size={14} aria-hidden="true" /> New random set
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Practice · randomized</p>
        <span className="font-mono text-xs text-muted">{i + 1}/{questions.length}</span>
      </div>
      <p className="text-sm leading-relaxed text-silver">{q.q}</p>

      <div className="mt-4 grid gap-2">
        {q.options.map((opt, idx) => {
          const isCorrect = answered && idx === q.correctIndex;
          const isWrongPick = answered && picked === idx && idx !== q.correctIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => pick(idx)}
              disabled={answered}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                isCorrect && "border-jade-bright/60 bg-jade/15 text-jade-bright",
                isWrongPick && "border-crimson/60 bg-crimson/15 text-crimson-bright",
                !answered && "border-line/70 text-silver hover:border-gold/50",
                answered && !isCorrect && !isWrongPick && "border-line/40 text-muted",
              )}
            >
              {isCorrect && <CheckCircle2 size={15} className="shrink-0" aria-hidden="true" />}
              {isWrongPick && <XCircle size={15} className="shrink-0" aria-hidden="true" />}
              {opt}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-3 min-h-[2.5rem] text-sm">
        {answered && (
          <p className={picked === q.correctIndex ? "text-jade-bright" : "text-crimson-bright"}>
            {picked === q.correctIndex ? "Correct. " : "Not quite. "}
            <span className="text-muted">{q.explanation}</span>
          </p>
        )}
      </div>

      {answered && (
        <button type="button" onClick={next} className="mt-1 rounded-full bg-crimson px-5 py-2 text-sm font-medium text-silver hover:bg-crimson/90">
          {i + 1 >= questions.length ? "Finish" : "Next question"}
        </button>
      )}
    </div>
  );
}
