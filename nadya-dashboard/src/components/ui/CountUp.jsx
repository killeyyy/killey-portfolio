import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn.js";
import { useReducedMotion } from "../../lib/useReducedMotion.js";

/** Number that eases to its value on mount and on change. */
export function CountUp({ value, format = (v) => String(v), duration = 900, className }) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (reduced) {
      prev.current = value;
      setV(value);
      return;
    }
    const from = prev.current;
    prev.current = value;
    if (from === value) return;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced, duration]);

  // tabular-nums: equal-width digits so the layout never jitters mid-count.
  return <span className={cn("tabular-nums", className)}>{format(v)}</span>;
}
