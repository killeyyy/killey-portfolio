/** @type {import('tailwindcss').Config} */
// Design tokens map to CSS variables defined in src/index.css so the whole
// palette can be tuned in one place. Colors use the <alpha-value> syntax so
// Tailwind opacity utilities (e.g. text-rose/70) work against the variables.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Lora", "ui-serif", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
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
        pop: {
          "0%": { transform: "scale(0.9)" },
          "60%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "sheet-up": "sheet-up 240ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 180ms ease-out both",
        "toast-in": "toast-in 200ms ease-out both",
        pop: "pop 200ms ease-out",
      },
    },
  },
  plugins: [],
};
