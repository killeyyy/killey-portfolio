/**
 * Category-share donut via stroke-dasharray arcs.
 * slices: [{ hex, value }] — legend renders outside (Stats owns it).
 */
export function Donut({ slices = [], size = 150, thickness = 16, centerLabel, centerSub }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = Math.max(
    slices.reduce((s, x) => s + x.value, 0),
    1,
  );
  let acc = 0;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(255 255 255 / 0.06)"
          strokeWidth={thickness}
        />
        {slices.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * c;
          const offset = -acc * c;
          acc += frac;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.hex}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <span className="absolute flex flex-col items-center">
        <span className="text-lg font-semibold tabular-nums text-cream">{centerLabel}</span>
        {centerSub && <span className="text-[10px] text-muted">{centerSub}</span>}
      </span>
    </div>
  );
}
