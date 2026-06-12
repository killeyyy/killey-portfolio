# Petalfall — a quiet space to grow

A local-first life tracker: activities, habits, custom trackers, money,
journal — and a journey layer where your real days grow a living 3D garden
(XP, levels, weekly "wishes", achievements, a nameable streak plant, a
Spotify-style weekly Wrapped). Live at
[ruang-nadya.vercel.app](https://ruang-nadya.vercel.app) · landing at
`/welcome` · privacy at `/privacy`.

Design rule inherited from the original brief: **progress always feels fun
and rewarding — the app never frames anything as failure.** No decay
mechanics, no red marks, positive-only insights, ungranted wishes simply
fade when the week turns.

## Run / build / test

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (must exit 0 before merge)
npm run preview    # smoke-test the production build
npm run test:data  # node logic suites (no browser, no test deps)
```

Deployed as its own Vercel project (root directory `nadya-dashboard`);
pushes to `main` auto-deploy. This folder is self-contained — it shares
nothing with the portfolio app in `../react-app`.

## Architecture

- **Stack**: Vite 5 · React 18 · Tailwind 3.4 · react-router 6 (data router
  + View Transitions) · lucide-react · `ogl` (tree-shaken, lazy) for the two
  WebGL moments (ambient aurora, 3D garden). Charts, motion and the Hero3D
  depth scenes are hand-rolled (SVG/CSS/WAAPI). Installable PWA.
- **Data**: namespaced `localStorage` (`nadya:*`). Activities are
  month-sharded (`nadya:act:YYYY-MM`); everything else single-key:
  `settings` · `categories` (with optional `weeklyTarget`) · `habits` +
  `habitLog` · `trackers` + `trackerLog` (Tend) · `savings` (entries carry
  `kind: save|income|expense`; no kind = save) · `journal` · `wishes`
  (granted weekly quests, append-only).
- **The seam**: `src/lib/storage.js` is the single persistence layer. Cloud
  sync (`src/lib/cloud/sync.js`) rides a write hook on it — persisted dirty
  map → debounced batch upsert to a Supabase KV table (RLS owner-only,
  server-side last-write-wins), per-key LWW pull on boot/sign-in, tombstoned
  deletions, lossless first merge via `migrated:*` snapshots. localStorage
  stays the source of truth; guests sync nothing. Auth is a hand-rolled
  GoTrue email-OTP client (`src/lib/cloud/auth.js`). Setup/runbook:
  `docs/CLOUD-SETUP.md`.
- **Day keys are LOCAL time only**, always via `src/lib/dates.js` — never
  `toISOString()` (UTC would shift days for UTC+7 users).
- **Schema**: versioned via `nadya:meta.schemaVersion` + `src/lib/migrations.js`,
  but prefer additive optional fields with code fallbacks over version bumps.
- **Derived, not stored**: `journey.js` (XP/levels/streak/achievements/garden),
  `quests.js` (weekly wishes seeded by week-start key), `wrapped.js`,
  `insights.js`, `correlations.js` (mood×habit links — positive-only by
  construction), `tend.js`, `seeds.js` (plantable packs). Retroactive by design.
- **Backup**: Settings → Export downloads one JSON; Import (replace mode)
  restores it. Device-local keys are excluded by the whitelist: `timer`,
  `journeySeen`, `wishesSeen`, `onboarded`, `session`, `syncDirty`,
  `syncMeta`, `migrated:*`.
- **Pro**: `src/data/pro.js` holds price/perks/`checkoutUrl`; the pricing
  section on `/welcome` switches to a live buy button when the URL is set.

## Testing

`tests/*.test.mjs` — pure-logic node suites run by `npm run test:data`
(localStorage shim + scripted `fetch`, importing source ES modules directly):
tend (trackers/tags/intentions) · quests (wish determinism + progress) ·
packs (every packet plantable as written) · correlations (sample gates,
positive-only rule, time buckets) · cloud (auth offline rules) · money
(kind splits, ring immunity) · sync (dirty durability, LWW, tombstones,
lossless first merge, hostile-key protection).

## Conventions

- Mobile-first; desktop gets the sidebar shell at `lg:` and the pointer-3D
  layer (Hero3D tilt/glare, magnetism) on fine pointers only.
- `prefers-reduced-motion` is honored globally (CSS kill switch) and every
  JS-driven effect checks it explicitly; WebGL never mounts under it.
- Budget: total JS ≤ 150KB gzip (currently ~119 main + lazy chunks for
  WebGL/auth/sync/landing). Animate `transform`/`opacity` only.
- Tailwind tokens map to CSS variables in `src/index.css`; four themes via
  `data-theme`. Fonts: Baloo 2 (display) + Figtree (UI).
- Truthful content only — no fabricated stats, ever.
