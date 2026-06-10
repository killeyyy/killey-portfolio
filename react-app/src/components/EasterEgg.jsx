import { useEffect, useState } from "react";

const SEQ = "killey";
const COLORS = ["#C8323C", "#C9A86A", "#7C5CFF", "#22D3EE", "#FF4FD8", "#34D399"];

/**
 * Hidden delight: type "killey" anywhere (outside inputs) and the brand
 * explodes in confetti from the center of the screen. Reduced-motion users
 * get the toast only. Pure WAAPI — no deps, cleans itself up.
 */
export default function EasterEgg() {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        buffer = "";
        return;
      }
      if (!/^[a-z]$/i.test(e.key)) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SEQ.length);
      if (buffer === SEQ) {
        buffer = "";
        fire();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fire() {
    setToast(true);
    setTimeout(() => setToast(false), 2600);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:105;overflow:hidden";
    document.body.appendChild(host);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 48; i++) {
      const p = document.createElement("span");
      const size = 5 + Math.random() * 9;
      p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${COLORS[i % COLORS.length]}`;
      host.appendChild(p);
      const angle = (i / 48) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 140 + Math.random() * Math.min(cx, cy) * 0.9;
      p.animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * dist - 50}px, ${Math.sin(angle) * dist + 60 - 50}px) rotate(${360 + Math.random() * 360}deg)`,
            opacity: 0,
          },
        ],
        { duration: 900 + Math.random() * 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    }
    setTimeout(() => host.remove(), 1800);
  }

  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[106] -translate-x-1/2 rounded-full border border-gold/40 bg-surface/95 px-5 py-2.5 text-sm text-gold shadow-lg backdrop-blur"
    >
      🔥 KILLEYYY mode — you found it.
    </div>
  );
}
