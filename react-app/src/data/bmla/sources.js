// ============================================================
// Sources & further reading — LEGITIMATE attribution only.
// We do NOT host or redistribute IBA / instructor materials.
// Instead we link to resources learners can legally access
// themselves, plus any notes KILLEYYY personally authored.
// ============================================================

/** Course textbooks — cited as references (we never host the books). */
export const textbooks = [
  {
    title: "Linear Algebra and Its Applications (3rd ed.) — David C. Lay",
    by: "course textbook · cited as reference",
    href: "https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006235",
    topics: ["matrices", "vectors", "determinants", "transformations", "eigen"],
  },
  {
    title: "Applied Mathematics for Business, Economics & the Social Sciences (3rd ed.) — Frank S. Budnick",
    by: "course textbook · cited as reference",
    href: "https://www.mheducation.com/",
    topics: ["applied", "linear-programming", "networks"],
  },
];

/** Free, openly-licensed / publicly-available references (legal to link). */
export const freeResources = [
  {
    title: "MIT OpenCourseWare 18.06 — Linear Algebra (Gilbert Strang)",
    by: "MIT OCW · free",
    href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
    topics: ["matrices", "vectors"],
  },
  {
    title: "Khan Academy — Linear Algebra",
    by: "Khan Academy · free",
    href: "https://www.khanacademy.org/math/linear-algebra",
    topics: ["matrices", "vectors"],
  },
  {
    title: "OpenStax — Business Math / Precalculus (open textbook)",
    by: "OpenStax · free, CC-licensed",
    href: "https://openstax.org/subjects/math",
    topics: ["business-math"],
  },
  {
    title: "Paul's Online Math Notes",
    by: "Lamar University · free",
    href: "https://tutorial.math.lamar.edu/",
    topics: ["business-math", "matrices"],
  },
  {
    title: "3Blue1Brown — Essence of Linear Algebra",
    by: "YouTube · free",
    href: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    topics: ["vectors", "matrices"],
  },
];

/**
 * KILLEYYY's own authored notes (uploaded by you — you own these).
 * Add { title, href, topics } entries pointing at files you place in
 * react-app/public/bmla/ or a Drive link. Empty until you add your own.
 * @type {{title:string, href:string, topics:string[]}[]}
 */
export const myNotes = [];

/** Honest note shown in the UI so the integrity stance is visible. */
export const sourcesNote =
  "Lessons here are original, written to match standard Business-Maths & Linear-Algebra topics. " +
  "We link to free, legitimate resources rather than redistributing any course's copyrighted files.";
