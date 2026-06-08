// ============================================================
// SINGLE SOURCE OF TRUTH for all site content.
// Both the public site and the owner cockpit import from here —
// edit content in ONE place. Ground-truth facts confirmed by Hassan
// (see docs/DECISIONS.md ADR-010); the original brief was stale.
// No invented metrics — truthful content only.
// ============================================================

/**
 * @typedef {Object} Project
 * @property {string} slug
 * @property {string} name
 * @property {string} type        e.g. "Game", "EdTech", "Web/Product"
 * @property {string} year
 * @property {"Live"|"In progress"|"Prototype"|"Paused"} status
 * @property {boolean} client      show on the public site?
 * @property {boolean} featured    flagship (case study + larger card)?
 * @property {string} blurb        one-line description
 * @property {string|null} url     live link (null if not public)
 * @property {string|null} embed   playable iframe src (null if none)
 * @property {string} metric       descriptive, NOT a fabricated number
 */

export const site = {
  brand: "KILLEYYY",
  fullName: "Hassan Sardar Shah",
  // Headline leads with WHAT he builds (no mantra).
  headline: "I build cinematic games, sites & content with AI.",
  subhead:
    "KILLEYYY — an AI-first builder & creator. I ship real products fast: browser games, web apps, and brand content, end to end.",
  about: [
    "I'm Hassan Sardar Shah — KILLEYYY. I'm an AI-first builder and creator: I don't write code the traditional way, I direct AI tools to design, build and ship complete products.",
    "I work cinematically — games, websites and content that feel premium and intentional. Most of what I build is live and playable in the browser, so the work speaks for itself.",
    "If you want something built fast and built well — a game, a site, a brand presence — let's talk.",
  ],
  // Location intentionally hidden on the public site (ADR-010).
  location: null,
  // Primary contact first; both listed.
  emails: ["hassansardarshah1@gmail.com", "h.shah.26396@khi.iba.edu.pk"],
  get email() {
    return this.emails[0];
  },
};

export const socials = {
  instagram: "https://instagram.com/hssn.shah",
  linkedin: "https://www.linkedin.com/in/hassan-sardar-shah-941625170/",
  github: "https://github.com/killeyyy", // verified real; remove if you prefer it private
};

/** @type {{title:string, body:string, icon:string}[]} */
export const services = [
  {
    title: "AI-built games",
    body: "Cinematic browser & indie games — from concept and mechanics to a shipped, playable build.",
    icon: "Gamepad2",
  },
  {
    title: "Brand & content",
    body: "A premium brand presence and content that makes people remember the name.",
    icon: "Megaphone",
  },
  {
    title: "Web design & build",
    body: "Fast, cinematic websites and web apps, designed and shipped end to end.",
    icon: "PenTool",
  },
  {
    title: "AI workflows",
    body: "Custom AI-driven workflows and tools that compress weeks of work into days.",
    icon: "Sparkles",
  },
];

/** @type {{step:string, title:string, body:string}[]} */
export const process = [
  { step: "01", title: "Discover", body: "We pin down the idea, the feeling, and what 'shipped' means." },
  { step: "02", title: "Design & build", body: "I direct AI tools to design and build it — cinematic, fast, iterative." },
  { step: "03", title: "Ship & iterate", body: "It goes live in the browser. We watch, learn, and sharpen it." },
];

/** @type {Project[]} */
export const projects = [
  {
    slug: "empire-rise",
    name: "Empire — Rise to the Top",
    type: "Game",
    year: "2026",
    status: "Live",
    client: true,
    featured: true,
    blurb: "Cinematic choose-your-own-adventure crime game — rise from nothing to the top.",
    url: "https://empire-rise.vercel.app",
    embed: "https://empire-rise.vercel.app",
    metric: "Live & playable in the browser",
  },
  {
    slug: "bmla-quest",
    name: "BMLA Quest",
    type: "EdTech",
    year: "2026",
    status: "Live",
    client: true,
    featured: true,
    blurb: "Gamified study tool for Business Maths & Linear Algebra — learning as a quest.",
    url: "https://bmla-quest.vercel.app",
    embed: "https://bmla-quest.vercel.app",
    metric: "Live & playable in the browser",
  },
  {
    slug: "bmla-prep-command-center",
    name: "BMLA Prep Command Center",
    type: "EdTech",
    year: "2026",
    status: "Live",
    client: true,
    featured: false,
    blurb: "A focused study dashboard — everything for exam prep in one calm command center.",
    url: "https://hassan-deals-pk.vercel.app",
    embed: "https://hassan-deals-pk.vercel.app",
    metric: "Live in the browser",
  },
  {
    slug: "shadow-kombat",
    name: "Shadow Kombat",
    type: "Game (Godot)",
    year: "2026",
    status: "In progress",
    client: true,
    featured: true,
    blurb: "Original cinematic 2D fighter in Godot — MK-style impact, KO slow-mo.",
    url: null,
    embed: null,
    metric: "In development",
  },
  {
    slug: "ascent-zero-to-hero",
    name: "ASCENT: Zero to Hero",
    type: "Web / Product",
    year: "2026",
    status: "In progress",
    client: true,
    featured: false,
    blurb: "A cinematic web-series reading experience — ranked zero, chapter-based progression.",
    url: null,
    embed: null,
    metric: "In development",
  },
];

// ---- Owner cockpit data (private). Sample/placeholder until wired to live
// sources — the dashboard shows a "sample data" badge when a token is absent. ----

/** @type {{name:string, company:string, topic:string, status:string, value:string}[]} */
export const leads = [
  { name: "—", company: "—", topic: "Add your first lead", status: "Idea", value: "—" },
];

/** @type {{title:string, due:string, done:boolean}[]} */
export const pipeline = [
  { title: "Wire owner login (serverless)", due: "Shipped", done: true },
  { title: "Connect GitHub to cockpit (live)", due: "Shipped", done: true },
  { title: "Ship redesigned portfolio (review → merge)", due: "In review", done: false },
  { title: "Add Vercel/Notion tokens for live feeds", due: "Next", done: false },
];

/** @type {{label:string, href:string, icon:string}[]} */
export const links = [
  { label: "Empire — Rise to the Top", href: "https://empire-rise.vercel.app", icon: "Gamepad2" },
  { label: "BMLA Quest", href: "https://bmla-quest.vercel.app", icon: "GraduationCap" },
  { label: "Vercel dashboard", href: "https://vercel.com/dashboard", icon: "Triangle" },
  { label: "GitHub", href: "https://github.com/killeyyy", icon: "Github" },
  { label: "Notion", href: "https://notion.so", icon: "NotebookPen" },
  { label: "Gmail", href: "https://mail.google.com", icon: "Mail" },
];

// Slugs of indexable work pages (one source of truth for routing + sitemap + SEO).
export const workSlugs = projects.map((p) => p.slug);

/**
 * Rich case-study content per project (keyed by slug). Truthful and qualitative
 * — NO invented metrics. Sourced from the project notes in /vault/projects.
 * CaseStudy.jsx merges this with the matching `projects` entry.
 * @type {Record<string, {tagline:string,intent:string,approach:{t:string,d:string}[],outcome:string,highlights:string[],stack:string[],role:string}>}
 */
export const caseStudies = {
  "empire-rise": {
    tagline: "A film you play — rise from nothing to the top of the city.",
    intent:
      "Make an interactive story that feels like a film, runs anywhere, and shows off cinematic choice design — playable straight from the portfolio, no install.",
    approach: [
      { t: "Pin the feeling first", d: "Define what 'cinematic' means here: a noir tone, weighty decisions, and consequences that stick to the story." },
      { t: "Direct AI through the build", d: "Drive AI tools through the writing, branching logic and UI — iterating fast on the story tree and the moment-to-moment feel." },
      { t: "Ship it playable", d: "Deploy a real, instant-play build to the browser and embed it live in the portfolio so the work speaks for itself." },
    ],
    outcome:
      "A live, playable cinematic crime game you can open in one click — branching paths and a climb from zero to the top, with nothing to download.",
    highlights: ["Branching choices with real consequences", "Cinematic, film-like pacing", "Plays instantly in the browser"],
    stack: ["AI-first workflow", "Branching narrative design", "Web / single-page build", "Deployed on Vercel"],
    role: "Concept, writing direction, build & ship — solo, AI-directed.",
  },
  "bmla-quest": {
    tagline: "Turn exam prep into a quest you actually want to play.",
    intent:
      "Make revising Business Maths & Linear Algebra genuinely engaging by reframing it as a game — progression and momentum instead of a wall of practice problems.",
    approach: [
      { t: "Reframe study as a game", d: "Layer a quest/progression loop onto real coursework so each session feels like advancing, not grinding." },
      { t: "Build the loop with AI", d: "Direct AI tools through content structuring, the progression system and the UI — fast iterations on what feels rewarding." },
      { t: "Ship browser-first", d: "Deploy an instant-open build so a student can start in seconds on any device." },
    ],
    outcome:
      "A live, playable study tool where Business Maths & Linear Algebra revision becomes a quest with momentum — sibling to the calmer BMLA Prep Command Center.",
    highlights: ["Gamified progression on real coursework", "Instant to open, mobile-friendly", "Built fast with an AI-first workflow"],
    stack: ["AI-first workflow", "Gamified progression loop", "Web / browser", "Deployed on Vercel"],
    role: "Concept, content structuring, build & ship — solo, AI-directed.",
  },
  "bmla-prep-command-center": {
    tagline: "One calm command center for everything exam prep.",
    intent:
      "Prep was scattered across notes and files. Centralize it into a single calm dashboard that cuts friction and decision-fatigue.",
    approach: [
      { t: "Give prep a home", d: "Pull materials, tasks and progress into one focused place instead of scattered tabs and files." },
      { t: "Design for calm focus", d: "Direct AI tools through a clean dashboard layout and data model that stays quiet and out of the way." },
      { t: "Ship it usable", d: "Deploy a browser-first dashboard that's ready to open and work in immediately." },
    ],
    outcome:
      "A live, focused study dashboard — the no-noise companion to BMLA Quest's gamified side.",
    highlights: ["Everything in one focused view", "Calm, low-friction by design", "Browser-first, always available"],
    stack: ["AI-first workflow", "Dashboard UI + data model", "Web / browser", "Deployed on Vercel"],
    role: "Concept, design direction, build & ship — solo, AI-directed.",
  },
  "shadow-kombat": {
    tagline: "An original 2D fighter built for impact — MK-style.",
    intent:
      "Build a real, juicy fighting game with proper game-feel: weighty hits, hit-stop, and cinematic slow-motion KOs.",
    approach: [
      { t: "Chase game-feel", d: "Target the feel first — impact frames, hit-stop and KO slow-mo that make every hit land hard." },
      { t: "Build in Godot", d: "Native 2D engine work in Godot for fighter systems and movement, AI-assisted on systems and art direction where it helps." },
      { t: "Develop in the open", d: "In active development and marked honestly as a work in progress — no invented release date." },
    ],
    outcome:
      "A native 2D fighter in active development, going for Mortal-Kombat-style impact. Shown on the portfolio as an honest WIP (no playable embed yet).",
    highlights: ["Weighty hits + hit-stop", "Cinematic slow-motion KOs", "Original characters & direction"],
    stack: ["Godot engine", "2D fighter systems", "Game-feel / hit-stop", "AI-assisted production"],
    role: "Concept, game-feel and production direction — in progress.",
  },
  "ascent-zero-to-hero": {
    tagline: "A web-series you climb — ranked zero, chapter by chapter.",
    intent:
      "Make reading a web-series feel cinematic and game-like: ranks, chapters, and a real sense of ascending from the bottom.",
    approach: [
      { t: "Make reading feel like climbing", d: "Frame the experience around progression — start 'ranked zero' and ascend through chapters." },
      { t: "Build cinematic on the web", d: "Direct AI tools through the content and a cinematic chapter-based UI." },
      { t: "Ship the first ascent", d: "In development; building toward a first showable chapter — honest WIP." },
    ],
    outcome:
      "A cinematic, chapter-based reading experience in development — power-fantasy progression on the web.",
    highlights: ["Chapter-based progression", "Cinematic, game-like framing", "Web-first reading experience"],
    stack: ["AI-first workflow", "Cinematic web UI", "Chapter progression", "Web / browser"],
    role: "Concept, narrative and UI direction — in progress.",
  },
};

export default { site, socials, services, process, projects, leads, pipeline, links, caseStudies, workSlugs };
