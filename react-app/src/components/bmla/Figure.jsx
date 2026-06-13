// Lightweight, themed inline-SVG diagrams for the lessons — no chart deps.
// Each figure is schematic (concept-first), colour-coded to the palette.

function Axes() {
  return (
    <g className="text-line" stroke="currentColor" strokeWidth="1">
      <line x1="12" y1="8" x2="12" y2="80" />
      <line x1="12" y1="80" x2="84" y2="80" />
    </g>
  );
}

function Panel({ children, label, sub }) {
  return (
    <figure className="flex-1">
      <svg viewBox="0 0 92 92" className="w-full" role="img" aria-label={`${label}: ${sub}`}>
        <Axes />
        {children}
      </svg>
      <figcaption className="mt-1 text-center">
        <span className="block text-xs font-medium text-silver">{label}</span>
        <span className="block text-[11px] text-muted">{sub}</span>
      </figcaption>
    </figure>
  );
}

function ThreeOutcomes() {
  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-line/60 bg-ink/40 p-4 sm:flex-nowrap">
      <Panel label="Cross once" sub="one solution">
        <line x1="16" y1="70" x2="78" y2="22" className="text-crimson-bright" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="26" x2="78" y2="72" className="text-cyan" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="47" cy="47" r="3.6" className="text-gold" fill="currentColor" />
      </Panel>
      <Panel label="Parallel" sub="no solution">
        <line x1="16" y1="62" x2="78" y2="22" className="text-crimson-bright" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="76" x2="78" y2="36" className="text-cyan" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </Panel>
      <Panel label="Same line" sub="infinitely many">
        <line x1="16" y1="68" x2="78" y2="26" className="text-gold" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
        <line x1="16" y1="68" x2="78" y2="26" className="text-crimson-bright" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" strokeLinecap="round" />
      </Panel>
    </div>
  );
}

function SpanLinePlane() {
  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-line/60 bg-ink/40 p-4 sm:flex-nowrap">
      <Panel label="Span{v}" sub="a line through 0">
        <line x1="6" y1="84" x2="86" y2="20" className="text-gold" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
        <line x1="46" y1="52" x2="70" y2="33" className="text-crimson-bright" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="46" cy="52" r="2.6" className="text-silver" fill="currentColor" />
      </Panel>
      <Panel label="Span{v₁,v₂}" sub="a plane through 0">
        <polygon points="46,52 74,40 60,22 32,34" className="text-violet" fill="currentColor" opacity="0.18" />
        <line x1="46" y1="52" x2="72" y2="40" className="text-crimson-bright" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="46" y1="52" x2="58" y2="26" className="text-cyan" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="46" cy="52" r="2.6" className="text-silver" fill="currentColor" />
      </Panel>
    </div>
  );
}

function EchelonStairs() {
  // ■ = pivot (leading entry), * = any value, 0 = zero. A descending staircase.
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
      {block.caption && <p className="mt-2 text-center text-xs text-muted">{block.caption}</p>}
    </div>
  );
}
