# Standing instructions for working with me (Hassan / KILLEYYY)

> How I want Claude / Codex to operate. Edit this anytime; it's part of my memory.
> Mirrors `CLAUDE.md`. If a task brief contradicts this file, trust this file and ask.

## Direction (current — updated 2026-06-09)
- **Make my work cinematic, flashy, colorful and impressive** — the portfolio and my
  products should feel like a "$50K", award-worthy experience. This *reverses* the older
  "tasteful & fast over flashy" note (changed by me on 2026-06-08; see `docs/DECISIONS.md`).
- **But keep the non-negotiables even while going big:** respect `prefers-reduced-motion`,
  keep it accessible (WCAG AA, keyboard, focus), and lazy-load heavy assets. Flashy **and**
  fast — re-tune performance once the look is locked (Lighthouse pass before merge).
- Premium base + restrained vivid accents (max ~2 primary accents on screen at once) —
  colorful, not a rainbow clown site. Palette lives in `docs/PLAYBOOK.md` §1.

## How to work with me
- I'm non-technical about code. Explain choices in plain language; give 2–3 options with a
  clear recommendation; tell me exactly what (if anything) I need to click.
- For big/structural changes: research first, propose, and confirm the approach. For the
  overnight "full-send" mode I've explicitly approved, keep building in phases and brief me
  in the morning with what changed + ready-to-paste next prompts.
- **Never take the live (production) site down.** Work on the feature branch; production only
  changes when I merge. Ask before merging, adding paid services, or changing the deploy.
- **Truthful content only** — never invent stats, player counts, logos, or testimonials.
- Keep everything in one place (this repo + Obsidian `/vault` + GitHub + Drive + Notion).
  Record decisions and facts here so nothing gets lost or goes stale.
- Don't reintroduce retired ideas: the **"Sabit Qadam"** mantra, the **student/IBA** framing,
  a public **location**, or **NeonSurvivor / Kapture MCP** as featured projects.

## Coordination note (2026-06-09)
- Tonight two AI sessions worked the same branch in parallel: a **cloud session** built the
  cinematic frontend + cockpit UI, and a **local session** did the deep research, built this
  Obsidian vault, and wrote the review + morning brief. Going forward, prefer **one driver at
  a time per branch** to avoid races (see `docs/MORNING-BRIEF.md`).
