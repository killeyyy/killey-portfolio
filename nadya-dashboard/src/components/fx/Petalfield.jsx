// Drifting rose petals across the whole app — eight tiny CSS shapes falling
// glacially behind the content. Deterministic placement (no render churn),
// pointer-events-none, and gone entirely under prefers-reduced-motion
// (the .petal class hides itself in index.css).
const frac = (n) => n - Math.floor(n);

const PETALS = [...Array(8)].map((_, i) => {
  const a = frac(i * 0.618034 + 0.17);
  const b = frac(i * 0.414214 + 0.43);
  const c = frac(i * 0.732051 + 0.71);
  return {
    left: `${4 + a * 92}%`,
    size: 7 + Math.round(b * 6), // 7–13px
    duration: 26 + Math.round(c * 22), // 26–48s per fall
    delay: -Math.round(a * 40), // negative: the sky is already falling
    drift: `${(b - 0.5) * 16}vw`,
    opacity: 0.25 + c * 0.3,
  };
});

export function Petalfield() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--petal-x": p.drift,
            "--petal-o": p.opacity,
          }}
        />
      ))}
    </div>
  );
}
