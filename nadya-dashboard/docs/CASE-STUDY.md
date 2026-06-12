# Petalfall — case study & launch ammo (owner's outreach kit)

Live: https://ruang-nadya.vercel.app · Landing: /welcome · Privacy: /privacy
Everything below is true and verifiable in this repo — use it as-is in
posts, the portfolio, and client pitches. No invented numbers.

## One-liner
**Petalfall — a quiet space to grow.** A local-first life tracker (activities,
habits, money, journal) where your real days grow a living 3D garden.
No ads, no tracking, works offline, syncs when you sign in.

## What makes it different (the honest pitch)
- **No failure-shaming, by design.** No streak loss, no red marks, no
  guilt graphs. Quiet weeks grow a sprout — never an empty plot.
- **A garden, not a dashboard.** Weekly "wishes" tuned to your own rhythm,
  XP and levels derived retroactively from everything you ever logged, a
  WebGL garden diorama grown from your real weeks.
- **Local-first, honestly.** Full app with zero account. Sign in and a
  3KB sync engine mirrors your space — newest change wins, offline writes
  never lost, first merge keeps reversible local snapshots.
- **Fast and tiny.** ~119KB gzip core JS (smaller than most sites' cookie
  banners), 60fps WebGL with battery guards, full reduced-motion support.

## The build story (for the portfolio / "built with AI" angle)
- Directed end-to-end by Hassan (KILLEYYY) using Claude-based agents:
  planning, code, tests, deploys, and the Supabase backend — shipped as
  31 reviewed pull requests on this repo, each build-green and verified
  live in production before the next began.
- Stack: Vite + React 18 + Tailwind, hand-rolled charts/motion/3D (one
  tiny WebGL lib for the shader scenes), Supabase (auth + RLS-locked KV
  sync), Vercel. Node-based logic test suites for every data feature.

## Launch checklist (owner)
1. Supabase email template + Site URL (docs/CLOUD-SETUP.md) — sign-in codes.
2. Custom SMTP (Resend/Brevo free) — before strangers sign in.
3. Gumroad / Lemon Squeezy product: "Petalfall Pro — $19, once, forever" →
   paste the link into `src/data/pro.js` `checkoutUrl` (one line).
4. Domain: petalfall.app ($9.99/yr) — vercel.com/domains,
   attach to the ruang-nadya project; rename the project while there.
5. Screenshots/screen-recordings for posts: Today hero tilt (desktop),
   Journey 3D garden, Wrapped story, a Money month. Dark room, phone +
   desktop side by side.

## Post drafts (edit voice to taste)

**X / Threads:**
> I built a life tracker that refuses to guilt-trip you.
> No streak loss. No red marks. Your quiet weeks still grow something.
> It's called Petalfall — local-first, free, runs in your browser, and your
> weeks literally grow a 3D garden.
> [link] — would love brutal feedback.

**LinkedIn (client-fishing version):**
> Shipped: Petalfall — a local-first life-tracking PWA with a real-time 3D
> garden grown from your data. 31 production PRs, AI-directed build,
> Supabase sync with row-level security, 119KB core bundle.
> This is what a one-person, AI-accelerated product team looks like in
> 2026. If you want an app built at this pace — DMs open.

**Instagram caption:**
> your habits, money & journal — but it feels like a place, not a
> spreadsheet 🌹 free in bio. no ads, no tracking, your data stays yours.

## Pricing rationale (if asked)
$19 lifetime at launch ("founding"): low enough for impulse, high enough
that 53 sales = $1k. Sync is the paid spine; the free app stays genuinely
complete so the recommendation loop ("just try it, it's free") keeps
working.
