import { useMemo, useState } from "react";
import { Tile } from "../ui/Tile.jsx";
import { Flourish } from "../ui/Flourish.jsx";
import { Sheet } from "../ui/Sheet.jsx";
import { Chip } from "../ui/Chip.jsx";
import { Field, TextInput, NumberStepper } from "../ui/Field.jsx";
import { useStore } from "../../store/StoreProvider.jsx";
import { COLOR_META } from "../../data/defaults.js";
import { formatMinutes, formatTime } from "../../lib/format.js";
import { todayKey } from "../../lib/dates.js";
import { entriesForDay } from "../../lib/insights.js";

/** Today's entries (newest first); tap a row to edit/backdate/delete. */
export function ActivityList() {
  const { categories, months, updateActivity, deleteActivity } = useStore();
  const today = todayKey();
  const entries = useMemo(
    () => [...entriesForDay(months, today)].sort((a, b) => b.at - a.at),
    [months, today],
  );
  const [editing, setEditing] = useState(null); // { entry } | null
  const catOf = (id) => categories.find((c) => c.id === id);

  return (
    <Tile title="Today's activities">
      {entries.length === 0 ? (
        <div className="py-3 text-center">
          <Flourish />
          <p className="text-sm text-muted">
            A fresh page — tap <span className="font-semibold text-rose-bright">+</span> when you
            finish something today.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line/60">
          {entries.map((e) => {
            const cat = catOf(e.categoryId);
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setEditing({ entry: e })}
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${COLOR_META[cat?.color]?.dot || "bg-rose"}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-cream">{cat?.label || "—"}</span>
                    {e.note && <span className="block truncate text-xs text-muted">{e.note}</span>}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold tabular-nums text-cream">
                      {formatMinutes(e.minutes)}
                    </span>
                    <span className="block text-[11px] tabular-nums text-muted">{formatTime(e.at)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <EditSheet
          entry={editing.entry}
          dateKey={today}
          categories={categories.filter((c) => !c.archived || c.id === editing.entry.categoryId)}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateActivity(today, editing.entry.id, patch);
            setEditing(null);
          }}
          onDelete={() => {
            deleteActivity(today, editing.entry.id);
            setEditing(null);
          }}
        />
      )}
    </Tile>
  );
}

function EditSheet({ entry, dateKey, categories, onClose, onSave, onDelete }) {
  const [categoryId, setCategoryId] = useState(entry.categoryId);
  const [minutes, setMinutes] = useState(entry.minutes);
  const [note, setNote] = useState(entry.note || "");
  const [date, setDate] = useState(dateKey);

  return (
    <Sheet open onClose={onClose} title="Edit activity">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c.id} selected={categoryId === c.id} onClick={() => setCategoryId(c.id)}>
              <span
                className={`h-2 w-2 rounded-full ${COLOR_META[c.color]?.dot || "bg-rose"}`}
                aria-hidden="true"
              />
              {c.label}
            </Chip>
          ))}
        </div>
        <Field label="Duration">
          <NumberStepper value={minutes} onChange={setMinutes} format={formatMinutes} />
        </Field>
        <Field label="Note">
          <TextInput value={note} onChange={(e) => setNote(e.target.value)} maxLength={120} />
        </Field>
        <Field label="Date" hint="Move it if you logged on the wrong day.">
          <TextInput type="date" value={date} max={todayKey()} onChange={(e) => setDate(e.target.value)} />
        </Field>
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
            onClick={() =>
              onSave({ categoryId, minutes, note: note.trim(), dateKey: date || dateKey })
            }
            className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </Sheet>
  );
}
