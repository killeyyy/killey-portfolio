/** @type {import("../curriculum.js").Lesson} */
export default {
  slug: "gaussian-elimination",
  moduleSlug: "matrices",
  title: "Gaussian Elimination & RREF",
  objective: "By the end you can row-reduce any system to reduced row-echelon form and read off the solution.",
  minutes: 18,
  tools: ["rref", "quiz:linear-systems"],
  blocks: [
    {
      type: "prose",
      text: "Gaussian elimination turns a messy system into a **staircase** you can read top-down. You only ever use three **elementary row operations**: swap two rows, scale a row, or add a multiple of one row to another.",
    },
    {
      type: "math",
      tex: "\\left[\\begin{array}{ccc|c}1&2&-1&3\\\\2&3&1&5\\\\-1&1&2&0\\end{array}\\right]",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Goal shape (RREF)",
      text: "Leading 1 in each pivot row, zeros above **and** below each pivot, pivots stepping right as you go down. Then each row literally reads `variable = value`.",
    },
    {
      type: "example",
      title: "The strategy, in order",
      example: {
        prompt: "How to attack any system without panicking.",
        steps: [
          { text: "1) Get a 1 in the top-left (swap/scale if needed)." },
          { text: "2) Clear the rest of that column to 0 using R→R−k·R₁." },
          { text: "3) Move to the next pivot, repeat downward, then clear upward." },
          { tex: "\\left[\\begin{array}{ccc|c}1&0&0&x\\\\0&1&0&y\\\\0&0&1&z\\end{array}\\right]" },
        ],
        answerTex: "\\Rightarrow\\; x,\\,y,\\,z\\ \\text{read straight off the last column.}",
      },
    },
    {
      type: "prose",
      text: "Watch out for the special cases: a row like `[0 0 0 | 5]` means **no solution**; a free column (no pivot) means **infinitely many** solutions — describe them with a parameter.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Use the **interactive solver** below: type any system and step through the exact row operations. Then test yourself with randomized practice.",
    },
    {
      type: "callout",
      tone: "integrity",
      text: "Original practice only — randomized each attempt so it builds skill, never a copy of your graded quiz.",
    },
    { type: "practice", practice: { bankId: "linear-systems", count: 4 } },
  ],
};
