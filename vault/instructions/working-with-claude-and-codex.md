# Working with Claude / Codex in this repo

> Practical playbook so any AI session is productive here without re-asking.

## Read first, every session
1. `CLAUDE.md` (repo root) — who I am + brand rules (authoritative).
2. `vault/memory/about-hassan.md` — ground-truth facts.
3. `vault/instructions/standing-instructions.md` — how to work with me + current direction.
4. `docs/PLAYBOOK.md` — the implementer's guide (palette, motion, shader, cockpit, infra).
5. `docs/PHASES.md` / `docs/DECISIONS.md` — what's done and why.

## Where things live (single source of truth)
- **Site content** (headline, projects, services, contact): `react-app/src/data/site.js` only.
- **Design tokens / palette:** `react-app/src/index.css` + `react-app/tailwind.config.js`.
- **Serverless / secrets:** top-level `/api` + Vercel env vars. NEVER `VITE_*` for secrets.
- **Notes / memory / instructions:** this `/vault` (Obsidian). **Structured lists** (leads,
  clients, pipeline): Notion. **Files:** Google Drive. **Code + activity:** GitHub / Vercel.

## Ground rules
- Branch work, small reviewable commits, keep `main` deployable. Don't touch production.
- One driver per branch at a time (avoid two agents racing the same files).
- Verify before claiming done: `cd react-app && npm run build` must exit 0; check the Vercel
  preview; verify any "Live" project URL in a real browser before featuring it.
- Truthful content only. Accessible + reduced-motion-safe. Lazy-load heavy assets.

## Handy commands
```bash
cd react-app
npm install
npm run dev       # local dev (Vite)
npm run build     # production build — must exit 0 before merge
npm run preview   # preview the production build
```
