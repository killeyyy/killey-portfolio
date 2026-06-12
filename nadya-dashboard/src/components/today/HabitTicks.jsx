import { Link } from "react-router-dom";
import { Check, Flame, Pencil } from "lucide-react";
import { Tile } from "../ui/Tile.jsx";
import { useToast } from "../ui/Toast.jsx";
import { cn } from "../../lib/cn.js";
import { useStore } from "../../store/StoreProvider.jsx";
import { todayKey } from "../../lib/dates.js";
import { habitStreaks, habitWeekStreak, habitsDueToday } from "../../lib/insights.js";
import { confettiBurst } from "../../lib/confetti.js";
import { buzz } from "../../lib/celebrate.js";

const MILESTONES = new Set([3, 7, 14, 30, 50, 100, 365]);

/** Today's habit checklist with streak counts + milestone celebrations. */
export function HabitTicks() {
  const { settings, habits, habitLog, toggleHabitTick } = useStore();
  const toast = useToast();
  const today = todayKey();
  const active = habits.filter((h) => !h.archivedAt);
  const tickedToday = habitLog[today] || [];
  // Weekly-rhythm habits that met their week aren't "due" — they wear a 🌿
  // tag instead of looking unticked, and don't block the all-done moment.
  const dueIds = new Set(
    habitsDueToday(habits, habitLog, today, settings.weekStart ?? 1).map((h) => h.id),
  );

  const onTick = (h) => {
    const wasDone = tickedToday.includes(h.id);
    toggleHabitTick(today, h.id);
    if (wasDone) return;
    buzz();
    // Celebrate with the tick applied (state lands next render).
    const nextLog = { ...habitLog, [today]: [...tickedToday, h.id] };
    const { current } = habitStreaks(nextLog, h.id, today);
    const allDone = active.every(
      (x) => x.id === h.id || tickedToday.includes(x.id) || !dueIds.has(x.id),
    );
    if (MILESTONES.has(current)) {
      confettiBurst();
      toast.show(`🔥 ${current}-day streak — ${h.name}!`);
    } else if (allDone && active.length > 1) {
      confettiBurst();
      toast.show("All habits done today ✨");
    }
  };

  return (
    <Tile
      title="Habits"
      action={
        <Link to="/habits" viewTransition aria-label="Manage habits" className="rounded-lg p-1.5 text-muted hover:text-cream">
          <Pencil size={16} />
        </Link>
      }
    >
      {active.length === 0 ? (
        <p className="text-sm text-muted">
          No habits yet —{" "}
          <Link to="/habits" viewTransition className="font-semibold text-rose-bright">
            add your first one
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-2">
          {active.map((h) => {
            const done = tickedToday.includes(h.id);
            const weekDone = !done && !dueIds.has(h.id);
            // Rhythm habits count weeks kept; daily habits keep the day flame.
            const rhythm = Boolean(h.timesPerWeek && h.timesPerWeek < 7);
            const current = rhythm
              ? habitWeekStreak(habitLog, h, today, settings.weekStart ?? 1)
              : habitStreaks(habitLog, h.id, today).current;
            return (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => onTick(h)}
                  aria-pressed={done}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors duration-150",
                    done ? "border-mint/50 bg-mint/10" : "border-line bg-surface2",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                      done ? "animate-pop border-mint bg-mint text-ink" : "border-line text-transparent",
                    )}
                    aria-hidden="true"
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-cream">
                    {h.emoji && <span className="mr-1.5">{h.emoji}</span>}
                    {h.name}
                  </span>
                  {weekDone && (
                    <span className="shrink-0 rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-semibold text-mint">
                      week done 🌿
                    </span>
                  )}
                  {current > 0 && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold tabular-nums text-coral">
                      <Flame size={13} aria-hidden="true" />
                      {current}
                      {rhythm && <span className="font-medium text-muted">wk</span>}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Tile>
  );
}
