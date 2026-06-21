import { useEffect, useState } from "react";

/** Cinematic preloader: oversized counter 0→100 over ink, then a curtain wipe.
 *  Shows once per session. Pure CSS transition (no framer-motion) so it can never
 *  block first paint, and respects prefers-reduced-motion. */
export default function Preloader() {
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("preloaded") === "1",
  );
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (done) return;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPct(100);
      const t = setTimeout(finish, 200);
      return () => clearTimeout(t);
    }
    let raf;
    let cur = 0;
    const tick = () => {
      cur += Math.max(1, (100 - cur) * 0.04);
      if (cur >= 100) {
        setPct(100);
        setTimeout(finish, 350);
        return;
      }
      setPct(Math.round(cur));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    sessionStorage.setItem("preloaded", "1");
    setLeaving(true);
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => setDone(true), reduced ? 0 : 750);
  }

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
      style={{ transform: leaving ? "translateY(-100%)" : "translateY(0)" }}
    >
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-gold">KILLEYYY</p>
      <p className="font-serif text-[18vw] font-semibold leading-none text-silver md:text-[10vw]">
        {pct}
        <span className="text-crimson">%</span>
      </p>
      <div className="mt-6 h-px w-56 overflow-hidden bg-silver/15">
        <div
          className="h-full bg-gradient-to-r from-crimson to-gold transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
