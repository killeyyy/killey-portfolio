import { cn } from "../../lib/cn.js";

/**
 * Goal-vs-actual columns for savings history.
 * months: [{ label, goal, actual }] — actual fills mint when goal met, sand otherwise;
 * the goal level renders as a hairline track behind each column.
 */
export function GoalBars({ months = [], height = 112 }) {
  const max = Math.max(...months.map((m) => Math.max(m.goal, m.actual)), 1);
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }} aria-hidden="true">
        {months.map((m) => (
          <div key={m.label} className="relative flex h-full flex-1 items-end justify-center">
            <span
              className="absolute bottom-0 w-full rounded-t border border-line/80"
              style={{ height: `${(m.goal / max) * 100}%` }}
            />
            <span
              className={cn(
                "relative w-[60%] rounded-t",
                m.goal > 0 && m.actual >= m.goal
                  ? "bg-mint shadow-[0_0_12px] shadow-mint/40"
                  : "bg-sand",
              )}
              style={{ height: `${(m.actual / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2">
        {months.map((m) => (
          <span key={m.label} className="flex-1 text-center text-[10px] text-muted">
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}
