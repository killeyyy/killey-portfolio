# PLAYBOOK.md — KILLEYYY cinematic site + owner cockpit

> The single doc an implementer follows. Synthesized from 8 deep-research dossiers
> against the **locked stack**: Vite 5 + React 18 + react-router-dom v6, Tailwind v3.4,
> Framer Motion v11, `ogl` (~29KB) for one WebGL hero, Vercel serverless `/api`, free-tier only.
>
> **Repo facts (do not re-derive):** app lives in `react-app/`; content single-source-of-truth is
> `react-app/src/data/site.js`; palette tokens are in `react-app/src/index.css` + `react-app/tailwind.config.js`;
> serverless functions go in **top-level** `/api`; existing components live under `react-app/src/components/`.
> Cross-cutting law (every section): **no-motion-first baseline**, transform/opacity only, Lighthouse
> mobile ≥ 90, WCAG AA, lazy-load heavy assets. Truthful content only — no invented metrics.
>
> **The one rule that makes this "$50K, not clown":** commit to ONE signature shader hero + ONE
> signature interaction; keep everything else quiet. Effect-count is not premium — choreography and
> restraint are. Max **2 primary accents on screen at once**.

---

## 0. Build order (do these in sequence)

1. **Prerender + SEO foundation** (§8) — unblocks all social/SEO; do before content polish.
2. **Lock the palette tokens** (§1) — already partially in `index.css`; extend with the cool axis.
3. **Upgrade the shader hero** (§2) — the existing `ShaderHero.jsx` is close; add the missing guards.
4. **Motion primitives library** `react-app/src/motion/` (§3) — shared, reduced-motion-gated.
5. **Public sections** (§4) — work grid, editorial about/contact.
6. **Case studies + embeds** `/work/:slug` (§5).
7. **Cockpit** `/owner` (§6) bento dashboard.
8. **Serverless auth + OG** `/api` (§7) and **live-data APIs** (§9).

---

## 1. Visual language & color

**LOCKED approach — "Garnet Aurora" (Extended Palette A):** keep the existing locked base
(ink `#0E0E10` / surface `#17171B` / silver `#E8E6E1` / champagne-gold `#C9A86A`), keep **crimson
`#C8323C` as the single LEAD accent**, ADD one **cool gradient/glow axis (electric violet `#7C5CFF`
→ cyan `#22D3EE`)**, keep **magenta `#FF4FD8` and amber `#FFB703` as rare gradient stops / "wow" pops
only**, and keep **jade reserved strictly for live/shipped semantics** (use `#34D399` when jade must
be readable text). Reserve the punchier "Cinematic Neon" set for **one or two flashy hero/showreel
sections only** — never globally.

**Three non-negotiable rules to stay premium-not-rainbow:**
1. Max **2 primary accents** on screen at once.
2. Every accent used as **text** uses its `*-bright`/`*-txt` variant verified at **≥4.5:1 (≥3:1 large/UI)** on ink. (Raw crimson `#C8323C` is only ~3.8:1 on ink → use `#F0566A` for body text.)
3. Every animated gradient/glow/shine/pulse has a `@media (prefers-reduced-motion: reduce)` freeze branch.

Tune vividness perceptually with **APCA (Lc 75+ body, Lc 45+ large)** but **certify with WCAG 2 AA** (Lighthouse A11y checks AA ratios).

### Recipe 1.1 — Extend the existing CSS tokens with the cool axis + AA text variants
The repo already defines `--c-*` triples in `index.css`. ADD these to `:root` (keep the existing block):
```css
:root{
  /* --- ADDED: AA-readable text variants of brand accents on ink --- */
  --c-crimson-bright: 240 86 106;  /* #F0566A  ~4.6:1 on ink — crimson AS TEXT */
  --c-jade-bright:     52 211 153;  /* #34D399  ~9:1 on ink   — live/shipped text/badge */
  /* --- ADDED: cool gradient/glow AXIS (violet -> cyan) --- */
  --c-violet:        124 92 255;    /* #7C5CFF glow/gradient */
  --c-violet-bright: 167 139 255;   /* #A78BFF ~5.2:1 text */
  --c-cyan:          34 211 238;    /* #22D3EE ~8.9:1 on ink */
  /* --- ADDED: rare "wow" pops / gradient stops ONLY (never large fills) --- */
  --c-magenta: 255 79 216;          /* #FF4FD8 ~6.1:1 */
  --c-amber:   255 183 3;           /* #FFB703 ~10:1 */
}
```

### Recipe 1.2 — Map the new accents into `tailwind.config.js` + glow/gradient utilities
Add to `theme.extend.colors` (alongside existing ink/crimson/jade/gold), plus `boxShadow` + `backgroundImage`:
```js
colors: {
  // ...existing ink/surface/silver/garnet/crimson/jade/gold...
  crimson: { DEFAULT: 'rgb(var(--c-crimson)/<alpha-value>)', bright: 'rgb(var(--c-crimson-bright)/<alpha-value>)' },
  jade:    { DEFAULT: 'rgb(var(--c-jade)/<alpha-value>)',    bright: 'rgb(var(--c-jade-bright)/<alpha-value>)' },
  violet:  { DEFAULT: 'rgb(var(--c-violet)/<alpha-value>)',  bright: 'rgb(var(--c-violet-bright)/<alpha-value>)' },
  cyan:    'rgb(var(--c-cyan)/<alpha-value>)',
  magenta: 'rgb(var(--c-magenta)/<alpha-value>)',
  amber:   'rgb(var(--c-amber)/<alpha-value>)',
},
boxShadow: {
  'glow-crimson':'0 0 24px -4px rgb(var(--c-crimson-bright)/.55),0 0 60px -10px rgb(var(--c-crimson)/.4)',
  'glow-violet' :'0 0 24px -4px rgb(var(--c-violet)/.6),0 0 70px -12px rgb(var(--c-violet)/.4)',
  'glow-cyan'   :'0 0 22px -4px rgb(var(--c-cyan)/.6),0 0 64px -12px rgb(var(--c-cyan)/.4)',
},
backgroundImage: {
  'mesh-aurora':'radial-gradient(45% 40% at 20% 15%,rgb(var(--c-violet)/.45),transparent 70%),radial-gradient(40% 35% at 80% 20%,rgb(var(--c-cyan)/.35),transparent 70%),radial-gradient(60% 50% at 50% 100%,rgb(var(--c-crimson)/.3),transparent 72%)',
},
// usage: <section className="bg-ink bg-mesh-aurora"> ; <h1 className="text-crimson-bright shadow-glow-violet">
```

### Recipe 1.3 — Animated gradient-text headline (background-clip) with reduced-motion off
```css
.headline-grad{
  background:linear-gradient(90deg,rgb(var(--c-crimson-bright)),rgb(var(--c-gold)),rgb(var(--c-violet-bright)),rgb(var(--c-crimson-bright)));
  background-size:200% auto;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;
  animation:shine 6s linear infinite;
}
@keyframes shine{to{background-position:200% center}}
@media (prefers-reduced-motion:reduce){.headline-grad{animation:none}}
```

### Recipe 1.4 — `@property` conic GLOW BORDER (GPU 120fps) for cards/CTAs
```css
@property --angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
.glow-card{position:relative;border-radius:18px;background:#141420;padding:1px;}
.glow-card::before,.glow-card::after{
  content:'';position:absolute;inset:-1.5px;z-index:-1;border-radius:inherit;
  background:conic-gradient(from var(--angle),#7C5CFF,#22D3EE,#C8323C,#FF4FD8,#7C5CFF);
}
.glow-card::after{filter:blur(16px);opacity:.7;} /* the bleed = glow */
.glow-card:hover::before,.glow-card:hover::after{animation:spin 4s linear infinite;}
@keyframes spin{to{--angle:360deg;}}
@media (prefers-reduced-motion:reduce){
  .glow-card::before,.glow-card::after{animation:none;background:#7C5CFF;}
  .glow-card::after{filter:blur(12px);opacity:.45;}
}
```

### Recipe 1.5 — Jade live/shipped badge with pulse (semantic color discipline)
```css
.badge-live{display:inline-flex;align-items:center;gap:.5rem;padding:.25rem .625rem;border-radius:999px;
  color:#34D399;background:rgb(31 111 92/.12);border:1px solid rgb(52 211 153/.35);font-weight:600;}
.badge-live .dot{width:8px;height:8px;border-radius:50%;background:#34D399;
  box-shadow:0 0 0 0 rgb(52 211 153/.6);animation:pulse 2.2s ease-out infinite;}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgb(52 211 153/.55)}70%{box-shadow:0 0 0 10px rgb(52 211 153/0)}100%{box-shadow:0 0 0 0 rgb(52 211 153/0)}}
@media (prefers-reduced-motion:reduce){.badge-live .dot{animation:none}}
```

**Inspirations (steal from):** Awwwards SOTD dark portfolios <https://www.awwwards.com/websites/sites_of_the_day/> · Lionel Peramo glow border <https://lionel-peramo.com/posts/high-performance-animated-glow-border-css/> · Smashing radial/conic gradients <https://www.smashingmagazine.com/2022/01/css-radial-conic-gradient/> · 66colorful APCA vs WCAG <https://66colorful.com/blog/apca-contrast/> · media.io futuristic palettes <https://www.media.io/color-palette/futuristic-color-palette.html>

**Pitfalls:** WCAG 4.5:1 is unreliable on near-black — always use the `*-bright` text variant. >2 primary accents = clownish. Glow must never be the *only* contrast carrier (it disappears for low-vision users). Animating `box-shadow`/`background-position` on big surfaces is a paint trap → animate `@property --angle` and transform/opacity. sRGB warm→cool gradients go muddy gray in the middle → use OKLCH / `color-mix(in oklab)` or mid-stops. Keep mesh blob alphas low (.2–.45) and put a dark scrim behind hero text so the cinematic base stays dominant.

---

## 2. Shader hero (one ogl WebGL moment)

**LOCKED approach:** one `ShaderHero.jsx` using the OGL fullscreen-**Triangle** pattern, **lazy-loaded
via `React.lazy`** so the ~29KB GL bundle stays off the critical path. The repo **already has a working
`react-app/src/components/hero/ShaderHero.jsx`** (garnet→crimson fbm nebula). **Upgrade it** by adding
the four guards it is currently missing rather than rewriting: (a) explicit `prefers-reduced-motion`
single-frame freeze, (b) lerped mouse-follow glow uniform, (c) `try/catch` + `renderer.gl` check that
flips to a CSS-gradient fallback, (d) keep the existing DPR cap, IntersectionObserver/visibilitychange
pause, and `loseContext()` cleanup (already present — good). Default look = the existing nebula or the
re-tuned **Aurora** (crimson→champagne→jade). Keep `StaticHero.jsx` as the reduced-motion/low-end floor.

Import only `{ Renderer, Program, Mesh, Triangle, Vec2 }` from `ogl` for tree-shaking.

### Recipe 2.1 — The four guards to ADD to the existing hero
```jsx
// at top of useEffect, BEFORE constructing the renderer:
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// (Hero already declines to mount this on small screens / no-motion — keep that.)

// (a) wrap renderer construction so a context failure shows the CSS fallback:
let renderer;
try {
  renderer = new Renderer({ alpha:false, antialias:false, dpr:Math.min(devicePixelRatio||1,1.75) });
  if (!renderer.gl) throw new Error('no gl');
} catch { setFailed(true); return; }   // parent renders the radial-gradient fallback div

// (b) lerped mouse glow — add a uMouse Vec2 uniform + smoothing in the loop:
import { Vec2 } from 'ogl';
const mouse = new Vec2(0.5,0.5), smooth = new Vec2(0.5,0.5);
// program.uniforms.uMouse = { value: smooth };
const onPointer = (e)=>{ const r=mount.getBoundingClientRect();
  mouse.set((e.clientX-r.left)/r.width, 1-(e.clientY-r.top)/r.height); };
mount.addEventListener('pointermove', onPointer, { passive:true });
// inside loop(): smooth.x += (mouse.x-smooth.x)*0.06; smooth.y += (mouse.y-smooth.y)*0.06;

// (c) prefers-reduced-motion: render ONE frame, never start rAF:
if (reduced) { program.uniforms.uTime.value = 0; renderer.render({ scene: mesh }); }
else { raf = requestAnimationFrame(loop); }

// (d) on cleanup, also remove the pointer listener:
mount.removeEventListener('pointermove', onPointer);
```

### Recipe 2.2 — Aurora FRAG (crimson→champagne→jade, premultiplied glow on ink) — swappable module
Place under `react-app/src/components/hero/shaders/aurora.js`; uses Patricio's `snoise`. Set
`gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)` and `alpha:true` to composite on ink.
```glsl
precision highp float;
uniform float uTime; uniform vec2 uResolution; uniform vec2 uMouse; // y up
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g);
}
vec3 ramp(float t){ vec3 c0=vec3(0.784,0.196,0.235),c1=vec3(0.788,0.659,0.416),c2=vec3(0.122,0.435,0.361);
  return t<0.5?mix(c0,c1,t*2.0):mix(c1,c2,(t-0.5)*2.0); }
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  float colT=clamp(uv.x+(uMouse.x-0.5)*0.4,0.0,1.0); vec3 rampColor=ramp(colT);
  float height=snoise(vec2(uv.x*2.0+uTime*0.10,uTime*0.25))*0.5; height=exp(height);
  height=(uv.y*2.0-height+0.2); float intensity=0.6*height;
  intensity+=0.12*smoothstep(0.45,0.0,distance(uv,uMouse)); // glow lift near cursor
  float a=smoothstep(0.20-0.25,0.20+0.25,intensity);
  gl_FragColor=vec4(intensity*rampColor*a,a); // premultiplied
}
```

### Recipe 2.3 — Lazy-mount wiring (keep GL off the critical path)
```jsx
import { lazy, Suspense } from 'react';
const ShaderHero = lazy(() => import('./hero/ShaderHero'));
// inside <Hero>: a CSS radial-gradient paints instantly under the canvas; reduced-motion/low-core skip the canvas.
<Suspense fallback={null}><ShaderHero className="absolute inset-0 -z-10" /></Suspense>
```

**Inspirations:** OGL Triangle Screen Shader example <https://oframe.github.io/ogl/examples/triangle-screen-shader.html> · OGL repo <https://github.com/oframe/ogl> · React Bits Aurora <https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Aurora/Aurora.jsx> · React Bits Iridescence <https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/Iridescence/Iridescence.jsx> · Patricio GLSL noise gist <https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83> · Codrops OGL bulge tutorial <https://tympanus.net/codrops/2023/06/28/creating-a-bulge-distortion-effect-with-webgl/>

**Pitfalls:** DPR is the #1 mobile killer (fullscreen shader runs per physical pixel; 3× phone = 9× fill) → always `Math.min(devicePixelRatio, 1.75)`. `prefers-reduced-motion` must FREEZE (one frame at uTime=0), not slow down. Forgetting `WEBGL_lose_context.loseContext()` leaks contexts (~16 cap → black canvas on SPA route churn). Set `uResolution` from `gl.drawingBufferWidth/Height` not `offsetWidth`. WebGL1 GLSL (OGL default) needs **constant loop bounds**; the React Bits Aurora is `#version 300 es` (WebGL2) — the FRAG above is ported to WebGL1. Lerp the mouse (`*0.06`) — raw pointer values look cheap/jittery. Attach listeners to the container with `{passive:true}`.

---

## 3. Motion & interactions

**LOCKED approach:** Wrap the app **once** in `<LazyMotion features={loadFeatures} strict>` +
`<MotionConfig reducedMotion="user">`, and import **`m` from `framer-motion/m` everywhere — never
`motion.*`** (the `strict` prop throws in dev if you slip). This cuts Framer Motion from ~34KB to
~4.6KB initial and gives app-wide reduced-motion safety for free. Build a shared
`react-app/src/motion/` primitives library. Split work by mechanism: **JS/Framer**
(`useMotionValue`→`useSpring`→`useTransform`) for pointer/spring/stateful effects; **CSS-only
`animation-timeline: view()/scroll()`** (behind `@supports` + `prefers-reduced-motion`) for high-volume
cheap reveals + reading-progress. Cross-route polish via React Router v6 `viewTransition` +
`useViewTransitionState`. **Avoid Motion+ paid components** (ScrambleText/splitText/Ticker) — use the
DIY recipes. (This matches ADR-006.)

### Recipe 3.1 — Foundation: LazyMotion + `m` (App wrap)
```jsx
// react-app/src/motion/features.js
import { domAnimation } from 'framer-motion'
export default domAnimation              // use domMax only if you need layout/drag
// App.jsx
import { LazyMotion, MotionConfig } from 'framer-motion'
const loadFeatures = () => import('./motion/features').then(m => m.default)
export default function App({ children }){
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
// every component: import * as m from 'framer-motion/m'  (NOT motion.*)
```

### Recipe 3.2 — Magnetic CTA (pointer-pull + spring), reduced-motion safe
```jsx
import { useRef } from 'react'
import * as m from 'framer-motion/m'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
const SPRING = { damping: 30, stiffness: 150, mass: 0.2 }
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null); const reduce = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, SPRING), sy = useSpring(y, SPRING)
  function onMove(e){ if(reduce||!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX-(r.left+r.width/2))*strength); y.set((e.clientY-(r.top+r.height/2))*strength) }
  const reset = () => { x.set(0); y.set(0) }
  return (<m.button ref={ref} onPointerMove={onMove} onPointerLeave={reset}
      style={{ x: reduce?0:sx, y: reduce?0:sy, willChange:'transform' }}>{children}</m.button>)
}
```

### Recipe 3.3 — 3D tilt card with moving sheen (hero/work tiles)
```jsx
import { useRef } from 'react'
import * as m from 'framer-motion/m'
import { useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion'
export function TiltCard({ children, max = 12 }) {
  const ref = useRef(null); const reduce = useReducedMotion()
  const px = useMotionValue(0.5), py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py,[0,1],[max,-max]),{stiffness:200,damping:20})
  const ry = useSpring(useTransform(px,[0,1],[-max,max]),{stiffness:200,damping:20})
  const sheen = useMotionTemplate`radial-gradient(circle at ${useTransform(px,[0,1],['0%','100%'])} ${useTransform(py,[0,1],['0%','100%'])}, rgba(201,168,106,0.25), transparent 60%)`
  function onMove(e){ if(reduce||!ref.current) return
    const r=ref.current.getBoundingClientRect(); px.set((e.clientX-r.left)/r.width); py.set((e.clientY-r.top)/r.height) }
  const reset=()=>{px.set(0.5);py.set(0.5)}
  return (<div style={{perspective:1000}}>
    <m.div ref={ref} onPointerMove={onMove} onPointerLeave={reset}
      style={{rotateX:reduce?0:rx,rotateY:reduce?0:ry,transformStyle:'preserve-3d',willChange:'transform'}}>
      {children}
      {!reduce && <m.div style={{position:'absolute',inset:0,background:sheen,pointerEvents:'none'}}/>}
    </m.div></div>)
}
```

### Recipe 3.4 — Split-text per-char reveal (FREE — splitText is Motion+ paid)
```jsx
import * as m from 'framer-motion/m'
const word={hidden:{},show:{transition:{staggerChildren:0.04}}}
const char={hidden:{opacity:0,y:'0.4em'},show:{opacity:1,y:'0em',transition:{duration:0.6,ease:[0.2,0.65,0.3,0.9]}}}
export function SplitHeading({ text, as:Tag='h2' }) {
  return (<Tag aria-label={text}>
    {text.split(' ').map((w,wi)=>(
      <m.span key={wi} aria-hidden variants={word} initial="hidden" whileInView="show" viewport={{once:true}}
        style={{display:'inline-block',whiteSpace:'nowrap',marginRight:'0.25em'}}>
        {w.split('').map((c,ci)=>(<m.span key={ci} variants={char} style={{display:'inline-block',willChange:'transform, opacity'}}>{c}</m.span>))}
      </m.span>))}
  </Tag>)
}
```

### Recipe 3.5 — Scramble/decode text on hover (FREE — ScrambleText is Motion+ paid)
```jsx
import { useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
const GLYPHS='!<>-_\\/[]{}—=+*^?#________'
export function Scramble({ text }) {
  const reduce=useReducedMotion(); const [out,setOut]=useState(text); const raf=useRef()
  const run=useCallback(()=>{ if(reduce) return; let frame=0; const total=text.length*3
    cancelAnimationFrame(raf.current)
    const tick=()=>{ const revealed=Math.floor(frame/3)
      setOut(text.split('').map((ch,i)=> i<revealed?ch:GLYPHS[(Math.random()*GLYPHS.length)|0]).join(''))
      if(frame++<total) raf.current=requestAnimationFrame(tick); else setOut(text) }; tick() },[text,reduce])
  return <span onMouseEnter={run} aria-label={text}>{out}</span>
}
```

### Recipe 3.6 — CSS-only scroll reveal + reading-progress (zero JS, compositor)
```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    @keyframes reveal { from { opacity:0; transform:translateY(40px); } }
    .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% cover 35%; }
    @keyframes grow { from { transform: scaleX(0); } }
    .progress { position:fixed; inset:0 0 auto 0; height:3px; background:#C8323C; transform-origin:left;
      animation: grow linear; animation-timeline: scroll(root block); }
  }
}
```

### Recipe 3.7 — Cross-route View Transitions (React Router v6) + reduced-motion kill-switch
```jsx
import { Link, useViewTransitionState } from 'react-router-dom'
export function WorkCard({ slug, cover, title }) {
  const href = `/work/${slug}`; const isT = useViewTransitionState(href)
  const vt = (name)=>({ viewTransitionName: isT ? name : 'none' })
  return (<Link to={href} viewTransition>
    <img src={cover} style={vt(`cover-${slug}`)} alt="" />
    <h3 style={vt(`title-${slug}`)}>{title}</h3>
  </Link>)
}
// detail route sets the SAME names. global.css:
// ::view-transition-old(*),::view-transition-new(*){animation-duration:.4s}
// @media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
```

**Also build (same dossier, transform/opacity-only):** `RevealGrid` (variants + `whileInView`,
`viewport.once`), `Marquee` (duplicate content ×2, animate x 0→-50%, pause-on-hover, collapse static
under reduced-motion), `CountUp` (`useInView` + `animate()` updating the DOM text node — **never**
per-frame `setState`), `PinnedStory` (`useScroll` + `useTransform`, sticky pin).

**Inspirations:** Motion LazyMotion docs <https://motion.dev/docs/react-lazy-motion> · Josh Comeau scroll-driven <https://www.joshwcomeau.com/animation/scroll-driven-animations/> · arielbk 3D shiny card <https://www.arielbk.com/blog/how-to-make-a-3d-shiny-card-animation> · alexjedi magnetic-wrapper <https://github.com/alexjedi/magnetic-wrapper> · React Router VT how-to <https://reactrouter.com/how-to/view-transitions> · Chrome VT misconceptions <https://developer.chrome.com/blog/view-transitions-misconceptions> · Codrops SVG marquee <https://tympanus.net/codrops/2025/06/17/building-an-infinite-marquee-along-an-svg-path-with-react-motion/>

**Pitfalls:** Mixing `motion.*` and `m.*` re-bundles all ~34KB (use `strict`). Animate only transform/opacity (width/height/top/left/filter/box-shadow trigger layout/paint). `will-change` only on actively animating nodes, remove after. CSS `animation-timeline` is ~85%+ but Firefox/old-Safari gaps → always `@supports` + ensure no-animation fallback shows content fully visible. View Transitions need **unique** `view-transition-name` per item (suffix with slug, only while transitioning). Marquees must be pausable + collapse under reduced-motion. Motion+ (`motion-plus/react`) is paid — do not import.

---

## 4. Layout & sections (public site)

**LOCKED approach:** dark cinematic editorial site = ONE shader hero (§2) behind oversized `clamp()`
display type, a **Phantom.land video-on-hover work grid**, an **editorial kinetic-type about/contact**,
buttery **View Transitions** between routes, and a **sub-second branded loader** (counter; doubles as
the first transition — never fake a delay). Pick ONE on-brand signature interaction (magnetic CTA or
game-flavored cursor) and resist adding more. The repo already has `Hero/Work/About/Contact/Services/
Process` components — these recipes upgrade them.

### Recipe 4.1 — Video-on-hover work grid (poster LCP, `preload="none"`, reduced-motion fallback)
```jsx
import { motion, useReducedMotion } from 'framer-motion' // use m.* in-app per §3
import { useRef } from 'react'
function WorkTile({ item }){
  const reduce=useReducedMotion(); const vid=useRef(null)
  const play=()=>!reduce&&vid.current?.play()
  const stop=()=>{ if(vid.current){vid.current.pause();vid.current.currentTime=0;} }
  return (
    <motion.a href={`/work/${item.slug}`} onHoverStart={play} onHoverEnd={stop}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-surface ring-1 ring-white/5"
      whileHover={reduce?{}:{ scale:1.02 }} transition={{ type:'spring', stiffness:200, damping:22 }}>
      <img src={item.poster} alt={item.title} loading="lazy" decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"/>
      <video ref={vid} src={item.video} muted loop playsInline preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"/>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
        <span className="text-xs uppercase tracking-[0.2em] text-gold">{item.kind}</span>
        <h3 className="font-serif text-2xl text-silver">{item.title}</h3>
        {item.live && <span className="mt-1 inline-block rounded-full bg-jade/15 px-2 py-0.5 text-xs text-jade-bright">Live</span>}
      </div>
    </motion.a>
  )
}
```

### Recipe 4.2 — Editorial about/contact with word-stagger scroll reveal
```jsx
import { motion, useReducedMotion } from 'framer-motion' // use m.* in-app
const container={ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }
const word={ hidden:{ y:'0.6em', opacity:0 }, show:{ y:0, opacity:1, transition:{ ease:[0.16,1,0.3,1], duration:0.8 } } }
function Reveal({ text, className }){
  const reduce=useReducedMotion()
  if(reduce) return <p className={className}>{text}</p>
  return (<motion.p variants={container} initial="hidden" whileInView="show" viewport={{ once:true, amount:0.6 }}
      className={className+' flex flex-wrap'}>
    {text.split(' ').map((w,i)=>(<span key={i} className="mr-[0.25em] overflow-hidden"><motion.span variants={word} className="inline-block">{w}</motion.span></span>))}
  </motion.p>)
}
// CTA: <a className="bg-gradient-to-r from-crimson-bright to-gold bg-clip-text text-transparent">Start a project →</a>
```

**Inspirations (the bar):** Phantom.land grid <https://www.phantom.land/> + Codrops writeup <https://tympanus.net/codrops/2025/06/30/invisible-forces-the-making-of-phantom-lands-interactive-grid-and-3d-face-particle-system/> · Cyd Stumpel (View Transitions, branded loader) <https://www.cydstumpel.nl/> · Roman Jean-Elie (kinetic editorial) <https://www.romanjeanelie.com/> · Obys (oversized type) <https://obys.agency/> · Bruno Simon (ONE signature) <https://bruno-simon.com/> · Active Theory (networked cursor idea) <https://activetheory.net/> · Bithell Games (AAA on no WebGL) <https://www.bithellgames.com/> · Codrops WebGL portfolio writeup <https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/>

**Pitfalls:** Effect-count ≠ premium — ONE wow per chapter (Awwwards Usability weighted 30%). Hover-video grids are bandwidth traps unless `preload="none"` + poster LCP; mobile = poster-only (no hover). Branded loader must be sub-second (faking waits hurts CWV). No invented metrics — jade "Live" badges only on genuinely shipped projects. Build the reduced-motion fallback FIRST.

---

## 5. Case studies & embeds (`/work/:slug`)

**LOCKED approach:** the repo already has `react-app/src/routes/CaseStudy.jsx`. Each case study =
**problem → approach → build → outcome**, 3–5 deep, the rest a grid; **honest AI-first framing, no
fabricated metrics** (use descriptive `metric` strings from `site.js`, not numbers). Flagship projects
get **inline playable game embeds** (click-to-launch, fullscreen, **sandboxed**, lazy) — KILLEYYY's
unfair advantage. Per-route meta + `CreativeWork`/`VideoGame` JSON-LD is set via `<Head>` (§8). The
`viewTransitionName` cover/title morph (§3.7) connects the grid card to the detail hero.

### Recipe 5.1 — Lazy, sandboxed, click-to-launch playable embed
```jsx
import { useState } from 'react'
export function PlayableEmbed({ src, poster, title }) {
  const [live, setLive] = useState(false)
  if (!live) return (
    <button onClick={() => setLive(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-white/10"
      aria-label={`Launch ${title}`}>
      <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />
      <span className="absolute inset-0 grid place-items-center bg-ink/40">
        <span className="rounded-full bg-crimson px-6 py-3 font-serif text-silver shadow-glow-crimson">▶ Play {title}</span>
      </span>
    </button>
  )
  return (
    <iframe src={src} title={title} loading="lazy" allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-fullscreen"
      className="aspect-video w-full rounded-2xl ring-1 ring-white/10" />
  )
}
```

**Inspirations:** Remedy (case-study structure / full-bleed key art) <https://www.remedygames.com/> · Bithell Games <https://www.bithellgames.com/> · Jenova Chen (restraint-as-luxury timeline) <https://jenovachen.info/> · Immersive Garden (cinematic pacing) <https://immersive-g.com/>

**Pitfalls:** Always `sandbox` third-party game iframes (no `allow-top-navigation`). Lazy + click-to-launch so embeds never block LCP. Verify any "Live" URL in a real browser before featuring (ADR-010: `*.vercel.app` aliases 403'd automated fetch). JSON-LD must reflect what's actually on the page (truthful).

---

## 6. Cockpit dashboard (`/owner`)

**LOCKED approach:** the repo has `react-app/src/routes/Owner.jsx`. Build it as a single **responsive
bento grid** (12-col desktop → 1-col mobile) of self-contained tiles, each owning its own
loading→live/sample/error state. Ship a small in-repo **viz kit with zero chart deps** — `Sparkline`,
`ProgressRing`, `Heatmap`, `StatTile`, `Skeleton`, `StatusBadge`, `ActivityFeed` — themed off the
existing palette (champagne/garnet ramp, jade strictly for live). Use **one** glassmorphism treatment
(blur ≤12px) on hero tiles only + hairline white/8% borders + a top sheen line. Gate every animation
behind `motion-safe`. Each tile fetches from your own `/api` endpoints (§9), never third-party APIs
directly. Layout: a wide **ActivityFeed** (2×1) as the emotional center, a GitHub contribution
**Heatmap** tile, a row of 4 **StatTiles** each with a **Sparkline**, and a Vercel-style deploy list.

### Recipe 6.1 — Bento grid + tile shell
```jsx
export function BentoGrid({ children }) {
  return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(140px,auto)] gap-3 sm:gap-4">{children}</div>)
}
export function Tile({ className='', children }) {
  return (<div className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 p-5
    shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)] ${className}`}>
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    {children}</div>)
}
// span helpers: hero "lg:col-span-2 lg:row-span-2" · wide "sm:col-span-2" · tall "lg:row-span-2"
```

### Recipe 6.2 — Inline SVG Sparkline (no chart lib, `currentColor`-themed)
```jsx
function Sparkline({ data, width=120, height=36, fill=false }) {
  if (!data || data.length < 2) return null
  const min=Math.min(...data), max=Math.max(...data), span=max-min||1
  const pts=data.map((v,i)=>[ (i/(data.length-1))*width, height-((v-min)/span)*height ])
  const line=pts.map(p=>p.join(',')).join(' ')
  return (<svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="text-crimson overflow-visible" preserveAspectRatio="none">
    {fill && <polygon points={`0,${height} ${line} ${width},${height}`} className="fill-current opacity-10"/>}
    <polyline points={line} className="fill-none stroke-current" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r={2.5} className="fill-current"/>
  </svg>)
}
```

### Recipe 6.3 — Animated SVG ProgressRing (stroke-dashoffset)
```jsx
function ProgressRing({ pct=0, size=96, stroke=8 }) {
  const r=(size-stroke)/2, c=r*2*Math.PI, offset=c*(1-Math.min(100,Math.max(0,pct))/100)
  return (<svg width={size} height={size} className="-rotate-90">
    <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} className="fill-none stroke-white/[0.07]"/>
    <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} strokeLinecap="round"
      className="fill-none stroke-gold transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
      style={{ strokeDasharray:c, strokeDashoffset:offset }}/>
  </svg>)
}
```

### Recipe 6.4 — GitHub-style contribution Heatmap (CSS grid, garnet ramp)
```jsx
const LEVELS=['bg-white/[0.04]','bg-garnet/40','bg-garnet/70','bg-crimson/80','bg-crimson']
function levelFor(n){ if(!n) return 0; if(n<3) return 1; if(n<6) return 2; if(n<10) return 3; return 4 }
function Heatmap({ days }) { // [{date,count}] up to 371
  const weeks=[]; for(let i=0;i<days.length;i+=7) weeks.push(days.slice(i,i+7))
  return (<div className="flex gap-1 overflow-x-auto">
    {weeks.map((week,wi)=>(<div key={wi} className="grid grid-rows-7 gap-1">
      {week.map(d=>(<div key={d.date} title={`${d.count} on ${d.date}`}
        className={`h-3 w-3 rounded-[3px] ${LEVELS[levelFor(d.count)]} transition-colors hover:ring-1 hover:ring-white/30`}/>))}
    </div>))}
  </div>)
}
```

### Recipe 6.5 — Live/sample/error StatusBadge + skeleton shimmer
```jsx
function StatusBadge({ status='live' }) {
  const map={ live:{dot:'bg-jade-bright',text:'Live'}, sample:{dot:'bg-gold',text:'Sample'}, error:{dot:'bg-crimson',text:'Error'} }[status]
  return (<span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-silver/80">
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping ${map.dot}`}/>
      <span className={`relative inline-flex h-2 w-2 rounded-full ${map.dot}`}/>
    </span>{map.text}</span>)
}
// Skeleton: relative overflow-hidden bg-white/[0.06] with an absolute -translate-x-full motion-safe:animate-shimmer
//   bg-gradient-to-r from-transparent via-white/10 to-transparent. Register keyframes shimmer{100%{transform:translateX(100%)}} in tailwind.config.
```

**Inspirations:** Vercel dashboard row layout <https://vercel.com/dashboard> · Linear hairline borders + pulse skeletons <https://linear.app> · Raycast glass tiles <https://www.raycast.com> · Resend status pills <https://resend.com> · Bento gallery <https://bentogrids.com/> · Aceternity bento block <https://ui.aceternity.com/blocks/bento-grids> · react-calendar-heatmap color scale <https://github.com/kevinsqi/react-calendar-heatmap> · Flowbite indicators <https://flowbite.com/docs/components/indicators/>

**Pitfalls:** `backdrop-filter` drops frames on low-end mobile → blur ≤12–16px, few glass tiles, never stack glass-on-glass (threatens Perf ≥90). NO chart library (Recharts/Chart.js/d3 = 50–200KB) — all viz is <40 lines inline SVG/CSS. Gate shimmer/ping/ring behind `motion-safe`. Verify lightest heatmap level is distinguishable on ink + add `title`/aria (non-color cue). `tabular-nums` on all KPIs/timestamps (prevents jitter). **Badges must tell the truth** — `Sample` for seeded data, never present sample as live. Tokens stay server-side — tiles hit your own `/api`, not third-party APIs.

---

## 7. Serverless auth & OG (`/api`)

**LOCKED approach (matches ADR-007):** a **stateless, zero-dependency** HMAC-signed session in an
httpOnly cookie via `node:crypto`. Shared `api/_lib/session.js` (underscore dir = not routed) exposes
`issueCookie`/`clearCookie`/`verifySession`. Password is **scrypt-hashed** in env (`OWNER_PASSWORD_HASH`),
compared with `timingSafeEqual` **after an equal-length guard**. Cookie flags:
`HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`. Logout re-issues with `Max-Age=0`. Every
protected `/api` route calls `verifySession(req)` first. Dynamic OG via `@vercel/og` in `api/og.tsx`
(`runtime:'edge'`), reading `?title=`/`?kicker=`, styled in the locked palette (flexbox only).

### Recipe 7.1 — `api/_lib/session.js`
```js
import crypto from 'node:crypto';
const SECRET = process.env.SESSION_SECRET;        // 32+ random bytes, Vercel env only
const COOKIE = 'killey_session'; const MAX_AGE = 60*60*8;
function sign(payload){
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}
export function issueCookie(payload){
  const token = sign({ ...payload, exp: Math.floor(Date.now()/1000)+MAX_AGE });
  return `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}
export function clearCookie(){ return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`; }
export function verifySession(req){
  const raw = req.cookies?.[COOKIE];
  if (!raw || !raw.includes('.')) return null;
  const [data,sig] = raw.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  const a=Buffer.from(sig), b=Buffer.from(expected);
  if (a.length!==b.length || !crypto.timingSafeEqual(a,b)) return null; // length guard FIRST
  try { const p=JSON.parse(Buffer.from(data,'base64url').toString());
    if (!p.exp || p.exp < Math.floor(Date.now()/1000)) return null; return p;
  } catch { return null; }
}
```

### Recipe 7.2 — `api/auth/login.js` (scrypt check + Set-Cookie)
```js
import crypto from 'node:crypto';
import { issueCookie } from '../_lib/session.js';
// OWNER_PASSWORD_HASH = "<saltHex>:<scryptHex>", generated once offline:
//  node -e "const c=require('crypto');const s=c.randomBytes(16);const h=c.scryptSync('MYPASS',s,64);console.log(s.toString('hex')+':'+h.toString('hex'))"
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'method' });
  const { password } = req.body || {};
  if (typeof password !== 'string') return res.status(400).json({ error:'bad' });
  const [saltHex,hashHex] = (process.env.OWNER_PASSWORD_HASH||'').split(':');
  if (!saltHex || !hashHex) return res.status(500).json({ error:'unconfigured' });
  const salt=Buffer.from(saltHex,'hex'), stored=Buffer.from(hashHex,'hex');
  const candidate = crypto.scryptSync(password, salt, stored.length);
  const ok = candidate.length===stored.length && crypto.timingSafeEqual(candidate, stored);
  if (!ok) return res.status(401).json({ error:'invalid' });   // generic msg
  res.setHeader('Set-Cookie', issueCookie({ sub:'owner', role:'owner' }));
  return res.status(200).json({ ok:true });
}
// api/auth/session.js: return verifySession(req) ? {authenticated:true,...} : 401
// api/auth/logout.js: POST -> res.setHeader('Set-Cookie', clearCookie()); 200
// Client cockpit on mount: fetch('/api/auth/session', { credentials:'include' })
```

### Recipe 7.3 — `api/og.tsx` (branded edge OG, framework=other)
```tsx
import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };
export default function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const title  = (searchParams.get('title')  || 'KILLEYYY').slice(0,100);
  const kicker =  searchParams.get('kicker') || 'Hassan Sardar Shah';
  return new ImageResponse(
    (<div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column',
      justifyContent:'space-between', padding:'80px',
      background:'linear-gradient(135deg, #0E0E10 0%, #17171B 60%, #7B1E2B 140%)',
      color:'#E8E6E1', fontFamily:'sans-serif' }}>
      <div style={{ display:'flex', color:'#C9A86A', fontSize:34, letterSpacing:4, textTransform:'uppercase' }}>{kicker}</div>
      <div style={{ display:'flex', fontSize:96, fontWeight:700, lineHeight:1.05, color:'#E8E6E1', maxWidth:980 }}>{title}</div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:18, height:18, borderRadius:9, background:'#C8323C' }} />
        <span style={{ fontSize:30, color:'#9a9a9f' }}>killeyyy.com</span>
      </div>
    </div>), { width:1200, height:630 }   // auto 1yr immutable cache
  );
}
// head: <meta property="og:image" content="https://killeyyy.com/api/og?title=Shadow%20Kombat" />
// robots.txt: Allow: /api/og*
```

**Inspirations:** Vercel OG docs <https://vercel.com/docs/og-image-generation> · OG API ref <https://vercel.com/docs/og-image-generation/og-image-api> · Vercel Node runtime <https://vercel.com/docs/functions/runtimes/node-js> · Vercel webhook signature compare idiom <https://vercel.com/docs/headers/request-headers> · custom font recipe <https://vercel.com/docs/recipes/using-custom-font> · MDN Set-Cookie <https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie> · Node crypto <https://nodejs.org/api/crypto.html>

**Pitfalls:** `timingSafeEqual` **throws** on unequal buffer lengths → guard `a.length===b.length &&` first or a forged token crashes the function. `SameSite=Strict` is not sent on cross-site top-level nav (fine for a cockpit you open directly; downgrade to `Lax` if email/Twitter links feel logged-out). Logout `Set-Cookie` must match Name+Path+flags exactly. Secrets must be plain env vars read inside `/api` only — **never** `VITE_*` (Vite inlines those into the client bundle). `@vercel/og` has a hard 500KB cap and **flexbox only** (`display:grid` silently fails — every flex container needs explicit `display:flex`). Add `Allow: /api/og*` to robots.txt.

---

## 8. Prerender & SEO

**LOCKED approach (ADR-002):** **`vite-react-ssg`** (NOT vite-plugin-ssr/Vike — Vike became a full
framework that replaces routing; its docs point RR users to vite-react-ssg). It keeps RR v6 working,
exposes `getStaticPaths()` for `/work/:slug`, ships a `<Head>` for per-route title/meta/canonical/
JSON-LD, and emits static HTML to `dist/`. Pair with **`vite-plugin-sitemap`** (sitemap.xml + robots.txt
at build) and **hand-authored JSON-LD** (Person on home, CreativeWork + BreadcrumbList on case studies).

> **Critical repo fix:** the current `vercel.json` has a blanket SPA rewrite
> `"/((?!api/).*)" → "/index.html"`. With prerendering this hands crawlers the empty CSR shell and
> **destroys the SEO win**. Replace it so static per-route HTML is served as-is; only fallback-rewrite
> client-only routes (`/owner/*`). See Recipe 8.4.

### Recipe 8.1 — `src/main.jsx` entry (ViteReactSSG instead of createRoot)
```jsx
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'
export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL })
// index.html keeps <div id="root"><!--app-html--></div> and NO hardcoded <title> (per-route <Head> sets it)
```

### Recipe 8.2 — routes with `getStaticPaths` (one slug source-of-truth = `site.js`)
```jsx
import type { RouteRecord } from 'vite-react-ssg'
import { workSlugs } from './data/site'   // derive from the existing site.js projects
export const routes: RouteRecord[] = [{
  path: '/', element: <Layout/>, entry: 'src/Layout.jsx',
  children: [
    { index: true, Component: React.lazy(()=>import('./routes/Home')) },
    { path: 'work', Component: React.lazy(()=>import('./routes/WorkIndex')) },
    { path: 'work/:slug', lazy: ()=>import('./routes/CaseStudy'), entry: 'src/routes/CaseStudy.jsx',
      getStaticPaths: () => workSlugs.map(s => `work/${s}`) },
  ],
}]
```

### Recipe 8.3 — `<Head>` per route: meta + OG/Twitter + JSON-LD (case study)
```jsx
import { Head } from 'vite-react-ssg'
const SITE='https://killeyyy.com'
// inside CaseStudy Component, w = loaded project:
const creativeWork={ '@context':'https://schema.org','@type':'CreativeWork', name:w.name, url:`${SITE}/work/${w.slug}`,
  image:`${SITE}${w.cover}`, datePublished:w.year, author:{ '@type':'Person', name:'Hassan Sardar Shah', url:SITE } }
const breadcrumb={ '@context':'https://schema.org','@type':'BreadcrumbList', itemListElement:[
  { '@type':'ListItem', position:1, name:'Work', item:`${SITE}/work` },
  { '@type':'ListItem', position:2, name:w.name } ] }  // last item: NO `item`
return (<article><Head>
  <title>{`${w.name} — KILLEYYY`}</title>
  <meta name="description" content={w.blurb} />
  <link rel="canonical" href={`${SITE}/work/${w.slug}`} />
  <meta property="og:type" content="article" /><meta property="og:title" content={w.name} />
  <meta property="og:image" content={`${SITE}/api/og?title=${encodeURIComponent(w.name)}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">{JSON.stringify(creativeWork)}</script>
  <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
</Head>…</article>)
// Home: Person JSON-LD with sameAs = REAL socials from site.js (IG @hssn.shah, LinkedIn, github.com/killeyyy)
```

### Recipe 8.4 — `vite.config.js` (sitemap) + corrected `vercel.json`
```js
// vite.config.js
import Sitemap from 'vite-plugin-sitemap'
import { workSlugs } from './src/data/site'
const SITE='https://killeyyy.com'
export default defineConfig({ plugins:[ react(),
  Sitemap({ hostname:SITE, dynamicRoutes: workSlugs.map(s=>`/work/${s}`),
    exclude:['/owner','/owner/*'], generateRobotsTxt:true,
    robots:[{ userAgent:'*', allow:'/', disallow:'/owner' }], changefreq:'weekly', priority:0.8 }),
], ssgOptions:{ script:'async', dirStyle:'nested' } })
```
```json
// vercel.json — DO NOT blanket-rewrite to index.html
{
  "$schema":"https://openapi.vercel.sh/vercel.json",
  "installCommand":"npm --prefix react-app install",
  "buildCommand":"npm --prefix react-app run build",
  "outputDirectory":"react-app/dist",
  "cleanUrls": true,
  "rewrites":[ { "source":"/owner/:path*", "destination":"/index.html" } ],
  "headers":[ { "source":"/assets/(.*)", "headers":[{ "key":"Cache-Control","value":"public, max-age=31536000, immutable" }] } ]
}
```

**Inspirations:** vite-react-ssg <https://github.com/Daydreamer-riri/vite-react-ssg> (+ docs <https://vite-react-ssg.netlify.app/docs/getting-started>) · Vike (why prerender beats CSR) <https://vike.dev/> · Google BreadcrumbList <https://developers.google.com/search/docs/appearance/structured-data/breadcrumb> · vite-plugin-sitemap <https://github.com/jbaubree/vite-plugin-sitemap> · jsonld Person <https://jsonld.com/person/> · CSR→SSG Lighthouse case study <https://www.alikaraki.me/blog/vite-react-ssg-lighthouse>

**Pitfalls:** Do NOT keep the blanket SPA rewrite (serves empty shell to bots). `getStaticPaths` must enumerate **every** indexable slug — derive it and the sitemap `dynamicRoutes` from the **same** `site.js` list. `og:image`/`twitter:image`/`canonical` must be **absolute** URLs. `loader()` runs at build — guard server-only code; its output ships in the static manifest (no secrets). Last BreadcrumbList item omits `item`, positions contiguous from 1. Validate every JSON-LD block in Google's Rich Results Test before shipping. Keep the ogl hero lazy/off the critical path so prerendered first paint stays fast (SEO 100 is easy; Perf ≥90 depends on not blocking on the shader).

---

## 9. Live-data APIs (cockpit feeds)

**LOCKED approach:** four tiny **uniform** Vercel Node functions — `api/github.js`, `api/vercel.js`,
`api/notion.js`, `api/drive.js`. Each: reads its secret from `process.env`; hits 1–2 REST endpoints
with the documented header; maps to a **whitelist of safe fields**; sets
`Cache-Control: public, s-maxage=60, stale-while-revalidate=300` on success; and on **any error or
missing token returns HTTP 200** with `{ source:'sample', ... }` and `s-maxage=30`. The cockpit uses
the `source` field to flip the `StatusBadge` truthfully (Live vs Sample). Protect each behind
`verifySession(req)` (§7) since these power the private cockpit. (Matches ADR-009.)

### Recipe 9.1 — `api/github.js` (recent repos + push-event feed, sample fallback)
```js
export default async function handler(req, res) {
  const USER=process.env.GITHUB_USER||'killeyyy'; const TOKEN=process.env.GITHUB_TOKEN;
  const H={ 'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',
    'User-Agent':'killeyyy-cockpit', ...(TOKEN?{Authorization:`Bearer ${TOKEN}`}:{}) };
  try {
    const [repoRes,evtRes]=await Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&direction=desc&per_page=6&type=owner`,{headers:H}),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=15`,{headers:H}) ]);
    if(!repoRes.ok||!evtRes.ok) throw new Error(`gh ${repoRes.status}/${evtRes.status}`);
    const repos=(await repoRes.json()).map(r=>({ name:r.name,url:r.html_url,description:r.description,
      pushedAt:r.pushed_at,stars:r.stargazers_count,language:r.language,fork:r.fork,topics:r.topics||[] }));
    const events=(await evtRes.json())
      .filter(e=>['PushEvent','CreateEvent','ReleaseEvent','PullRequestEvent'].includes(e.type)).slice(0,8)
      .map(e=>({ type:e.type,repo:e.repo?.name,createdAt:e.created_at,
        commits:e.type==='PushEvent'?(e.payload?.commits||[]).map(c=>c.message):[] }));
    res.setHeader('Cache-Control','public, s-maxage=120, stale-while-revalidate=600');
    return res.status(200).json({ source:'live', repos, events });
  } catch { res.setHeader('Cache-Control','public, s-maxage=30');
    return res.status(200).json(GITHUB_SAMPLE); }
}
const GITHUB_SAMPLE={ source:'sample', repos:[{ name:'shadow-kombat', url:'https://github.com/killeyyy/shadow-kombat',
  description:'Cinematic browser fighter', pushedAt:'2026-06-01T12:00:00Z', stars:0, language:'GDScript', fork:false, topics:['game'] }],
  events:[{ type:'PushEvent', repo:'killeyyy/shadow-kombat', createdAt:'2026-06-01T12:00:00Z', commits:['ship M1'] }] };
// Free polling: cache ETag + send If-None-Match -> 304 costs NO rate-limit quota. Honor x-poll-interval.
```

### Recipe 9.2 — `api/vercel.js` (deployments → status pills)
```js
export default async function handler(req,res){
  const TOKEN=process.env.VERCEL_TOKEN, TEAM=process.env.VERCEL_TEAM_ID, PROJ=process.env.VERCEL_PROJECT_ID;
  const qs=new URLSearchParams({ limit:'8', projectId:PROJ }); if(TEAM) qs.set('teamId',TEAM);
  try {
    if(!TOKEN) throw new Error('no token');
    const r=await fetch(`https://api.vercel.com/v7/deployments?${qs}`,{ headers:{ Authorization:`Bearer ${TOKEN}` }});
    if(!r.ok) throw new Error(`vercel ${r.status}`);
    const { deployments }=await r.json();
    const data=deployments.map(d=>({ uid:d.uid, name:d.name, url:d.url?`https://${d.url}`:null,
      state:d.state||d.readyState, target:d.target, created:d.created, inspectorUrl:d.inspectorUrl,
      branch:d.meta?.githubCommitRef, commitMsg:d.meta?.githubCommitMessage }));
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ source:'live', deployments:data });
  } catch { res.setHeader('Cache-Control','public, s-maxage=30');
    return res.status(200).json({ source:'sample', deployments:[{ uid:'dpl_sample', name:'killeyyy',
      url:'https://killeyyy.vercel.app', state:'READY', target:'production', created:1748779200000,
      inspectorUrl:null, branch:'main', commitMsg:'ship cockpit' }] }); }
}
// state enum: BUILDING|ERROR|INITIALIZING|QUEUED|READY|CANCELED|BLOCKED|DELETED -> READY=jade, BUILDING=gold, ERROR=garnet
```

### Recipe 9.3 — `api/notion.js` (2025-09-03 data-source flow)
```js
const NV='2025-09-03';
export default async function handler(req,res){
  const TOKEN=process.env.NOTION_TOKEN, DB=process.env.NOTION_DATABASE_ID;
  let DSID=process.env.NOTION_DATA_SOURCE_ID;
  const H={ Authorization:`Bearer ${TOKEN}`, 'Notion-Version':NV, 'Content-Type':'application/json' };
  try {
    if(!TOKEN||!DB) throw new Error('no token/db');
    if(!DSID){ const dbr=await fetch(`https://api.notion.com/v1/databases/${DB}`,{headers:H});
      if(!dbr.ok) throw new Error(`notion db ${dbr.status}`); DSID=(await dbr.json()).data_sources?.[0]?.id; }
    const qr=await fetch(`https://api.notion.com/v1/data_sources/${DSID}/query`,{ method:'POST', headers:H,
      body:JSON.stringify({ page_size:25, sorts:[{ timestamp:'created_time', direction:'descending' }] }) });
    if(!qr.ok) throw new Error(`notion query ${qr.status}`);
    const { results }=await qr.json();
    const rows=results.map(p=>{ const P=p.properties;
      const txt=pr=>pr?.title?.[0]?.plain_text||pr?.rich_text?.[0]?.plain_text||'';
      return { id:p.id, url:p.url, created:p.created_time, name:txt(P.Name||P.Lead||P.Title),
        status:P.Status?.status?.name||P.Stage?.select?.name||null,
        value:P.Value?.number??P.Amount?.number??null, source:P.Source?.select?.name||null }; });
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ source:'live', rows });
  } catch { res.setHeader('Cache-Control','public, s-maxage=30');
    return res.status(200).json({ source:'sample', rows:[
      { id:'p1', url:'#', created:'2026-06-01T00:00:00Z', name:'Acme brand film', status:'Proposal', value:5000, source:'Referral' } ] }); }
}
```

### Recipe 9.4 — `api/drive.js` (refresh-token → access-token, `fields` required)
```js
export default async function handler(req,res){
  const { GOOGLE_CLIENT_ID:cid, GOOGLE_CLIENT_SECRET:secret, GOOGLE_REFRESH_TOKEN:rt }=process.env;
  try {
    if(!cid||!secret||!rt) throw new Error('no oauth creds');
    const tok=await fetch('https://oauth2.googleapis.com/token',{ method:'POST',
      headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body:new URLSearchParams({ client_id:cid, client_secret:secret, refresh_token:rt, grant_type:'refresh_token' }) });
    if(!tok.ok) throw new Error(`token ${tok.status}`); const { access_token }=await tok.json();
    const params=new URLSearchParams({ orderBy:'modifiedTime desc', pageSize:'10',
      fields:'files(id,name,mimeType,modifiedTime,webViewLink,iconLink,size)', q:'trashed=false' });
    const r=await fetch(`https://www.googleapis.com/drive/v3/files?${params}`,{ headers:{ Authorization:`Bearer ${access_token}` }});
    if(!r.ok) throw new Error(`drive ${r.status}`);
    const files=(await r.json()).files.map(f=>({ id:f.id,name:f.name,mimeType:f.mimeType,
      modifiedTime:f.modifiedTime,link:f.webViewLink,icon:f.iconLink,size:f.size?Number(f.size):null }));
    res.setHeader('Cache-Control','public, s-maxage=120, stale-while-revalidate=600');
    return res.status(200).json({ source:'live', files });
  } catch { res.setHeader('Cache-Control','public, s-maxage=30');
    return res.status(200).json({ source:'sample', files:[{ id:'f1', name:'KILLEYYY-brand-kit.pdf',
      mimeType:'application/pdf', modifiedTime:'2026-06-02T09:00:00Z', link:'#', icon:null, size:248000 }] }); }
}
```

**Inspirations:** GitHub list repos <https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user> · GitHub public events <https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28#list-public-events-for-a-user> · GitHub rate limits <https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28> · Vercel list deployments <https://vercel.com/docs/rest-api/reference/endpoints/deployments/list-deployments> · Notion 2025-09-03 upgrade <https://developers.notion.com/docs/upgrade-guide-2025-09-03> + query data source <https://developers.notion.com/reference/query-a-data-source> · Drive files.list <https://developers.google.com/drive/api/reference/rest/v3/files/list> · Google OAuth refresh <https://developers.google.com/identity/protocols/oauth2/web-server#offline> · Vercel edge caching <https://vercel.com/docs/edge-network/caching>

**Pitfalls:** **Notion breaking change** — with version `2025-09-03` query via `POST /v1/data_sources/{id}/query` (the old `/databases/{id}/query` is gone); do the one-time `GET /v1/databases/{id}` to read `data_sources[].id` and cache it in `NOTION_DATA_SOURCE_ID`. **Drive has no static API key** — exchange a stored `refresh_token` each batch; omitting `fields` returns only id+name; prefer `drive.metadata.readonly` scope. Vercel path is **v7** now; `url` lacks `https://` (prepend it); use `teamId` for team tokens. GitHub unauthenticated = 60/hr → always send a PAT (5,000/hr) **and** a `User-Agent` (rejects without it); use ETag/304. **Never** ship tokens in the client bundle — read `process.env` inside the function and map to a whitelist (raw responses can leak emails/ids). Fallback must still be **HTTP 200** with short cache so the panel recovers. `s-maxage` is the shared CDN cache (what you want); Vercel only caches GET/HEAD.

---

## Appendix — cross-cutting budget rules (every section)
- No-motion-first baseline; build reduced-motion fallbacks **before** the animated version.
- Animate transform/opacity only; `will-change` on active nodes, removed after.
- One signature creative moment per chapter, not everywhere.
- Every accent-on-dark pairing audited at ≥4.5:1 (text) / ≥3:1 (large/UI) on ink.
- Heavy assets (shader, video, embeds) lazy-loaded and off the critical render path.
- Secrets only in Vercel env + `/api`; never `VITE_*`, never the client bundle, never git.
- Truthful content only — no fabricated metrics, logos, or "Live" badges on unshipped work.
