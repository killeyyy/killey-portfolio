import { NavLink } from "react-router-dom";
import {
  BarChart3, Flame, Home, NotebookPen, PiggyBank, Plus, Repeat, Settings, Sprout,
} from "lucide-react";
import { cn } from "../../lib/cn.js";
import { useStore } from "../../store/StoreProvider.jsx";
import { todayKey } from "../../lib/dates.js";
import { habitStreaks } from "../../lib/insights.js";

const NAV = [
  { to: "/", icon: Home, label: "Today", end: true },
  { to: "/stats", icon: BarChart3, label: "Stats" },
  { to: "/journey", icon: Sprout, label: "Journey" },
  { to: "/savings", icon: PiggyBank, label: "Savings" },
  { to: "/journal", icon: NotebookPen, label: "Journal" },
  { to: "/habits", icon: Repeat, label: "Habits" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

/** Desktop-only navigation rail (mobile keeps the bottom TabBar). */
export function Sidebar({ onPlus }) {
  const { habits, habitLog } = useStore();
  const bestStreak = habits
    .filter((h) => !h.archivedAt)
    .reduce((best, h) => Math.max(best, habitStreaks(habitLog, h.id, todayKey()).current), 0);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line/60 bg-surface/30 px-5 py-8 backdrop-blur lg:flex">
      <p className="font-serif text-xl font-bold">
        <span className="text-gradient-warm">Ruang Nadya</span>
      </p>

      <nav className="mt-8 space-y-1" aria-label="Main">
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive ? "bg-rose/10 text-rose-bright" : "text-muted hover:bg-white/5 hover:text-cream",
              )
            }
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {bestStreak > 0 && (
          <p className="flex items-center gap-2 px-1 text-xs text-muted">
            <Flame size={14} className="text-coral" aria-hidden="true" />
            Best streak: <span className="font-semibold tabular-nums text-cream">{bestStreak} days</span>
          </p>
        )}
        <button
          type="button"
          onClick={onPlus}
          className="glow-rose flex w-full items-center justify-center gap-2 rounded-xl bg-rose py-3 text-sm font-semibold text-ink transition-transform duration-150 active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          Log activity
          <kbd className="ml-1 rounded bg-ink/20 px-1.5 text-[10px] font-semibold">L</kbd>
        </button>
      </div>
    </aside>
  );
}
