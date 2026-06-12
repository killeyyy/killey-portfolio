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
- [ ] Weekly Wrapped (/wrapped): Spotify-Wrapped-style recap of last week — total time, top category, productive %, best day, habit champion, mood avg, gratitude count; poster-grade gradient design; link appears on Today every Monday
- [ ] First-run onboarding: welcome → name → week start → daily target → starter habits pack
- [ ] Year heatmap (GitHub-style) of activity volume in Stats month view

## Pass 4 — Final polish
- [ ] Journal search + month jump
- [ ] Empty-state illustrations (inline SVG flourishes)
- [ ] A11y + Lighthouse pass (mobile ≥ 90), 375px and 1440px layout audit
- [ ] README for the folder (what it is, how to run, how data/backup work)

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
