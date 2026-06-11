import { useId, useState } from "react";
import { breakEven } from "../../../lib/bmla/finance.js";
import { fmt } from "../../../lib/bmla/linalg.js";

const W = 320;
const H = 180;
const PAD = 28;

/** Live break-even chart: drag the sliders, watch the crossover move. */
export default function BreakEven() {
  const [fixed, setFixed] = useState(1200);
  const [price, setPrice] = useState(20);
  const [unitCost, setUnitCost] = useState(8);
  const uid = useId();

  const q = breakEven(fixed, price, unitCost);
  const qMax = Math.max(q ? q * 2 : 200, 50);
  const yMax = Math.max(price * qMax, fixed + unitCost * qMax) * 1.05;
  const x = (qq) => PAD + (qq / qMax) * (W - PAD - 8);
  const y = (v) => H - PAD + ((PAD + 8 - H) * v) / yMax;

  const sliders = [
    { label: "Fixed cost (F)", value: fixed, set: setFixed, min: 0, max: 5000, step: 50, color: "accent-gold" },
    { label: "Price / unit (p)", value: price, set: setPrice, min: 1, max: 60, step: 1, color: "accent-crimson" },
    { label: "Cost / unit (v)", value: unitCost, set: setUnitCost, min: 0, max: 59, step: 1, color: "accent-cyan" },
  ];

  return (
    <div className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Interactive · Break-even explorer</p>
      <p className="mb-4 text-sm text-muted">Revenue line vs total-cost line. Where they cross, profit starts.</p>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={q ? `Break-even at ${Math.ceil(q)} units` : "No break-even — price below unit cost"} className="w-full max-w-md">
          <line x1={PAD} y1={H - PAD} x2={W - 4} y2={H - PAD} stroke="rgb(255 255 255 / 0.15)" />
          <line x1={PAD} y1={H - PAD} x2={PAD} y2={6} stroke="rgb(255 255 255 / 0.15)" />
          {/* cost line */}
          <line x1={x(0)} y1={y(fixed)} x2={x(qMax)} y2={y(fixed + unitCost * qMax)} stroke="#22D3EE" strokeWidth="2" />
          {/* revenue line */}
          <line x1={x(0)} y1={y(0)} x2={x(qMax)} y2={y(price * qMax)} stroke="#F0566A" strokeWidth="2" />
          {q !== null && (
            <>
              <line x1={x(q)} y1={H - PAD} x2={x(q)} y2={y(price * q)} stroke="#C9A86A" strokeDasharray="4 3" />
              <circle cx={x(q)} cy={y(price * q)} r="4.5" fill="#C9A86A" />
              <text x={Math.min(x(q) + 6, W - 70)} y={y(price * q) - 8} fill="#E8E6E1" fontSize="10" fontFamily="monospace">
                q* = {fmt(Math.ceil(q))}
              </text>
            </>
          )}
          <text x={W - 64} y={y(price * qMax) + 12} fill="#F0566A" fontSize="9" fontFamily="monospace">revenue</text>
          <text x={W - 44} y={y(fixed + unitCost * qMax) - 6} fill="#22D3EE" fontSize="9" fontFamily="monospace">cost</text>
        </svg>

        <div className="min-w-[14rem] space-y-4">
          {sliders.map((s) => (
            <label key={s.label} htmlFor={`${uid}-${s.label}`} className="block">
              <span className="flex items-center justify-between font-mono text-xs text-muted">
                {s.label} <span className="text-silver">{s.value}</span>
              </span>
              <input
                id={`${uid}-${s.label}`}
                type="range"
                min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className={`mt-1 w-full ${s.color}`}
              />
            </label>
          ))}
          <p className="rounded-lg border border-gold/30 bg-gold/10 p-3 font-mono text-xs text-gold" aria-live="polite">
            {q === null
              ? "p ≤ v → margin ≤ 0, no break-even."
              : `q* = F ÷ (p − v) = ${fixed} ÷ ${price - unitCost} = ${fmt(q)} units`}
          </p>
        </div>
      </div>
    </div>
  );
}
