import { Suspense } from "react";
import MathTex from "./Math.jsx";
import { Rich, CalloutBlock, ExampleBlock, HeadingBlock, DefinitionBlock, TheoremBlock } from "./blocks.jsx";
import Checkpoint from "./Checkpoint.jsx";
import Figure from "./Figure.jsx";
import { LessonProgressProvider, CheckpointTally } from "./LessonProgress.jsx";
import { TOOLS } from "./tools/index.js";

const ToolFallback = () => (
  <div className="rounded-xl2 border border-line/70 bg-surface/40 p-6 text-center text-sm text-muted">
    Loading interactive tool…
  </div>
);

function Block({ block, idx, moduleSlug }) {
  switch (block.type) {
    case "prose":
      return <p className="max-w-2xl text-fluid-base leading-relaxed text-muted"><Rich text={block.text} /></p>;
    case "math":
      return <MathTex tex={block.tex} className="text-silver" />;
    case "heading":
      return <HeadingBlock block={block} />;
    case "definition":
      return <DefinitionBlock block={block} />;
    case "theorem":
      return <TheoremBlock block={block} />;
    case "figure":
      return <Figure block={block} />;
    case "checkpoint":
      return <Checkpoint block={block} cpId={idx} />;
    case "example":
      return <ExampleBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "practice": {
      const Quiz = TOOLS.quiz;
      return (
        <Suspense fallback={<ToolFallback />}>
          <Quiz
            moduleSlug={moduleSlug}
            count={block.practice?.count ?? 5}
            topic={block.practice?.topic}
          />
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
    <LessonProgressProvider>
      <div className="space-y-6">
        {lesson.blocks.map((b, i) => (
          <Block key={i} block={b} idx={i} moduleSlug={lesson.moduleSlug} />
        ))}
        <CheckpointTally />
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
    </LessonProgressProvider>
  );
}
