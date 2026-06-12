import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { Sheet } from "../components/ui/Sheet.jsx";
import { Field, TextInput } from "../components/ui/Field.jsx";
import { Ring } from "../components/charts/Ring.jsx";
import { GoalBars } from "../components/charts/GoalBars.jsx";
import { SavingsEntrySheet } from "../components/savings/SavingsEntrySheet.jsx";
import { Hero3D } from "../components/fx/Hero3D.jsx";
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

  const { goal, saved, income, spent, entries } = useMemo(
    () => savingsForMonth(savings, anchor),
    [savings, anchor],
  );
  const money = (v) => formatMoney(v, settings.currency, settings.locale);
  const pct = goal ? Math.min(100, (saved / goal) * 100) : 0;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const out = spent + saved;
  const flowMax = Math.max(income, out, 1);
  const inHand = income - out;

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
      <PageHeader title="Money" sub={formatMonthLabel(anchor)} />

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

      <Hero3D>
        <div className="flex items-center gap-4 [transform-style:preserve-3d]">
          <div className="[transform:translateZ(40px)]">
            <Ring value={pct} size={110} glow className={pct >= 100 ? "text-mint" : "text-sand"} />
          </div>
          <div className="min-w-0 flex-1 [transform:translateZ(20px)]">
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
      </Hero3D>

      {(income > 0 || spent > 0) && (
        <Tile title="This month's flow">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-mint/10 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-mint">In</p>
              <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-cream">
                {money(income)}
              </p>
            </div>
            <div className="rounded-xl bg-coral/10 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-coral">Spent</p>
              <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-cream">
                {money(spent)}
              </p>
            </div>
            <div className="rounded-xl bg-sand/10 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-sand">Saved</p>
              <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-cream">
                {money(saved)}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1.5" aria-hidden="true">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-mint/80 transition-all duration-700 ease-out"
                style={{ width: `${(income / flowMax) * 100}%` }}
              />
            </div>
            <div className="flex h-2 w-full gap-px overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-coral/80 transition-all duration-700 ease-out"
                style={{ width: `${(spent / flowMax) * 100}%` }}
              />
              <div
                className="h-full bg-sand/80 transition-all duration-700 ease-out"
                style={{ width: `${(saved / flowMax) * 100}%` }}
              />
            </div>
          </div>
          {income > 0 && (
            <p className="mt-2 text-xs tabular-nums text-muted">
              {inHand >= 0
                ? `Still in hand: ${money(inHand)}`
                : `${money(-inHand)} more out than in this month`}
            </p>
          )}
        </Tile>
      )}

      <Tile
        title="This month"
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
          <p className="text-sm text-muted">
            No money moves this month yet — add savings, income or expenses.
          </p>
        ) : (
          <ul className="divide-y divide-line/60">
            {sorted.map((e) => {
              const kind = e.kind || "save";
              const meta =
                kind === "income"
                  ? { sign: "+", cls: "text-mint", tag: "income" }
                  : kind === "expense"
                    ? { sign: "−", cls: "text-coral", tag: "expense" }
                    : { sign: "♥", cls: "text-sand", tag: "saved" };
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setEntrySheet({ entry: e })}
                    className="flex w-full items-center gap-3 py-2.5 text-left"
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-sm font-bold ${meta.cls}`}
                      aria-hidden="true"
                    >
                      {meta.sign}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-semibold tabular-nums ${meta.cls}`}>
                        {money(e.amount)}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {meta.tag}
                        {e.note ? ` · ${e.note}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{formatDayLabel(e.date)}</span>
                  </button>
                </li>
              );
            })}
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
            // Only save-kind entries move the goal ring (legacy = save).
            const after =
              entries
                .filter((e) => e.id !== entry.id && (!e.kind || e.kind === "save"))
                .reduce((s, e) => s + e.amount, 0) +
              (entry.kind === "save" ? entry.amount : 0);
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
