import { Tile } from "../ui/Tile.jsx";
import { formatMinutes } from "../../lib/format.js";

/**
 * Where tagged time went in the visible period. Renders nothing until tags
 * exist — the feature introduces itself only once she's used it.
 */
export function TagTimes({ rows }) {
  if (!rows.length) return null;
  const max = rows[0].minutes;
  return (
    <Tile title="Time by tag">
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li key={r.tag} className="flex items-center gap-2.5">
            <span className="w-24 shrink-0 truncate text-xs text-cream">#{r.tag}</span>
            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-lavender/80 to-rose/80 transition-all duration-700 ease-out"
                style={{ width: `${(r.minutes / max) * 100}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-muted">
              {formatMinutes(r.minutes)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        Tags from your quick-log entries — add them when you log to slice time your way.
      </p>
    </Tile>
  );
}
