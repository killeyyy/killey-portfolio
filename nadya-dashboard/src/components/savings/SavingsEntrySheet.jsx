import { useState } from "react";
import { Sheet } from "../ui/Sheet.jsx";
import { Field, TextInput } from "../ui/Field.jsx";
import { uid } from "../../lib/uid.js";
import { monthKey, todayKey } from "../../lib/dates.js";

/** Add/edit one savings entry within a month. */
export function SavingsEntrySheet({ mKey, entry, onClose, onSave, onDelete }) {
  const isCurrentMonth = mKey === monthKey();
  const [amount, setAmount] = useState(entry?.amount ?? "");
  const [date, setDate] = useState(entry?.date || (isCurrentMonth ? todayKey() : `${mKey}-01`));
  const [note, setNote] = useState(entry?.note || "");

  const submit = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    onSave({ id: entry?.id || uid(), date, amount: Math.round(value), note: note.trim() });
  };

  return (
    <Sheet open onClose={onClose} title={entry ? "Edit saving" : "Add saving"}>
      <div className="space-y-4">
        <Field label="Amount">
          <TextInput
            type="number"
            inputMode="numeric"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="250000"
            autoFocus
          />
        </Field>
        <Field label="Date">
          <TextInput
            type="date"
            value={date}
            min={`${mKey}-01`}
            max={todayKey()}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Note">
          <TextInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
            maxLength={80}
          />
        </Field>
        <div className="flex gap-2 pt-1">
          {entry && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-rose-bright active:scale-95"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!Number(amount)}
            className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </Sheet>
  );
}
