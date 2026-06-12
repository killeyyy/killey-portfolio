// Tiny WAAPI confetti — no deps, self-cleaning, reduced-motion safe.
const COLORS = ["#E25C72", "#F2876B", "#DDBC8E", "#7ED4B2", "#B49CE8", "#85B8E3"];

export function confettiBurst() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden";
  document.body.appendChild(host);
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("span");
    const size = 6 + Math.random() * 6;
    piece.style.cssText = `position:absolute;left:50%;top:38%;width:${size}px;height:${size * 0.45}px;background:${COLORS[i % COLORS.length]};border-radius:2px`;
    const angle = Math.random() * 2 * Math.PI;
    const dist = 90 + Math.random() * 240;
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist - 140;
    piece.animate(
      [
        { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + 260}px)) rotate(${360 + Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      { duration: 900 + Math.random() * 600, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "forwards" },
    );
    host.appendChild(piece);
  }
  setTimeout(() => host.remove(), 1800);
}
