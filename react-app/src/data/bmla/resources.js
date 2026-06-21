// ============================================================
// PRIVATE resource locker — your own course materials.
// Paste YOUR OWN access-controlled links (e.g. Google Drive "share" links
// only you can open) so your exact book, lecture notes, assignments and
// past papers sit right next to the lessons. Leave href:"" to show an
// "add link" placeholder. These never leave your private vault.
// ============================================================

/** @typedef {{label:string, href:string, note?:string}} ResItem */
/** @typedef {{title:string, icon:string, note?:string, items:ResItem[]}} ResGroup */

/** @type {ResGroup[]} */
export const resourceGroups = [
  {
    title: "Textbooks",
    icon: "BookOpen",
    note: "Your own copies (Lay & Budnick) — paste a Drive link only you can open.",
    items: [
      { label: "Lay — Linear Algebra and Its Applications (3rd ed.)", href: "" },
      { label: "Budnick — Applied Mathematics (3rd ed.)", href: "" },
    ],
  },
  {
    title: "Lecture notes",
    icon: "NotebookPen",
    note: "Teacher's slides/notes, by chapter.",
    items: [
      { label: "Ch 1 — Linear equations (REF/RREF, span, Ax=b)", href: "" },
      { label: "Ch 2 — Matrix algebra, inverses, IMT", href: "" },
      { label: "Ch 3 — Determinants", href: "" },
      { label: "Ch 5 — Eigenvalues & diagonalization", href: "" },
      { label: "LP / Simplex", href: "" },
      { label: "Transportation & Assignment", href: "" },
    ],
  },
  {
    title: "Assignments",
    icon: "FileText",
    items: [
      { label: "Assignment 1", href: "" },
      { label: "Assignment 2", href: "" },
      { label: "Assignment 3", href: "" },
      { label: "Assignment 4", href: "" },
    ],
  },
  {
    title: "Past papers",
    icon: "FileText",
    items: [
      { label: "Final — Spring 2024", href: "" },
      { label: "Midterm — Spring 2026", href: "" },
    ],
  },
  {
    title: "My own notes",
    icon: "NotebookPen",
    note: "Your master notes, formula sheet, cram packs.",
    items: [
      { label: "Master study notes", href: "" },
      { label: "Formula sheet", href: "" },
    ],
  },
];
