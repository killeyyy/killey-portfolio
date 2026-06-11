import { useReducedMotion } from "../../lib/useReducedMotion.js";
import { cn } from "../../lib/cn.js";

/** Animated progress ring; label/sub render in the center. */
export function Ring({ value = 0, size = 96, stroke = 9, className = "text-rose", label, sub }) {
  const reduced = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(255 255 255 / 0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={className}
          stroke="currentColor"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: reduced ? "none" : "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <span className="absolute flex flex-col items-center">
        <span className={cn("font-semibold tabular-nums text-cream", size >= 110 ? "text-xl" : "text-base")}>
          {label ?? `${Math.round(value)}%`}
        </span>
        {sub && <span className="text-[10px] text-muted">{sub}</span>}
      </span>
    </div>
  );
}
