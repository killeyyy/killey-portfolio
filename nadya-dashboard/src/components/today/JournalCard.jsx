import { useEffect, useRef, useState } from "react";
import { Tile } from "../ui/Tile.jsx";
import { Chip } from "../ui/Chip.jsx";
import { TextInput, TextArea } from "../ui/Field.jsx";
import { cn } from "../../lib/cn.js";
import { useStore } from "../../store/StoreProvider.jsx";
import { isSmallHours, todayKey, yesterdayKey } from "../../lib/dates.js";

const EMPTY = { grateful: ["", "", ""], highlight: "", mood: null };

export const MOODS = [
  { value: 1, emoji: "😞", label: "Rough" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

/** Daily journal: mood + 3 gratitudes + one-line highlight. Autosaves. */
export function JournalCard() {
  const { journal, saveJournalEntry } = useStore();
  const [asYesterday, setAsYesterday] = useState(false);
  const dateKey = asYesterday ? yesterdayKey() : todayKey();
  const [draft, setDraft] = useState(() => ({ ...EMPTY, ...journal[dateKey] }));
  const [savedFlash, setSavedFlash] = useState(false);
  const flashTimer = useRef(null);

  // Reload the draft when the target day changes (midnight toggle).
  useEffect(() => {
    setDraft({ ...EMPTY, ...journal[dateKey] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const flash = () => {
    setSavedFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setSavedFlash(false), 1500);
  };

  const persist = (next) => {
    saveJournalEntry(dateKey, {
      grateful: next.grateful,
      highlight: next.highlight,
      mood: next.mood ?? null,
    });
    flash();
  };

  const save = () => {
    const isEmpty =
      draft.grateful.every((g) => !g.trim()) && !draft.highlight.trim() && !draft.mood;
    const existing = journal[dateKey];
    if (isEmpty && !existing) return;
    const changed =
      !existing ||
      existing.highlight !== draft.highlight ||
      (existing.mood ?? null) !== (draft.mood ?? null) ||
      existing.grateful.join("\n") !== draft.grateful.join("\n");
    if (!changed) return;
    persist(draft);
  };

  const setMood = (value) => {
    const next = { ...draft, mood: draft.mood === value ? null : value };
    setDraft(next);
    persist(next);
  };

  const setGrateful = (i, v) =>
    setDraft((d) => ({ ...d, grateful: d.grateful.map((g, j) => (j === i ? v : g)) }));

  return (
    <Tile
      title="Journal"
      action={savedFlash ? <span className="text-xs font-medium text-mint">Saved ✓</span> : null}
    >
      <div className="space-y-4" onBlur={save}>
        {isSmallHours() && (
          <Chip
            selected={asYesterday}
            onClick={() => setAsYesterday((v) => !v)}
            className="w-full justify-center"
          >
            It's past midnight — write about yesterday
          </Chip>
        )}

        <div>
          <p className="mb-2 font-serif text-sm text-muted">How was the day?</p>
          <div className="flex justify-between gap-1 sm:justify-start sm:gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                aria-label={m.label}
                aria-pressed={draft.mood === m.value}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl border text-xl transition duration-150 ease-out active:scale-90",
                  draft.mood === m.value
                    ? "scale-110 border-rose bg-rose/15"
                    : "border-line bg-surface2 opacity-70 grayscale-[0.4]",
                )}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-serif text-sm text-muted">
            Three things I'm grateful for…
          </p>
          <div className="space-y-2">
            {draft.grateful.map((g, i) => (
              <TextInput
                key={i}
                value={g}
                onChange={(e) => setGrateful(i, e.target.value)}
                placeholder={`${i + 1}.`}
                maxLength={140}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-serif text-sm text-muted">
            Highlight of the day, in one sentence…
          </p>
          <TextArea
            value={draft.highlight}
            onChange={(e) => setDraft((d) => ({ ...d, highlight: e.target.value }))}
            placeholder="The best part was…"
            maxLength={280}
          />
        </div>
      </div>
    </Tile>
  );
}
