/** Zero-JS hero background: garnet→crimson glow on ink + film grain.
 *  Always rendered (first paint / reduced-motion / no-WebGL fallback). */
export default function StaticHero() {
  return (
    <div
      aria-hidden="true"
      className="grain absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 55% at 50% 0%, rgba(200,50,60,0.20), transparent 70%)," +
          "radial-gradient(45% 45% at 82% 25%, rgba(123,30,43,0.26), transparent 70%)," +
          "#0E0E10",
      }}
    />
  );
}
