import { useRef } from "react";

const fine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pointer magnetism for desktop buttons: the element drifts a few px toward
 * the pointer while hovered and springs back on leave. Touch and
 * reduced-motion get nothing. Pair with a transition-transform class.
 */
export function useMagnetic(max = 7) {
  const ref = useRef(null);
  const onPointerMove = (e) => {
    if (!fine()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate(${(x * max).toFixed(1)}px, ${(y * max).toFixed(1)}px)`;
  };
  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return { ref, onPointerMove, onPointerLeave };
}
