import { useId } from "react";
import { cn } from "../../lib/cn.js";

/** Sparkline with gradient area fill + end dot, themed via currentColor. */
export function TrendLine({ data = [], height = 48, className = "text-rose" }) {
  const gradId = useId();
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const w = 100;
  const pad = 3;
  const step = w / (data.length - 1);
  const y = (d) => pad + (height - 2 * pad) * (1 - (d - min) / (max - min || 1));
  const pts = data.map((d, i) => [i * step, y(d)]);
  const line = pts.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(" ");
  const area = `M0,${height} L${line.split(" ").join(" L")} L${w},${height} Z`;
  const [endX, endY] = pts[pts.length - 1];
  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={endX} cy={endY} r="2.5" fill="currentColor" />
    </svg>
  );
}
