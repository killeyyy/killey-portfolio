import { createContext, useCallback, useContext, useState } from "react";
import { PartyPopper, ListChecks } from "lucide-react";

// Tracks how many in-lesson checkpoints exist and how many were answered
// correctly, so the lesson can show a live tally + a celebratory complete state.
const Ctx = createContext(null);

export function LessonProgressProvider({ children }) {
  const [ids, setIds] = useState(() => new Set());
  const [correct, setCorrect] = useState(() => new Set());

  const register = useCallback((id) => {
    setIds((s) => (s.has(id) ? s : new Set(s).add(id)));
  }, []);
  const report = useCallback((id, ok) => {
    setCorrect((s) => {
      const n = new Set(s);
      if (ok) n.add(id);
      else n.delete(id);
      return n;
    });
  }, []);

  return (
    <Ctx.Provider value={{ total: ids.size, correct: correct.size, register, report }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLessonProgress = () => useContext(Ctx);

/** Live tally of the lesson's checkpoints, with a celebratory all-correct state. */
export function CheckpointTally() {
  const p = useLessonProgress();
  if (!p || p.total === 0) return null;
  const all = p.correct === p.total;
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-4 ${all ? "border-jade/40 bg-jade/10" : "border-line/70 bg-surface/40"}`} aria-live="polite">
      {all ? <PartyPopper size={18} className="shrink-0 text-jade-bright" aria-hidden="true" /> : <ListChecks size={18} className="shrink-0 text-gold" aria-hidden="true" />}
      <div className="text-sm">
        <p className={`font-medium ${all ? "text-jade-bright" : "text-silver"}`}>
          {all ? "All checks passed — you've got this section." : `Checkpoints: ${p.correct} of ${p.total} correct`}
        </p>
        {!all && <p className="text-xs text-muted">Answer the “check your understanding” questions above as you read.</p>}
      </div>
    </div>
  );
}
