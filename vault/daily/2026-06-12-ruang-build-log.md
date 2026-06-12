# 2026-06-12 — Ruang ship log

The day Ruang went from gift to product. 19 production PRs (#21–#39),
all squash-merged, all build-green, 9 node test suites by end of day.

## Shipped & LIVE (through #30)
Tend (custom trackers + tags + weekly intentions) · garden wishes ·
seed packets · richer stats (mood links, time-of-day, month recap) ·
accounts (email-OTP, Supabase backend verified in SQL) · the 3D garden
(landed the stalled visual-lane PR) · Money 2.0 (income/expense) ·
Hero3D depth scenes on Today/Stats/Money/Journey · landing `/welcome` +
`/privacy` + error boundaries · own-your-plant defaults.

## Merged, AWAITING DEPLOY (#31–#39 — Vercel free tier hit 100/day)
Cloud sync (offline-first, lossless merge) · pricing + Pro config +
outreach kit (`docs/CASE-STUDY.md`) · tags-in-stats + wishes-on-Today +
sync status + README rewrite · Tend XP + 2 achievements + mood editing ·
tracker insights + vault project note · v2.0.0 + backup filename ·
poster rebrand + Wrapped wishes beat · the money wish · onboarding
plants seed packets.

Unblock: quota resets ~24h, or Redeploy button on the ruang-nadya
project, or upgrade Vercel. A deploy-window watch + a ready-to-merge
trigger PR are armed in the build session.

## Owner blockers (the $1k path)
1. Supabase email template `{{ .Token }}` + Site URL → then SMTP
   (Resend/Brevo) — `nadya-dashboard/docs/CLOUD-SETUP.md`.
2. Gumroad/Lemon Squeezy product → paste URL in
   `nadya-dashboard/src/data/pro.js`.
3. Domain: ruang.life $2.99/yr · 4. Vercel Ignored Build Step or Pro.

Full project state: [[../projects/ruang]]
