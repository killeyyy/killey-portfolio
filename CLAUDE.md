# CLAUDE.md — standing context for KILLEYYY's repo

This file is read by Claude Code / Codex at the start of every session. It is the
**source of truth for who Hassan is and how to work here.** If anything in a task
brief contradicts this file, trust this file and ask — the old brief carried stale
"memories" (see `docs/DECISIONS.md` ADR-010).

## Who

- **Hassan Sardar Shah** — brand **KILLEYYY**.
- An **AI-first builder & creator**: he directs AI tools (Claude, Codex) to design,
  build and ship complete products — games, websites, content. He is **not** a
  traditional/ML engineer; frame him as a builder/creator.
- **Do NOT** use: the mantra "Sabit Qadam" (removed), the "student / IBA Karachi"
  positioning (removed), a public location (hidden), or any invented metrics.
- Tone/brand: cinematic, premium, elegant, disciplined.

## Facts (authoritative)

- Headline leads with what he builds: "I build cinematic games, sites & content with AI."
- Public contact: Instagram `@hssn.shah`, LinkedIn `hassan-sardar-shah-941625170`,
  emails `hassansardarshah1@gmail.com` (primary) + `h.shah.26396@khi.iba.edu.pk`.
  (`hsskiller@gmail.com` is the account email, not the public contact.)
- GitHub: `github.com/killeyyy`. Vercel team: `hsskiller-2439s-projects`.
- Featured projects — Live: **Empire — Rise to the Top** (empire-rise.vercel.app),
  **BMLA Quest** (bmla-quest.vercel.app), **BMLA Prep Command Center**
  (hassan-deals-pk.vercel.app). WIP: **Shadow Kombat** (Godot), **ASCENT: Zero to Hero**.
  Dropped: NeonSurvivor, Kapture MCP. Verify any "live" URL in a real browser before featuring.

## This repo

- **Production site:** being promoted from the single-file `index.html` to the Vite
  app in `react-app/` (see `docs/DECISIONS.md`). Root `index.html` still serves prod
  until the `vercel.json` flip.
- **Single content source of truth:** `react-app/src/data/site.js`. Edit content there
  only — both the public site and the owner cockpit read it.
- **Design system:** `react-app/tailwind.config.js` + `react-app/src/index.css`
  (palette: ink/silver/garnet/crimson/jade/gold; serif + mono type). Tune palette there.
- **Brand palette (hex):** ink `#0E0E10`, surface `#17171B`, silver `#E8E6E1`,
  muted `#A7A29A`, garnet `#7B1E2B`, crimson `#C8323C` (lead), jade `#1F6F5C`
  (restrained "live"), gold `#C9A86A` (metallic detail).

## How to run / build

```bash
cd react-app
npm install
npm run dev      # local dev server
npm run build    # production build (must exit 0 before merge)
npm run preview  # preview the production build
```

## Conventions

- Develop on the feature branch, small reviewable commits, keep `main` deployable.
- Budget: Lighthouse mobile ≥ 90 (Perf/A11y/Best-Practices/SEO), WCAG AA,
  respect `prefers-reduced-motion`. Lazy-load heavy assets (the shader hero is
  code-split). Mobile-first.
- Secrets only via Vercel env vars + serverless `/api` — never in the client bundle
  or git. `.env` is gitignored; commit `.env.example` (names only).
- Truthful content only. No fabricated stats, logos, or testimonials.

## The hub (one place for everything)

- `/vault` is an Obsidian-compatible markdown vault (clients, business, projects,
  personal, memory, instructions, daily) synced via the Obsidian Git plugin.
- Long-term memory → `vault/memory/`. Standing instructions → `vault/instructions/`.
- Structured data (leads/clients/pipeline) → Notion ("KILLEYYY — Client Pipeline").
  Files → Drive. Dev activity → GitHub/Vercel. The owner cockpit surfaces these: secure
  serverless login + LIVE GitHub feed shipped; Vercel/Notion/Drive go live when their
  tokens are set in Vercel env (see docs/SETUP-ENV.md).
