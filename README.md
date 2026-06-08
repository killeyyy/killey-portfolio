# KILLEYYY — Portfolio & Command Center

A cinematic, premium personal site for **Hassan Sardar Shah (KILLEYYY)** — an
AI-first builder & creator shipping cinematic games, websites and content. Two modes:

- **Public site** — the showcase (hero, work, about, contact). Live projects are
  **playable in the browser** right on the page.
- **Owner cockpit** — a private command center (overview, projects, pipeline, links)
  that connects to GitHub/Vercel/Notion/Drive and an in-repo Obsidian vault.

> Status: actively being upgraded. See `docs/PROPOSAL.md`, `docs/RESEARCH.md`,
> `docs/DECISIONS.md`, and `CHANGELOG.md`. During the migration the root
> `index.html` still serves production; the new app lives in `react-app/`.

## Architecture

| Part | Where | Notes |
|---|---|---|
| **Production site (current)** | `index.html` (root) | Self-contained CDN build; serves prod until the Vite flip. |
| **Production site (target)** | `react-app/` | Vite + React + Tailwind v3.4 + react-router; the real app. |
| **Content (source of truth)** | `react-app/src/data/site.js` | Edit content **here only** — both modes read it. |
| **Design system** | `react-app/tailwind.config.js` + `react-app/src/index.css` | Palette tokens, type scale, motion. |
| **Serverless (Phase 4)** | `/api/*` | Owner auth + live data; secrets via Vercel env vars. |
| **Knowledge hub** | `/vault` + `CLAUDE.md` | Obsidian-synced markdown second brain. |

## Run it

```bash
cd react-app
npm install
npm run dev      # local dev server
npm run build    # production build (must exit 0)
npm run preview  # preview the production build
```

## Edit content

Open `react-app/src/data/site.js` — it holds the headline, about text, contact,
services, process, projects (incl. which are public/playable), and cockpit data.
Change it in one place; the whole site updates. **Truthful content only — no
invented metrics.** Tune colors in `react-app/src/index.css` (`:root` tokens).

## The hub (one place for everything)

`/vault` is an Obsidian-compatible markdown vault (clients, business, projects,
personal, memory, instructions, daily). See `vault/README.md` for the 5-minute
Obsidian Git sync setup. `CLAUDE.md` holds standing context so Claude/Codex always
work from the correct, current facts.

## Tech

React 18 · Vite 5 · Tailwind v3.4 · react-router · ogl (WebGL hero) · lucide-react ·
Vercel. Budget: Lighthouse mobile ≥ 90, WCAG AA, `prefers-reduced-motion` respected.
