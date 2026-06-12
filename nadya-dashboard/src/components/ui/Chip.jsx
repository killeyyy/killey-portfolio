import { cn } from "../../lib/cn.js";

/** Tappable pill — categories, durations, filters. */
export function Chip({ selected = false, onClick, disabled = false, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium",
        "transition duration-150 ease-out active:scale-95",
        selected
          ? "border-rose bg-rose/15 text-cream"
          : "border-line bg-surface2 text-muted",
        disabled && "opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
