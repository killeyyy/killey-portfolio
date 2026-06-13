import { lazy } from "react";

// Tool registry — each tool is its own lazy chunk, mounted only when a lesson
// lists it. Tools receive { moduleSlug } for bank/deck scoping.
export const TOOLS = {
  rref: lazy(() => import("./RrefSolver.jsx")),
  quiz: lazy(() => import("./Quiz.jsx")),
  flashcards: lazy(() => import("./Flashcards.jsx")),
  "break-even": lazy(() => import("./BreakEven.jsx")),
  determinant: lazy(() => import("./DetSolver.jsx")),
  inverse: lazy(() => import("./InverseSolver.jsx")),
  eigen: lazy(() => import("./EigenSolver.jsx")),
  span: lazy(() => import("./SpanChecker.jsx")),
};
