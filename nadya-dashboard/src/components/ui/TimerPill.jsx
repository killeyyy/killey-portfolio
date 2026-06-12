import { useEffect, useState } from "react";
import { Square } from "lucide-react";
import { useStore } from "../../store/StoreProvider.jsx";
import { useToast } from "./Toast.jsx";
import { todayKey } from "../../lib/dates.js";
import { formatMinutes } from "../../lib/format.js";

/** Floating live-timer pill — tap to stop and log the elapsed time. */
export function TimerPill() {
  const { timer, stopTimer, categories, logActivity, deleteActivity } = useStore();
  const toast = useToast();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  if (!timer) return null;
  const cat = categories.find((c) => c.id === timer.categoryId);
  const elapsed = Date.now() - timer.startedAt;
  const mm = Math.floor(elapsed / 60000);
  const ss = Math.floor(elapsed / 1000) % 60;

  const stop = () => {
    const t = stopTimer();
    if (!t) return;
    const minutes = Math.max(1, Math.round((Date.now() - t.startedAt) / 60000));
    const dateKey = todayKey();
    const entry = logActivity({ dateKey, categoryId: t.categoryId, minutes, note: "" });
    toast.show(`Logged ${cat?.label || "activity"} · ${formatMinutes(minutes)}`, [
      { label: "Undo", onClick: () => deleteActivity(dateKey, entry.id) },
    ]);
  };

  return (
    <button
      type="button"
      onClick={stop}
      aria-label={`Stop timer for ${cat?.label || "activity"}`}
      className="glow-rose fixed bottom-[calc(8.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-rose/50 bg-surface2 px-4 py-2 text-sm font-semibold text-cream shadow-lg lg:bottom-auto lg:left-auto lg:right-8 lg:top-6 lg:translate-x-0"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-rose" aria-hidden="true" />
      {cat?.label} · <span className="tabular-nums">{mm}:{String(ss).padStart(2, "0")}</span>
      <Square size={12} className="fill-rose-bright text-rose-bright" aria-hidden="true" />
    </button>
  );
}
