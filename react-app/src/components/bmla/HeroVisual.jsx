/**
 * Hero cover slot for /bmla.
 *
 * When `src` is set (e.g. a Higgsfield-generated image URL or an imported
 * asset), it renders that cover art. Otherwise it falls back to an on-brand
 * linear-algebra motif — vectors on a grid — so the slot always looks
 * intentional, with or without generated art. Rendered desktop-only by the
 * caller to keep the mobile hero focused.
 */
const GRID = Array.from({ length: 7 }, (_, i) => 28 + i * 24); // grid line offsets

// Vectors drawn from the origin, in brand accents (on-theme for linear algebra).
const ORIGIN = { x: 44, y: 196 };
const VECTORS = [
  { x: 158, y: 120, color: "rgb(var(--c-crimson-bright))", head: "ah-crimson" },
  { x: 120, y: 70, color: "rgb(var(--c-cyan))", head: "ah-cyan" },
  { x: 176, y: 58, color: "rgb(var(--c-gold))", head: "ah-gold" },
];

export default function HeroVisual({ src, alt = "" }) {
  return (
    <div className="border-gradient relative aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-surface/40">
      <div aria-hidden="true" className="aurora absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="grain absolute inset-0" />

      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 220 270"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            {VECTORS.map((v) => (
              <marker key={v.head} id={v.head} markerWidth="9" markerHeight="9" refX="5.5" refY="4" orient="auto">
                <path d="M0,0 L7,4 L0,8 Z" fill={v.color} />
              </marker>
            ))}
          </defs>

          {/* grid */}
          <g stroke="rgb(var(--c-line))" strokeWidth="0.5" opacity="0.45">
            {GRID.map((x) => (
              <line key={`v${x}`} x1={x} y1="20" x2={x} y2="250" />
            ))}
            {GRID.map((y) => (
              <line key={`h${y}`} x1="20" y1={y + 6} x2="208" y2={y + 6} />
            ))}
          </g>

          {/* axes */}
          <line x1="20" y1={ORIGIN.y} x2="208" y2={ORIGIN.y} stroke="rgb(var(--c-muted))" strokeWidth="0.75" opacity="0.4" />
          <line x1={ORIGIN.x} y1="246" x2={ORIGIN.x} y2="28" stroke="rgb(var(--c-muted))" strokeWidth="0.75" opacity="0.4" />

          {/* vectors */}
          {VECTORS.map((v) => (
            <line
              key={v.head}
              x1={ORIGIN.x}
              y1={ORIGIN.y}
              x2={v.x}
              y2={v.y}
              stroke={v.color}
              strokeWidth="2.25"
              strokeLinecap="round"
              markerEnd={`url(#${v.head})`}
            />
          ))}
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r="3" fill="rgb(var(--c-silver))" />

          {/* on-theme caption */}
          <text x="20" y="262" fill="rgb(var(--c-muted))" fontSize="9" fontFamily="monospace" letterSpacing="1.5">
            A v = λ v
          </text>
        </svg>
      )}

      {/* depth vignette so text/CTAs stay legible against the panel edge */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
    </div>
  );
}
