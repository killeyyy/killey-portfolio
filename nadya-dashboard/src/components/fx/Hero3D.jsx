import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn.js";

const fine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Gyro tilt is for devices WITHOUT a fine pointer (phones). Android exposes
// deviceorientation freely; iOS requires a permission gesture, so it's
// detected by the presence of requestPermission and politely skipped.
const gyroCapable = () =>
  typeof window !== "undefined" &&
  typeof DeviceOrientationEvent !== "undefined" &&
  typeof DeviceOrientationEvent.requestPermission !== "function" &&
  !window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Deep-3D hero frame: gradient border, pointer-driven tilt (deeper than the
 * standard Tile glow), a specular glare that follows the pointer, and a real
 * perspective + preserve-3d chain so children can float on translateZ planes
 * (use `[transform:translateZ(..)]` on inner layers).
 * Touch and reduced-motion get the static framed card — nothing breaks.
 */
export function Hero3D({ className, innerClassName, children, max = 6 }) {
  const frameRef = useRef(null);
  const glareRef = useRef(null);

  // Phones: the card leans with the device itself. Neutral pose is captured
  // from the first reading so "how she's already holding it" reads as flat.
  useEffect(() => {
    if (!gyroCapable()) return undefined;
    let base = null;
    const onTilt = (e) => {
      if (e.beta == null || e.gamma == null) return;
      if (base === null) base = { beta: e.beta, gamma: e.gamma };
      const el = frameRef.current;
      if (!el) return;
      const dx = Math.max(-18, Math.min(18, e.beta - base.beta)) / 18;
      const dy = Math.max(-18, Math.min(18, e.gamma - base.gamma)) / 18;
      // the 200ms transform transition smooths the 60Hz stream
      el.style.transform = `rotateX(${(-dx * max * 0.7).toFixed(2)}deg) rotateY(${(dy * max * 0.7).toFixed(2)}deg)`;
    };
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [max]);

  const onMove = (e) => {
    if (!fine()) return;
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateX(${(-(py - 0.5) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg)`;
    const g = glareRef.current;
    if (g) {
      g.style.opacity = "1";
      g.style.background = `radial-gradient(300px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgb(255 255 255 / 0.10), transparent 60%)`;
    }
  };

  const onLeave = () => {
    if (frameRef.current) frameRef.current.style.transform = "";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div className={cn("[perspective:900px]", className)}>
      <div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={cn(
          "relative rounded-2xl bg-gradient-to-br from-rose/60 via-line/50 to-coral/45 p-px",
          "shadow-[0_24px_60px_-24px_rgb(0_0_0/0.7)]",
          "transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d]",
        )}
      >
        <div
          className={cn(
            "rounded-[15px] bg-surface p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] [transform-style:preserve-3d]",
            innerClassName,
          )}
        >
          {children}
        </div>
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
