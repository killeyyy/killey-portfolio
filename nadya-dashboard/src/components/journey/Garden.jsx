// Mawar's Garden — her whole history as a meadow. One plant per week:
// quiet weeks grow a sprout, full weeks bloom. Nothing is ever empty or dead.
import { COLOR_META } from "../../data/defaults.js";
import { parseKey, addDays } from "../../lib/dates.js";

const PER_ROW = 8;
const CELL = 34;
const ROW_H = 56;

// Deterministic "nature": same week always leans and stretches the same way.
function jitter(seed, salt) {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x); // 0..1
}

const label = (start) => {
  const fmt = (k) => parseKey(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(addDays(start, 6))}`;
};

function Plant({ x, y, stars, hex, tilt, stretch, delay, current }) {
  const h = (10 + stars * 7) * stretch; // sprout → tall bloom
  const r = 3 + stars * 1.7;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`} className="sway" style={{ animationDelay: `${delay}s` }}>
      <path d={`M0 0 C 0 ${-h * 0.5}, ${tilt > 0 ? 2 : -2} ${-h * 0.75}, 0 ${-h}`} fill="none" stroke="#1F6F5C" strokeWidth="2" strokeLinecap="round" />
      <path d={`M0 ${-h * 0.45} q ${tilt > 0 ? -7 : 7} -1 ${tilt > 0 ? -8 : 8} -6 q ${tilt > 0 ? 5 : -5} 6 ${tilt > 0 ? 8 : -8} 6 z`} fill="#7ED4B2" opacity="0.75" />
      {stars === 0 && (
        <path d={`M0 ${-h} q 6 -2 7 -7 q -6 1 -7 7 z`} fill="#7ED4B2" />
      )}
      {stars > 0 &&
        [...Array(stars >= 3 ? 6 : 5)].map((_, i, arr) => {
          const a = (i / arr.length) * 2 * Math.PI;
          return (
            <circle
              key={i}
              cx={r * 0.85 * Math.cos(a)}
              cy={-h + r * 0.85 * Math.sin(a)}
              r={r * 0.62}
              fill={hex}
              opacity={stars === 1 ? 0.75 : 1}
            />
          );
        })}
      {stars > 0 && <circle cx="0" cy={-h} r={r * 0.45} fill="#C9A86A" />}
      {current && <circle cx="0" cy={-h} r={r + 3.5} fill="none" stroke="#F78DA3" strokeWidth="1" opacity="0.6" />}
    </g>
  );
}

export function Garden({ plots = [] }) {
  if (!plots.length) return null;
  const rows = Math.ceil(plots.length / PER_ROW);
  const width = Math.min(plots.length, PER_ROW) * CELL + 16;
  const height = rows * ROW_H + 14;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label={`Garden of ${plots.length} weeks`}
    >
      {[...Array(rows)].map((_, r) => (
        <ellipse
          key={r}
          cx={width / 2}
          cy={(r + 1) * ROW_H + 4}
          rx={width / 2 - 6}
          ry="5"
          fill="#3A2620"
          opacity="0.55"
        />
      ))}
      {plots.map((p, i) => {
        const row = Math.floor(i / PER_ROW);
        const col = i % PER_ROW;
        return (
          <g key={p.start}>
            <title>{`${label(p.start)} · ${p.stars}★`}</title>
            <Plant
              x={col * CELL + CELL / 2 + 8 + (jitter(i, 1) - 0.5) * 8}
              y={(row + 1) * ROW_H + 2}
              stars={p.stars}
              hex={COLOR_META[p.color]?.hex || "#E25C72"}
              tilt={(jitter(i, 2) - 0.5) * 14}
              stretch={0.85 + jitter(i, 3) * 0.4}
              delay={jitter(i, 4) * 4}
              current={p.isCurrent}
            />
          </g>
        );
      })}
    </svg>
  );
}
