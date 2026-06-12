import { Check, Minus, Pencil, Plus } from "lucide-react";
import { Tile } from "../ui/Tile.jsx";
import { useToast } from "../ui/Toast.jsx";
import { useStore } from "../../store/StoreProvider.jsx";
import { COLOR_META } from "../../data/defaults.js";
import { formatMinutes } from "../../lib/format.js";
import { parseKey, todayKey } from "../../lib/dates.js";
import { dayFill, dayGoal, dayValue, weekSummary } from "../../lib/tend.js";
import { buzz } from "../../lib/celebrate.js";
import { cn } from "../../lib/cn.js";

const fmtValue = (t, v) => (t.kind === "minutes" ? formatMinutes(v) : String(v));

/** One tracker: today's controls + the week as seven slowly-filling leaves. */
export function TrackerCard({ tracker: t, onEdit }) {
  const { settings, trackerLog, setTrackerValue } = useStore();
  const toast = useToast();
  const today = todayKey();
  const hex = COLOR_META[t.color]?.hex || "#E25C72";

  const value = dayValue(trackerLog, today, t.id);
  const goal = dayGoal(t);
  const week = weekSummary(trackerLog, t, today, settings.weekStart ?? 1);

  const setToday = (next) => {
    const clamped = Math.max(0, Math.min(100000, next));
    setTrackerValue(today, t.id, clamped);
    buzz();
    if (goal > 0 && value < goal && clamped >= goal) {
      toast.show(`${t.emoji} ${t.name} — tended for today 🌿`);
    }
  };

  const todayLine =
    t.kind === "check"
      ? value > 0
        ? "Tended today"
        : "Not yet today — one tap"
      : `${fmtValue(t, value)}${goal ? ` of ${fmtValue(t, goal)}` : ""}${t.unit ? ` ${t.unit}` : ""} today`;

  const weekLine =
    t.kind === "check"
      ? `${week.total} of ${week.goal} days`
      : `${fmtValue(t, week.total)} / ${fmtValue(t, week.goal)} this week`;

  return (
    <Tile>
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg"
          style={{ backgroundColor: `${hex}26` }}
          aria-hidden="true"
        >
          {t.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-cream">
            <span className="truncate">{t.name}</span>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit ${t.name}`}
              className="shrink-0 text-muted/70 hover:text-cream"
            >
              <Pencil size={12} />
            </button>
          </p>
          <p
            className={cn(
              "text-xs tabular-nums",
              goal > 0 && dayFill(t, value) >= 1 ? "font-medium text-mint" : "text-muted",
            )}
          >
            {todayLine}
            {goal > 0 && dayFill(t, value) >= 1 && " 🌿"}
          </p>
        </div>

        {t.kind === "check" ? (
          <button
            type="button"
            onClick={() => setToday(value > 0 ? 0 : 1)}
            aria-label={value > 0 ? `Unmark ${t.name}` : `Mark ${t.name} done`}
            aria-pressed={value > 0}
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition duration-150 ease-out active:scale-95",
              value > 0 ? "border-mint bg-mint text-ink" : "border-line bg-surface2 text-muted",
            )}
          >
            <Check size={18} strokeWidth={2.5} />
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setToday(value - (t.step || 1))}
              disabled={value <= 0}
              aria-label={`Less ${t.name}`}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface2 text-cream active:scale-95 disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              onClick={() => setToday(value + (t.step || 1))}
              aria-label={`More ${t.name}`}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink active:scale-95"
              style={{ backgroundColor: hex }}
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {week.keys.map((k, i) => {
            const future = k > today;
            return (
              <span
                key={k}
                title={`${parseKey(k).toLocaleDateString("en-GB", { weekday: "short" })} · ${fmtValue(t, week.values[i])}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  future && "border border-line",
                  k === today && "ring-1 ring-cream/40",
                )}
                style={
                  future
                    ? undefined
                    : { backgroundColor: hex, opacity: 0.15 + 0.85 * week.fills[i] }
                }
              />
            );
          })}
        </div>
        <p
          className={cn(
            "text-[11px] tabular-nums",
            week.met ? "font-semibold text-mint" : "text-muted",
          )}
        >
          {weekLine}
          {week.met && " 🌿"}
        </p>
      </div>
    </Tile>
  );
}
