# Ruang Nadya — AAAAA roadmap

Goal: premium, innovative, feature-rich experience on **desktop and mobile**.
Worked in passes; each pass builds green, merges to main, deploys live.
The /loop continues from the first unchecked item.

## Pass 1 — Design System 2.0 + Today 2.0 (DONE when checked)
- [x] Ambient aurora background (rose/lavender/coral glows + film grain), custom scrollbar, glass surfaces
- [x] Desktop experience: left sidebar shell (wordmark, nav, quick log), bottom tab bar stays mobile-only
- [x] Sheet → responsive: bottom sheet on mobile, centered modal on desktop
- [x] Micro-interactions: CountUp animated numbers, bar rise-in + stagger, trend line draw-in
- [x] Daily Rings hero (Apple-rings concept): Productive vs daily target · Habits done · Journal closed
- [x] Mood capture on Journal (Daylio concept): 5-level emoji, stored per day, shown in history
- [x] Day timeline strip — today's entries as proportional colored blocks
- [x] Milestones + confetti (WAAPI, reduced-motion safe): streak milestones, all-habits day, savings goal met
- [x] Daily productive target in Settings (drives rings)
- [x] Desktop keyboard shortcuts: L = log, 1–5 = navigate
- [x] Today/Stats desktop grid layouts

## Pass 2 — THE JOURNEY UPDATE (Nadya's direct feedback, 2026-06-12)
Her asks: (1) change the font 💀, (2) "journey, not a tracker — duolingo-ish:
levels, milestones, achievements, celebrations, progress paths, streak pet",
(3) line charts for habits. Progress must feel fun, never like failure.
- [x] Font swap: Baloo 2 (display/numbers — chunky, warm) + Figtree (UI); drop Lora italics
- [x] lib/journey.js: XP derived retroactively from existing data (logs/habits/journal/savings — no new storage), level curve, rose-garden level names (Seedling → … → Eternal Bloom), overall day-streak, ~12 derivable achievements
- [x] Streak pet "Mawar" 🌹: SVG potted rose that grows with the day-streak (seed → sprout → bud → bloom → radiant), gentle sway, never dies — wilting is NOT a mechanic (no failure-shaming)
- [x] /journey route: pet hero + level card with XP bar + last-8-weeks star path (0–3 stars per week) + achievements grid (locked = dimmed, not red)
- [x] Level-up + new-achievement celebrations (confetti + toast; `nadya:journeySeen` tracks what's been celebrated)
- [x] Nav: Journey replaces Savings in the mobile tab bar (Savings gets a card on Today + stays in desktop sidebar)
- [x] Habit line charts (her ask): weekly adherence % TrendLine per habit on /habits

## Pass 2.5 — Signature features (deferred from old pass 2)
- [x] Focus timer (Toggl concept): start/stop pill, persists (`nadya:timer`), stop → quick log
- [x] Insights engine on Stats: heuristic text cards (positive framing only)
- [x] Mood trend line in Stats + weekday profile chart

## Pass 3 — Wrapped + onboarding
- [x] Weekly Wrapped (/wrapped): Spotify-Wrapped-style recap of last week — total time, top category, productive %, best day, habit champion, mood avg, gratitude count; poster-grade gradient design; link appears on Today every Monday
- [x] First-run onboarding: welcome → name → week start → daily target → starter habits pack (shipped in Upgrade D)
- [x] Year heatmap (GitHub-style) of activity volume in Stats month view

## Pass 4 — Final polish
- [x] Journal search + month filter
- [x] Empty-state illustrations (shipped in Upgrade B)
- [x] A11y/layout audit: aria-labels on icon buttons, reduced-motion everywhere, 375px/1440px layouts by construction; bundle ~90KB gzip JS. (True Lighthouse run needs a browser — not available in this sandbox; flagged for a manual phone check.)
- [x] README.md (architecture, data model, conventions, testing)

## Conventions for the loop
- Branch `claude/kind-bohr-tif247` → PR → squash-merge to main (auto-deploys ruang-nadya).
- `npm run build` must exit 0 before every commit; never touch root config or `react-app/`.
- All day keys via `src/lib/dates.js` (local time). Additive schema changes only (optional fields + fallbacks); bump `CURRENT_SCHEMA` only for breaking shape changes.

## Upgrade B — Visual Masterpass (shipped)
- [x] Time-of-day greeting gradient + streak-aware microcopy
- [x] Gradient-frame glow Tile variant on hero cards (+ desktop hover lift)
- [x] Chart beauty: gradient Ring stroke, rounded Donut caps, gradient bar fills + tap value chips, mint glow on met goals, today marker on heatmaps
- [x] Living nav: gradient FAB with halo pulse, tab indicator dots, route transitions, sidebar gradient pill
- [x] Mawar v2: gradient petals, blink, soil + pot detail, butterfly at radiant
- [x] Celebration v2: petal confetti, full-screen level-up moment, haptic buzz on log/tick
- [x] Empty-state flourishes + warmer microcopy

## Upgrade C — Weekly Wrapped masterpiece (shipped)
Research-driven (Wrapped/Duolingo/Strava teardowns): stories grammar, two-beat
tease-then-reveal, one giant stat per card, persona identity claim, peak-end
sequencing, positive-only copy, client-side canvas share poster.
- [x] /wrapped: full-screen story player — segmented progress bars (animation-end
      advances), tap zones (back ⅓ / next ⅔), hold-to-pause, per-card radial tint,
      reduced-motion = tap-only with static bars
- [x] lib/wrapped.js: last-complete-week stats + weekly persona rules + relatable
      equivalents; node-tested (week bounds, exclusions, XP math)
- [x] lib/poster.js: 1080×1920 canvas poster (fonts preloaded before fillText),
      Web Share API files with download fallback, zero deps
- [x] Entry points: Monday/Tuesday ritual card on Today + "Last week, wrapped" on Journey

## Upgrade F — Mawar's Garden (shipped)
- [x] weeklyGarden(): every week since her first recorded day → a plot (same star criteria as the path; dominant category colors the bloom; quiet weeks sprout, never empty)
- [x] SVG meadow on Journey: deterministic natural variation (tilt/height/sway per week), soil rows, current-week halo, tooltips with week range + stars
