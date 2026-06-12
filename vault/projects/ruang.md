# Ruang — your quiet space

**Status:** live · monetization armed, waiting on owner steps
**Live:** https://ruang-nadya.vercel.app (`/welcome` landing · `/privacy`)
**Repo:** `nadya-dashboard/` in killey-portfolio · own Vercel project
**Backend:** Supabase `ruang` (`vuyexsgqemslttivlzoy`, ap-southeast-1, free)

## What it is

Local-first life tracker PWA — activities, habits, custom trackers (Tend),
money (income/expense/savings), journal — with a derived journey layer:
XP/levels, weekly "wishes" (gentle quests from her own rhythm), 17
achievements, nameable streak plant, WebGL 3D garden grown from real weeks,
weekly Wrapped story. Email-OTP accounts + offline-first cloud sync
(newest-wins, lossless first merge). Started 2026-06-12 as a gift for Nadya;
same day rebranded Ruang and rebuilt for the masses. ~34 production PRs.

## The $1k/30-days plan (set 2026-06-12)

- **Product:** Ruang Pro **$19 once** (cloud sync + themes/pets + founding
  badge). Checkout = paste Gumroad/Lemon Squeezy link into
  `nadya-dashboard/src/data/pro.js` → buy button appears on /welcome.
  53 sales = $1k.
- **Services:** Ruang as flagship case study to close 1–2 custom builds at
  ~$500. Outreach kit with post drafts: `nadya-dashboard/docs/CASE-STUDY.md`.

## Owner action list (the blockers)

1. Supabase dashboard: Magic-Link template → show `{{ .Token }}`; Site URL →
   the prod URL. Then custom SMTP (Resend/Brevo free) before public sign-ins.
   Runbook: `nadya-dashboard/docs/CLOUD-SETUP.md`.
2. Create Gumroad or Lemon Squeezy product → send/paste the checkout URL.
3. Domain: ruang.life $2.99/yr (vercel.com/domains) + rename Vercel project.
4. Vercel: free tier hit the 100 deploys/day cap on launch day — set an
   Ignored Build Step on the killey-portfolio project, or upgrade Pro.

## Engineering notes

- Budget: JS ≤150KB gzip (≈120 main + lazy WebGL/auth/sync/landing chunks).
- 8 node test suites: `cd nadya-dashboard && npm run test:data`.
- Day keys LOCAL-time only via `src/lib/dates.js`. Additive schema always.
- `src/lib/storage.js` is THE persistence seam; sync rides a write hook on
  it. Device-local keys (session/timer/seen-flags/migrated:*) never sync.
- DNA: no failure-shaming anywhere — no decay, no red, positive-only copy.
