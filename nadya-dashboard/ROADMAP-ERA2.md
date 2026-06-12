# Ruang — Era 2 roadmap (AAAAA)

From a handmade gift to a product for the masses. Each upgrade is ONE PR:
research → build → test → PR → squash-merge → verify production → report.
Non-negotiables inherited from Era 1: never break Nadya's data, no
failure-shaming, day keys via `lib/dates.js` only, additive schema with
fallbacks, build green before merge, never touch root config or `../react-app`.

**Nadya's install must not regress by one pixel** — a `legacyLove` flag
(auto-set for installs that pre-date the i18n layer) preserves Indonesian
greetings, Mawar's name, and the Rosé theme forever.

## Bundle math (hard gate: ≤150KB gzip JS total, Lighthouse mobile ≥ 90)

| | est. gzip |
|---|---|
| Today (Era 1) | ~90KB |
| Motion (CSS `linear()` springs + tilt + press) | +1–3KB |
| View Transitions (router migration) | +14KB measured (data-router runtime) |
| WebGL ambient (ogl, tree-shaken, **lazy chunk**) | +10–14KB deferred |
| i18n (hand-rolled t(); `id` locale lazy-loaded) | +1–2KB |
| Theming (data-theme palettes + FOUC script) | +1KB |
| Auth+sync (auth-js ~16KB + postgrest-js ~5KB + queue ~3KB, **route-split**) | +8–24KB |
| **Worst case** | **~145KB** ✓ (tight — prefer plain-fetch auth) |

Re-measure with the real build at every PR; sizes above were verified against
bundlephobia/bundlejs June 2026. If auth pushes the budget, drop to plain
`fetch` wrappers around GoTrue/PostgREST REST endpoints (~8KB total).

---

## Phase 1 — Premium motion & depth

### PR 1 · Motion system foundation + pressable physicality
The single highest-leverage premium signal: timing and touch feel.
- Motion tokens in `index.css`: pre-generated CSS `linear()` spring curves
  (Baseline: Chrome 113+/FF 112+/Safari 17.2+; older browsers fall back to
  ease-out), duration scale 120/180/240ms, default easing `ease-out` — never
  `ease-in`. Interaction animations ≤200ms (Vercel/Emil Kowalski guidance).
- Pressability on every control: `:active { transform: scale(0.97) }` at
  ~150ms, pure CSS (within the 100ms perceptual deadline), `touch-action:
  manipulation`, transparent tap-highlight + visible active state.
- Gate ALL hover styles behind `@media (hover: hover) and (pointer: fine)`
  (kills sticky-hover on touch).
- `font-variant-numeric: tabular-nums` on every CountUp/stat (no digit jitter).
- Haptics: `navigator.vibrate(10)` on confirm-class actions (log, tick,
  level-up) — Android-only by design; iOS silently no-ops; Firefox removed it.
- Stagger list entrances 20–40ms/item, entrance only. High-frequency actions
  (quick log, habit tick) get NO new animation — speed IS the premium feel.
- Audit: animate only `transform`/`opacity`; no `transition: all`.
- **Accept:** build green; bundle delta ≤3KB; reduced-motion = opacity-only;
  every tappable surface responds <100ms on a mid-range Android.

### PR 2 · View Transitions — screens morph, not teleport
- Precondition refactor (zero visual change): `<BrowserRouter><Routes>` →
  data router (`createBrowserRouter` + `RouterProvider`). Required because
  `<Link viewTransition>` only works on data routers (react-router ≥6.30).
- Route-level transitions via `viewTransition` on Link/NavLink; replaces the
  keyed `animate-route-in` wrapper. Direction-aware slide for tab order
  (left tab = content slides left — Family's "fly, don't teleport").
- Shared-element morphs via `useViewTransitionState`: Mawar card on Today →
  Journey hero; savings tile → Savings; Wrapped ritual card → story player.
  Few names per transition (every name = a snapshot pair = jank risk).
- Transform/opacity-only group animations (size-interpolating groups run on
  main thread — the low-end-Android stutter source).
- All `view-transition-name` rules inside
  `@media (prefers-reduced-motion: no-preference)` — browsers do NOT
  auto-skip VT for reduced motion. Unsupported browsers: instant swap (the
  correct fallback, zero extra code).
- **Accept:** build green; navigation feels spatial on Chrome Android +
  Safari 18+; Firefox <144 and reduced-motion get instant swaps; no
  duplicate-name console errors.

### PR 3 · Depth pass — light, glass, layers
- Two-layer shadows everywhere (ambient + direct) + semi-transparent 1px
  light borders (`inset 0 0 0 1px rgb(255 255 255 / .06)`); concentric
  nested radii (child ≤ parent).
- Linear-style calm: dim chrome (sidebar/tab bar recede), soften hairlines —
  "structure felt, not seen." Hover = +contrast, not glow spam.
- One glass layer max per screen: `backdrop-filter: blur(12–20px)` on
  floating surfaces (sheets, TimerPill, tab bar) — sparingly (NN/g legibility).
- CSS 3D tilt on hero cards (rings hero, Wrapped poster, level card):
  `perspective` + pointer-driven rotateX/Y, ~20 lines, GPU-composited,
  desktop-pointer only, off under reduced motion.
- Scroll-driven parallax on heroes via `animation-timeline: view()` inside
  `@supports` (Chrome 115+/Safari 26; Firefox ignores = static). Depth
  offsets ≤20px — parallax is a documented vestibular trigger (WCAG 2.3.3).
- **Accept:** build green; bundle delta ≤1KB; 5-second phone test reads
  "expensive"; reduced-motion/Firefox lose nothing functional.

### PR 4 · The WebGL moment — living ambient
ONE tasteful effect: the aurora background becomes a slowly breathing
noise-blended mesh gradient (rose/lavender/coral), or wind across Mawar's
garden — pick after prototyping both, ship one.
- `ogl`, tree-shaken (Renderer/Program/Mesh/Triangle ≈8–14KB), **lazy-loaded
  chunk** post-first-paint; the existing static CSS aurora IS the fallback
  and the reduced-motion/no-WebGL/load-failure experience. Full ogl is 34KB —
  never import the barrel.
- Perf gates: `dpr = min(devicePixelRatio, 1.5)` (fill-rate is the killer on
  mid-range Android; it's a soft gradient — render at half res, CSS scales),
  mediump precision, rAF loop stopped on `visibilitychange` AND
  IntersectionObserver exit.
- **Accept:** build green; main bundle unchanged (chunk is lazy); 60fps on a
  mid-range Android or it auto-degrades; battery-safe (loop provably stops);
  zero effect under reduced motion.

---

## Phase 2 — Identity: Ruang for everyone, legacy for Nadya

### PR 5 · English-only copy pass + Ruang rebrand
> Direction change (owner, 2026-06-12): English for EVERYONE, including
> Nadya's install — the i18n layer and `legacyLove` are dropped entirely.
- Every Indonesian string → English (greetings, onboarding, wrapped CTA,
  streak copy). Brand: "Ruang — your quiet space" (title, manifest, wordmark,
  about, backup error).
- New-user default name becomes empty (greeting gracefully omits it);
  onboarding no longer falls back to "Nadya".
- **Accept:** build green; zero Indonesian strings in src/; PWA manifest
  reads "Ruang".

### Era 2.5 — continuous feature & visual expansion (owner, 2026-06-12)
"More features, visuals, depth, tracking — signature 3D moments within the
existing perf gates." Interleaved with the remaining phases, each ONE PR:
- [x] **Deeper tracking** — shipped as **Tend** (`/tend`): custom trackers
  (count / time / done-or-not) with daily intentions + the week as seven
  filling leaves, one-tap starter seeds (water/sleep/prayer/…), per-entry
  tags on activities (quick-log chips + edit), weekly per-category
  intentions with bloom bars. Derived via `lib/tend.js` (node-tested:
  `npm run test:data`); new keys `nadya:trackers` / `nadya:trackerLog`,
  additive only, included in backup export/import.
- [x] **Templates & packs** — shipped as **Seed packets** (`/seeds`):
  6 curated bundles mixing habits + trackers + weekly intentions, planted
  in two taps (dedupe by name, existing intentions never overwritten,
  archived things don't block replanting) + 4 nightly-prompt packs that
  surface one question per day in the journal (`settings.promptPack`).
  Pure planting logic in `lib/seeds.js`, content in `data/packs.js`, both
  node-tested; zero new storage keys.
- [x] **Richer stats** — shipped on /stats via `lib/correlations.js`
  (pure, node-tested): "What lifts you" (mood×habit links — positive-only
  by construction, min 4 samples each side, 8-week window), "When you
  bloom" (time-of-day bands: dawn/daylight/golden hour/night), and "Your
  month in bloom" recap (active days, fullest day, leading category,
  ticks, journal days, mood avg — future days never count against her).
  *(Trend forecasts deliberately skipped: predictions read as pressure.)*
- [x] **Journey expansion (data half)** — shipped as **garden wishes**:
  3 weekly quests derived deterministically from her own data (show-up
  target = her 4-week rhythm; rotating habit/tracker/category/journal
  wishes at ~60% of her average — beatable by design). Auto-granted into
  an append-only `nadya:wishes` log (+25 XP each, in backups), 3 new wish
  achievements; ungranted wishes fade when the week turns — no red, no
  "failed". `lib/quests.js` node-tested. *(Visual half — pet evolutions +
  species, garden seasons/weather — stays with the visual lane.)*
- **Signature 3D** — 3D garden scene (the WebGL budget's second moment),
  3D stat heroes, deeper card dimensionality. ogl chunk is already paid for;
  every scene lazy, DPR-capped, reduced-motion-safe.

### PR 6 · Themes + nameable pet
- 3 new palettes — Ocean / Forest / Mono — as `:root[data-theme]` variable
  sets over the existing rgb-triple tokens (alpha utilities keep working;
  this is the documented Tailwind 3.4 pattern). Rosé stays default.
- FOUC-proof: render-blocking inline `<head>` script sets `data-theme` from
  localStorage before first paint (a React effect always flashes).
  JS-mutate `<meta name="theme-color">` on switch (manifest theme_color is
  static; the meta overrides it).
- Pet becomes nameable + species/colorway choice (rose/fern/cactus… each a
  palette-aware SVG variant); onboarding gains the naming step. `legacyLove`
  pins Mawar-the-rose. Derived-data rule holds: name/species in settings,
  growth still derived.
- **Accept:** build green; all 4 themes AA-contrast on ink; no theme flash on
  cold load; Nadya sees zero change; theme/locale/pet covered by node tests.

---

## Phase 3 — Accounts & sync (local-first, guest-first)

> ⚠️ Gate: creating the Supabase project + choosing the SMTP provider needs
> owner approval first (free tier viable, see research notes).

### PR 7 · Supabase foundation + auth (sync OFF) — ✅ shipped
> Live: project `ruang` (`vuyexsgqemslttivlzoy`, ap-southeast-1, $0/mo),
> kv table + RLS + LWW trigger verified in SQL (cross-user reads = 0 rows,
> stale updates dropped, >5min skew clamped). Hand-rolled GoTrue fetch
> client (~2KB lazy with the Account tile — auth-js skipped, budget intact),
> email-OTP sign-in on Settings, offline-never-signs-out rule node-tested.
> Owner dashboard steps (email template token + Site URL + custom SMTP
> before public sign-ins) in `docs/CLOUD-SETUP.md`; keep-alive cron added.
- Schema: ONE kv table — `(user_id uuid default auth.uid() references
  auth.users on delete cascade, key text, value jsonb, updated_at
  timestamptz, primary key (user_id, key))`. RLS `to authenticated using
  ((select auth.uid()) = user_id)` (sub-select form — per-row calls cause
  seq scans) + index via the PK. Server-side LWW guard: trigger rejects
  writes where incoming `updated_at <` stored (else migration upload could
  clobber newer device data).
- Auth: **email 6-digit OTP** (`signInWithOtp`+`verifyOtp`) — NOT clickable
  magic links: PKCE links die in email-app in-app browsers and cross-device
  (verifier is browser-local). Plus Google OAuth. Import `GoTrueClient` +
  `PostgrestClient` directly (~21KB, route-split onto Settings/auth) — never
  full supabase-js (53KB, won't tree-shake).
- Free-tier mitigations: custom SMTP (Resend/Brevo free tier) — built-in
  email is 2/hour AND team-members-only, i.e. unusable in prod; keep-alive
  cron (GitHub Action) against the 1-week pause; 90-day restore window noted
  in runbook.
- Offline-auth rule: local data readable regardless of auth state; never
  sign out on token-refresh failure (known supabase-js offline-boot trap);
  sync simply waits for a live session.
- Guest mode = today's app, full-featured, never nagged. Sign-in lives in
  Settings only.
- **Accept:** build green; sign-in/out works on phone PWA; RLS verified by
  failing cross-user read test; guest experience untouched; bundle delta
  within math above.

### PR 8 · Sync queue + migration wizard
- Inside `storage.js` ONLY (callers untouched — the seam earns its keep):
  write path = mutate localStorage → mark key in a persisted dirty set →
  debounced flush (~2s). localStorage stays the source of truth.
- Flush triggers: debounce, app start, `online` event (hint only —
  `navigator.onLine` lies), `visibilitychange→hidden` with
  `fetch keepalive` (best-effort; durability comes from the persisted dirty
  set, not the beacon). Skip Background Sync API (Chromium-only).
- Retry: exponential backoff 1s→30s + jitter; attempts capped per session;
  dirty flags survive restart. Cross-tab: Web Locks elects one flusher.
  `deviceId` + `updatedAt` per write → replays are no-ops (PUT by key is
  idempotent).
- Pull on app start + sign-in: fetch all rows, per-key LWW vs local
  `updatedAt`.
- Migration wizard (sign-in with existing local data): snapshot local keys →
  batch upsert → server merges per-key LWW → confirm step only where the
  account already had different data → local snapshot retained under a
  `migrated:` prefix until confirmed (reversible). Lossless by construction.
- Conflict policy: newest `updatedAt` per key wins (client clocks; server
  trigger rejects future-skewed >5min). CRDTs are overkill for
  whole-key-replacement KV data — and every off-the-shelf option fails the
  budget or the architecture: PowerSync/RxDB/Watermelon force
  IndexedDB/SQLite-wasm, Electric is read-path only, Zero rejects offline
  writes, legend-state v3 is still beta. Hand-rolled ~3KB queue wins.
- **Accept:** build green; node suite extended: queue (dirty/retry/replay),
  LWW merge, migration round-trip, clock-skew rejection; airplane-mode test:
  log → kill app → relaunch online → row lands exactly once; two-device test
  converges.

---

## Phase 4 — Mass readiness

### PR 9 · Landing + privacy + error boundaries
- Public landing at `/welcome` (code-split; the app stays the PWA start
  page): what Ruang is, install CTA, theme/pet preview, en/id.
- `/privacy`: plain-language — data lives on-device (guest) or in your
  account (signed in), no tracking, no analytics, export anytime.
- Error boundaries per route shell with friendly recovery ("your data is
  safe — it's on your device") + export escape hatch.
- **Accept:** build green; landing Lighthouse ≥90 mobile; boundaries catch a
  thrown route render without white-screening the shell.

### PR 10 · Reminders + store path + final audit
- Opt-in PWA notifications (habit reminder time in Settings): local
  scheduling via SW where supported; degrade to nothing — never nag.
- `docs/STORE-PATH.md`: Capacitor wrap plan (later, documented now).
- Final audit: real Lighthouse mobile run ≥90 on production (browser env
  required), bundle report vs budget table, full a11y pass, two-device sync
  soak.
- **Accept:** all five Definition-of-AAAAA bullets demonstrably true.

---

## Definition of AAAAA (unchanged, the bar for "done")
1. Feels expensive within 5 seconds of opening, on a phone.
2. Every screen has one "how is this a web app?" moment.
3. Works fully offline; syncs invisibly when signed in; guest mode never nags.
4. A stranger can install it, name their pet, pick theme + language.
5. Nadya's data and rituals untouched: same garden, same Mawar, same streaks
   (language is now English for everyone — owner's call, 2026-06-12).

---

## Research notes (June 2026, adversarially verified)
- View Transitions same-document: Baseline since Oct 2025 (Chrome 111+,
  Safari 18+, FF 144+); FF added `types` Jan 2026. react-router
  `viewTransition` requires a data router. Browsers do NOT auto-skip VT under
  reduced motion. [web.dev/caniuse/reactrouter.com]
- CSS `linear()` springs: Baseline (113/112/17.2+); native `spring()` never
  shipped — don't wait for it. Motion-mini is 2.3KB if imperative WAAPI
  control is ever needed; react-spring (20KB) and framer-style motion
  (~18–34KB) rejected. [caniuse/motion.dev/bundlephobia]
- ogl full = 34KB gzip; tree-shaken fullscreen-shader subset ≈8–14KB; cap
  DPR at 1.5 (fill-rate bound on mid-range Android); rAF auto-pauses on
  hidden tabs but NOT off-screen canvases → IntersectionObserver required.
- supabase-js v2 = 53KB gzip, doesn't tree-shake (createClient pulls all
  sub-clients); auth-js ~16KB + postgrest-js ~5KB imported directly.
- PKCE magic links break cross-device/in-app-browser → email OTP codes.
- Supabase free tier: 500MB DB, 50K MAU, unlimited API requests — but
  built-in email is 2/hr + team-only (custom SMTP mandatory, free), and
  projects pause after 1 week idle (keep-alive cron; 90-day restore window).
- Vibration API: Android Chrome only; iOS Safari never; FF removed in 129.
- Scroll-driven animations: Chrome 115+/Safari 26; FF flag-only → @supports.
- Skeleton screens: evidence mixed — prefer optimistic/instant UI; skeletons
  only for >300ms known-layout loads.
- i18n: id has no plural categories (CLDR) → hand-rolled t() is correct, not
  a shortcut.
