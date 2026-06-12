# Ruang → app stores (the documented-later plan, Era 2 PR 10 item)

Ruang ships as a PWA first — installable, offline, zero store tax. App
stores come later, when the PWA has users asking for them. This is the
runbook for that day; nothing here blocks anything now.

## Recommended wrapper: Capacitor

- `npm i @capacitor/core @capacitor/cli && npx cap init ruang life.ruang.app`
  inside `nadya-dashboard/` (webDir: `dist`). The app is already
  local-first + responsive + reduced-motion-safe — no code changes needed
  to boot inside a WebView.
- Per platform: `npx cap add android` / `ios`, then `npm run build &&
  npx cap sync` per release. Keep store builds on tagged commits.

## Things that change inside a wrapper

- **PWA service worker**: disable in the native build (Capacitor serves
  local files; SW caching is redundant and complicates updates). Gate the
  registration on `!window.Capacitor`.
- **Auth emails / deep links**: the email-OTP flow already avoids magic
  links, so nothing breaks cross-context — codes work in any WebView.
- **Haptics**: swap `navigator.vibrate` for `@capacitor/haptics` to get
  iOS support (the web API never fires there).
- **Status bar / safe areas**: already handled via `viewport-fit=cover` +
  `env(safe-area-inset-*)`.

## Store requirements checklist

- Android (Play): privacy policy URL (have: `/privacy`), data-safety form
  (localStorage + optional Supabase sync, no ads/tracking — truthful and
  easy), target API level per current Play policy, $25 one-time fee.
- iOS (App Store): Apple Developer $99/yr, App Review note that accounts
  are optional (guideline 5.1.1 friendly — guest mode is full-featured),
  sign-in works without social providers (email OTP qualifies).
- Both: screenshots from the real app (Today hero, 3D garden, Wrapped),
  the no-failure-shaming angle is the store listing's hook.

## Not chosen (and why)

- **TWA/Bubblewrap** (Android-only, thinnest wrapper): viable fallback,
  but no iOS story and no native haptics.
- **React Native / full rewrite**: throws away a working product for
  parity risk. No.
