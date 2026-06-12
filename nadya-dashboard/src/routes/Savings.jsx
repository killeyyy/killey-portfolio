import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { Sheet } from "../components/ui/Sheet.jsx";
import { Field, TextInput } from "../components/ui/Field.jsx";
import { Ring } from "../components/charts/Ring.jsx";
import { GoalBars } from "../components/charts/GoalBars.jsx";
import { SavingsEntrySheet } from "../components/savings/SavingsEntrySheet.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { addMonths, monthKey } from "../lib/dates.js";
import { formatDayLabel, formatMoney, formatMonthLabel, formatMonthShort } from "../lib/format.js";
import { savingsForMonth } from "../lib/insights.js";
import { confettiBurst } from "../lib/confetti.js";
import { useToast } from "../components/ui/Toast.jsx";

export default function Savings() {
  const { settings, savings, setMonthGoal, upsertSavingsEntry, deleteSavingsEntry } = useStore();
  const toast = useToast();
  const [anchor, setAnchor] = useState(() => monthKey());
  const [goalOpen, setGoalOpen] = useState(false);
  const [entrySheet, setEntrySheet] = useState(null); // { entry } | { entry: null }

  const { goal, saved, entries } = useMemo(() => savingsForMonth(savings, anchor), [savings, anchor]);
  const money = (v) => formatMoney(v, settings.currency, settings.locale);
  const pct = goal ? Math.min(100, (saved / goal) * 100) : 0;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  const history = useMemo(
    () =>
      [-5, -4, -3, -2, -1, 0].map((n) => {
        const mk = addMonths(anchor, n);
        const m = savingsForMonth(savings, mk);
        return { label: formatMonthShort(mk), goal: m.goal, actual: m.saved };
      }),
    [savings, anchor],
  );
  const hasHistory = history.some((m) => m.goal > 0 || m.actual > 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Savings" sub={formatMonthLabel(anchor)} />

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => setAnchor((a) => addMonths(a, -1))}
          aria-label="Previous month"
          className="rounded-xl border border-line bg-surface2 p-2 text-muted active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => setAnchor((a) => addMonths(a, 1))}
          disabled={anchor >= monthKey()}
          aria-label="Next month"
          className="rounded-xl border border-line bg-surface2 p-2 text-muted active:scale-95 disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <Tile>
        <div className="flex items-center gap-4">
          <Ring value={pct} size={110} className={pct >= 100 ? "text-mint" : "text-sand"} />
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold tabular-nums text-cream">{money(saved)}</p>
            {goal > 0 ? (
              <p className="mt-0.5 text-sm tabular-nums text-muted">
                of {money(goal)}
                {saved < goal ? ` · ${money(goal - saved)} to go` : " · goal met 🎉"}
              </p>
            ) : (
              <p className="mt-0.5 text-sm text-muted">No goal for this month yet.</p>
            )}
            <button
              type="button"
              onClick={() => setGoalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-cream active:scale-95"
            >
              <Pencil size={12} aria-hidden="true" />
              {goal > 0 ? "Edit goal" : "Set goal"}
            </button>
          </div>
        </div>
      </Tile>

      <Tile
        title="Entries"
        action={
          <button
            type="button"
            onClick={() => setEntrySheet({ entry: null })}
            className="inline-flex items-center gap-1 rounded-xl bg-rose px-3 py-1.5 text-xs font-semibold text-ink active:scale-95"
          >
            <Plus size={14} aria-hidden="true" /> Add
          </button>
        }
      >
        {sorted.length === 0 ? (
          <p className="text-sm text-muted">Nothing saved this month yet.</p>
        ) : (
          <ul className="divide-y divide-line/60">
            {sorted.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setEntrySheet({ entry: e })}
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold tabular-nums text-cream">
                      {money(e.amount)}
                    </span>
                    {e.note && <span className="block truncate text-xs text-muted">{e.note}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-muted">{formatDayLabel(e.date)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Tile>

      {hasHistory && (
        <Tile title="Last 6 months">
          <GoalBars months={history} />
          <p className="mt-1 text-xs text-muted">
            Outline = goal, fill = saved (green when met).
          </p>
        </Tile>
      )}

      {goalOpen && (
        <GoalSheet
          initial={goal}
          money={money}
          onClose={() => setGoalOpen(false)}
          onSave={(value) => {
            setMonthGoal(anchor, value);
            setGoalOpen(false);
          }}
        />
      )}

      {entrySheet && (
        <SavingsEntrySheet
          mKey={anchor}
          entry={entrySheet.entry}
          onClose={() => setEntrySheet(null)}
          onSave={(entry) => {
            const before = saved;
            upsertSavingsEntry(anchor, entry);
            setEntrySheet(null);
            const after =
              entries.filter((e) => e.id !== entry.id).reduce((s, e) => s + e.amount, 0) +
              entry.amount;
            if (goal > 0 && before < goal && after >= goal) {
              confettiBurst();
              toast.show("Monthly savings goal met 🎉");
            }
          }}
          onDelete={
            entrySheet.entry
              ? () => {
                  deleteSavingsEntry(anchor, entrySheet.entry.id);
                  setEntrySheet(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

function GoalSheet({ initial, money, onClose, onSave }) {
  const [value, setValue] = useState(initial || "");
  return (
    <Sheet open onClose={onClose} title="Monthly goal">
      <div className="space-y-4">
        <Field label="Goal amount" hint="Also becomes the default for future months.">
          <TextInput
            type="number"
            inputMode="numeric"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1500000"
            autoFocus
          />
        </Field>
        {Number(value) > 0 && <p className="text-sm text-muted">= {money(Number(value))}</p>}
        <button
          type="button"
          disabled={!Number(value)}
          onClick={() => onSave(Math.round(Number(value)))}
          className="w-full rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
        >
          Save goal
        </button>
      </div>
    </Sheet>
  );
}
