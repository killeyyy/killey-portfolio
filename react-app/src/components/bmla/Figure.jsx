import { useState } from "react";

// Interactive, themed inline-SVG manipulatives for the lessons — no chart deps.
// Range sliders (keyboard-accessible) drive a live geometric verdict.

const S = 13; // px per unit
const C = 100; // centre
const sx = (x) => C + x * S;
const sy = (y) => C - y * S;
const near = (a, b) => Math.abs(a - b) < 1e-9;

function Board({ children }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[18rem] overflow-hidden rounded-lg bg-ink/50" role="img">
      <g className="text-line" stroke="currentColor" strokeWidth="1">
        <line x1={sx(-7)} y1={sy(0)} x2={sx(7)} y2={sy(0)} />
        <line x1={sx(0)} y1={sy(-7)} x2={sx(0)} y2={sy(7)} />
      </g>
      {children}
    </svg>
  );
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="w-28 shrink-0">{label} <span className="font-mono text-silver">{value}</span></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-1 flex-1 cursor-pointer accent-crimson"
      />
    </label>
  );
}

function lineAcross(m, b) {
  return `${sx(-7)},${sy(-7 * m + b)} ${sx(7)},${sy(7 * m + b)}`;
}

function ThreeOutcomes() {
  const mA = 1, bA = 0; // fixed line: y = x
  const [m, setM] = useState(-1);
  const [b, setB] = useState(2);

  let verdict, vCls, dot = null;
  if (!near(m, mA)) {
    const x = (bA - b) / (m - mA);
    dot = { x, y: m * x + b };
    verdict = "Cross once → one solution";
    vCls = "border-jade/40 bg-jade/10 text-jade-bright";
  } else if (!near(b, bA)) {
    verdict = "Parallel → no solution";
    vCls = "border-crimson/40 bg-crimson/10 text-crimson-bright";
  } else {
    verdict = "Same line → infinitely many";
    vCls = "border-gold/40 bg-gold/10 text-gold";
  }

  return (
    <div className="rounded-xl border border-line/60 bg-ink/40 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Board>
          <polyline points={lineAcross(mA, bA)} className="text-cyan" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <polyline points={lineAcross(m, b)} className="text-crimson-bright" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {dot && Math.abs(dot.x) <= 7 && Math.abs(dot.y) <= 7 && (
            <circle cx={sx(dot.x)} cy={sy(dot.y)} r="4" className="text-gold" fill="currentColor" />
          )}
        </Board>
        <div className="flex-1 space-y-2.5">
          <p className="text-xs text-muted">Fixed line <span className="text-cyan">y = x</span>. Move the <span className="text-crimson-bright">red line</span>:</p>
          <Slider label="slope" value={m} min={-3} max={3} step={0.5} onChange={setM} />
          <Slider label="intercept" value={b} min={-4} max={4} step={1} onChange={setB} />
          <p className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${vCls}`}>{verdict}</p>
        </div>
      </div>
    </div>
  );
}

function SpanLinePlane() {
  const v1 = [2, 1];
  const [vx, setVx] = useState(-1);
  const [vy, setVy] = useState(2);
  const dependent = near(v1[0] * vy - v1[1] * vx, 0);

  return (
    <div className="rounded-xl border border-line/60 bg-ink/40 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Board>
          {dependent ? (
            <polyline points={lineAcross(v1[1] / v1[0], 0)} className="text-gold" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          ) : (
            <polygon
              points={`${sx(0)},${sy(0)} ${sx(v1[0])},${sy(v1[1])} ${sx(v1[0] + vx)},${sy(v1[1] + vy)} ${sx(vx)},${sy(vy)}`}
              className="text-violet"
              fill="currentColor"
              opacity="0.18"
            />
          )}
          <line x1={sx(0)} y1={sy(0)} x2={sx(v1[0])} y2={sy(v1[1])} className="text-crimson-bright" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={sx(0)} y1={sy(0)} x2={sx(vx)} y2={sy(vy)} className="text-cyan" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={sx(v1[0])} cy={sy(v1[1])} r="3" className="text-crimson-bright" fill="currentColor" />
          <circle cx={sx(vx)} cy={sy(vy)} r="3" className="text-cyan" fill="currentColor" />
        </Board>
        <div className="flex-1 space-y-2.5">
          <p className="text-xs text-muted">Fixed <span className="text-crimson-bright">v₁ = (2, 1)</span>. Move <span className="text-cyan">v₂</span>:</p>
          <Slider label="v₂ x" value={vx} min={-4} max={4} step={1} onChange={setVx} />
          <Slider label="v₂ y" value={vy} min={-4} max={4} step={1} onChange={setVy} />
          <p className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${dependent ? "border-gold/40 bg-gold/10 text-gold" : "border-violet/40 bg-violet/10 text-violet-bright"}`}>
            {dependent ? "v₂ is a multiple of v₁ → Span is a line" : "Independent → Span is a plane"}
          </p>
        </div>
      </div>
    </div>
  );
}

function EchelonStairs() {
  const rows = [
    ["p", "*", "*", "*", "*"],
    ["0", "p", "*", "*", "*"],
    ["0", "0", "0", "p", "*"],
    ["0", "0", "0", "0", "0"],
  ];
  return (
    <div className="rounded-xl border border-line/60 bg-ink/40 p-4">
      <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 2rem)" }}>
        {rows.flat().map((c, i) => (
          <span
            key={i}
            className={
              c === "p"
                ? "flex h-8 items-center justify-center rounded-md bg-crimson/80 font-mono text-sm font-bold text-silver"
                : c === "*"
                ? "flex h-8 items-center justify-center rounded-md border border-gold/40 font-mono text-sm text-gold"
                : "flex h-8 items-center justify-center rounded-md border border-line/40 font-mono text-sm text-muted"
            }
          >
            {c === "p" ? "■" : c}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        <span className="text-crimson-bright">■</span> pivot (leading entry) · <span className="text-gold">*</span> any value · the leading entries step down and to the right.
      </p>
    </div>
  );
}

const FIGS = {
  "three-outcomes": ThreeOutcomes,
  "span-line-plane": SpanLinePlane,
  "echelon-stairs": EchelonStairs,
};

export default function Figure({ block }) {
  const Fig = FIGS[block.name];
  if (!Fig) return null;
  return (
    <div>
      <Fig />
      {block.caption && <p className="mt-2 text-xs text-muted">{block.caption}</p>}
    </div>
  );
}
