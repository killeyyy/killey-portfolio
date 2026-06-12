import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, PiggyBank, Settings } from "lucide-react";
import { Tile } from "../components/ui/Tile.jsx";
import { CountUp } from "../components/ui/CountUp.jsx";
import { Ring } from "../components/charts/Ring.jsx";
import { ActivityList } from "../components/today/ActivityList.jsx";
import { HabitTicks } from "../components/today/HabitTicks.jsx";
import { JournalCard } from "../components/today/JournalCard.jsx";
import { DayTimeline } from "../components/today/DayTimeline.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { monthKey, todayKey } from "../lib/dates.js";
import { formatFullDate, formatMinutes, formatMoney } from "../lib/format.js";
import { dailyTotals, productiveShare, savingsForMonth } from "../lib/insights.js";
import { computeJourney } from "../lib/journey.js";

// The greeting's gradient follows her clock — dawn sands, warm noons,
// rose dusks, lavender nights.
function greeting(h = new Date().getHours()) {
  if (h >= 4 && h < 11) return { label: "Selamat pagi", grad: ["#F78DA3", "#DDBC8E"] };
  if (h >= 11 && h < 15) return { label: "Selamat siang", grad: ["#F2876B", "#DDBC8E"] };
  if (h >= 15 && h < 18) return { label: "Selamat sore", grad: ["#F2876B", "#F78DA3"] };
  return { label: "Selamat malam", grad: ["#B49CE8", "#F78DA3"] };
}

export default function Today() {
  const { settings, categories, months, habits, habitLog, journal, savings } = useStore();
  const today = todayKey();
  const target = settings.dailyTarget ?? 180;

  const summary = useMemo(() => {
    const [day] = dailyTotals(months, [today], categories);
    return { ...day, share: productiveShare(day) };
  }, [months, today, categories]);

  const streak = useMemo(
    () =>
      computeJourney({
        habits, habitLog, journal, savings,
        dailyTarget: target, categories,
      }).streak,
    [habits, habitLog, journal, savings, target, categories, months],
  );
  const { label: hello, grad } = greeting();

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
          <h1 className="font-serif text-2xl font-bold text-cream lg:text-3xl">
            {hello},{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(100deg, ${grad[0]}, ${grad[1]})` }}
            >
              {settings.name}
            </span>
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {formatFullDate()}
            {streak >= 2 && <span className="text-coral"> · {streak} hari beruntun 🔥</span>}
          </p>
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
      <Tile glow className="animate-fade-up lg:p-6">
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
              gradient
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

      {/* Monday/Tuesday ritual: last week's story (Wrapped concept) */}
      {[settings.weekStart, (settings.weekStart + 1) % 7].includes(new Date().getDay()) && (
        <Link
          to="/wrapped"
          className="block rounded-2xl bg-gradient-to-r from-rose/25 via-surface to-coral/20 p-px"
        >
          <span className="flex items-center justify-between rounded-[15px] bg-surface px-4 py-3">
            <span className="text-sm font-semibold text-cream">Your week, wrapped 🌹</span>
            <span className="text-xs text-muted">tap for the story →</span>
          </span>
        </Link>
      )}

      <DayTimeline />

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        <ActivityList />
        <div className="space-y-4 lg:space-y-6">
          <HabitTicks />
          <JournalCard />
          <SavingsPeek savings={savings} settings={settings} />
        </div>
      </div>
    </div>
  );
}

/** Compact savings row — the full page lives at /savings. */
function SavingsPeek({ savings, settings }) {
  const { goal, saved } = savingsForMonth(savings, monthKey());
  const money = (v) => formatMoney(v, settings.currency, settings.locale);
  return (
    <Link
      to="/savings"
      className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition-colors duration-150 hover:border-sand/40"
    >
      <span className="flex items-center gap-3 text-sm font-medium text-cream">
        <PiggyBank size={18} className="text-sand" aria-hidden="true" />
        Savings
      </span>
      <span className="flex items-center gap-1 text-xs tabular-nums text-muted">
        {goal > 0 ? `${money(saved)} of ${money(goal)}` : "Set this month's goal"}
        <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}
