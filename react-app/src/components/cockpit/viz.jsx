import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Count-up number that animates when scrolled into view. */
export function Counter({ to, duration = 1200, className }) {
  const [v, setV] = useState(reducedMotion() ? to : 0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (reducedMotion()) {
      setV(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref} className={className}>{v}</span>;
}

/** Inline SVG sparkline, themed via text color (currentColor). */
export function Sparkline({ data = [], className = "text-crimson-bright", height = 36 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const w = 100;
  const step = w / (data.length - 1 || 1);
  const pts = data.map((d, i) => `${(i * step).toFixed(2)},${(height - ((d - min) / (max - min || 1)) * height).toFixed(2)}`);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={`h-9 w-full ${className}`} aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Animated SVG progress ring. */
export function ProgressRing({ value = 0, size = 84, stroke = 8, className = "text-jade-bright", label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--c-silver) / 0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          className={className} stroke="currentColor" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: reducedMotion() ? "none" : "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <span className="absolute font-serif text-fluid-lg font-semibold text-silver">{label ?? `${value}%`}</span>
    </div>
  );
}

/** GitHub-style contribution heatmap (garnet ramp by intensity 0..4).
 *  Pass `data` (array of per-day counts) for the LIVE feed; otherwise renders
 *  a stable deterministic sample. */
export function Heatmap({ weeks = 18, days = 7, seed = 7, data = null }) {
  let cells;
  if (Array.isArray(data) && data.length) {
    const max = Math.max(...data, 1);
    cells = data.map((c) => (c <= 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4))));
  } else {
    // deterministic pseudo-random so it's stable across renders (sample data)
    cells = [];
    let s = seed;
    const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < weeks * days; i++) cells.push(Math.floor(rand() * 5));
  }
  const ramp = ["bg-silver/10", "bg-crimson/20", "bg-crimson/40", "bg-crimson/70", "bg-crimson"];
  return (
    <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: `repeat(${days}, 1fr)` }} aria-hidden="true">
      {cells.map((lvl, i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-[3px] ${ramp[lvl]}`} />
      ))}
    </div>
  );
}

/** live / sample / error pill. */
export function StatusBadge({ state = "sample" }) {
  const map = {
    live: ["Live", "text-jade-bright border-jade-bright/40 bg-jade/10"],
    sample: ["Sample data", "text-gold border-gold/40 bg-gold/10"],
    error: ["Offline", "text-crimson-bright border-crimson/40 bg-crimson/10"],
  };
  const [label, cls] = map[state] || map.sample;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {label}
    </span>
  );
}

/** Glass bento tile shell. */
export function Tile({ children, className = "", span = "", glow = false }) {
  return (
    <div className={`${glow ? "glow-card " : ""}rounded-[18px] border border-line/70 bg-surface/40 p-5 backdrop-blur ${span} ${className}`}>
      {children}
    </div>
  );
}
