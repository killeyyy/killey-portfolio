# Stack & accounts (where everything lives)

> The map of my tools and where things go. Public contact details are in
> `about-hassan.md`; secrets/tokens are NEVER stored here — they live only in Vercel env.

## This repo = the operating system
- GitHub: **github.com/killeyyy** → repo `killey-portfolio`.
- Hosting: **Vercel**, team `hsskiller-2439s-projects`. Production = the old single-file
  site until the Vite app is merged (the `vercel.json` flip is staged on the feature branch).
- Account email (NOT public contact): `hsskiller@gmail.com`.

## Where each kind of thing goes
| Thing | Home |
|---|---|
| Notes, memory, standing instructions, daily log | This `/vault` (Obsidian + Git) |
| Structured lists: leads, clients, pipeline | **Notion** |
| Files / assets / docs | **Google Drive** |
| Code + dev activity | **GitHub** |
| Deploys + analytics | **Vercel** |
| Site content (one source of truth) | `react-app/src/data/site.js` |

## App stack (locked)
- Vite 5 + React 18 + react-router-dom v6; Tailwind v3.4 (build); Framer Motion v11;
  GSAP + Lenis (smooth scroll); `ogl` (WebGL shader hero). Vercel serverless `/api` (Node).
- Free tier only. Lighthouse mobile ≥ 90 target (re-tuned before merge).

## Secrets (when wiring auth + live data — paste into Vercel → Settings → Env Vars)
> Names only here. Values go in Vercel, never in the repo. See `docs/SETUP-ENV.md`.
- `SESSION_SECRET`, `OWNER_PASSWORD_HASH` (secure owner login)
- `GITHUB_TOKEN`, `VERCEL_TOKEN`, `NOTION_TOKEN` + `NOTION_DB_ID`, `GOOGLE_*` (live cockpit data)
