// ============================================================
// The ACTUAL course syllabus — the primary navigation spine.
// Chapters/sections as taught (Lay), mapped to authored lessons:
//   Chapter 1 · §1.1–1.5, §1.7–1.9
//   Chapter 2 · §2.1–2.3
//   Chapter 3 · §3.1–3.2
// Lessons outside this list (Cramer's rule, eigen, LP, …) remain
// browsable by topic but are NOT part of the current syllabus.
// ============================================================

/** @typedef {{ sec: string, label: string, lessonSlug: string }} SyllabusSection */

export const SYLLABUS = [
  {
    chapter: 1,
    title: "Linear Equations in Linear Algebra",
    note: "§1.1–1.5 · §1.7–1.9 (1.6 skipped)",
    sections: [
      { sec: "1.1", label: "Systems of Linear Equations", lessonSlug: "lay-1-1" },
      { sec: "1.2", label: "Row Reduction & Echelon Forms", lessonSlug: "lay-1-2" },
      { sec: "1.3", label: "Vector Equations", lessonSlug: "lay-1-3" },
      { sec: "1.4", label: "The Matrix Equation Ax = b", lessonSlug: "lay-1-4" },
      { sec: "1.5", label: "Solution Sets of Linear Systems", lessonSlug: "lay-1-5" },
      { sec: "1.7", label: "Linear Independence", lessonSlug: "lay-1-7" },
      { sec: "1.8", label: "Introduction to Linear Transformations", lessonSlug: "lay-1-8" },
      { sec: "1.9", label: "The Matrix of a Linear Transformation", lessonSlug: "lay-1-9" },
    ],
  },
  {
    chapter: 2,
    title: "Matrix Algebra",
    note: "§2.1–2.3",
    sections: [
      { sec: "2.1", label: "Matrix Operations", lessonSlug: "lay-2-1" },
      { sec: "2.2", label: "The Inverse of a Matrix", lessonSlug: "lay-2-2" },
      { sec: "2.3", label: "Characterizations of Invertible Matrices", lessonSlug: "lay-2-3" },
    ],
  },
  {
    chapter: 3,
    title: "Determinants",
    note: "§3.1–3.2",
    sections: [
      { sec: "3.1", label: "Introduction to Determinants", lessonSlug: "determinants-cofactor" },
      { sec: "3.2", label: "Properties of Determinants", lessonSlug: "lay-3-2" },
    ],
  },
];

/** Flat, syllabus-ordered lesson slugs (the canonical study order). */
export const syllabusSlugs = SYLLABUS.flatMap((ch) => ch.sections.map((s) => s.lessonSlug));

/** Look up the syllabus section for a lesson slug (null if off-syllabus). */
export function sectionOf(lessonSlug) {
  for (const ch of SYLLABUS) {
    const s = ch.sections.find((x) => x.lessonSlug === lessonSlug);
    if (s) return { ...s, chapter: ch.chapter };
  }
  return null;
}

/** Chapter progress against a progress.done map. */
export function chapterProgress(done) {
  return SYLLABUS.map((ch) => {
    const total = ch.sections.length;
    const doneCount = ch.sections.filter((s) => done[s.lessonSlug]).length;
    return { chapter: ch.chapter, done: doneCount, total };
  });
}

/** First unfinished section in syllabus order (null when all done). */
export function nextSection(done) {
  for (const ch of SYLLABUS) {
    const s = ch.sections.find((x) => !done[x.lessonSlug]);
    if (s) return { ...s, chapter: ch.chapter };
  }
  return null;
}
