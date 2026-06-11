import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { ActivityList } from "../components/today/ActivityList.jsx";
import { HabitTicks } from "../components/today/HabitTicks.jsx";
import { JournalCard } from "../components/today/JournalCard.jsx";
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
  const { settings, categories, months } = useStore();
  const today = todayKey();
  const summary = useMemo(() => {
    const [day] = dailyTotals(months, [today], categories);
    return { ...day, share: productiveShare(day) };
  }, [months, today, categories]);

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold italic text-cream">
            {greeting()}, <span className="text-gradient-warm">{settings.name}</span>
          </h1>
          <p className="mt-0.5 text-sm text-muted">{formatFullDate()}</p>
        </div>
        <Link to="/settings" aria-label="Settings" className="rounded-lg p-1.5 text-muted hover:text-cream">
          <Settings size={20} />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Logged today</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-cream">
            {formatMinutes(summary.total)}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Productive</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-cream">
            {summary.share === null ? "—" : `${summary.share}%`}
          </p>
        </div>
      </div>

      <ActivityList />
      <HabitTicks />
      <JournalCard />
    </div>
  );
}
