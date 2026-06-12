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

## Pass 2 — Signature features
- [ ] Focus timer (Toggl concept): start/stop pill in shell, persists across reloads (`nadya:timer`), stop → prefilled quick log
- [ ] Insights engine on Stats: heuristic text cards ("Tuesday is your most productive day", "Entertainment +2h vs last week", "You journal most after 21:00")
- [ ] Mood trend line + mood×productivity hint in Stats
- [ ] Weekday profile chart (avg minutes by weekday)

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
