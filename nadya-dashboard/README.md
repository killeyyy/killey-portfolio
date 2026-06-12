# Ruang Nadya 🌹

A personal life companion built as a gift — activity tracking, habits, savings,
journaling, and a gamified "journey" layer (XP, levels, achievements, a streak
pet named Mawar, and a weekly Wrapped story). Live at
[ruang-nadya.vercel.app](https://ruang-nadya.vercel.app).

Design rule inherited from its owner's brief: **progress always feels fun and
rewarding — the app never frames anything as failure.** No decay mechanics,
no red marks, positive-only insights.

## Run / build

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (must exit 0 before merge)
npm run preview  # smoke-test the production build
```

Deployed as its own Vercel project (root directory `nadya-dashboard`); pushes
to `main` auto-deploy. This folder is self-contained — it shares nothing with
the portfolio app in `../react-app`.

## Architecture

- **Stack**: Vite 5 · React 18 · Tailwind 3.4 · react-router 6 · lucide-react.
  No chart libraries (hand-rolled SVG/div charts), no animation libraries
  (CSS keyframes + WAAPI), installable PWA via `vite-plugin-pwa`.
- **Data**: everything lives in namespaced `localStorage` (`nadya:*`).
  Activities are month-sharded (`nadya:act:YYYY-MM`); everything else is
  single-key. `src/lib/storage.js` is the single persistence seam — cloud sync
  could replace its internals without touching callers.
- **Day keys are LOCAL time only**, always via `src/lib/dates.js` — never
  `toISOString()` (UTC would shift days for UTC+7).
- **Schema**: versioned via `nadya:meta.schemaVersion` + `src/lib/migrations.js`.
  Prefer additive optional fields with code fallbacks over version bumps.
- **Journey layer** (`src/lib/journey.js`): XP/levels/streak/achievements are
  *derived* from existing data on the fly — retroactive, nothing extra stored.
  Wrapped (`src/lib/wrapped.js`) derives the last complete week the same way.
- **Backup**: Settings → Export downloads a single JSON; Import (replace mode)
  restores it. `nadya:timer`, `nadya:journeySeen`, `nadya:onboarded` are
  device-local UX state and intentionally excluded.

## Testing

Pure-logic node tests live outside the bundle (no test deps in the app):
date math, sharding, migrations, backup round-trip, journey XP/streaks,
insights, Wrapped week boundaries. They shim `localStorage` and import the
source ES modules directly.

## Conventions

- Mobile-first; desktop gets the sidebar shell at `lg:`.
- `prefers-reduced-motion` is honored globally (CSS kill switch) and JS
  auto-advance/count-ups check it explicitly.
- Tailwind tokens map to CSS variables in `src/index.css` — tune the whole
  palette there. Fonts: Baloo 2 (display) + Figtree (UI).
