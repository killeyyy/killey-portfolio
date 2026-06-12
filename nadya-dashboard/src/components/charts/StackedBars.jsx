import { cn } from "../../lib/cn.js";

/**
 * Per-day stacked category bars (div-based — crisper than SVG at thin widths).
 * days: [{ key, label?, total, segments: [{ hex, minutes }] }]
 */
export function StackedBars({ days = [], height = 128, onSelect, selectedKey }) {
  const max = Math.max(...days.map((d) => d.total), 1);
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }} aria-hidden="true">
        {days.map((day, i) => (
          <button
            key={day.key}
            type="button"
            tabIndex={-1}
            onClick={() => onSelect?.(day.key)}
            style={{ animationDelay: `${Math.min(i * 28, 400)}ms`, transformOrigin: "bottom" }}
            className={cn(
              "flex h-full flex-1 animate-rise flex-col-reverse overflow-hidden rounded-t",
              selectedKey === day.key ? "opacity-100 ring-1 ring-rose-bright/60" : "opacity-90",
            )}
          >
            {day.segments.map((seg, i) => (
              <span
                key={i}
                style={{
                  height: `${(seg.minutes / max) * 100}%`,
                  backgroundColor: seg.hex,
                }}
              />
            ))}
            {day.total === 0 && <span className="h-px bg-line" />}
          </button>
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
