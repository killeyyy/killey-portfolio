# PROPOSAL — KILLEYYY portfolio redesign

*Plain-language proposal for Hassan. Read this, then approve or tweak. Where there's a real
choice, I give options + a recommendation. Backed by `docs/RESEARCH.md`.*

---

## 1. The big picture (what we're building)

A cinematic, premium, **fast** personal site for **KILLEYYY** — an AI-first builder/creator who
ships games, sites and content. Two modes stay:

- **Public site** — your cinematic showcase. Strangers land, go "whoa," and *play your games right
  on the page.*
- **Owner cockpit** (private) — your command center: live GitHub/Vercel/Notion/Drive data + your
  Obsidian notes, all in one place so you stop switching tools and forgetting things.

The work happens on a safe branch; **your live site never goes down during the rebuild.**

---

## 2. One important upgrade the research forced (please note)

The research turned up a real problem with the simple plan: **Google and social apps (Instagram,
X, LinkedIn, WhatsApp) can't "see" a React site that builds itself in the browser.** They'd show a
blank preview and rank you poorly. 

**Fix:** we "pre-bake" the pages into real HTML at build time (a free build step, tool:
`vite-react-ssg`). Result: proper Google results and rich link previews when you share yourself.
No extra cost, no change to how you edit content. *This is the kind of thing we caught by
researching before building.*

---

## 3. The look — your palette (this needs your eyes)

You said "premium, elegant — crimson, maroon, emerald, whatever you think right." Here's my call,
tuned to what reads as luxury on dark screens (muted "smoky" jewel tones, off-black not pure black
to avoid eye-strain glow). **Tell me if the vibe is right; exact shades get final-tuned in code.**

| Role | Color | Hex (starting point) |
|---|---|---|
| Base "ink" (background) | near-black, faint cool | `#0E0E10` |
| Raised surfaces (cards) | one notch lighter | `#17171B` |
| Hairline borders | dim champagne | `#2A2722` |
| Primary text | soft silver (not pure white) | `#E8E6E1` |
| Muted text / labels | champagne-grey | `#A7A29A` |
| **Lead accent** | **garnet → crimson gradient** | `#7B1E2B` → `#C8323C` |
| Rare 2nd accent | smoky jade (only for "live/shipped") | `#1F6F5C` |
| Metallic detail | champagne/gold sheen (hairlines, focus) | `#C9A86A` |

**Type:** a dramatic **display serif** for headings (your big "KILLEYYY" wordmark) + a **monospace**
for small labels/metadata (the "builder/engineer" signal). Premium + technical, exactly your brand.

> If you'd rather lead with **crimson over gold**, or want a different mood, say so now — changing it
> later is cheap *before* build, costly after.

---

## 4. What goes in the first build (ranked by impact vs effort)

These come straight from the research's ranked list. **First build = the cinematic public site +
the secure cockpit foundation.**

**Shipping now:**
1. **Cinematic shader hero** — a living maroon-lit background that makes people stop. Has a calm
   static version for phones / reduced-motion so it stays fast and kind. *(Your pick.)*
2. **Playable project cards + deep-dive case studies** — your live Vercel games **embedded and
   playable right on the page** (click-to-launch, fullscreen). This is your unfair advantage; most
   portfolios only link out. Each flagship gets a "problem → how I built it → what shipped" story.
   *(Your pick.)*
3. **The premium design system** — palette above, kinetic display-serif wordmark, grain texture,
   editorial layout, tasteful motion.
4. **Speed + accessibility built in** — Lighthouse ≥ 90 on mobile, keyboard-friendly, readable
   contrast, respects "reduce motion."
5. **SEO + share cards** — proper Google results, auto-generated branded preview images when you
   share any page (`@vercel/og`), and structured data so Google understands "Hassan Sardar Shah =
   KILLEYYY."
6. **Secure owner login** — your password stops living in the code; it becomes a real server-checked
   login (free).
7. **Command-center cockpit** — live GitHub/Vercel data, your Notion + Drive, and your Obsidian
   vault, with graceful "sample data" when a connection isn't wired yet.

**Deferred to a later pass (agreed):** Cmd+K command palette, the "ask my portfolio" AI chat,
custom cursor, sound, light/dark toggle. Cheap to add once the foundation is solid.

---

## 5. Your "one place for everything" (the hub)

This repo becomes your operating system, synced with Obsidian/GitHub/Drive/Notion:

- A **`/vault`** folder (markdown) with `clients/`, `business/`, `projects/`, `personal/`,
  `memory/`, `instructions/`, `daily/`. You open it in **Obsidian**; it syncs through GitHub (the
  Obsidian "Git" plugin). I'll give you click-by-click setup.
- A **`CLAUDE.md`** file holding your standing facts/instructions/brand rules — so me and Codex read
  the *correct* you every time and stale stuff (like "Sabit Qadam") never comes back.
- The cockpit can **read and write** these notes, and pull live data from your connected tools.

Structured lists (leads, clients, pipeline) live in **Notion** (you already use it); notes/memory in
**Obsidian**; files in **Drive**. All free, all tools you already have.

---

## 6. What this will cost you: **$0/month.** What you'll click (later, I'll guide you)

- Paste a few secret keys into Vercel's dashboard (Settings → Environment Variables) when we wire
  live data + login. Nothing secret ever goes into the code.
- Install Obsidian's "Git" plugin and point it at the `/vault` folder.
- Possibly flip your 3 game projects to "public" in Vercel if they're behind login (I'll confirm
  by testing them in a browser first — your rule: truthful content only).

---

## 7. How we ship (so nothing breaks)

Small, reviewable commits on branch `claude/jolly-archimedes-EBecL`, behind a **draft PR**. Your
current live site keeps serving the whole time. Right at the end we "flip" to the new site in one
reversible step, after I've verified it on a preview link and run Lighthouse. You'll get
screenshots + scores in the PR before anything goes live.

---

## 8. ✅ What I need from you now

1. **Palette/vibe:** good as-is, or lead with crimson / change the mood? *(Section 3)*
2. **Anything in Sections 4–5 you want added, cut, or reordered?**
3. **Green light to start building** the design system + public site (Phase 3), or want to discuss
   first?

Once you say go, I start with the design system and the single content source, then the hero and
playable cards — committing as I go so you can watch it take shape.
