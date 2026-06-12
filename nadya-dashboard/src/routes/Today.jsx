import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Droplets, PiggyBank, Settings, Sparkles } from "lucide-react";
import { Hero3D } from "../components/fx/Hero3D.jsx";
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
import { dayFill, dayGoal, dayValue } from "../lib/tend.js";
import { weeklyQuests } from "../lib/quests.js";

// The greeting's gradient follows her clock — dawn sands, warm noons,
// rose dusks, lavender nights.
function greeting(h = new Date().getHours()) {
  if (h >= 4 && h < 11) return { label: "Good morning", grad: ["#F78DA3", "#DDBC8E"] };
  if (h >= 11 && h < 15) return { label: "Good afternoon", grad: ["#F2876B", "#DDBC8E"] };
  if (h >= 15 && h < 18) return { label: "Good evening", grad: ["#F2876B", "#F78DA3"] };
  return { label: "Good night", grad: ["#B49CE8", "#F78DA3"] };
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
            {hello}
            {settings.name ? ", " : ""}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(100deg, ${grad[0]}, ${grad[1]})` }}
            >
              {settings.name}
            </span>
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {formatFullDate()}
            {streak >= 2 && <span className="text-coral"> · {streak}-day streak 🔥</span>}
          </p>
        </div>
        <Link
          to="/settings"
          aria-label="Settings"
          viewTransition
          className="rounded-lg p-1.5 text-muted hover:text-cream lg:hidden"
        >
          <Settings size={20} />
        </Link>
      </header>

      {/* Daily rings hero — a real depth scene: text and rings float on
          separate Z planes inside the pointer-tilted frame. */}
      <Hero3D className="animate-fade-up" innerClassName="lg:p-6">
        <div className="flex flex-col items-center gap-5 [transform-style:preserve-3d] sm:flex-row sm:justify-between">
          <div className="text-center [transform:translateZ(26px)] sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Logged today</p>
            <p className="mt-1 font-serif text-5xl font-semibold tracking-tight lg:text-6xl">
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
          <div className="flex items-center gap-4 [transform:translateZ(46px)] lg:gap-6">
            <Ring
              value={target ? Math.min(100, (summary.productive / target) * 100) : 0}
              size={84}
              stroke={8}
              gradient
              glow
              label={formatMinutes(summary.productive)}
              sub={`of ${formatMinutes(target)}`}
            />
            <Ring
              value={activeHabits.length ? (habitsDone / activeHabits.length) * 100 : 0}
              size={84}
              stroke={8}
              className="text-mint"
              glow
              label={`${habitsDone}/${activeHabits.length || 0}`}
              sub="habits"
            />
            <Ring
              value={journalDone ? 100 : 0}
              size={84}
              stroke={8}
              className="text-lavender"
              glow
              label={journalDone ? "✓" : "—"}
              sub="journal"
            />
          </div>
        </div>
      </Hero3D>

      {/* Monday/Tuesday ritual: last week's story (Wrapped concept) */}
      {[settings.weekStart, (settings.weekStart + 1) % 7].includes(new Date().getDay()) && (
        <Link
          to="/wrapped"
          viewTransition
          className="block rounded-2xl bg-gradient-to-r from-rose/25 via-surface to-coral/20 p-px [view-transition-name:wrapped]"
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
          <TendPeek />
          <WishesPeek />
        </div>
      </div>
    </div>
  );
}

/** This week's garden wishes at a glance — the comeback loop on Today. */
function WishesPeek() {
  const { settings, categories, months, habits, habitLog, journal, trackers, trackerLog,
    savings, wishes } = useStore();
  const quests = useMemo(
    () =>
      weeklyQuests({
        habits, habitLog, journal, trackers, trackerLog, categories, savings,
        weekStart: settings.weekStart ?? 1,
      }),
    // `months` is the change signal for activity-backed wishes.
    [months, habitLog, journal, trackers, trackerLog, habits, categories, savings, settings.weekStart],
  );
  const granted = quests.filter((q) => wishes[q.id] || q.done).length;
  return (
    <Link
      to="/journey"
      viewTransition
      className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition-colors duration-150 hover:border-rose/40"
    >
      <span className="flex items-center gap-3 text-sm font-medium text-cream">
        <Sparkles size={18} className="text-rose-bright" aria-hidden="true" />
        Wishes
      </span>
      <span className="flex items-center gap-1 text-xs tabular-nums text-muted">
        {granted === quests.length && quests.length > 0
          ? "all granted this week 🌠"
          : `${granted} of ${quests.length} granted this week`}
        <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

/** Compact trackers row — the full page lives at /tend. */
function TendPeek() {
  const { trackers, trackerLog } = useStore();
  const today = todayKey();
  const active = trackers.filter((t) => !t.archivedAt);
  const tended = active.filter((t) => dayFill(t, dayValue(trackerLog, today, t.id)) >= 1).length;
  return (
    <Link
      to="/tend"
      viewTransition
      className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition-colors duration-150 hover:border-sky/40"
    >
      <span className="flex items-center gap-3 text-sm font-medium text-cream">
        <Droplets size={18} className="text-sky" aria-hidden="true" />
        Tend
      </span>
      <span className="flex items-center gap-1 text-xs tabular-nums text-muted">
        {active.length === 0
          ? "Water, sleep, prayer & more"
          : `${tended} of ${active.length} tended today`}
        <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

/** Compact savings row — the full page lives at /savings. */
function SavingsPeek({ savings, settings }) {
  const { goal, saved } = savingsForMonth(savings, monthKey());
  const money = (v) => formatMoney(v, settings.currency, settings.locale);
  return (
    <Link
      to="/savings"
      viewTransition
      className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 transition-colors duration-150 hover:border-sand/40"
    >
      <span className="flex items-center gap-3 text-sm font-medium text-cream">
        <PiggyBank size={18} className="text-sand" aria-hidden="true" />
        Money
      </span>
      <span className="flex items-center gap-1 text-xs tabular-nums text-muted">
        {goal > 0 ? `${money(saved)} of ${money(goal)}` : "Set this month's goal"}
        <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}
