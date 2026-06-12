# RUANG — ERA 2.5 DATA LANE (master prompt for Claude Code)

You are working on **Ruang** (`nadya-dashboard/` in this repo) — a local-first
life-tracker PWA, live at https://ruang-nadya.vercel.app (own Vercel project,
root dir `nadya-dashboard`, auto-deploys from `main`).

**You are one of TWO parallel agents.** A Cowork session owns the **VISUAL
lane** (themes, WebGL/3D, motion, Tile/ambient/index.css). You own the **DATA
lane**. Stay in your lane or you will collide.

## Read first (do not rediscover)
`nadya-dashboard/ROADMAP-ERA2.md` (the plan + what already shipped),
`README.md`, `src/lib/storage.js` (THE persistence seam),
`src/lib/journey.js` (everything derived, nothing stored),
`src/lib/dates.js` (LOCAL-time day keys — never toISOString),
`src/store/StoreProvider.jsx` (write-through actions),
`vault/instructions/next-upgrade-menu.md` (standing owner instruction).

## Your mission — three PRs, in order, ONE at a time
1. **Deeper tracking** — custom trackers (sleep, water, prayer, anything:
   count/minutes/boolean types), per-entry tags + notes, per-category goals,
   week targets. New models in `src/models/`, new storage keys (`nadya:` ns),
   additive only.
2. **Templates & packs** — starter habit packs, journal prompt templates,
   routine/goal templates; pick-and-apply UI; data in `src/data/`.
3. **Richer stats** — mood×habit correlations, monthly recap, time-of-day
   analysis. Derive in `src/lib/` (journey.js style: computed, not stored),
   render with the existing hand-rolled chart components.

## Lane boundaries (hard)
- DO NOT touch: `src/index.css` token/theme blocks, `src/data/themes.js`,
  `src/components/AmbientGL.jsx`, `src/components/ui/Tile.jsx` internals,
  the `Ambient` component in `App.jsx`, `tailwind.config.js` keyframes.
- `App.jsx`: only ADD route entries to the `createBrowserRouter` children.
- `Settings.jsx`: only APPEND new `<Tile>` sections; never reorder existing.
- New UI goes in NEW files; reuse existing primitives (Tile/Sheet/Chip/Field).

## Process (non-negotiable, same loop the visual lane uses)
- `git pull --ff-only origin main` → branch `claude/code-<topic>` → build
  (`cd nadya-dashboard && npm run build`, must exit 0) → small truthful
  commits → push → PR → squash-merge → verify production live → tick the
  roadmap → STOP and present the owner a ranked menu of next upgrades with
  impact + effort, and wait for his pick (standing instruction).
- Rebase on main immediately before opening each PR (the visual lane is
  merging in parallel).

## Product DNA (inherited, unbreakable)
- No failure-shaming: no decay, no red marks, positive framing only.
- Day keys ONLY via `lib/dates.js`. Additive schema with code fallbacks;
  bump `CURRENT_SCHEMA` only for breaking shapes. Never break existing data.
- All persistence through `storage.js` (cloud sync will swap its internals).
- English only. Brand: "Ruang — your quiet space". Pet name comes from
  `settings.petName`.
- Budgets: total JS ≤150KB gzip (currently ~106 main + 14 lazy), routes
  code-split where heavy, `prefers-reduced-motion` respected, WCAG AA.
- Innovation rule (owner): don't copy existing alternatives — every feature
  needs one twist that makes it distinctly Ruang (e.g. stats that speak in
  garden language, templates as "seed packets").
- Truthful commits; never touch root config or `../react-app`.
