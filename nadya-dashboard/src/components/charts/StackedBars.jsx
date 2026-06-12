import { cn } from "../../lib/cn.js";
import { formatMinutes } from "../../lib/format.js";

/**
 * Per-day stacked category bars (div-based — crisper than SVG at thin widths).
 * days: [{ key, label?, total, segments: [{ hex, minutes }] }]
 * Tapping a bar shows a value chip above it and reports the day via onSelect.
 */
export function StackedBars({ days = [], height = 128, onSelect, selectedKey }) {
  const max = Math.max(...days.map((d) => d.total), 1);
  return (
    <div>
      <div className="flex items-end gap-1 pt-7" style={{ height: height + 28 }} aria-hidden="true">
        {days.map((day, i) => (
          <div key={day.key} className="relative flex h-full flex-1 items-end">
            {selectedKey === day.key && day.total > 0 && (
              <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 animate-pop whitespace-nowrap rounded-md bg-cream px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-ink">
                {formatMinutes(day.total)}
              </span>
            )}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onSelect?.(day.key)}
              style={{
                animationDelay: `${Math.min(i * 28, 400)}ms`,
                transformOrigin: "bottom",
                height: `${(day.total / max) * 100}%`,
              }}
              className={cn(
                "flex w-full animate-rise flex-col-reverse overflow-hidden rounded-t",
                selectedKey === day.key ? "ring-1 ring-rose-bright/60" : "opacity-90",
              )}
            >
              {day.segments.map((seg, j) => (
                <span
                  key={j}
                  style={{
                    height: `${day.total ? (seg.minutes / day.total) * 100 : 0}%`,
                    backgroundImage: `linear-gradient(180deg, ${seg.hex}, ${seg.hex}B3)`,
                  }}
                />
              ))}
            </button>
            {day.total === 0 && <span className="absolute bottom-0 h-px w-full bg-line" />}
          </div>
        ))}
      </div>
      {days.length <= 7 && (
        <div className="mt-1 flex gap-1">
          {days.map((day) => (
            <span key={day.key} className="flex-1 text-center text-[10px] text-muted">
              {day.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
