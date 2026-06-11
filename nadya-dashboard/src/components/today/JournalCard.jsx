import { useEffect, useRef, useState } from "react";
import { Tile } from "../ui/Tile.jsx";
import { Chip } from "../ui/Chip.jsx";
import { TextInput, TextArea } from "../ui/Field.jsx";
import { useStore } from "../../store/StoreProvider.jsx";
import { isSmallHours, todayKey, yesterdayKey } from "../../lib/dates.js";

const EMPTY = { grateful: ["", "", ""], highlight: "" };

/** Daily 2-prompt journal: 3 gratitudes + one-line highlight. Autosaves on blur. */
export function JournalCard() {
  const { journal, saveJournalEntry } = useStore();
  const [asYesterday, setAsYesterday] = useState(false);
  const dateKey = asYesterday ? yesterdayKey() : todayKey();
  const [draft, setDraft] = useState(() => journal[dateKey] || EMPTY);
  const [savedFlash, setSavedFlash] = useState(false);
  const flashTimer = useRef(null);

  // Reload the draft when the target day changes (midnight toggle).
  useEffect(() => {
    setDraft(journal[dateKey] || EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const save = () => {
    const isEmpty =
      draft.grateful.every((g) => !g.trim()) && !draft.highlight.trim();
    const existing = journal[dateKey];
    if (isEmpty && !existing) return;
    const changed =
      !existing ||
      existing.highlight !== draft.highlight ||
      existing.grateful.join("\n") !== draft.grateful.join("\n");
    if (!changed) return;
    saveJournalEntry(dateKey, { grateful: draft.grateful, highlight: draft.highlight });
    setSavedFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setSavedFlash(false), 1500);
  };

  const setGrateful = (i, v) =>
    setDraft((d) => ({ ...d, grateful: d.grateful.map((g, j) => (j === i ? v : g)) }));

  return (
    <Tile
      title="Journal"
      action={
        savedFlash ? <span className="text-xs font-medium text-mint">Saved ✓</span> : null
      }
    >
      <div className="space-y-3" onBlur={save}>
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
          <p className="mb-2 font-serif text-sm italic text-muted">
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
          <p className="mb-2 font-serif text-sm italic text-muted">
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
