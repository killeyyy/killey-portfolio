import { Link } from "react-router-dom";
import { CheckCircle2, PlayCircle, BookOpen } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { SYLLABUS, nextSection } from "../../data/bmla/syllabus.js";

/**
 * Syllabus-first navigation: the course exactly as taught —
 * Ch 1 (§1.1–1.5, 1.7–1.9) · Ch 2 (§2.1–2.3) · Ch 3 (§3.1–3.2).
 * One chip per section, done-state from progress, "up next" highlighted.
 */
export default function SyllabusNav({ done = {}, compact = false }) {
  const next = nextSection(done);
  return (
    <div className="space-y-4">
      {SYLLABUS.map((ch) => {
        const doneCount = ch.sections.filter((s) => done[s.lessonSlug]).length;
        const pct = Math.round((doneCount / ch.sections.length) * 100);
        return (
          <div key={ch.chapter} className="rounded-[16px] border border-line/70 bg-surface/50 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-semibold text-silver">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">Chapter {String(ch.chapter).padStart(2, "0")}</span>
                <span className="ml-2">{ch.title}</span>
              </p>
              <p className="font-mono text-[11px] text-muted">
                {ch.note} · <span className={doneCount === ch.sections.length ? "text-jade-bright" : "text-silver"}>{doneCount}/{ch.sections.length}</span>
              </p>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/60">
              <div className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-jade" : "bg-crimson")} style={{ width: `${pct}%` }} />
            </div>
            <div className={cn("mt-3 grid gap-2", compact ? "sm:grid-cols-4 grid-cols-2" : "sm:grid-cols-3 lg:grid-cols-4")}>
              {ch.sections.map((s) => {
                const isDone = !!done[s.lessonSlug];
                const isNext = next && next.lessonSlug === s.lessonSlug;
                return (
                  <Link
                    key={s.sec}
                    to={`/bmla/lesson/${s.lessonSlug}`}
                    aria-label={`Section ${s.sec} — ${s.label}${isDone ? " (done)" : isNext ? " (up next)" : ""}`}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
                      isNext
                        ? "border-crimson/60 bg-crimson/10 hover:bg-crimson/15"
                        : isDone
                          ? "border-jade/30 bg-jade/5 hover:border-jade/50"
                          : "border-line/70 hover:border-gold/50",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 size={14} className="shrink-0 text-jade-bright" aria-hidden="true" />
                    ) : isNext ? (
                      <PlayCircle size={14} className="shrink-0 text-crimson-bright" aria-hidden="true" />
                    ) : (
                      <BookOpen size={14} className="shrink-0 text-muted" aria-hidden="true" />
                    )}
                    <span className="min-w-0">
                      <span className={cn("block font-mono text-[11px]", isNext ? "text-crimson-bright" : isDone ? "text-jade-bright" : "text-gold")}>
                        §{s.sec}{isNext && " · up next"}
                      </span>
                      {!compact && (
                        <span className="block truncate text-xs text-muted transition-colors group-hover:text-silver">{s.label}</span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
