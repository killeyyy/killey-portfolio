import { useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { Sheet } from "../components/ui/Sheet.jsx";
import { TextInput, TextArea } from "../components/ui/Field.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { monthKey, monthKeyOf } from "../lib/dates.js";
import { formatDayLabel, formatMonthLabel } from "../lib/format.js";

export default function Journal() {
  const { journal, saveJournalEntry, deleteJournalEntry } = useStore();
  const [editing, setEditing] = useState(null); // dateKey | null

  const groups = useMemo(() => {
    const keys = Object.keys(journal).sort().reverse();
    const byMonth = new Map();
    for (const k of keys) {
      const m = monthKeyOf(k);
      if (!byMonth.has(m)) byMonth.set(m, []);
      byMonth.get(m).push(k);
    }
    return [...byMonth.entries()];
  }, [journal]);

  const thisMonthCount = groups.find(([m]) => m === monthKey())?.[1].length || 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Journal"
        sub={
          thisMonthCount
            ? `${thisMonthCount} day${thisMonthCount === 1 ? "" : "s"} journaled this month`
            : "Little notes to your future self"
        }
      />

      {groups.length === 0 && (
        <Tile>
          <p className="text-sm text-muted">
            No entries yet — tonight's gratitudes go on the Today screen, and they'll collect here.
          </p>
        </Tile>
      )}

      {groups.map(([m, keys]) => (
        <section key={m}>
          <h2 className="mb-2 px-1 font-serif text-sm font-semibold text-muted">
            {formatMonthLabel(m)}
          </h2>
          <div className="space-y-3">
            {keys.map((k) => {
              const e = journal[k];
              const gratefuls = e.grateful.filter((g) => g.trim());
              return (
                <Tile key={k} className="cursor-pointer" >
                  <button type="button" onClick={() => setEditing(k)} className="w-full text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {formatDayLabel(k)}
                    </p>
                    {e.highlight && (
                      <p className="mt-1.5 font-serif text-sm italic text-cream">
                        “{e.highlight}”
                      </p>
                    )}
                    {gratefuls.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {gratefuls.map((g, i) => (
                          <li key={i} className="flex gap-1.5 text-xs text-muted">
                            <span className="text-rose-bright">♥</span>
                            <span className="min-w-0 flex-1">{g}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                </Tile>
              );
            })}
          </div>
        </section>
      ))}

      {editing && (
        <EntrySheet
          dateKey={editing}
          entry={journal[editing]}
          onClose={() => setEditing(null)}
          onSave={(entry) => {
            saveJournalEntry(editing, entry);
            setEditing(null);
          }}
          onDelete={() => {
            deleteJournalEntry(editing);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EntrySheet({ dateKey, entry, onClose, onSave, onDelete }) {
  const [grateful, setGrateful] = useState(entry.grateful);
  const [highlight, setHighlight] = useState(entry.highlight);
  return (
    <Sheet open onClose={onClose} title={formatDayLabel(dateKey)}>
      <div className="space-y-3">
        <p className="font-serif text-sm italic text-muted">Three things I was grateful for…</p>
        {grateful.map((g, i) => (
          <TextInput
            key={i}
            value={g}
            onChange={(e) =>
              setGrateful((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))
            }
            placeholder={`${i + 1}.`}
            maxLength={140}
          />
        ))}
        <p className="font-serif text-sm italic text-muted">Highlight of the day…</p>
        <TextArea value={highlight} onChange={(e) => setHighlight(e.target.value)} maxLength={280} />
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-rose-bright active:scale-95"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => onSave({ grateful, highlight })}
            className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </Sheet>
  );
}
