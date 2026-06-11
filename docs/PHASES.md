# Overnight build — phases & morning brief

Branch `claude/jolly-archimedes-EBecL` · PR #1 (draft). Production stays on the old
site until you merge. Preview auto-updates on every push:
**https://killey-portfolio-git-claude-jol-0a1a5f-hsskiller-2439s-projects.vercel.app**

Direction (your call tonight): **maximal — flashy, deep, animated, colorful, $50K feel.**
Accessibility (reduced-motion) kept; performance budget relaxed in favour of "wow"
(we'll re-tune in Phase I). Implementer's guide: `docs/PLAYBOOK.md`.

## ✅ Done tonight (A–D)

- **A — Motion + color foundation:** Lenis smooth scroll, Framer Motion reveal/stagger,
  custom magnetic cursor, cinematic 0→100 preloader, "Garnet Aurora" colour system
  (violet/cyan/magenta/amber + AA-safe text variants), gradient text, glow utilities.
- **B — Cinematic hero:** oversized animated **KILLEYYY** wordmark (per-letter reveal +
  gradient sweep), gradient-highlighted headline, **magnetic CTAs**, mouse-reactive
  **aurora WebGL shader** (warm garnet/crimson × cool violet/cyan, pointer glow).
- **C — Living sections:** scroll-reveal headings, staggered **colorful glow service
  cards**, gradient process numerals on an aurora panel, work grid with hover-lift/glow
  project cards (playable embeds intact).
- **D — Vibrant bento cockpit:** glass tiles, scroll-triggered **count-up** stats, SVG
  **sparkline + progress ring**, contribution **heatmap**, live/sample badges.

## ⏭️ Remaining phases (queued — PLAYBOOK has exact recipes)

- **E — Case studies & micro-interactions:** richer `/work/:slug` deep dives (problem →
  build → outcome), 3D tilt + sheen tiles, split-text/scramble hover, cross-route View
  Transitions, video-on-hover posters.
- **F — Secure owner auth (serverless):** replace the interim passcode with an HMAC
  signed httpOnly cookie (`/api/auth/*`, scrypt hash). *Needs env vars (below).*
- **G — Live cockpit data:** `/api/github`, `/api/vercel`, `/api/notion`, `/api/drive`
  with caching + graceful sample fallback; wire into the bento tiles.
- **H — SEO & prerender:** `vite-react-ssg` (real HTML for crawlers), per-route meta +
  JSON-LD (Person/CreativeWork), `@vercel/og` share cards, sitemap/robots.
- **I — Perf re-tune + verify:** code-split/LazyMotion, image pipeline, Lighthouse
  pass, then the production-flip readiness check.

## 🌅 For you in the morning

**Look at the preview** (link above) on phone + desktop. Then tell me any of:

1. **"Tune the palette"** — more/less colour, brighter/darker, different accent mix.
2. **"Do Phase E/F/G/H next"** — or "keep going through all phases."
3. **"Add Cmd+K + the AI assistant"** — the two deferred power features.
4. **"Wire live data"** — then paste these into Vercel → Settings → Environment Variables
   (I'll give exact steps): `GITHUB_TOKEN`, `VERCEL_TOKEN`, `NOTION_TOKEN`+`NOTION_DB_ID`,
   `GOOGLE_*`, plus `SESSION_SECRET` + `OWNER_PASSWORD_HASH` for the secure login.
5. **"Merge it"** — only after Phase I + a Lighthouse pass; merging flips production.

**Owner to-dos (when ready):** install Obsidian + Git plugin on `/vault`; flip the 3
game projects to public in Vercel if any show a login wall inside their card.

## Notes / decisions logged
- Reversed "tasteful & fast" → "flashy & rich" per owner (2026-06-08). Reduced-motion
  + lazy-loading retained; perf re-tuned in Phase I. See `docs/DECISIONS.md`.
- A parallel research agent produced `docs/PLAYBOOK.md` + RESEARCH addendum; this build
  follows it.
