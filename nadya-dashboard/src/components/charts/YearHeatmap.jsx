import { cn } from "../../lib/cn.js";

// Intensity ramp relative to her own busiest day — never an absolute bar.
const RAMP = ["bg-white/5", "bg-rose/25", "bg-rose/45", "bg-rose/70", "bg-rose"];

/**
 * GitHub-style year grid of daily logged minutes.
 * values: minutes per day, oldest → newest, column-major weeks (7 rows).
 * Scrolls horizontally on mobile; the newest weeks start in view.
 */
export function YearHeatmap({ values = [], className }) {
  const max = Math.max(...values, 1);
  const level = (v) => (v <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)));
  return (
    <div className={cn("overflow-x-auto pb-1", className)} dir="rtl">
      <div
        dir="ltr"
        className="grid w-max grid-flow-col gap-[3px]"
        style={{ gridTemplateRows: "repeat(7, 1fr)" }}
        aria-hidden="true"
      >
        {values.map((v, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-2.5 rounded-[3px]",
              RAMP[level(v)],
              i === values.length - 1 && "ring-1 ring-rose-bright/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
