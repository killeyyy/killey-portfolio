# Ruang cloud setup (Supabase) — owner runbook

Project: **ruang** (`vuyexsgqemslttivlzoy`, region `ap-southeast-1`, free tier $0/mo)
API URL: `https://vuyexsgqemslttivlzoy.supabase.co`
Schema: one `public.kv` table (per-user key/value mirror of `nadya:*`), RLS
owner-only, last-write-wins trigger (older writes dropped, clock skew >5min
clamped). Verified: cross-user reads return 0 rows; stale updates are no-ops.

## Required dashboard steps (2 minutes, before sign-in works end-to-end)

1. **Show the 6-digit code in the email**
   Dashboard → Authentication → Email Templates → *Magic Link*:
   replace the body with something like
   `<p>Your Ruang code is:</p><h2>{{ .Token }}</h2><p>It expires in an hour.</p>`
   (The app uses OTP codes, not clickable links — links break in email-app
   in-app browsers and across devices.)
2. **Site URL**
   Dashboard → Authentication → URL Configuration →
   Site URL: `https://ruang-nadya.vercel.app`

## Before sharing sign-in with anyone else (custom SMTP — mandatory)

Supabase's built-in email sends **2 emails/hour** and **only to project team
members** — fine for your own testing, unusable in production.

- Create a free [Resend](https://resend.com) (3k emails/mo) or
  [Brevo](https://brevo.com) (300/day) account, verify a sender.
- Dashboard → Authentication → SMTP Settings → enable custom SMTP, paste
  host/port/user/password from the provider, set a sender like
  `Ruang <hello@yourdomain>`.

## Free-tier housekeeping

- **Idle pause:** free projects pause after ~1 week without traffic. The
  GitHub Action `.github/workflows/supabase-keepalive.yml` pings the REST
  endpoint every 3 days to prevent this. If it ever pauses anyway, restore
  from the dashboard (90-day restore window).
- The publishable key in `src/lib/cloud/config.js` is safe to be public —
  RLS is the security boundary. Never put the `service_role` key anywhere
  client-side or in git.

## What's live vs not

- ✅ Auth (email OTP) + session refresh + sign-out; guest mode untouched.
- ✅ Sync: signed-in users' `nadya:*` data mirrors to the kv table —
  persisted dirty queue, newest-write-wins per key, tombstoned deletions,
  lossless first merge (`migrated:*` local snapshots). Guests sync nothing.
- ⏳ Pro gating + checkout — waiting on the payment-rail account
  (Gumroad / Lemon Squeezy).
