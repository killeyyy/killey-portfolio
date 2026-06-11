import { useState } from "react";
import { Sheet } from "../ui/Sheet.jsx";
import { Chip } from "../ui/Chip.jsx";
import { Field, TextInput } from "../ui/Field.jsx";
import { COLOR_META, COLOR_NAMES } from "../../data/defaults.js";
import { uid } from "../../lib/uid.js";

/** Add/edit a habit; editing also offers archive (history is kept). */
export function HabitForm({ habit, onClose, onSave, onArchive }) {
  const [name, setName] = useState(habit?.name || "");
  const [emoji, setEmoji] = useState(habit?.emoji || "");
  const [color, setColor] = useState(habit?.color || "rose");

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      id: habit?.id || uid(),
      name: name.trim(),
      emoji: emoji.trim(),
      color,
      createdAt: habit?.createdAt || Date.now(),
      archivedAt: habit?.archivedAt || null,
    });
  };

  return (
    <Sheet open onClose={onClose} title={habit ? "Edit habit" : "New habit"}>
      <div className="space-y-4">
        <Field label="Name">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Read 10 pages"
            maxLength={60}
            autoFocus
          />
        </Field>
        <Field label="Emoji" hint="Optional — shows next to the name.">
          <TextInput
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="📖"
            maxLength={4}
            className="w-24"
          />
        </Field>
        <Field label="Color">
          <div className="flex flex-wrap gap-2">
            {COLOR_NAMES.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full ${COLOR_META[c].dot} ${
                  color === c ? "ring-2 ring-cream ring-offset-2 ring-offset-surface2" : ""
                }`}
              />
            ))}
          </div>
        </Field>
        <div className="flex gap-2 pt-1">
          {habit && onArchive && (
            <button
              type="button"
              onClick={onArchive}
              className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted active:scale-95"
            >
              Archive
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!name.trim()}
            className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </Sheet>
  );
}
