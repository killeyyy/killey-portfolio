import { useMemo, useState } from "react";
import { RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import { questFlashcards } from "../../../data/bmla/quest-import.js";
import { gradeCard, pickSession } from "../../../lib/bmla/leitner.js";
import { get, set } from "../../../lib/bmla/storage.js";
import { bumpStudyActivity } from "../../../lib/bmla/progress.js";

/** Leitner spaced-repetition flashcards from KILLEYYY's own deck. */
export default function Flashcards({ moduleSlug, limit = 10 }) {
  const storeKey = `leitner:${moduleSlug}`;
  const [nonce, setNonce] = useState(0);
  const session = useMemo(() => {
    const deck = questFlashcards.filter((c) => c.moduleSlug === moduleSlug);
    return pickSession(deck, get(storeKey, {}), limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug, limit, nonce]);

  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  if (!session.length) return null;
  const finished = i >= session.length;

  function grade(correct) {
    const card = session[i];
    set(storeKey, gradeCard(get(storeKey, {}), card.id, correct));
    bumpStudyActivity();
    setDoneCount((d) => d + 1);
    setFlipped(false);
    setI(i + 1);
  }

  if (finished) {
    return (
      <div className="rounded-xl2 border border-line/70 bg-surface/50 p-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Deck done</p>
        <p className="mt-2 font-serif text-fluid-lg font-semibold text-silver">{doneCount} cards reviewed</p>
        <p className="mt-1 text-sm text-muted">Cards you missed come back sooner — that's the spaced-repetition doing its job.</p>
        <button
          type="button"
          onClick={() => { setNonce((n) => n + 1); setI(0); setDoneCount(0); }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-line/70 px-5 py-2.5 text-sm text-silver hover:border-gold/50 hover:text-gold"
        >
          <RotateCcw size={14} aria-hidden="true" /> Review again
        </button>
      </div>
    );
  }

  const card = session[i];
  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Flashcards · spaced repetition</p>
        <span className="font-mono text-xs text-muted">{i + 1}/{session.length}</span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show question" : "Reveal answer"}
        className="glow-card flex min-h-[9rem] w-full items-center justify-center rounded-[18px] border border-line/70 bg-ink/60 p-6 text-center transition-colors motion-safe:duration-300 hover:border-gold/40"
      >
        <span className={`text-sm leading-relaxed ${flipped ? "text-jade-bright" : "text-silver"}`}>
          {flipped ? card.back : card.front}
        </span>
      </button>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted">
        {flipped ? "How did you do?" : "Tap / press Enter to flip"}
      </p>

      {flipped && (
        <div className="mt-3 flex justify-center gap-3">
          <button type="button" onClick={() => grade(false)} className="inline-flex items-center gap-2 rounded-full border border-crimson/50 px-5 py-2 text-sm text-crimson-bright hover:bg-crimson/10">
            <ThumbsDown size={14} aria-hidden="true" /> Again
          </button>
          <button type="button" onClick={() => grade(true)} className="inline-flex items-center gap-2 rounded-full border border-jade/50 px-5 py-2 text-sm text-jade-bright hover:bg-jade/10">
            <ThumbsUp size={14} aria-hidden="true" /> Got it
          </button>
        </div>
      )}
    </div>
  );
}
