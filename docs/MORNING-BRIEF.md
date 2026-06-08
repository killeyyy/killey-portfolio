# ☀️ Morning brief — KILLEYYY portfolio (overnight 2026-06-08 → 09)

Hey Hassan. Here's what happened while you slept, what to look at, and copy-paste prompts to
drive the next moves. Everything is on branch `claude/jolly-archimedes-EBecL` (draft PR #1).
**Your live/production site never changed** — all work is on the branch + its preview.

## 🔗 Look at this first
**Preview (updates on every push):**
https://killey-portfolio-git-claude-jol-0a1a5f-hsskiller-2439s-projects.vercel.app

Open it on **phone + desktop**. It went from a flat dark page to a cinematic, colorful,
animated site: animated **KILLEYYY** hero with a mouse-reactive WebGL aurora, gradient
headline, magnetic buttons, smooth scroll, custom cursor, living sections, and a vibrant
**bento cockpit** at `/owner` (passcode for now: `killey-2026`).

---

## 🛠️ What got built (and by whom)
Two AI sessions ran on the same branch tonight:

**Cloud session — the cinematic frontend** (phases A–D in `docs/PHASES.md`):
- Garnet-Aurora color system, Lenis smooth scroll, custom cursor, 0→100 preloader.
- Animated hero (per-letter wordmark + gradient sweep), magnetic CTAs, WebGL aurora shader.
- Living sections (scroll reveals, glow service cards, aurora process panel, hover-lift work grid).
- Vibrant bento cockpit (count-ups, sparkline, progress ring, contribution heatmap, live/sample badges).
- SEO basics: JSON-LD (Person/ProfilePage), OG/Twitter meta, robots + sitemap.

**Local session (me) — research, the hub, and this review:**
- **Deep research** (8-agent, web-cited) → `docs/PLAYBOOK.md` + `docs/RESEARCH.md` addendum.
  *The cloud build follows this playbook* (that's why the palette/components line up).
- **Obsidian vault** (`/vault`) filled out into your "single operating system": per-project
  notes (these feed the case studies), memory (about / preferences / stack & accounts),
  reconciled standing instructions, business + client templates, today's daily log.
- This brief + `docs/SETUP-ENV.md`.

> ⚠️ **Coordination heads-up:** two agents editing one branch nearly collided tonight (I had to
> reset and take a non-overlapping lane). **Recommend: run ONE driver per branch at a time.**
> In the morning, pick which session continues and let the other stand down.

---

## 🔍 Review findings (no blocking bugs — build passes; these are upgrades)
Prioritised; most map to the cloud session's already-queued phases H/I.

1. **Performance (do before merge).** Main JS is ~351KB (110KB gzip) — full Framer Motion +
   GSAP + Lenis are all in the main chunk. Switch Framer to **LazyMotion + `m`**, confirm GSAP
   is actually used (Lenis alone may cover the smooth scroll → drop GSAP if unused), and
   code-split the `/owner` + `/work/:slug` routes. Target Lighthouse mobile ≥ 90.
2. **Share previews are blank.** The SEO block sets `twitter:card = summary_large_image` but
   there's **no `og:image`/`twitter:image`** — so links shared to WhatsApp/X/LinkedIn show no
   image. Add a 1200×630 image (static, or generate with `@vercel/og`). Add `<link rel="canonical">`.
3. **Hide the cockpit from search.** `robots.txt` allows everything — add `Disallow: /owner`
   so your private dashboard isn't crawled/indexed.
4. **Per-route SEO needs the prerender.** Until `vite-react-ssg` lands (their phase H), every
   `/work/:slug` page serves the homepage's meta to crawlers. Phase H fixes this + adds
   per-project `CreativeWork` JSON-LD.
5. **Domain.** JSON-LD/sitemap use the long Vercel alias; switch to your real domain when you
   pick one (see `docs/SETUP-ENV.md` §3).
6. **Preloader** runs ~1.5s on first visit — consider trimming toward sub-second so it never
   feels like a wait.

**Strong already:** reduced-motion is respected everywhere (cursor, smooth-scroll, preloader,
shader all freeze/disable), cursor is gated to fine-pointer devices, the shader is lazy-loaded,
and game embeds are sandboxed. Solid, accessible foundation.

---

## ✅ What you need to do (non-technical)
1. **Review the preview** (link above), phone + desktop. Decide: more/less color? hero vibe ok?
2. **Verify the 3 live games** open in a normal browser:
   Empire `empire-rise.vercel.app` · BMLA Quest `bmla-quest.vercel.app` · BMLA Prep
   `hassan-deals-pk.vercel.app`. If any shows a login wall inside its card, flip that project to
   **public** in Vercel (Deployment Protection off).
3. **Set up the vault in Obsidian:** install Obsidian + the **Git** plugin, open `/vault` as a
   vault (steps in `vault/README.md`). Now your notes sync with the repo.
4. **Later (when wiring login + live data):** paste env vars into Vercel — exact steps in
   `docs/SETUP-ENV.md`.

---

## 📋 Copy-paste prompts for the next moves
Pick one and paste it to your chosen session:

- **Keep going, all phases:**
  > "Continue the build through phases E→I from docs/PHASES.md. Do the perf re-tune from
  > docs/MORNING-BRIEF.md (LazyMotion + `m`, drop unused GSAP, code-split routes), add og:image
  > + canonical + `Disallow: /owner`, then run Lighthouse and paste the scores in the PR."

- **Secure login + live cockpit data (phases F/G):**
  > "Build the serverless `/api` from docs/PLAYBOOK.md §7 + §9: HMAC signed-cookie auth
  > (api/auth/*), then api/github + api/vercel with graceful sample fallback, and wire them into
  > the bento cockpit with truthful Live/Sample badges. I'll paste the env vars from docs/SETUP-ENV.md."

- **Case studies (phase E):**
  > "Build rich /work/:slug case studies (problem → build → outcome) from the vault project
  > notes in vault/projects/*.md, with 3D-tilt cards, cross-route View Transitions, and the
  > playable embeds. Truthful content only."

- **Tune the look:**
  > "Tune the palette: [more/less color | brighter | calmer | lean more crimson | more violet/cyan].
  > Keep it premium, max 2 accents on screen, reduced-motion safe."

- **Make it real (SEO + share cards):**
  > "Do phase H: add vite-react-ssg prerender, per-route meta + Person/CreativeWork JSON-LD,
  > @vercel/og share images, canonical + sitemap. Verify crawlers get real HTML per route."

- **Add the vault read/write API (Obsidian ⇄ cockpit):**
  > "Add api/vault.js (GitHub Contents API, sha-guarded read/write) and a cockpit notes panel so
  > I can read/write vault/memory + daily notes from /owner. Git stays the source of truth."

- **Ship it:**
  > "Run phase I (perf re-tune + Lighthouse + verify), then prepare the production flip:
  > confirm the vercel.json flip on a preview, screenshots in the PR, and tell me exactly what to
  > click to merge."

---

## 🗂️ Where everything lives (your operating system)
- **Site content (one place):** `react-app/src/data/site.js`
- **Look / palette:** `react-app/src/index.css` + `react-app/tailwind.config.js`
- **Notes / memory / instructions:** `/vault` (Obsidian) · **structured lists:** Notion ·
  **files:** Drive · **code+deploys:** GitHub/Vercel
- **The plan & decisions:** `docs/PLAYBOOK.md`, `docs/PHASES.md`, `docs/DECISIONS.md`, `docs/RESEARCH.md`
- **Secrets setup:** `docs/SETUP-ENV.md`
