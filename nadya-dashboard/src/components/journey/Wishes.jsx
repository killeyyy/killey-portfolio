import { useEffect, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Tile } from "../ui/Tile.jsx";
import { useStore } from "../../store/StoreProvider.jsx";
import { weeklyQuests } from "../../lib/quests.js";
import { formatMinutes } from "../../lib/format.js";
import { confettiBurst } from "../../lib/confetti.js";
import * as storage from "../../lib/storage.js";
import { cn } from "../../lib/cn.js";

const fmt = (q, v) => (q.unit === "minutes" ? formatMinutes(v) : String(v));

/**
 * This week's garden wishes — three gentle, data-derived quests. Granting is
 * automatic (StoreProvider); this tile shows them and celebrates fresh grants
 * once per device (`nadya:wishesSeen`, excluded from backups like journeySeen).
 */
export function Wishes() {
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

  useEffect(() => {
    const seen = storage.get("wishesSeen");
    const granted = quests.filter((q) => wishes[q.id]).map((q) => q.id);
    if (!seen) {
      // First visit: honor history quietly, celebrate only what comes next.
      storage.set("wishesSeen", granted);
      return;
    }
    const fresh = granted.filter((id) => !seen.includes(id));
    if (fresh.length) {
      confettiBurst();
      storage.set("wishesSeen", [...seen, ...fresh].slice(-60));
    }
  }, [wishes, quests]);

  return (
    <Tile
      title="This week's wishes"
      action={<span className="text-xs text-muted">the garden asks softly</span>}
    >
      <ul className="space-y-3">
        {quests.map((q) => {
          const granted = Boolean(wishes[q.id]) || q.done;
          const pct = Math.min(100, (q.progress / q.target) * 100);
          return (
            <li key={q.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base",
                  granted ? "bg-mint/15" : "bg-white/5",
                )}
                aria-hidden="true"
              >
                {q.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-cream">{q.title}</p>
                  {granted ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-mint">
                      <Sparkles size={12} aria-hidden="true" /> granted · +{q.xp} XP
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {fmt(q, Math.min(q.progress, q.target))} of {fmt(q, q.target)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted">{q.desc}</p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      granted ? "bg-mint" : "bg-gradient-to-r from-rose to-coral",
                    )}
                    style={{ width: `${Math.max(granted ? 100 : 3, pct)}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] text-muted">
        New wishes bloom each week, tuned to your own rhythm. Ungranted ones simply fade —
        nothing is ever lost.
      </p>
    </Tile>
  );
}
