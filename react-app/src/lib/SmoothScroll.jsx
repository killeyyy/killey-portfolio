import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion.js";

/** Weighted, physics-based smooth scroll (award-site feel). Disabled under
 *  prefers-reduced-motion; keyboard/anchor scrolling still works natively. */
export default function SmoothScroll({ children }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);
  return children;
}
