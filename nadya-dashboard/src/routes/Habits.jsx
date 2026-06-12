import { useMemo, useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { Flourish } from "../components/ui/Flourish.jsx";
import { HabitHeatmap } from "../components/charts/HabitHeatmap.jsx";
import { TrendLine } from "../components/charts/TrendLine.jsx";
import { HabitForm } from "../components/habits/HabitForm.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { addDays, rangeKeys, todayKey, weekStartKey } from "../lib/dates.js";
import { habitAdherence, habitHeatValues, habitStreaks } from "../lib/insights.js";

export default function Habits() {
  const { settings, habits, habitLog, saveHabits } = useStore();
  const [form, setForm] = useState(null); // { habit } | { habit: null }
  const today = todayKey();

  // 12 aligned heatmap columns ending in the current (possibly partial) week.
  const heatKeys = useMemo(
    () => rangeKeys(weekStartKey(addDays(today, -77), settings.weekStart), today),
    [today, settings.weekStart],
  );
  const last28 = useMemo(() => rangeKeys(addDays(today, -27), today), [today]);

  const active = habits.filter((h) => !h.archivedAt);
  const archived = habits.filter((h) => h.archivedAt);

  const upsert = (habit) => {
    const exists = habits.some((h) => h.id === habit.id);
    saveHabits(exists ? habits.map((h) => (h.id === habit.id ? habit : h)) : [...habits, habit]);
    setForm(null);
  };

  const setArchived = (id, archivedAt) => {
    saveHabits(habits.map((h) => (h.id === id ? { ...h, archivedAt } : h)));
    setForm(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Habits"
        back
        action={
          <button
            type="button"
            onClick={() => setForm({ habit: null })}
            className="inline-flex items-center gap-1 rounded-xl bg-rose px-3 py-1.5 text-xs font-semibold text-ink active:scale-95"
          >
            <Plus size={14} aria-hidden="true" /> New
          </button>
        }
      />

      {active.length === 0 && (
        <Tile>
          <div className="py-3 text-center">
            <Flourish />
            <p className="text-sm text-muted">
              Small daily promises to yourself — add one and tick it from the Today screen.
            </p>
          </div>
        </Tile>
      )}

      {active.map((h) => {
        const { current, best } = habitStreaks(habitLog, h.id, today);
        const adherence = habitAdherence(habitLog, h, last28, today);
        return (
          <Tile
            key={h.id}
            title={
              <>
                {h.emoji && <span className="mr-1.5">{h.emoji}</span>}
                {h.name}
              </>
            }
            action={
              <button
                type="button"
                onClick={() => setForm({ habit: h })}
                className="text-xs font-semibold text-muted hover:text-cream"
              >
                Edit
              </button>
            }
          >
            <div className="mb-3 flex gap-4 text-xs text-muted">
              <span>
                Streak{" "}
                <span className="font-semibold tabular-nums text-coral">🔥 {current}</span>
              </span>
              <span>
                Best <span className="font-semibold tabular-nums text-cream">{best}</span>
              </span>
              <span>
                Last 4 weeks{" "}
                <span className="font-semibold tabular-nums text-cream">
                  {adherence.pct === null ? "—" : `${adherence.pct}%`}
                </span>
              </span>
            </div>
            <HabitHeatmap values={habitHeatValues(habitLog, h.id, heatKeys)} />
            <WeeklyLine habit={h} habitLog={habitLog} weekStart={settings.weekStart} today={today} />
          </Tile>
        );
      })}

      {archived.length > 0 && (
        <Tile title="Archived">
          <ul className="space-y-2">
            {archived.map((h) => (
              <li key={h.id} className="flex items-center gap-2 text-sm text-muted">
                <span className="min-w-0 flex-1 truncate">
                  {h.emoji && <span className="mr-1">{h.emoji}</span>}
                  {h.name}
                </span>
                <button
                  type="button"
                  onClick={() => setArchived(h.id, null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-bright"
                >
                  <RotateCcw size={12} aria-hidden="true" /> Restore
                </button>
              </li>
            ))}
          </ul>
        </Tile>
      )}

      {form && (
        <HabitForm
          habit={form.habit}
          onClose={() => setForm(null)}
          onSave={upsert}
          onArchive={form.habit ? () => setArchived(form.habit.id, Date.now()) : undefined}
        />
      )}
    </div>
  );
}

/** Her ask (2026-06-12): a line chart per habit — weekly consistency %. */
function WeeklyLine({ habit, habitLog, weekStart, today }) {
  const points = [];
  for (let w = -7; w <= 0; w++) {
    const start = addDays(weekStartKey(today, weekStart), w * 7);
    const days = rangeKeys(start, addDays(start, 6)).filter((k) => k <= today);
    points.push(habitAdherence(habitLog, habit, days, today).pct ?? 0);
  }
  if (points.every((p) => !p)) return null;
  return (
    <div className="mt-3">
      <TrendLine data={points} height={36} className="text-mint" />
      <p className="mt-1 text-[10px] text-muted">Consistency per week, last 8 weeks</p>
    </div>
  );
}
