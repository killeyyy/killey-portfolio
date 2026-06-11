import { useRef } from "react";
import { m, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion.js";

/**
 * 3D pointer-tilt card with a moving gold sheen. Transform/opacity only.
 * No-op under reduced-motion. docs/PLAYBOOK.md Recipe 3.3.
 */
export default function Tilt({ children, className, max = 10, sheen = true }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, [0, 1], ["0%", "100%"]);
  const gy = useTransform(py, [0, 1], ["0%", "100%"]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(201,168,106,0.22), transparent 55%)`;

  function onMove(e) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{
          rotateX: reduced ? 0 : rx,
          rotateY: reduced ? 0 : ry,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative h-full w-full"
      >
        {children}
        {sheen && !reduced && (
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style={{ background: sheenBg }}
          />
        )}
      </m.div>
    </div>
  );
}
