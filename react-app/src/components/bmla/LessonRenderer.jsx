import { Suspense } from "react";
import MathTex from "./Math.jsx";
import { Rich, CalloutBlock, ExampleBlock } from "./blocks.jsx";
import { TOOLS } from "./tools/index.js";

const ToolFallback = () => (
  <div className="rounded-xl2 border border-line/70 bg-surface/40 p-6 text-center text-sm text-muted">
    Loading interactive tool…
  </div>
);

function Block({ block, moduleSlug }) {
  switch (block.type) {
    case "prose":
      return <p className="max-w-2xl text-fluid-base leading-relaxed text-muted"><Rich text={block.text} /></p>;
    case "math":
      return <MathTex tex={block.tex} className="text-silver" />;
    case "example":
      return <ExampleBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "practice": {
      const Quiz = TOOLS.quiz;
      return (
        <Suspense fallback={<ToolFallback />}>
          <Quiz moduleSlug={moduleSlug} count={block.practice?.count ?? 5} />
        </Suspense>
      );
    }
    default:
      return null;
  }
}

/** Renders a lesson's blocks, then its interactive tools. */
export default function LessonRenderer({ lesson }) {
  return (
    <div className="space-y-6">
      {lesson.blocks.map((b, i) => (
        <Block key={i} block={b} moduleSlug={lesson.moduleSlug} />
      ))}
      {(lesson.tools || [])
        .filter((id) => id !== "quiz" || !lesson.blocks.some((b) => b.type === "practice"))
        .map((id) => {
          const Tool = TOOLS[id];
          if (!Tool) return null;
          return (
            <Suspense key={id} fallback={<ToolFallback />}>
              <Tool moduleSlug={lesson.moduleSlug} />
            </Suspense>
          );
        })}
    </div>
  );
}
