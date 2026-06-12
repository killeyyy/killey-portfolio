/** @type {import('tailwindcss').Config} */
// Design tokens map to CSS variables defined in src/index.css so the whole
// palette can be tuned in one place. Colors use the <alpha-value> syntax so
// Tailwind opacity utilities (e.g. text-rose/70) work against the variables.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Gate every hover: variant behind @media (hover:hover) — kills sticky
  // hover states flashing on touch screens.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--c-ink) / <alpha-value>)", // base background (#0F0B0D)
        surface: "rgb(var(--c-surface) / <alpha-value>)", // cards (#181216)
        surface2: "rgb(var(--c-surface-2) / <alpha-value>)", // raised/sheets (#221A20)
        line: "rgb(var(--c-line) / <alpha-value>)", // hairline borders (#322630)
        cream: "rgb(var(--c-cream) / <alpha-value>)", // primary text (#F4EDEA)
        muted: "rgb(var(--c-muted) / <alpha-value>)", // secondary text (#A9989F)
        rose: "rgb(var(--c-rose) / <alpha-value>)", // lead accent (#E25C72)
        "rose-bright": "rgb(var(--c-rose-bright) / <alpha-value>)", // rose as text on ink (#F78DA3)
        coral: "rgb(var(--c-coral) / <alpha-value>)", // secondary warm accent (#F2876B)
        sand: "rgb(var(--c-sand) / <alpha-value>)", // savings/money accent (#DDBC8E)
        mint: "rgb(var(--c-mint) / <alpha-value>)", // success accent (#7ED4B2)
        sky: "rgb(var(--c-sky) / <alpha-value>)", // category color (#85B8E3)
        lavender: "rgb(var(--c-lavender) / <alpha-value>)", // category color (#B49CE8)
        mauve: "rgb(var(--c-mauve) / <alpha-value>)", // category color (#9A7B8C)
      },
      fontFamily: {
        // Nadya's pick (2026-06-12): warm chunky display + friendly UI sans.
        // `serif` intentionally maps to the display font so every existing
        // font-serif heading upgrades in one place.
        sans: ["Figtree", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Baloo 2", "ui-rounded", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
        // Tokens live in index.css; spring is a real linear() damped spring
        // on modern engines, back-out overshoot elsewhere.
        out: "var(--ease-out)",
        spring: "var(--ease-spring)",
      },
      keyframes: {
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // Overshoot comes from the spring easing now, not baked keyframes —
        // simple from→to + var(--ease-spring) reads as physics, not tween.
        pop: {
          from: { transform: "scale(0.85)" },
          to: { transform: "scale(1)" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "translate(-50%, -50%) scale(0.96)" },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        rise: {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        "route-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        halo: {
          "0%": { transform: "scale(1)", opacity: "0.35" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "spring-in": {
          from: { opacity: "0", transform: "scale(0.6)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "sheet-up": "sheet-up 240ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 180ms ease-out both",
        "toast-in": "toast-in 350ms var(--ease-spring) both",
        pop: "pop 350ms var(--ease-spring)",
        "modal-in": "modal-in 300ms var(--ease-spring) both",
        "fade-up": "fade-up 480ms cubic-bezier(0.22,1,0.36,1) both",
        rise: "rise 600ms cubic-bezier(0.22,1,0.36,1) both",
        "route-in": "route-in 240ms cubic-bezier(0.22,1,0.36,1) both",
        halo: "halo 2.6s ease-out infinite",
        "spring-in": "spring-in 500ms var(--ease-spring) both",
      },
    },
  },
  plugins: [],
};
