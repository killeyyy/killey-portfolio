# DECISIONS — Architecture Decision Log (ADR)

Running log of key choices for the KILLEYYY portfolio + hub. Newest decisions appended.
Status: **proposed** = awaiting owner sign-off · **accepted** = confirmed · **superseded**.

---

### ADR-001 — Promote the Vite/React project to production
- **Status:** accepted (owner, this session)
- **Decision:** Make `react-app/` (Vite + React) the production site; retire the single-file CDN
  `index.html` after parity. Centralize content into one source of truth both modes read.
- **Why:** The cinematic features (WebGL hero, playable embeds, live cockpit) and the Lighthouse
  ≥90 budget are impractical with CDN Tailwind/Babel; content currently duplicated across
  `index.html` and `react-app/src/App.jsx` drifts apart; secrets can't be hidden in a single file.
- **Consequences:** Real build pipeline, components, env vars; a Vercel "flip" is required (ADR-008).

### ADR-002 — Prerender to static HTML (NEW, from research)
- **Status:** proposed (recommended; researched)
- **Decision:** Add build-time static prerendering (`vite-react-ssg` or equivalent) so each route
  ships real HTML with title/description/OG/JSON-LD; not a client-only SPA. Avoid full SSR/Next.js.
- **Why:** Social + AI crawlers don't execute JS; Googlebot's JS rendering is deferred/unreliable.
  An empty `<div id="root">` = no link previews, weak SEO. (`docs/RESEARCH.md` §5.1.)
- **Consequences:** Slightly more build config; per-route meta must be defined; covers known routes
  (fine for a portfolio).

### ADR-003 — Headline features for first build
- **Status:** accepted (owner)
- **Decision:** Cinematic WebGL/shader hero (reduced-motion safe) + playable project cards with
  case-study deep dives. Defer Cmd+K palette, AI chat, custom cursor, sound, theming.
- **Why:** Owner's pick; research ranks these highest-impact for an indie builder. Deferred items
  are cheap to add later and carry a11y caveats.

### ADR-004 — Free-tier services only
- **Status:** accepted (owner)
- **Decision:** Vercel serverless (free) for secrets/login/live data. No paid APIs now (AI chat
  deferred). Optional free upgrades (Clerk auth, Supabase DB) documented, not adopted.
- **Why:** Owner budget = $0/month.

### ADR-005 — Premium jewel-tone palette (designer's call)
- **Status:** proposed (owner deferred to me; confirm vibe in PROPOSAL §3)
- **Decision:** Off-black ink `#0E0E10` base (not pure `#000`, avoids halation), champagne/silver
  neutrals, **garnet→crimson** lead accent (`#7B1E2B`→`#C8323C`), restrained smoky-jade emerald
  `#1F6F5C` for "live/shipped" only, champagne/gold `#C9A86A` metallic detail. Display serif +
  monospace type. Replaces emerald-everywhere. All pairings audited for WCAG AA (4.5:1 / 3:1).
- **Why:** Owner wants "premium, elegant, crimson/maroon/emerald." Research: 2026 favors muted
  smoky jewel tones, single restrained accent, off-black surfaces, serif+mono pairing.
- **Open:** owner may prefer crimson-lead over gold-detail; final hues tuned in code.

### ADR-006 — Motion & WebGL stack
- **Status:** accepted (researched)
- **Decision:** Framer Motion (with `LazyMotion` + `m`, ~4.6KB initial) as primary; `ogl` (~29KB)
  for the single-shader hero (NOT three.js/R3F). CSS scroll-driven animations for reveals
  (progressive enhancement, `@supports` + Firefox fallback). Same-document View Transitions for
  route morphs. GSAP ScrollTrigger only if scrubbed/pinned choreography is needed later (now free).
- **Why:** Smallest bundles that hit the cinematic goal under the Lighthouse budget (RESEARCH §2).
- **Consequences:** Hero must lazy-load + static poster + reduced-motion freeze + DPR cap + rAF
  pause offscreen.

### ADR-007 — Secure owner auth via serverless signed cookie
- **Status:** proposed (recommended)
- **Decision:** Replace the plaintext client password with a Vercel serverless login: hashed
  password + HMAC-signed httpOnly cookie; data routes verify the cookie server-side. Secrets in
  Vercel env vars only. Clerk free tier documented as the social-login alternative.
- **Why:** Current password ships in the bundle (readable in View Source). (RESEARCH §4 / brief.)

### ADR-008 — Vercel migration via atomic `vercel.json` flip
- **Status:** proposed (recommended)
- **Decision:** Keep root `index.html` serving prod while building; reach parity; then in ONE
  revertible commit add `vercel.json` (`buildCommand`/`outputDirectory: react-app/dist`, SPA
  rewrites excluding `/api/`). Serverless functions in top-level `/api`. Delete legacy `index.html`
  only after the new deploy is confirmed live.
- **Why:** "main deployable at every commit"; instant `git revert` safety net.

### ADR-009 — Knowledge hub: Obsidian + Notion + Drive, built together with the portfolio
- **Status:** accepted (owner)
- **Decision:** `/vault` markdown (clients/business/projects/personal/memory/instructions/daily) +
  `CLAUDE.md` in-repo, synced via Obsidian Git. Structured data → Notion; files → Drive; dev
  activity → GitHub/Vercel. Cockpit reads (build-time) + reads/writes (serverless GitHub Contents
  API, sha-guarded). Graceful fallbacks when a token is absent.
- **Why:** Owner wants one place for everything; uses tools he already has; $0.

### ADR-010 — Content ground truth overrides the original brief
- **Status:** accepted (owner, this session)
- **Decision:** AI-first builder/creator (NOT student/IBA framing); **no mantra** ("Sabit Qadam"
  removed); headline leads with what he builds; location hidden; contact = IG @hssn.shah, LinkedIn
  hassan-sardar-shah-941625170, emails hassansardarshah1@gmail.com (primary) + h.shah.26396@khi.iba.edu.pk;
  feature Empire / BMLA Quest / BMLA Prep Command Center (live, verified READY on Vercel) + Shadow
  Kombat / ASCENT (WIP); drop NeonSurvivor + Kapture MCP. No invented metrics.
- **Why:** Original brief carried stale "old memories"; owner corrected them. Recorded here + to be
  mirrored into `/vault/memory` + `CLAUDE.md` so they don't resurface.
- **Verification:** Empire-rise production deployment confirmed `READY` via Vercel API; the public
  `*.vercel.app` aliases returned 403 to automated fetch (bot/protection) — must be browser-verified
  before featuring.
