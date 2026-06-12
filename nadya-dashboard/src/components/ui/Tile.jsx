import { useRef } from "react";
import { cn } from "../../lib/cn.js";

const fine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Pointer-driven 3D tilt for hero cards (≤2.2°, GPU-composited).
 * Desktop fine-pointers only; reduced motion and touch get nothing.
 * The 200ms transform transition doubles as smoothing.
 */
function useTilt(max = 2.2) {
  const ref = useRef(null);
  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || !fine()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-2px)`;
  };
  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return { ref, onPointerMove, onPointerLeave };
}

/**
 * Card shell; optional display-font title + right-side action.
 * `glow` wraps it in a 1px rose→coral gradient frame with an inset top
 * highlight, layered depth shadow and a desktop pointer tilt — heroes only.
 */
export function Tile({ title, action, children, className, glow = false }) {
  const tilt = useTilt();
  const body = (
    <section
      className={cn(
        glow
          ? "rounded-[15px] bg-surface p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
          : "surface-depth rounded-2xl border border-line/70 bg-surface p-4",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="font-serif text-base font-bold text-cream">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );

  if (!glow) return body;
  return (
    <div
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className={cn(
        "rounded-2xl bg-gradient-to-br from-rose/40 via-line/60 to-coral/30 p-px",
        "shadow-[0_16px_40px_-20px_rgb(0_0_0/0.6)]",
        "transition-transform duration-200 ease-out will-change-transform",
      )}
    >
      {body}
    </div>
  );
}
