import { cn } from "../../lib/cn.js";

/**
 * GitHub-style day grid for habit ticks.
 * values: 0/1 per day, oldest → newest, length = weeks * 7 (column-major weeks).
 */
export function HabitHeatmap({ values = [], cellClass = "h-2.5 w-2.5", className }) {
  return (
    <div
      className={cn("grid grid-flow-col gap-[3px]", className)}
      style={{ gridTemplateRows: "repeat(7, 1fr)" }}
      aria-hidden="true"
    >
      {values.map((v, i) => (
        <span
          key={i}
          className={cn("rounded-[3px]", cellClass, v ? "bg-rose" : "bg-white/5")}
        />
      ))}
    </div>
  );
}
