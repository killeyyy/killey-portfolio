import { Tile } from "../ui/Tile.jsx";
import { formatMinutes } from "../../lib/format.js";
import { cn } from "../../lib/cn.js";

/** Where the period's logged minutes land across the day — four light bands. */
export function TimeOfDay({ profile }) {
  const { buckets, total, peak } = profile;
  return (
    <Tile title="When you bloom">
      {total === 0 ? (
        <p className="text-sm text-muted">Nothing logged in this period yet.</p>
      ) : (
        <>
          <ul className="space-y-2.5">
            {buckets.map((b) => (
              <li key={b.id} className="flex items-center gap-2.5">
                <span className="w-5 text-center text-sm" aria-hidden="true">
                  {b.emoji}
                </span>
                <span className="w-20 shrink-0 text-xs text-cream">{b.label}</span>
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      peak?.id === b.id ? "bg-gradient-to-r from-rose to-coral" : "bg-rose/40",
                    )}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-muted">
                  {b.minutes ? `${formatMinutes(b.minutes)} · ${b.pct}%` : "—"}
                </span>
              </li>
            ))}
          </ul>
          {peak && (
            <p className="mt-2 text-xs text-muted">
              Most of your time opens in the{" "}
              <span className="font-semibold text-cream">{peak.label.toLowerCase()}</span> {peak.emoji}
            </p>
          )}
        </>
      )}
    </Tile>
  );
}
