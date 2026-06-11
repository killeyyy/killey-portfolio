# RESEARCH — Cinematic, premium portfolio for KILLEYYY

**Purpose.** Evidence base for upgrading Hassan Sardar Shah's ("KILLEYYY") portfolio into a
cinematic, premium, elegant, *and fast/accessible* site, built on Vite + React + Tailwind +
Framer Motion with a lightweight `ogl` WebGL hero on Vercel. Hard budget: Lighthouse mobile
≥ 90 (Performance / Accessibility / Best-Practices / SEO) and WCAG AA with
`prefers-reduced-motion` support.

**Method.** Five parallel research agents (one per angle) ran ~45 web searches total and
synthesized findings into the Pattern → Why it works → Applies to KILLEYYY → Cost/Risk format.
**Honesty caveat:** in this environment, direct page fetches to several authoritative domains
(web.dev, MDN, w3.org, developer.chrome.com, Google Search Central, itch.io) returned HTTP 403,
so a number of claims are corroborated via search-result summaries of those same official pages
plus a second independent source, rather than full-page reads. Every claim is tied to a named
source URL below; treat exact secondary statistics (engagement multipliers, byte sizes) as
source-reported and worth a spot-check before quoting as hard data. Core technical thresholds
(Core Web Vitals, WCAG ratios, browser-support versions, OG image specs) were cross-checked
across multiple official sources and are internally consistent.

**Date:** 2026-06-08.

---

## 1. Award-winning portfolio patterns (2025–2026)

**1. Cinematic preloader with an oversized rolling counter (0→100) gated on real asset load.**
Pattern — full-screen intro: an oversized % counter synced to a progress bar, dismissed with an
upward wipe revealing the page (e.g. Alexander Kjær Grote's Readymag "Project of the Year";
Igloo Inc's engineered load). Why — converts unavoidable load into a branded, anticipatory
moment and lets you compile shaders/fonts/hero assets before the curtain lifts. Applies — ink-black
screen, champagne/silver oversized counter in the display serif, maroon→crimson progress bar;
sync dismissal to `window.load`. Cost/Risk — never block content longer than real load; provide a
skip and respect `prefers-reduced-motion` (instant fade); counts toward LCP if the hero is gated.

**2. Display-serif maximalism paired with a monospace utility voice.** Pattern — high-contrast
display serif for headings + monospaced accent for metadata/labels/buttons ("neo-serif + mono").
Why — serif signals editorial craft; mono signals "builder/engineer"; the tension reads premium.
Applies — champagne display serif for the name/section titles; a mono (Geist Mono / similar) in
silver for project metadata, timestamps, "ships fast" labels — on-brand for an AI-first builder.
Cost/Risk — two+ families add font weight; subset & preload; keep mono at accessible sizes.

**3. Oversized variable type as the layout itself (up to ~12vw), kinetic on scroll/cursor.**
Pattern — ultra-large display fonts, fluid marquees, staggered text reveals; variable fonts
(Fraunces "wonk," Recursive) animate weight/optical-size. Why — typography becomes the hero image:
bandwidth-cheap, infinitely sharp, expressive (the dominant 2026 type direction). Applies — a
massive "KILLEYYY" wordmark that shifts weight on scroll; a slow champagne skills/tools marquee.
Cost/Risk — variable fonts are larger single files but replace many statics; animate
`transform`/opacity not `font-weight` to avoid jank; guarantee a readable static fallback.

**4. Smooth, physics-based scroll (Lenis) orchestrating reveals and pinned sections.** Pattern —
replace native scroll with Lenis driven by GSAP's ticker, with ScrollTrigger pinning/staggering.
Why — a weighted, intentional scroll cadence is the most consistent "expensive" tell. Applies —
pin the hero, reveal projects in staggered beats, parallax background grain/gradients. Cost/Risk —
scroll hijacking harms a11y if overdone; keep keyboard/anchor nav working; disable smoothing under
`prefers-reduced-motion`; watch INP/LCP, lazy-init below-the-fold triggers. *(See §2.1 — CSS
scroll-driven animations are the lighter-weight alternative for most reveals.)*

**5. Scroll-as-narrative: a sequenced, chaptered story, not a list of sections.** Pattern — award
site *Abstract Intelligence* (Awwwards SOTD + Dev Award + FWA) is structured as a scroll-based
digital story with a 3D hero and light interactive beats. Why — a beginning→middle→end arc gives
motion a reason to exist; cohesion beats spectacle. Applies — sequence: identity → "what I build
with AI" → 2–3 flagship projects as chapters → contact, each chapter one hero idea + one
interaction, with the maroon→crimson thread as the through-line. Cost/Risk — pacing is design
effort; keep content skimmable and deep-linkable per chapter.

**6. Restrained single-accent color on off-black; accent reserved for emphasis.** Pattern — 2026
moves away from all-over neon; accents "used sparingly," monochrome base + occasional adaptive
accents. Why — scarcity makes the accent meaningful and directs the eye to CTAs/key moments.
Applies — ink-black canvas + champagne/silver "neutral metal," maroon→crimson reserved for primary
CTAs/active states/the narrative thread; emerald only as a rare second accent ("shipped" ticks).
Cost/Risk — enforce via tokens (one "accent" role); verify saturated crimson/emerald contrast.

**7. Muted "smoky" jewel tones, not pure saturated jewels.** Pattern — 2026 jewel tones skew
slightly muted/smoky — plum noir, smoky jade, garnet, burgundy. Why — desaturated jewels sit
better on dark, reduce halation, read editorial not "gamer-RGB." Applies — pull maroon→crimson
toward garnet/burgundy and emerald toward smoky jade for surfaces/gradients; brightest crimson only
for tiny focal accents. Cost/Risk — muted tones can drop below 3:1/4.5:1 — for surfaces/large
shapes, not body text.

**8. Off-black surfaces and tonal elevation — never pure `#000`.** Pattern — off-white text
(`#E0E0E0`–`#F0F0F0`) on dark gray (`#121212`–`#1E1E1E`); signal depth with lighter tonal
surfaces/hairline borders, not just shadows. Why — off-black reduces halation (text glow affecting
~1 in 3 people with astigmatism) and eye fatigue while keeping the cinematic dark feel. Applies —
base `#0E0E10`–`#121214` ("ink"), cards a notch lighter `#1A1A1E` with hairline champagne borders,
body text soft silver not pure white. Cost/Risk — still must independently hit 4.5:1 / 3:1 in the
dark theme; audit every accent-on-dark pairing.

**9. Grain/noise texture over gradients via SVG `feTurbulence` (cheap, scalable).** Pattern —
inline SVG `feTurbulence` (`fractalNoise`, tuned `baseFrequency`/`numOctaves`) at ~15–30% opacity
over gradients/hero/cards. Why — grain breaks up flat dark fields and banded gradients, adding
tactile "film" depth that signals craft. Applies — a subtle grain layer over the ink background and
maroon→crimson mesh hero; low opacity so champagne text stays crisp. Cost/Risk — large *animated*
`feTurbulence` is GPU-expensive — prefer a static tiled noise PNG/SVG; keep it behind text.

**10. Custom cursor + magnetic micro-interactions on key elements.** Pattern — cursor transforms
over items ("view project" pill), magnetic CTAs that elastically pull toward the pointer. Why —
rewards exploration, telegraphs affordances, adds crafted polish. Applies — magnetic primary CTA in
crimson; a minimal champagne cursor that becomes a "view project" pill over case studies.
Cost/Risk — keep a visible focus ring, large hit areas, sensible touch fallback; desktop fine-pointer
only; reduced-motion guarded. *(See §2.5 for a11y specifics.)*

**11. WebGL/3D sculptural hero — engineered for fast first paint.** Pattern — top Sites of the
Year lead with a 3D/WebGL hero (Igloo Inc, Awwwards Site of the Year 2025; *Abstract
Intelligence's* 3D sculptural hero) with staged texture/shader loading. Why — a living, reactive
hero is the strongest "wow"/creativity signal — but award teams obsess over progressive loading.
Applies — one restrained shader/3D focal element (slowly turning crimson-lit form or particle
field), one hero idea not many. Cost/Risk — highest effort/perf cost: bundle, shader-compile jank,
mobile GPU, battery — lazy-load, static poster fallback, reduced-motion/low-power gate. *(See §2.3
and §4 for the implementation discipline.)*

**12. View Transitions for seamless, app-like page/section changes.** Pattern — Cyd Stumpel's
Awwwards SOTD 2025 portfolio uses the View Transitions API for fluid morphs. Why — continuity feels
premium and is a low-overhead way to look advanced. Applies — project list→detail morphs
(shared-element transition on the project thumbnail/title). Cost/Risk — progressive enhancement
(instant nav fallback); shorten/disable under reduced-motion. *(Support detail in §2.2.)*

**13. Asymmetric/broken editorial grid with deliberate whitespace and marquees.** Pattern — broken
grids, asymmetrical image containers, generous negative space, fluid marquees. Why — asymmetry +
whitespace create focal hierarchy and a curated, magazine rhythm. Applies — one large feature
project + smaller staggered supports, wide champagne margins, a slow tool/skill marquee divider.
Cost/Risk — must stay responsive and keyboard-navigable; logical DOM/reading order independent of
visual placement; marquees pause on hover/focus and respect reduced-motion.

**14. Build to the Awwwards scoring weighting — Design 40 / Usability 30 / Creativity 20 / Content 10.**
Pattern — Awwwards scores Design 40%, Usability 30%, Creativity 20%, Content 10% (18+ jurors,
outliers dropped) + community vote; FWA rewards the experimental more. Why — Usability is weighted
second-highest, so load speed/responsiveness/navigability matter nearly as much as visuals.
Applies — don't sacrifice usability for spectacle; pour the "creativity 20%" into one or two
signature moments (3D hero, kinetic name) not everywhere. Cost/Risk — animation-heavy builds
threaten Usability via FCP/LCP/INP — lazy/conditional animations, hardware-accelerated transforms,
a no-motion-first baseline (`prefers-reduced-motion`; WCAG 2.3.3).

### Sources
- Awwwards Developer Award — https://www.awwwards.com/developer-award/
- Awwwards Sites of the Year — https://www.awwwards.com/websites/sites_of_the_year/
- Igloo Inc (Awwwards) — https://www.awwwards.com/sites/igloo-inc
- Cyd Stumpel Portfolio 2025 (View Transitions) — https://www.awwwards.com/sites/cyd-stumpel-portfolio-2025
- Abstract Intelligence (Mallard & Claret) — https://mallardandclaret.com/our-latest-release-abstract-intelligence-picks-up-sotd-fwa-and-developer-award/
- Phantom.Land — https://www.phantom.land/
- The FWA — https://thefwa.com/
- Awwwards Evaluation System — https://www.awwwards.com/about-evaluation/
- Awwwards judging criteria decoded (Utsubo) — https://www.utsubo.com/blog/award-winning-website-design-guide
- Web design trends 2026 (Envato) — https://elements.envato.com/learn/web-design-trends
- Top web design trends 2026 (Figma) — https://www.figma.com/resource-library/web-design-trends/
- Typography trends 2026 (Fontfabric) — https://www.fontfabric.com/blog/10-design-trends-shaping-the-visual-typographic-landscape-in-2026/
- Trending fonts 2026, neo-serif + mono (Made Good) — https://madegooddesigns.com/trending-fonts/
- Lenis smooth scroll — https://github.com/darkroomengineering/lenis
- Infinite scroll w/ GSAP + Lenis (Codrops) — https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/
- Grainy Gradients (CSS-Tricks) — https://css-tricks.com/grainy-gradients/
- nnnoise SVG generator — https://www.fffuel.co/nnnoise/
- feTurbulence (MDN) — https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence
- Inclusive Dark Mode (Smashing) — https://www.smashingmagazine.com/2025/04/inclusive-dark-mode-designing-accessible-dark-themes/
- Dark Mode Accessibility (AccessibilityChecker) — https://www.accessibilitychecker.org/blog/dark-mode-accessibility/
- Color trends 2026 (LogoMaker) — https://www.logomaker.com/blog/color-trends/
- UI color trends 2026 (UpDivision) — https://updivision.com/blog/post/ui-color-trends-to-watch-in-2026
- Anatomy of an award-winning portfolio (Readymag) — https://blog.readymag.com/versatile-layout-tricky-animations-anatomy-of-award-winning-readymag-portfolio-11ad389d4b20/
- Magnetic cursor effect (GSAP Vault) — https://gsapvault.com/effects/magnetic-cursor
- prefers-reduced-motion (web.dev) — https://web.dev/articles/prefers-reduced-motion
- Accessible animation (Pope Tech) — https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/

---

## 2. Modern interaction techniques (browser support, perf, a11y)

**2.1 CSS scroll-driven animations (`animation-timeline: scroll()/view()`).** Drive keyframes off
scroll/visibility entirely in CSS — runs on the compositor (off main thread), zero bundle, a
Lighthouse/INP win over JS scroll libs. **Support (2026):** Chrome/Edge 115+, Safari 26+; Firefox
partial/behind flag → **not Baseline (Firefox is the gap).** Firefox needs non-zero
`animation-duration` (convention `1ms`). USE NOW as progressive enhancement only (wrap in
`@supports (animation-timeline: scroll())` and `@media (prefers-reduced-motion: no-preference)`);
never make content visibility depend on it. Parallax/large motion is a vestibular trigger.

**2.2 View Transitions API.** Browser-native morph/crossfade. **Same-document** (`document.startViewTransition`):
Chrome/Edge 111+, Firefox 133+, Safari 18+ → **Baseline Newly Available (Oct 2025)** — USE NOW for
route transitions, degrades to instant cut. **Cross-document (MPA)** (`@view-transition { navigation: auto }`):
Chrome/Edge 126+, Safari 18.2+, **Firefox not yet (2026 expected)** → enhancement only, no-ops in
Firefox. Wrap custom keyframes in `prefers-reduced-motion: reduce`.

**2.3 WebGL hero: `ogl` vs three.js / R3F.** A single full-screen fragment-shader plane needs no
scene graph/cameras/lights/loaders — exactly the machinery three.js ships. `ogl` ≈ 8KB core (~29KB
total minzipped, zero deps, MIT); three.js ≈ 155KB gzipped, R3F stacks on top. **KEEP `ogl`** for a
single-shader hero; only move to three.js/R3F if the hero becomes a real 3D scene. Protect the
budget: dynamic-`import()` the hero (out of critical path), static poster first paint, freeze the
time uniform / swap to poster under reduced-motion, pause rAF off-screen, cap DPR.

**2.4 Framer Motion (Motion) vs GSAP + ScrollTrigger.** Motion is React-idiomatic (variants,
`AnimatePresence`, `layoutId`, gestures) with a first-class `useReducedMotion()` +
`<MotionConfig reducedMotion="user">`. Bundle: full `motion` ≈ 34KB; with `LazyMotion` + the `m`
component initial ≈ **4.6KB**, lazy-loading `domAnimation` (+18KB) / `domMax` (+28KB). GSAP core ≈
23–27KB; **free for everyone incl. all plugins since the Webflow acquisition (Oct 2024)**.
**KEEP Framer Motion** as primary (+`LazyMotion`/`m`); add **GSAP ScrollTrigger only** for scrubbed/
pinned choreography CSS scroll-timeline can't do. Both evergreen-safe; always wire reduced-motion.

**2.5 Micro-interactions, custom cursors, Cmd+K, sound.** Micro-interactions (~120–220ms) via
Motion `whileHover`/`whileTap`, reduced-motion guarded — USE NOW. **Command palette:** `cmdk`
(unstyled, Radix-accessible Dialog, Tailwind-friendly, fine to ~2–3k items) preferred over `kbar`
(prebuilt UI + virtualization) for a portfolio — but **deferred** to a later pass. **Custom cursor:**
only behind `@media (any-hover: hover) and (pointer: fine)`, never hide the real cursor, disable
under reduced-motion (CSS cursors ignore OS cursor-size/contrast settings → low-vision risk).
**Sound:** WCAG 1.4.2 (Audio Control, Level A) — no autoplay >3s without a pause/mute; start muted /
user-initiated, persistent keyboard-operable mute — **defer/opt-in only.**

**Cross-cutting:** Firefox is the recurring support gap (scroll-driven animations, cross-document
VT) — every effect needs a static/faded fallback; everything respects `prefers-reduced-motion`.

### Sources
- Scroll-driven animations (MDN) — https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- animation-timeline: scroll() support (caniuse) — https://caniuse.com/mdn-css_properties_animation-timeline_scroll
- Scroll-triggered animations (Chrome for Developers) — https://developer.chrome.com/blog/scroll-triggered-animations
- Scroll-driven animations (Josh W. Comeau) — https://www.joshwcomeau.com/animation/scroll-driven-animations/
- View Transition API (MDN) — https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- What's new in view transitions 2025 (Chrome) — https://developer.chrome.com/blog/view-transitions-in-2025
- View transitions support (caniuse) — https://caniuse.com/view-transitions
- OGL — https://github.com/oframe/ogl
- R3F vs three.js (2026) — https://www.creativedevjobs.com/blog/react-three-fiber-vs-threejs
- Shaders with R3F (Maxime Heckel) — https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
- GSAP pricing (now free) — https://gsap.com/pricing/
- Webflow acquires GSAP — https://webflow.com/blog/webflow-acquires-gsap
- GSAP vs Motion — https://motion.dev/docs/gsap-vs-motion
- Reduce Framer Motion bundle (LazyMotion/m) — https://motion.dev/docs/react-reduce-bundle-size
- useReducedMotion (Motion) — https://motion.dev/docs/react-use-reduced-motion
- cmdk — https://github.com/pacocoursey/cmdk
- kbar — https://github.com/timc1/kbar
- Custom cursor accessibility (David Bushell) — https://dbushell.com/2025/10/27/custom-cursor-accessibility/
- SC 1.4.2 Audio Control (W3C) — https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html

---

## 3. Show, don't tell — demonstrating the work

Core principle across sources: a portfolio's job is to *convert attention into evidence*, not
describe capability. KILLEYYY's live, embeddable Vercel games are an unfair advantage most
portfolios can't replicate.

**3.1 Embed live, playable demos directly (highest-leverage move).** Put a real playable build in
the card/case study via iframe, not just a link — itch.io built "Game Embeds" around this; indie
guides call in-page playables "the holy grail." Applies — `<iframe src="https://your-game.vercel.app">`
with a fullscreen button on the top 2–3 hero projects. Cost/Risk — each iframe loads a full page;
use `loading="lazy"` + click-to-launch poster; sandbox (see 3.5).

**3.2 itch.io "click-to-launch" pattern, not auto-run.** Default to a poster + play button that
boots the game on click; offer fullscreen; on mobile force click-to-fullscreen. Why — HTML5 games
are heavy and browsers mute autostart audio anyway. Cost/Risk — low; main effort is a good poster
frame + a fullscreen handler.

**3.3 Media ladder: live demo > hover-to-play clip > video > screenshot.** Grid cards get a
lightweight muted hover-to-play loop (poster at rest); the live embed is one level deeper; static
screenshots are the fallback. Interactive/animated portfolios reportedly get ~3× longer engagement
(source-reported — sanity-check). Cost/Risk — hover doesn't exist on touch → tap-to-play poster /
autoplay-on-scroll; keep clips short; honor reduced-motion (show poster).

**3.4 Autoplay previews: `muted autoplay loop playsinline preload="none"` + `poster`.** `muted`
makes autoplay fire; `playsinline` stops iOS forcing fullscreen; wrap `play()` in `.catch()` to
fall back to poster when blocked. Cost/Risk — many simultaneous videos hurt battery → IntersectionObserver
so only on-screen previews play; captions for informational video.

**3.5 Sandbox embeds correctly — never `allow-scripts` + `allow-same-origin` for untrusted frames.**
That combo lets a frame remove its own sandbox (the HTML validator flags it). Host games on a
separate origin/subdomain (Vercel subdomains are effectively third-party to the portfolio domain),
grant `allow-scripts` + needed `allow` (fullscreen/gamepad/pointer-lock) but keep them cross-origin.
Verify `postMessage` `event.origin`, never target `*`. Cost/Risk — over-restricting breaks games;
test each.

**3.6 Each deep dive: problem → approach → build → outcome, in the builder's voice.** Guides
converge on this arc and "quality over quantity: 3–5 strong case studies." Applies — full case
studies for 3–5 best projects (top games + a flagship web app); the rest a fast playable/visual
grid. Cost/Risk — writing effort; use "micro case studies" (a few tight paragraphs + media) for
smaller projects.

**3.7 Process / before-after storytelling (scrollytelling, iteration shots).** Show prototype →
iterations → final; before/after frames; GIFs of broken-vs-fixed. Process proves *how you think*.
Applies — early ugly prototype vs shipped build for a flagship game; one scroll-driven reveal in the
hero case study. Cost/Risk — keep to one or two hero pieces; respect reduced-motion; don't let
storytelling outweigh playable proof.

**3.8 Frame AI-built work honestly: real demos, real (or no) metrics, visible tradeoffs.** Let the
working product be the proof; state your real role and how AI was used; show human decisions; never
invent metrics. Applies — lead with "play it" rather than dubious counts; only cite real, verifiable
numbers; a "what I'd do next" note adds credibility at zero cost. Named precedents: **Bruno Simon**
(drivable 3D portfolio — gold standard for playable proof), Cassie Codes, Keita Yamada; the
strongest direct precedent is itch.io's in-page embed pattern itself.

### Sources
- Sandboxed iframes (web.dev) — https://web.dev/articles/sandboxed-iframes
- React iframes best practices (LogRocket) — https://blog.logrocket.com/best-practices-react-iframes/
- iframe element (MDN) — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
- Uploading HTML5 games (itch.io) — https://itch.io/docs/creators/html5
- Introducing Game Embeds (itch.io) — https://itch.io/updates/introducing-game-embeds
- Itch.io publishing guide 2025 (Generalist Programmer) — https://generalistprogrammer.com/tutorials/itch-io-game-publishing-complete-indie-developer-guide-2025
- Video autoplay best practices (Cloudinary) — https://cloudinary.com/guides/video-effects/video-autoplay-in-html
- Autoplay policy (Chrome) — https://developer.chrome.com/blog/autoplay
- Autoplay guide (MDN) — https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- hover-video-player — https://github.com/Gyanreyer/hover-video-player
- Case study portfolios (Toptal) — https://www.toptal.com/designers/ui/case-study-portfolio
- Micro case studies (Alex Couch) — https://medium.com/alex-couch-s-portfolio/9-micro-case-studies-9a9e8584af3d
- Scrollytelling examples (Shorthand) — https://shorthand.com/the-craft/scrollytelling-examples/index.html
- Building honest products with AI (Figma) — https://www.figma.com/blog/vishal-kapoors-10-rules-building-with-ai/
- Game developer portfolios 2026 (SiteBuilderReport) — https://www.sitebuilderreport.com/inspiration/game-developer-portfolios

---

## 4. Performance & accessibility (2025–2026)

All Core Web Vitals thresholds are measured at the **75th percentile**, split mobile/desktop.

**4.1 Hit the three CWV gates: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.** INP officially replaced FID
on 12 Mar 2024; "needs improvement" runs to 4.0s / 500ms / 0.25. Lighthouse mobile Performance is
weighted toward LCP/TBT(≈INP)/CLS. Applies — the lazy WebGL hero is the LCP/INP risk surface:
render a lightweight LCP element (poster image or H1) immediately, layer the shader after; reserve
the canvas box (fixed `aspect-ratio`) for CLS 0. Cost/Risk — INP is hardest on a JS-heavy SPA
(measures every interaction); verify in field (CrUX/RUM), not just lab.

**4.2 Protect INP: yield to the main thread, break up long tasks (>50ms).** Prefer
`scheduler.yield()` (polyfill → `setTimeout`), wrap non-urgent React updates in `useTransition`,
debounce expensive handlers. Applies — init the WebGL scene/decode textures/scroll logic in yielded
chunks so they never block taps; consider OffscreenCanvas + Web Worker to move rendering off-main.
Cost/Risk — `scheduler.yield()` needs a polyfill; workers add complexity.

**4.3 Lazy-load/defer the WebGL hero: dynamic `import()` + IntersectionObserver.** Code-split the GL
module behind `React.lazy` + `<Suspense>`, instantiate only when the hero is in/near viewport (one
documented refactor cut main bundle ~95%). Cost/Risk — a Suspense/static-poster fallback is
mandatory (blank hero = CLS); **known Vite issue: `manualChunks` can interfere with `React.lazy`
splitting — inspect the chunk graph.**

**4.4 Pause the render loop offscreen/hidden; cap DPR.** Drive with `requestAnimationFrame`; stop
via IntersectionObserver (offscreen) + Page Visibility API (backgrounded);
`setPixelRatio(Math.min(devicePixelRatio || 1, 2))` — many phones report DPR 3 (= ~9× fill rate of
1× for negligible gain; uncapped dropped a simple iOS scene to ~40fps vs 60). Cost/Risk — non-integer
DPR can alias; wire teardown to avoid GL context leaks on unmount.

**4.5 Split stable vendor code with Vite/Rollup `manualChunks`.** Isolate react+react-dom, the GL
lib, icons into persistent chunks; route/feature views behind dynamic imports → deploys invalidate
only small app chunks. Cost/Risk — over-chunking creates request waterfalls (bad on mobile); can
break `React.lazy` if misconfigured — read the chunk report.

**4.6 Respect `prefers-reduced-motion`: disable non-essential motion, keep a static fallback.** CSS
`@media (prefers-reduced-motion: reduce)` (use `0.01ms` not `0ms`); JS
`matchMedia('(prefers-reduced-motion: reduce)')` + `change` listener / Framer's `useReducedMotion`.
Scaling/panning/parallax are documented vestibular triggers (>35% of adults by ~40 have experienced
vestibular dysfunction). Applies — freeze the shader on a static frame / swap to poster, disable
scroll-jacking/parallax, keep instant non-animated state changes. Cost/Risk — SSR/hydration mismatch
(preference unknown server-side) → guard with a client effect or `Sec-CH-Prefers-Reduced-Motion`.

**4.7 Serve AVIF with WebP/JPEG fallback via `<picture>`, always with width/height.** AVIF ~50%
smaller than JPEG, WebP ~25–35% with faster decode/wider support; explicit dims (or `aspect-ratio`)
prevent CLS. Cost/Risk — AVIF encode is slow/CPU-heavy at build; per-image quality tuning.

**4.8 Prioritize the LCP image; lazy-load the rest.** One above-the-fold LCP image gets
`fetchpriority="high"` and **no** lazy attr (Google Flights: LCP 2.6s→1.9s); below-the-fold images
`loading="lazy"` + `srcset`/`sizes` (saves 70–90% of bytes on phones). Cost/Risk —
`fetchpriority="high"` on **at most one** image; never lazy-load the LCP image.

**4.9 Self-host subsetted WOFF2 variable fonts; preload; `font-display: swap`.** WOFF2 only; one
variable file for all weights; subset (a face can drop ~90KB→~15KB); preload the 1–2 critical
faces; target < 100KB total fonts. Cost/Risk — preloading too many fonts competes with the LCP image.

**4.10 Kill font-swap CLS with metric-overridden fallback fonts.** Define a local-font `@font-face`
fallback tuned with `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` (Fontaine
auto-generates) so the swap causes no reflow → font CLS → 0 while keeping `swap`. Cost/Risk —
override values are per-font; automate in the build.

**4.11 Semantic HTML + visible keyboard focus (WCAG AA/2.2).** Native `<button>`/`<a>`/`<nav>`/
landmarks; `:focus-visible` indicator; logical tab order; **2.4.11 Focus Not Obscured** (sticky
headers must not fully hide the focused element). Cost/Risk — cinematic sites strip focus rings and
use `<div>` "buttons" (common Lighthouse + WCAG failures) — keep semantics; design a brand focus
ring; add `scroll-margin` under sticky headers.

**4.12 Contrast ratios + accessible names for icon buttons.** Text (1.4.3): **4.5:1** normal,
**3:1** large (≥18pt / 14pt bold). Non-text (1.4.11): **3:1** for UI boundaries/icons/focus
indicators. Icon-only buttons need `aria-label`; decorative SVG `aria-hidden="true"` +
`focusable="false"`; toggle state via `aria-pressed`/`aria-expanded`, not color alone. Cost/Risk —
text over a shader/video may need a scrim/gradient or text-shadow to clear 4.5:1.

### Sources
- Web Vitals (web.dev) — https://web.dev/articles/vitals
- Optimize LCP — https://web.dev/articles/optimize-lcp
- Optimize INP — https://web.dev/articles/optimize-inp
- Optimize long tasks — https://web.dev/articles/optimize-long-tasks
- Optimize CLS — https://web.dev/articles/optimize-cls
- WebGL best practices (MDN) — https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- OffscreenCanvas (web.dev) — https://web.dev/articles/offscreen-canvas
- Faster WebGL with OffscreenCanvas (Evil Martians) — https://evilmartians.com/chronicles/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers
- manualChunks breaks React.lazy (vite#17653) — https://github.com/vitejs/vite/issues/17653
- prefers-reduced-motion (MDN) — https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Accessible animations in React (Josh W. Comeau) — https://www.joshwcomeau.com/react/prefers-reduced-motion/
- Fetch Priority API (web.dev) — https://web.dev/articles/fetch-priority
- Browser-level image lazy loading — https://web.dev/articles/browser-level-image-lazy-loading
- AVIF vs WebP (Crystallize) — https://crystallize.com/blog/avif-vs-webp
- Font best practices (web.dev) — https://web.dev/articles/font-best-practices
- CSS size-adjust — https://web.dev/articles/css-size-adjust
- WCAG 2.2 — https://www.w3.org/TR/WCAG22/
- SC 1.4.3 Contrast (Minimum) — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- SC 1.4.11 Non-text Contrast — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- SC 2.4.11 Focus Not Obscured — https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- Accessible focus indicators (Sara Soueidan) — https://www.sarasoueidan.com/blog/focus-indicators/

---

## 5. SEO & social sharing (2026)

**Biggest structural decision: a client-only SPA is an SEO + social liability — prerender to static
HTML.** Googlebot renders JS but in a deferred, sometimes-failing queue; **social and AI crawlers
(Facebook, X, LinkedIn, Slack, Discord, many LLM bots) do NOT run JS at all** — an empty
`<div id="root">` yields no preview and no description. Fix (cheapest reliable on Vercel):
**build-time prerender** every known route to static HTML (e.g. `vite-react-ssg`, `vike`,
`react-snap`) so title/description/OG/JSON-LD are in the initial response. Full SSR (Next.js) is
overkill for a small portfolio.

**5.2 Per-page metadata in the served HTML:** unique `<title>`, `<meta name="description">` (<160
chars), `<link rel="canonical">`, `<meta name="viewport">`, `<html lang>`, `<meta name="robots">`.
Caveat — never rely on JS to remove a `noindex`; set robots correctly at build time.

**5.3 Open Graph is the universal preview standard + a thin X layer.** Required:
`og:title`, `og:description`, `og:image`, `og:url`, `og:type` (`website`/`profile`), `og:site_name`;
plus `twitter:card=summary_large_image`. **Gotchas: Twitter tags use `name=`, OG uses `property=`;
`og:image` must be an absolute https URL.** Validate post-deploy (X Card Validator / opengraph.xyz).

**5.4 OG image 1200×630 (1.91:1), < ~1MB, key content in the center ~80% safe zone.** Cross-platform
sweet spot; edges crop differently per platform.

**5.5 Generate per-page OG images with `@vercel/og` (Satori) in a serverless/edge function.**
Renders JSX→SVG→PNG at ~500KB (vs ~50MB Chromium+Puppeteer); default 1200×630; ships
`cache-control: public, immutable, max-age=31536000` (generated once, then CDN). Non-Next: `npm i
@vercel/og`, expose `api/og`. **Limits: flexbox only (no grid), ~500KB budget, fonts must be
TTF/OTF/WOFF — WOFF2 NOT supported.**

**5.6 JSON-LD `Person` / `ProfilePage` with a rich `sameAs` array (highest-leverage schema).**
Google prefers JSON-LD; `Person` + `sameAs` (GitHub, X, LinkedIn, YouTube) is the connective tissue
for entity/Knowledge-Graph resolution. Use `alternateName: "KILLEYYY"`. `ProfilePage` wraps an
about page (requires `mainEntity` Person/Org with `name`/`alternateName`). Don't fabricate `sameAs`.

**5.7 `CreativeWork`/`SoftwareApplication`/`VideoGame` on project pages + `BreadcrumbList`.** Type
each project correctly with `author`/`creator` → your `Person` (stable `@id` so entities link).
BreadcrumbList is an actively-supported rich result.

**5.8 `WebSite` schema for the site-name signal — but NOT the Sitelinks Search Box.** The Sitelinks
Search Box (`SearchAction`) was **deprecated (announced 21 Oct 2024, removed 21 Nov 2024)** — omit it.

**5.9 Tiny `sitemap.xml` + `robots.txt` (with the `Sitemap:` line), generated at build time.** List
only indexable canonical URLs; never `Disallow` JS/CSS (breaks rendering).

**5.10 SPA Googlebot hygiene:** History API routing (not hash); each render is a fresh stateless
session (no content behind clicks/banners); return a real **404** for unknown routes (soft-404s on
200 pollute the index); Vite's hashed filenames handle asset caching.

**5.11 (SPECULATIVE/contested) `llms.txt`.** Google **explicitly does not support it for search**
(Illyes, Jul 2025; Mueller compared it to the keywords meta tag); ~10% adoption, negligible ranking
impact. Read by dev AI tools (Cursor/Copilot) and Google's experimental Lighthouse "Agentic
Browsing" audit (presence check, not ranking). As an AI-first builder, a small `llms.txt` is a cheap
on-brand gesture — **not an SEO tactic.** Higher-leverage for AI citation: clean HTML (5.1) + Person/
sameAs (5.6).

**Tooling note:** React 19 hoists `<title>`/`<meta>`/`<link>` natively (less need for
`react-helmet-async`, whose maintenance has been rocky; `@dr.pogodin/react-helmet` is a maintained
successor) — but none of it matters unless the metadata reaches the served HTML (i.e. prerender/SSR).

### Sources
- OG Image Generation (Vercel) — https://vercel.com/docs/og-image-generation
- Introducing OG Image Generation (Vercel blog) — https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images
- @vercel/og (npm) — https://www.npmjs.com/package/@vercel/og
- OG image sizes 2026 (Krumzi) — https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2026-guide
- Twitter Card specs (OG Preview) — https://ogpreview.app/open-graph/twitter/
- JavaScript SEO basics (Google) — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- How Google handles JS (Vercel) — https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process
- Structured data intro (Google) — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- ProfilePage (Google) — https://developers.google.com/search/docs/appearance/structured-data/profile-page
- schema.org/Person — https://schema.org/Person
- Farewell Sitelinks Search Box (Google) — https://developers.google.com/search/blog/2024/10/sitelinks-search-box
- React 19 Document Metadata (LogRocket) — https://blog.logrocket.com/guide-react-19-new-document-metadata-feature/
- SPA SEO guide (Stackmatix) — https://www.stackmatix.com/blog/best-seo-practices-for-single-page-applications-spas
- llms.txt: does it work? (IndexLab) — https://www.indexlab.ai/blog/llms-txt-does-it-actually-work-october-2025-updated
- Google adds llms.txt check to Lighthouse (Search Engine Land) — https://searchengineland.com/google-llms-txt-chrome-lighthouse-478246

---

## Top reusable patterns for KILLEYYY — ranked by impact vs effort

| Rank | Pattern | Impact | Effort | Verdict |
|---|---|---|---|---|
| 1 | **Prerender SPA → static HTML** (vite-react-ssg) so meta/OG/JSON-LD ship in HTML | Very High | Low–Med | **Do first** — unblocks all SEO/social |
| 2 | **Off-black `#0E0E10` + champagne/silver + restrained garnet→crimson accent + smoky-jade emerald**, enforced via tokens | Very High | Low | **Do** — the premium look, contrast-safe |
| 3 | **Lazy `ogl` shader hero + static poster + reduced-motion freeze + DPR cap** | Very High | Med | **Do** — the "wow," budget-safe |
| 4 | **Display-serif + monospace pairing; oversized kinetic wordmark (variable font)** | High | Low–Med | **Do** — instant editorial/builder identity |
| 5 | **Inline playable game embeds (click-to-launch, fullscreen, sandboxed, lazy)** | Very High | Med | **Do** — KILLEYYY's unfair advantage |
| 6 | **Case studies: problem→approach→build→outcome; 3–5 deep, rest a grid; honest AI framing** | High | Med | **Do** — credibility without fake metrics |
| 7 | **CWV discipline:** AVIF+`<picture>`, one `fetchpriority` LCP image, subset variable WOFF2 + metric-override fallback | High | Med | **Do** — guards Lighthouse ≥90 |
| 8 | **A11y baseline:** semantic HTML, `:focus-visible` brand ring, 4.5:1/3:1 contrast, aria-labelled icon buttons, no-motion-first | High | Low–Med | **Do** — Lighthouse A11y + WCAG AA |
| 9 | **JSON-LD ProfilePage→Person + sameAs; per-project CreativeWork/VideoGame; @vercel/og cards** | High | Med | **Do** — entity discovery + sharp shares |
| 10 | **CSS scroll-driven reveals** (compositor, zero bundle) + **same-document View Transitions** | Med–High | Low | **Do** — cheap polish, progressive |
| 11 | **Cinematic preloader (counter) + grain via feTurbulence + asymmetric editorial grid + magnetic CTA** | Med | Low–Med | **Do, restrained** — signature moments only |
| 12 | **Cmd+K palette (cmdk); custom cursor (fine-pointer); tasteful sound** | Med | Low–Med | **Defer** — later pass, a11y-gated |
| 13 | **Lenis + GSAP ScrollTrigger pinned scroll choreography** | Med | Med–High | **Conditional** — only where CSS can't; a11y cost |
| 14 | **`llms.txt`** | Low | Trivial | **Optional** — on-brand gesture, no SEO benefit |

**Cross-cutting rules that protect the budget:** no-motion-first baseline; Firefox needs static
fallbacks (scroll-driven anims, cross-document VT); one signature creative moment per chapter, not
everywhere (Awwwards Usability is weighted 30%); every accent-on-dark pairing audited for contrast.


## Addendum: deep-research pass (this session)

A second, code-first research pass (8 structured dossiers) was run to turn the earlier RESEARCH.md
direction into a **copy-pasteable implementation playbook** (`docs/PLAYBOOK.md`). It confirms the
existing ADRs and adds concrete, sourced recipes. New or sharpened findings:

**Visual language / color.** The "premium not rainbow" discipline is now codified: keep the locked base
+ **crimson `#C8323C` as the single LEAD accent**, ADD one cool gradient/glow axis **violet `#7C5CFF` →
cyan `#22D3EE`**, keep **magenta `#FF4FD8` / amber `#FFB703` as rare "wow" pops only**, and jade strictly
for live/shipped (use `#34D399` when readable). Three hard rules: max 2 primary accents on screen; every
accent-as-text uses an AA-verified `*-bright` variant (raw crimson is only ~3.8:1 on ink → `#F0566A` for
body); every animated gradient/glow has a `prefers-reduced-motion` freeze. Tune with APCA, certify with
WCAG 2 AA. New techniques: `@property --angle` conic glow border (GPU, far cheaper than animating
box-shadow), `background-clip:text` animated gradient headlines, OKLCH conic-spotlight + layered-radial
aurora hero.

**Shader hero.** The existing `react-app/src/components/hero/ShaderHero.jsx` already implements the OGL
fullscreen-Triangle pattern with DPR cap, IO/visibility rAF pause, and `loseContext()` cleanup. Research
identifies the four **missing guards to add**: explicit reduced-motion single-frame freeze, a lerped
mouse-follow glow uniform, a `try/catch + renderer.gl` check that flips to a CSS-gradient fallback, and
container-scoped passive pointer listeners. A WebGL1-ported **Aurora** FRAG (crimson→champagne→jade,
premultiplied alpha) is provided as a swappable module.

**Motion.** Confirmed `framer-motion@11` is API-compatible with the renamed "Motion". The bundle win is
**`LazyMotion` + `m`** (~4.6KB vs ~34KB) with the `strict` prop, plus app-wide `<MotionConfig
reducedMotion="user">`. Motion's slick text primitives (**ScrambleText / splitText / Ticker are paid
Motion+**) — free DIY equivalents are included. Split work by mechanism: JS/Framer for pointer/spring;
CSS `animation-timeline: view()/scroll()` (behind `@supports`) for cheap high-volume reveals + progress
bar; React Router v6 `viewTransition` + `useViewTransitionState` for cross-route cover/title morphs.

**Cockpit dashboard.** The 2025–26 "command-center" aesthetic = strict **bento grid** + a **zero-dependency
viz kit** (inline-SVG `Sparkline`/`ProgressRing`/`Heatmap`, CSS `Skeleton`/`StatusBadge`/`ActivityFeed`) —
no chart library (saves 50–200KB). One glassmorphism treatment (blur ≤12px) on hero tiles only; all motion
behind `motion-safe`; tiles fetch from own `/api` only.

**Serverless auth & OG.** Stateless **HMAC-signed httpOnly cookie** via `node:crypto` (no DB, no deps);
**scrypt-hashed** owner password in env; `timingSafeEqual` **after an equal-length guard** (it throws on
length mismatch). `@vercel/og` works framework-agnostically via `api/og.tsx` (`runtime:'edge'`, flexbox
only, 500KB cap).

**Prerender & SEO.** Locks **`vite-react-ssg`** over Vike (Vike became a full framework that replaces RR
routing). Surfaces a **repo-blocking issue**: the current `vercel.json` blanket SPA rewrite
(`"/((?!api/).*)" → /index.html`) would hand crawlers the empty CSR shell and destroy the SEO win — it
must be replaced so prerendered per-route HTML is served as-is, with fallback only for `/owner/*`. Derive
`getStaticPaths` and the sitemap `dynamicRoutes` from the same `site.js` slug list.

**Live-data APIs.** Four uniform Node functions with token-in-env + **HTTP-200 sample fallback** +
`s-maxage`/`stale-while-revalidate`. Key gotchas: **Notion 2025-09-03** moved querying to
`/v1/data_sources/{id}/query` (one-time discovery of `data_sources[].id`); **Drive** needs a stored
refresh-token exchange and a mandatory `fields` param; **Vercel** is on `/v7/deployments` and `url`
lacks `https://`; **GitHub** needs a PAT (5,000/hr) + `User-Agent`, with ETag/304 polling free of quota.

### Cited source list (this pass)
- Phantom.land + Codrops grid writeup — phantom.land · tympanus.net/codrops/2025/06/30/…
- Codrops WebGL portfolio writeup — tympanus.net/codrops/2025/11/27/…
- Cyd Stumpel, Roman Jean-Elie, Obys, Bruno Simon, Active Theory, Bithell, Remedy, Jenova Chen, Immersive Garden, Noomo, Cappen (award inspirations)
- OGL Triangle example + repo — oframe.github.io/ogl · github.com/oframe/ogl
- React Bits Aurora / Iridescence — github.com/DavidHDev/react-bits
- Patricio GLSL noise gist · The Book of Shaders — gist.github.com/patriciogonzalezvivo · thebookofshaders.com/11
- Motion LazyMotion / accessibility / scroll docs — motion.dev/docs/…
- Josh Comeau scroll-driven animations — joshwcomeau.com/animation/scroll-driven-animations
- arielbk 3D shiny card · alexjedi magnetic-wrapper · Codrops SVG marquee
- React Router View Transitions how-to — reactrouter.com/how-to/view-transitions
- Chrome VT misconceptions — developer.chrome.com/blog/view-transitions-misconceptions
- Color: media.io futuristic palettes · colorhero dark mode 2025 · Lionel Peramo glow border · Smashing radial/conic gradients · Harshal Ladhe gradient text · 66colorful APCA · Mavik Labs design tokens
- Dashboard: Vercel/Linear/Raycast/Resend · bentogrids.com · Aceternity bento · react-calendar-heatmap · Flowbite indicators
- Vercel: OG docs + API ref · Node runtime · request-headers (HMAC) · custom font recipe · edge caching · list deployments
- MDN Set-Cookie · Node.js crypto docs
- Prerender: vite-react-ssg (repo + docs) · Vike · vite-plugin-sitemap · Google BreadcrumbList structured data · jsonld Person · alikaraki CSR→SSG Lighthouse case study
- APIs: GitHub REST (repos/events/rate-limits) · Vercel deployments · Notion 2025-09-03 upgrade + query data source · Google Drive files.list + OAuth offline refresh

