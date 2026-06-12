import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Tile } from "../components/ui/Tile.jsx";
import { CountUp } from "../components/ui/CountUp.jsx";
import { Ring } from "../components/charts/Ring.jsx";
import { ActivityList } from "../components/today/ActivityList.jsx";
import { HabitTicks } from "../components/today/HabitTicks.jsx";
import { JournalCard } from "../components/today/JournalCard.jsx";
import { DayTimeline } from "../components/today/DayTimeline.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { todayKey } from "../lib/dates.js";
import { formatFullDate, formatMinutes } from "../lib/format.js";
import { dailyTotals, productiveShare } from "../lib/insights.js";

function greeting(h = new Date().getHours()) {
  if (h >= 4 && h < 11) return "Selamat pagi";
  if (h >= 11 && h < 15) return "Selamat siang";
  if (h >= 15 && h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function Today() {
  const { settings, categories, months, habits, habitLog, journal } = useStore();
  const today = todayKey();
  const target = settings.dailyTarget ?? 180;

  const summary = useMemo(() => {
    const [day] = dailyTotals(months, [today], categories);
    return { ...day, share: productiveShare(day) };
  }, [months, today, categories]);

  const activeHabits = habits.filter((h) => !h.archivedAt);
  const habitsDone = (habitLog[today] || []).filter((id) =>
    activeHabits.some((h) => h.id === id),
  ).length;
  const entry = journal[today];
  const journalDone = Boolean(
    entry && (entry.highlight?.trim() || entry.mood || entry.grateful?.some((g) => g.trim())),
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold italic text-cream lg:text-3xl">
            {greeting()}, <span className="text-gradient-warm">{settings.name}</span>
          </h1>
          <p className="mt-0.5 text-sm text-muted">{formatFullDate()}</p>
        </div>
        <Link
          to="/settings"
          aria-label="Settings"
          className="rounded-lg p-1.5 text-muted hover:text-cream lg:hidden"
        >
          <Settings size={20} />
        </Link>
      </header>

      {/* Daily rings hero */}
      <Tile className="animate-fade-up lg:p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Logged today</p>
            <p className="mt-1 font-serif text-4xl font-semibold lg:text-5xl">
              <CountUp
                value={summary.total}
                format={formatMinutes}
                className="text-gradient-warm tabular-nums"
              />
            </p>
            <p className="mt-1 text-sm text-muted">
              {summary.share === null ? "Tap + when you finish something" : `${summary.share}% productive`}
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <Ring
              value={target ? Math.min(100, (summary.productive / target) * 100) : 0}
              size={84}
              stroke={8}
              className="text-rose"
              label={formatMinutes(summary.productive)}
              sub={`of ${formatMinutes(target)}`}
            />
            <Ring
              value={activeHabits.length ? (habitsDone / activeHabits.length) * 100 : 0}
              size={84}
              stroke={8}
              className="text-mint"
              label={`${habitsDone}/${activeHabits.length || 0}`}
              sub="habits"
            />
            <Ring
              value={journalDone ? 100 : 0}
              size={84}
              stroke={8}
              className="text-lavender"
              label={journalDone ? "✓" : "—"}
              sub="journal"
            />
          </div>
        </div>
      </Tile>

      <DayTimeline />

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        <ActivityList />
        <div className="space-y-4 lg:space-y-6">
          <HabitTicks />
          <JournalCard />
        </div>
      </div>
    </div>
  );
}
