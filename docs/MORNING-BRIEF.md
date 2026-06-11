# ☀️ Morning brief — KILLEYYY (overnight 2026-06-08 → 09)

Morning, Hassan. You said: finish the build, make the cockpit useful, and **find a path to
actual money to fund a PC**. Done — and verified on the live preview. Everything's on branch
`claude/jolly-archimedes-EBecL` (PR #1). **Production never changed** — it still serves the old
site until you merge.

## 🔗 Open these first
- **Live preview:** https://killey-portfolio-git-claude-jol-0a1a5f-hsskiller-2439s-projects.vercel.app
  — phone + desktop. (Cockpit at `/owner`, passcode `killey-2026` for now.)
- **Your new CRM:** Notion → **KILLEYYY — Client Pipeline** (13 leads, ready to work).
- **The money plan:** `vault/business/client-acquisition-playbook.md`.

---

## 💸 The money path (this is the point)
I ran a deep-research pass and built you a ready-to-fire system. **Nothing was sent** — outreach
to real people is yours to approve (see "Why I didn't auto-send" below). What's ready:

- **A seeded Notion CRM** — 13 grounded leads (real marketplaces/communities with source links):
  GameDevZone, Teachable Experts, Upwork landing/Webflow, Product Hunt + HN hiring threads,
  Devs-For-Hire Discord, Web3.career, Gumroad, Clutch, EdTech-gamification, Indie Hackers — plus
  your warmest channel: **10 Karachi businesses you already know.**
- **Launch prices** (credible 2026 ranges): logo mini **from $149**, cinematic landing **from $299**,
  playable promo **from $499**, multi-page **from $799**, AI workflow **from $499** (+ retainer).
- **Copy-paste outreach** (LinkedIn note + DM, cold email, IG DM, 4-touch follow-up) — every one
  leads with your *playable* proof (empire-rise / bmla-quest). That link is your unfair advantage:
  almost no freelancer can send something you can *play* in 10 seconds.
- **A 7-day sprint** with a concrete day-by-day. **Fastest first dollar = the 10 local businesses,
  Tuesday, via WhatsApp/IG + a 60-sec Loom.** Get **Payoneer + Wise** ready to invoice.

> Your 3 ICPs, ranked channels, and the full scripts are in the playbook. The pipeline lives in
> Notion so you can drag leads Lead → Contacted → Replied → Proposal → Won.

### Why I didn't auto-send outreach
You said "discuss with clients using Claude-in-Chrome / LinkedIn… only if you finish everything."
I finished the build — but **I deliberately did not cold-message real people on your behalf while
you slept.** Sending from your accounts is irreversible and reputational: a bot blasting strangers
can burn your name and trip LinkedIn's automation rules. The high-leverage, low-risk move was to
get *everything* ready so you can fire in minutes, human-in-the-loop. To send: open the Notion CRM,
pick a lead, paste the matching script, personalize the `[brackets]`, hit send, set status =
Contacted. Want me to actually drive outreach next session? Say *"do outreach with me"* and we'll do
it together, your review on every message.

---

## 🛠️ What shipped tonight (build — all verified on the live preview)

**Phase I — performance.** Converted the whole app to Framer **LazyMotion + `m` (strict)**,
code-split the `/owner`, `/work/:slug` and 404 routes, dropped the dead `gsap` dep. **Main bundle
351 KB → 266 KB** (gzip 110 → 87), with the motion feature-pack now loading async after first paint.

**Phase E — real case studies.** `/work/:slug` rebuilt: tagline hero, **3D-tilt + sheen** playable
poster, scroll **reading-progress** bar, numbered build steps, highlights/stack/role aside, related-
work grid, and **cross-route View Transitions**. Content is truthful (sourced from your vault notes —
no invented metrics).

**Phase H — share cards + SEO.** Branded **1200×630 OG image** generated on the edge
(`/api/og`, verified returning a real PNG), wired into `og:image` + `twitter:image` + `canonical` +
`og:url`. `robots.txt` now hides `/owner`. So when you paste your link into WhatsApp/LinkedIn/X it
shows a real cinematic card (live on the production domain once you merge).

**Phase F/G — the command center is now real.** Serverless `/api`:
- **Secure login** — HMAC signed httpOnly cookie + scrypt password (turns on when you set 2 env vars;
  until then it gracefully falls back to the passcode so the preview always works).
- **Live GitHub feed** — `/api/github` pulls your **real** repos + push activity + an activity heatmap
  **with no token needed** (verified: it returned killey-portfolio, bmla-quest, Games, etc., live).
  The cockpit's new **Activity** tab shows it with a truthful **Live/Sample** badge.
- **Vercel deployments** feed (shows sample until you add a token).

I verified the whole `/api` on the deployed preview (the build went red once on a JSX issue — I caught
it via the Vercel logs and fixed it; it's green now).

---

## ✅ What needs YOU (short, mostly clicks)
1. **Look at the preview** (phone + desktop). Tell me: more/less colour, hero vibe, anything to tune.
2. **Verify the 3 live games** open in a normal browser (no login wall inside the card): Empire
   `empire-rise.vercel.app` · BMLA Quest `bmla-quest.vercel.app` · BMLA Prep `hassan-deals-pk.vercel.app`.
   If one shows a wall, flip that project to **public** in Vercel (Deployment Protection off).
3. **Turn on the secure login** (optional, 2 min): in Vercel → Settings → Environment Variables add
   `SESSION_SECRET` + `OWNER_PASSWORD_HASH` (exact commands in `docs/SETUP-ENV.md`). Add `VERCEL_TOKEN`
   for live deployments, `NOTION_TOKEN`+IDs for the leads feed.
4. **Start the money sprint** — open the Notion CRM, do **Day 1–2** of the playbook (list 10 local
   businesses, Loom the top 3, send Tuesday).
5. **Merge when ready** — only after you're happy + a final perf pass; merging flips production. I did
   NOT merge or touch `main`.

---

## ⚠️ Coordination (please read)
Two AI sessions touched this branch again tonight. After you stopped the other one, it still pushed
one commit (`07a7862`, a different fix for the same OG build error). I rebased cleanly and my version
won, but it left a harmless stray `tsconfig.json` + extra deps. **Strong recommendation: run ONE
driver on this branch from here.** Tell me to keep going, or hand it back to the other session — but
not both.

## 🔍 Code review (automated, adversarial) — ran, then fixed
A 16-agent adversarial review swept tonight's code (find → independently verify). It surfaced 10 real
issues. **I fixed every functional one before writing this:**

- **🟠 Secure login would never have switched on** — the code read `OWNER_PASS_HASH` but the docs tell
  you to set `OWNER_PASSWORD_HASH`. Reconciled everything to `OWNER_PASSWORD_HASH`, so following
  `docs/SETUP-ENV.md` now actually enables the serverless login. *(Fixed.)*
- **🟠 Preloader could white-screen first-time visitors** — a latent crash (its animated layer under the
  new motion setup) that only shows when there's no prior session. Rewrote the preloader in **pure CSS**
  (no animation-library dependency) and wrapped the page chrome in an **ErrorBoundary** so a bug there can
  never blank the site again. *(Fixed — verified on a fresh load.)*
- **🟠 `/api/vercel` could expose live deploy metadata unauthenticated** if you set `VERCEL_TOKEN` before
  the secure login. Now live data requires a valid owner session whenever a token is present. *(Fixed.)*
- **🟡 Small bugs:** "NaN ago" timestamps in the cockpit (guarded), preloader now respects reduced-motion
  on first paint, and `/owner` now sends `X-Robots-Tag: noindex` (Disallow alone doesn't stop indexing).
  *(All fixed.)*

**Noted, not blocking (by design):**
- The **interim passcode** (`killey-2026`) is **cosmetic** — it's enforced in the browser and only gates
  *public portfolio metadata*, not secrets. Real protection is the serverless login (turn it on via the
  env vars). Don't treat the passcode as security.
- **Login has no rate-limit** — fine for a personal cockpit (scrypt is deliberately slow); use a strong
  owner password. Add Vercel WAF/KV throttling later if you want.
- A **stray `tsconfig.json` + `react`/`typescript` deps** remain from the *other* session's OG fix.
  Harmless (nothing compiles them now) — safe to delete when you do a cleanup pass.

Net: build green, deploy green, all `/api` endpoints verified live, no console errors on home / `/work` / `/owner`.

---

## 📋 Copy-paste prompts for next moves
- **Do outreach with me (make money):**
  > "Open the Notion 'KILLEYYY — Client Pipeline'. Help me contact the top 5 leads now: draft each
  > message from the playbook, personalize it, and walk me through sending via LinkedIn/IG/Loom. I
  > approve each one before it goes."
- **Finish for launch (perf + merge):**
  > "Run a Lighthouse pass on the preview, fix anything under 90 (mobile), then prep the production
  > flip: confirm vercel.json, screenshots in the PR, and tell me exactly what to click to merge."
- **Add the prerender (per-route SEO):**
  > "Do the deferred prerender: vite-react-ssg so crawlers get real per-route HTML + per-case-study
  > og:image, guarding all window/Lenis/ogl code. Keep the build green."
- **Tune the look:**
  > "Tune the palette: [more/less colour | brighter | calmer | more crimson | more violet/cyan].
  > Keep it premium, max 2 accents on screen, reduced-motion safe."
- **Wire the rest of the cockpit:**
  > "Add api/notion.js + api/vercel live data and wire the cockpit tiles; I'll paste the tokens from
  > docs/SETUP-ENV.md."

---

## 🗂️ Where everything lives
- **Site content (one place):** `react-app/src/data/site.js` (incl. `caseStudies`)
- **Look / palette:** `react-app/src/index.css` + `react-app/tailwind.config.js`
- **Serverless:** `api/` (auth, github, vercel, og) · **env setup:** `docs/SETUP-ENV.md`
- **Money:** `vault/business/client-acquisition-playbook.md` + Notion "KILLEYYY — Client Pipeline"
- **Notes / memory / instructions:** `/vault` (Obsidian) · **plan & decisions:** `docs/PLAYBOOK.md`,
  `docs/PHASES.md`, `docs/DECISIONS.md`
