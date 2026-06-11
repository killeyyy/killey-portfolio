/** @type {import('tailwindcss').Config} */
// Design tokens map to CSS variables defined in src/index.css so the whole
// palette can be tuned in one place. Colors use the <alpha-value> syntax so
// Tailwind opacity utilities (e.g. text-silver/70) work against the variables.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--c-ink) / <alpha-value>)", // base background (#0E0E10)
        surface: "rgb(var(--c-surface) / <alpha-value>)", // cards (#17171B)
        surface2: "rgb(var(--c-surface-2) / <alpha-value>)", // raised (#1F1F24)
        line: "rgb(var(--c-line) / <alpha-value>)", // hairline borders
        silver: "rgb(var(--c-silver) / <alpha-value>)", // primary text (#E8E6E1)
        muted: "rgb(var(--c-muted) / <alpha-value>)", // secondary text (#A7A29A)
        garnet: "rgb(var(--c-garnet) / <alpha-value>)", // deep accent (#7B1E2B)
        crimson: "rgb(var(--c-crimson) / <alpha-value>)", // lead accent (#C8323C)
        jade: "rgb(var(--c-jade) / <alpha-value>)", // restrained "live" accent (#1F6F5C)
        gold: "rgb(var(--c-gold) / <alpha-value>)", // champagne metallic detail (#C9A86A)
        plum: "rgb(var(--c-plum) / <alpha-value>)", // jewel accent (#8B4AA8)
        azure: "rgb(var(--c-azure) / <alpha-value>)", // jewel accent (#3882C4)
        "crimson-bright": "rgb(var(--c-crimson-bright) / <alpha-value>)",
        "jade-bright": "rgb(var(--c-jade-bright) / <alpha-value>)",
        violet: "rgb(var(--c-violet) / <alpha-value>)",
        "violet-bright": "rgb(var(--c-violet-bright) / <alpha-value>)",
        cyan: "rgb(var(--c-cyan) / <alpha-value>)",
        magenta: "rgb(var(--c-magenta) / <alpha-value>)",
        amber: "rgb(var(--c-amber) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // fluid type scale (mobile → desktop)
        "fluid-sm": "clamp(0.875rem, 0.84rem + 0.18vw, 1rem)",
        "fluid-base": "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
        "fluid-lg": "clamp(1.25rem, 1.1rem + 0.7vw, 1.6rem)",
        "fluid-xl": "clamp(1.7rem, 1.3rem + 2vw, 2.75rem)",
        "fluid-2xl": "clamp(2.4rem, 1.6rem + 4vw, 4.5rem)",
        "fluid-hero": "clamp(3rem, 1.5rem + 9vw, 9rem)",
      },
      maxWidth: { content: "72rem" },
      borderRadius: { xl2: "1.25rem" },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
