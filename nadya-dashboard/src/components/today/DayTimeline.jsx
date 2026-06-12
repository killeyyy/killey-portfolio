import { useMemo } from "react";
import { useStore } from "../../store/StoreProvider.jsx";
import { COLOR_META } from "../../data/defaults.js";
import { todayKey } from "../../lib/dates.js";
import { formatMinutes } from "../../lib/format.js";
import { entriesForDay } from "../../lib/insights.js";

/** Today's entries as one proportional color strip — "where did today go". */
export function DayTimeline() {
  const { categories, months } = useStore();
  const blocks = useMemo(() => {
    const entries = [...entriesForDay(months, todayKey())].sort((a, b) => a.at - b.at);
    return entries.map((e) => {
      const cat = categories.find((c) => c.id === e.categoryId);
      return { id: e.id, minutes: e.minutes, label: cat?.label, hex: COLOR_META[cat?.color]?.hex || "#E25C72" };
    });
  }, [months, categories]);

  if (blocks.length === 0) return null;
  const total = blocks.reduce((s, b) => s + b.minutes, 0);

  return (
    <div className="animate-fade-up">
      <div className="flex h-3 w-full gap-px overflow-hidden rounded-full" aria-hidden="true">
        {blocks.map((b) => (
          <span
            key={b.id}
            style={{ width: `${(b.minutes / total) * 100}%`, backgroundColor: b.hex }}
            title={`${b.label} · ${formatMinutes(b.minutes)}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-muted">
        Your day so far · {formatMinutes(total)} across {blocks.length}{" "}
        {blocks.length === 1 ? "entry" : "entries"}
      </p>
    </div>
  );
}
