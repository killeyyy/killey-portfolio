const WORDS = ["AI-FIRST", "CINEMATIC GAMES", "WEB DESIGN", "BRAND CONTENT", "SHIPPED FAST", "KILLEYYY"];

/** Infinite kinetic marquee band (doubled row → seamless loop). Freezes under
 *  reduced-motion (global rule), still legible. */
export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-line/50 bg-surface/20 py-6" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 will-change-transform">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-serif text-fluid-xl font-semibold text-silver/15">
            {w} <span className="text-crimson">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
