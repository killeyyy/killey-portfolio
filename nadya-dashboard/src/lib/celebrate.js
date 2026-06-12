// Celebration helpers beyond confetti: haptics + the full-screen level-up moment.
import { confettiBurst } from "./confetti.js";

/** Tiny haptic tick — free delight on Android, silently ignored elsewhere. */
export function buzz(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* noop */
  }
}

/**
 * 2.2s full-screen level-up moment: radial rose glow + a display card that
 * springs in, plus petal confetti. Returns false under reduced motion so the
 * caller can fall back to a toast.
 */
export function levelUpMoment(title, sub) {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const host = document.createElement("div");
  host.className = "fixed inset-0 z-[90] grid place-items-center pointer-events-none animate-fade-in";
  host.style.background =
    "radial-gradient(circle at 50% 45%, rgb(226 92 114 / 0.28), rgb(15 11 13 / 0.65) 70%)";

  const card = document.createElement("div");
  card.className =
    "animate-spring-in rounded-3xl border border-rose/40 bg-surface2 px-8 py-6 text-center shadow-2xl shadow-ink/70";
  card.innerHTML = `
    <p class="font-serif text-3xl font-bold text-gradient-warm">${title}</p>
    ${sub ? `<p class="mt-1 font-serif text-lg font-semibold text-cream">${sub}</p>` : ""}
    <p class="mt-2 text-xs text-muted">keep blooming 🌹</p>`;
  host.appendChild(card);
  document.body.appendChild(host);

  confettiBurst();
  buzz(30);
  setTimeout(() => {
    host.style.transition = "opacity 300ms ease-out";
    host.style.opacity = "0";
    setTimeout(() => host.remove(), 320);
  }, 2200);
  return true;
}
