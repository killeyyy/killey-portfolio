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
  { title: "Ship redesigned portfolio", due: "In progress", done: false },
  { title: "Wire owner login (serverless)", due: "Next", done: false },
  { title: "Connect GitHub/Vercel/Notion to cockpit", due: "Next", done: false },
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

export default { site, socials, services, process, projects, leads, pipeline, links };
