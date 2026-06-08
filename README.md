# KILLEYYY — Portfolio

A dual-mode personal portfolio for **Hassan Sardar Shah (KILLEYYY)** — student, builder, and creator shipping cinematic games, sites, and content with an AI-first workflow.

🔗 **Live:** https://killey-portfolio-hsskiller-2439s-projects.vercel.app

## Two modes
- **Client Site** — the public-facing portfolio (hero, services, work, about, contact).
- **Owner** — a private dashboard (overview, projects, leads, pipeline, quick links) behind a password gate.

> Note: the owner password is a lightweight, client-side gate — it keeps casual visitors and search engines out, but it is not real authentication. Don't store anything sensitive behind it.

## What's in this repo

### `index.html` (root)
The **deployed version** — a single, self-contained file. It uses React + Babel + Tailwind via CDN, so it runs by just opening it in a browser or hosting the file anywhere (Vercel, GitHub Pages, Netlify…). Edit the `DATA` object and `OWNER_PASSWORD` near the top to customize.

### `react-app/`
The same site as a **Vite + React** project, for anyone who wants to develop it with a modern toolchain.

```bash
cd react-app
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

It uses `lucide-react` for icons and Tailwind (via CDN in `index.html`). All content lives in the `DATA` object in `src/App.jsx`.

## Tech
React · Tailwind CSS · lucide-react · Vite

---
_Sabit Qadam — show up every day._
