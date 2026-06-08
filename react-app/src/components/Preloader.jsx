import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "../lib/useReducedMotion.js";

/** Cinematic preloader: oversized counter 0→100 over ink, then a curtain wipe.
 *  Shows once per session. Reduced-motion → instant short fade. */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(() =>
    typeof window !== "undefined" && sessionStorage.getItem("preloaded") === "1",
  );
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (done) return;
    if (reduced) {
      setPct(100);
      const t = setTimeout(finish, 250);
      return () => clearTimeout(t);
    }
    let raf;
    let cur = 0;
    const tick = () => {
      cur += Math.max(1, (100 - cur) * 0.04);
      if (cur >= 100) {
        cur = 100;
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
    setDone(true);
  }

  return (
    <AnimatePresence>
      {!done && (
        <m.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-gold">KILLEYYY</p>
          <p className="font-serif text-[18vw] font-semibold leading-none text-silver md:text-[10vw]">
            {pct}
            <span className="text-crimson">%</span>
          </p>
          <div className="mt-6 h-px w-56 overflow-hidden bg-white/10">
            <div className="h-full bg-gradient-to-r from-crimson to-gold transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
