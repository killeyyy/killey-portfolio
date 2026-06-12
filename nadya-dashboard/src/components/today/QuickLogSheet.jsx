import { useEffect, useMemo, useState } from "react";
import { History, Play } from "lucide-react";
import { Sheet } from "../ui/Sheet.jsx";
import { Chip } from "../ui/Chip.jsx";
import { TextInput, NumberStepper } from "../ui/Field.jsx";
import { useToast } from "../ui/Toast.jsx";
import { useStore } from "../../store/StoreProvider.jsx";
import { COLOR_META, DURATION_PRESETS } from "../../data/defaults.js";
import { formatMinutes } from "../../lib/format.js";
import {
  addDays, isSmallHours, monthKey, monthKeyOf, rangeKeys, todayKey, yesterdayKey,
} from "../../lib/dates.js";
import { entriesForDay } from "../../lib/insights.js";
import { buzz } from "../../lib/celebrate.js";

/**
 * The fast path: tap a category, tap a duration → entry commits immediately.
 * Happy path is 3 taps including the "+"; "Repeat last" is 2.
 */
export function QuickLogSheet({ open, onClose }) {
  const { categories, months, ensureMonths, logActivity, deleteActivity, timer, startTimer } =
    useStore();
  const toast = useToast();
  const [selectedCat, setSelectedCat] = useState(null);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [note, setNote] = useState("");
  const [asYesterday, setAsYesterday] = useState(false);

  // Frequency ordering + repeat-last need the last 14 days of entries.
  const last14 = useMemo(() => rangeKeys(addDays(todayKey(), -13), todayKey()), []);
  useEffect(() => {
    if (open) ensureMonths([...new Set([monthKey(), ...last14.map(monthKeyOf)])]);
  }, [open, ensureMonths, last14]);

  const active = useMemo(() => categories.filter((c) => !c.archived), [categories]);

  // Categories ordered by 14-day usage; unused ones keep their default order.
  const ordered = useMemo(() => {
    const usage = {};
    let last = null;
    for (const key of last14) {
      for (const e of entriesForDay(months, key)) {
        usage[e.categoryId] = (usage[e.categoryId] || 0) + 1;
        if (!last || e.at > last.at) last = e;
      }
    }
    const sorted = [...active].sort((a, b) => (usage[b.id] || 0) - (usage[a.id] || 0));
    return { sorted, last, usage };
  }, [active, months, last14]);

  // Fresh state each time the sheet opens; preselect the last-used category.
  useEffect(() => {
    if (!open) return;
    setSelectedCat(ordered.last?.categoryId || ordered.sorted[0]?.id || null);
    setNote("");
    setAsYesterday(false);
    setCustomMinutes(30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const commit = (categoryId, minutes) => {
    const category = active.find((c) => c.id === categoryId);
    if (!category || !minutes) return;
    const dateKey = asYesterday ? yesterdayKey() : todayKey();
    const entry = logActivity({ dateKey, categoryId, minutes, note: note.trim() });
    buzz();
    onClose();
    toast.show(`Logged ${category.label} · ${formatMinutes(minutes)}`, [
      { label: "Undo", onClick: () => deleteActivity(dateKey, entry.id) },
    ]);
  };

  const lastCat = ordered.last && active.find((c) => c.id === ordered.last.categoryId);

  return (
    <Sheet open={open} onClose={onClose} title="Log activity">
      <div className="space-y-4">
        {lastCat && (
          <Chip
            onClick={() => commit(lastCat.id, ordered.last.minutes)}
            className="w-full justify-center border-dashed py-2.5"
          >
            <History size={14} aria-hidden="true" />
            Repeat last: {lastCat.label} · {formatMinutes(ordered.last.minutes)}
          </Chip>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">What</p>
          <div className="flex flex-wrap gap-2">
            {ordered.sorted.map((c) => (
              <Chip key={c.id} selected={selectedCat === c.id} onClick={() => setSelectedCat(c.id)}>
                <span
                  className={`h-2 w-2 rounded-full ${COLOR_META[c.color]?.dot || "bg-rose"}`}
                  aria-hidden="true"
                />
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            How long <span className="normal-case text-muted/70">(tap to log)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {DURATION_PRESETS.map((m) => (
              <Chip key={m} disabled={!selectedCat} onClick={() => commit(selectedCat, m)}>
                {formatMinutes(m)}
              </Chip>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <NumberStepper value={customMinutes} onChange={setCustomMinutes} format={formatMinutes} />
            <button
              type="button"
              disabled={!selectedCat}
              onClick={() => commit(selectedCat, customMinutes)}
              className="rounded-xl bg-rose px-4 py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
            >
              Log
            </button>
          </div>
        </div>

        {!timer && (
          <button
            type="button"
            disabled={!selectedCat}
            onClick={() => {
              startTimer(selectedCat);
              onClose();
              toast.show("Timer running — tap the pill to stop & log");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose/40 py-2.5 text-sm font-semibold text-rose-bright active:scale-95 disabled:opacity-40"
          >
            <Play size={14} aria-hidden="true" />
            Or start a live timer
          </button>
        )}

        <TextInput
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          maxLength={120}
        />

        {isSmallHours() && (
          <Chip selected={asYesterday} onClick={() => setAsYesterday((v) => !v)} className="w-full justify-center">
            It's past midnight — count this as yesterday
          </Chip>
        )}
      </div>
    </Sheet>
  );
}
