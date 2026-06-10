# Changelog

All notable changes to the KILLEYYY portfolio. Format based on
[Keep a Changelog](https://keepachangelog.com/). Dates are YYYY-MM-DD.

## [Unreleased] — cinematic redesign + command-center hub

Branch: `claude/jolly-archimedes-EBecL`. Root `index.html` still serves production
until the Vite app reaches parity and the `vercel.json` flip lands.

### Added
- **Cmd/Ctrl+K command palette** (zero-dep, fully keyboard accessible): jump to any
  section, open case studies, launch live games, copy email, open socials, owner login.
  Trigger via keyboard or the ⌘K button in the nav.
- **Easter egg:** type `killey` anywhere → brand-color confetti burst + toast
  (reduced-motion safe).
- **Nav v2:** gradient reading-progress bar, ⌘K trigger, glassier blur.
- **Hero v3:** truthful animated stats strip derived from the projects data
  (live count / playable count / total), floating depth orbs, scroll cue.
- **Services:** 3D pointer-tilt cards with gold sheen (existing Tilt recipe).
- **About v2:** editorial word-staggered pull quote + colorful method principles.
- **Footer v2:** cinematic — oversized gradient wordmark, explore/live/connect
  columns, back-to-top.
- **404 v2:** aurora + giant gradient 404 + magnetic CTAs.
- `docs/RESEARCH.md` — cited research (award-winning 2025–26 portfolios, interaction
  techniques, "show don't tell", performance/a11y, 2026 SEO) + ranked patterns.
- `docs/PROPOSAL.md`, `docs/DECISIONS.md` (ADR log).
- Real Tailwind v3.4 + PostCSS build; premium jewel-tone design tokens
  (`src/index.css`, `tailwind.config.js`): ink/silver/garnet/crimson/jade/gold,
  fluid type scale, motion tokens, brand focus ring, global `prefers-reduced-motion`,
  film-grain utility.
- Single content source of truth (`react-app/src/data/site.js`) — kills the
  index.html ↔ App.jsx duplication; corrected ground-truth content.
- Rebuilt site as components with react-router: Home, `/work/:slug` case studies,
  `/owner` cockpit, 404; a11y skip-link + ScrollToTop.
- Cinematic hero: static garnet→crimson + grain fallback with a lazy `ogl` shader
  (DPR-capped, rAF paused offscreen, reduced-motion safe).
- Playable project cards: click-to-launch sandboxed iframes + fullscreen.
- Owner cockpit (interim gate) reading the content source.
- Knowledge hub: `/vault` (Obsidian-ready) + `CLAUDE.md` standing context.

### Changed
- Rebrand from emerald to the garnet→crimson jewel-tone system.
- README rewritten for the new architecture.
- Positioning corrected: AI-first builder/creator (no student/IBA framing), no
  mantra ("Sabit Qadam" removed), headline-first, location hidden.

### Security
- Plaintext client password flagged for replacement; serverless signed-cookie auth
  scheduled for Phase 4 (interim gate clearly marked in the cockpit).

### Pending (next)
- Serverless owner auth + live GitHub/Vercel/Notion/Drive data with caching/fallbacks.
- SEO: `@vercel/og` cards, JSON-LD (Person/CreativeWork), sitemap; build-time prerender.
- Static prerender (`vite-react-ssg`); `vercel.json` production flip; Lighthouse run.
