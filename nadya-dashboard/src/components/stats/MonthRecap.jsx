import { Tile } from "../ui/Tile.jsx";
import { MOODS } from "../today/JournalCard.jsx";
import { formatDayLabel, formatMinutes } from "../../lib/format.js";
import { COLOR_META } from "../../data/defaults.js";
import { cn } from "../../lib/cn.js";

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-cream">{value}</p>
      {sub && <p className="truncate text-[10px] text-muted">{sub}</p>}
    </div>
  );
}

/** The month, gathered — only what the other tiles don't already say. */
export function MonthRecap({ recap }) {
  if (!recap.activeDays) return null;
  const moodEmoji = recap.moodAvg ? MOODS[Math.round(recap.moodAvg) - 1]?.emoji : null;
  return (
    <Tile title="Your month in bloom" className="lg:col-span-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          label="Active days"
          value={`${recap.activeDays} of ${recap.daysSoFar}`}
          sub="days with something logged"
        />
        {recap.top && (
          <Stat
            label="Led the way"
            value={
              <span className="flex items-center gap-1.5">
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", COLOR_META[recap.top.category.color]?.dot)}
                  aria-hidden="true"
                />
                {recap.top.category.label}
              </span>
            }
            sub={formatMinutes(recap.top.minutes)}
          />
        )}
        {recap.bestDay && (
          <Stat
            label="Fullest day"
            value={formatMinutes(recap.bestDay.total)}
            sub={formatDayLabel(recap.bestDay.key)}
          />
        )}
        <Stat label="Habit ticks" value={recap.ticks} sub="little promises kept" />
        <Stat label="Journal" value={`${recap.journalDays} days`} sub="pages written" />
        {recap.moodAvg && (
          <Stat label="Mood" value={`${moodEmoji} ${recap.moodAvg}`} sub="average this month" />
        )}
      </div>
    </Tile>
  );
}
