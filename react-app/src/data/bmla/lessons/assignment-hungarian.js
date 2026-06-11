/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "assignment-hungarian",
  moduleSlug: "networks",
  title: "The Assignment Problem & Hungarian Method",
  objective: "By the end you can run the Hungarian method start-to-finish: reduce, cover, adjust, assign.",
  minutes: 17,
  tools: ["flashcards"],
  blocks: [
    {
      type: "prose",
      text: "Assign n workers to n jobs, **one each**, at minimum total cost. It's a transportation problem where every supply and demand is 1 — which is why the **Hungarian method** can be so much faster.",
    },
    {
      type: "example",
      title: "The Hungarian recipe",
      example: {
        prompt: "Minimize total cost on an n×n cost matrix.",
        steps: [
          { text: "1) **Row reduction:** subtract each row's minimum from that row." },
          { text: "2) **Column reduction:** subtract each column's minimum from that column." },
          { text: "3) **Cover all zeros** with the minimum number of horizontal/vertical lines." },
          { text: "4) If #lines = n → an optimal assignment exists on the zeros. If #lines < n → find the **smallest uncovered value**, subtract it from every uncovered cell, **add it at line intersections**, and go back to step 3." },
          { text: "5) **Assign** on zeros — start with rows/columns having exactly one zero." },
        ],
        answerTex: "\\#\\text{lines}=n\\;\\Longleftrightarrow\\;\\text{optimal assignment available}",
      },
    },
    {
      type: "callout",
      tone: "tip",
      title: "Why subtracting is legal",
      text: "Subtracting a constant from a whole row/column shifts **every** assignment's total by the same amount — the *ranking* of assignments never changes. You're hunting a zero-cost assignment in the reduced matrix.",
    },
    {
      type: "callout",
      tone: "warn",
      text: "**Unbalanced?** Add a dummy row/column of zeros first. **Maximization?** Convert to minimization by subtracting every entry from the largest entry, then proceed normally.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Exam presentation: show the matrix after each stage (row-reduced → column-reduced → each cover/adjust round) and state the final assignment + total cost from the **original** matrix.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original randomized practice — never live coursework answers.",
    },
    { type: "practice", practice: { bankId: "networks", count: 4 } },
  ],
};
