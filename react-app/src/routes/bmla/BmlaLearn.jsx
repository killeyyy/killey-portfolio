import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, Circle, ArrowRight, Clock } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import Footer from "../../components/Footer.jsx";
import Icon from "../../lib/icons.jsx";
import { ProgressRing, Heatmap, Counter, Tile, StatusBadge } from "../../components/cockpit/viz.jsx";
import { curriculum, lessonIndex } from "../../data/bmla/index.js";
import { getProgress, activitySeries } from "../../lib/bmla/progress.js";

export default function BmlaLearn() {
  const progress = useMemo(() => getProgress(), []);
  const series = useMemo(() => activitySeries(126), []);
  const doneCount = lessonIndex.filter((l) => progress.done[l.slug]).length;
  const pct = lessonIndex.length ? Math.round((doneCount / lessonIndex.length) * 100) : 0;
  const next = lessonIndex.find((l) => !progress.done[l.slug]);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">BMLA Mastery · Dashboard</p>
            <h1 className="mt-1 font-serif text-fluid-xl font-semibold text-silver">Your prep, at a glance.</h1>
          </div>
          <StatusBadge state="live" />
        </div>

        {/* bento overview */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile glow className="flex flex-col items-center justify-center py-6 text-center">
            <ProgressRing value={pct} label={`${pct}%`} />
            <p className="mt-3 text-sm text-muted">lessons completed</p>
          </Tile>
          <Tile className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Lessons done</p>
            <p className="mt-1 font-serif text-[3rem] font-semibold leading-none text-jade-bright">
              <Counter to={doneCount} />
              <span className="text-fluid-lg text-muted">/{lessonIndex.length}</span>
            </p>
          </Tile>
          <Tile className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Minutes studied</p>
            <p className="mt-1 font-serif text-[3rem] font-semibold leading-none text-gold">
              <Counter to={progress.minutes} />
            </p>
          </Tile>
          <Tile className="col-span-2 lg:col-span-1">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">Study streak</p>
            <Heatmap data={series} />
          </Tile>
        </div>

        {next && (
          <Link
            to={`/bmla/lesson/${next.slug}`}
            className="glow-card mt-6 flex items-center justify-between rounded-[18px] border border-crimson/40 bg-crimson/10 px-6 py-4 transition-transform hover:scale-[1.01]"
          >
            <span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-crimson-bright">Continue</span>
              <span className="mt-0.5 block text-sm font-medium text-silver">{next.title}</span>
            </span>
            <ArrowRight size={18} className="text-crimson-bright" aria-hidden="true" />
          </Link>
        )}

        {/* modules + lessons */}
        <div className="mt-12 space-y-8">
          {curriculum.map((mod, mi) => {
            const lessons = lessonIndex.filter((l) => l.moduleSlug === mod.slug);
            return (
              <section key={mod.slug}>
                <div className="mb-3 flex items-center gap-3">
                  <span className={`inline-flex rounded-lg border border-line/70 bg-ink/40 p-2 ${mod.accent}`}>
                    <Icon name={mod.icon} size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Module {String(mi + 1).padStart(2, "0")}{mod.ref ? ` · ${mod.ref}` : ""}
                    </p>
                    <h2 className="text-fluid-lg font-semibold text-silver">{mod.title}</h2>
                  </div>
                </div>
                {lessons.length ? (
                  <ul className="space-y-2">
                    {lessons.map((l) => {
                      const isDone = !!progress.done[l.slug];
                      return (
                        <li key={l.slug}>
                          <Link
                            to={`/bmla/lesson/${l.slug}`}
                            className="flex items-center gap-3 rounded-xl border border-line/70 bg-surface/50 px-4 py-3 text-sm transition-colors hover:border-gold/50"
                          >
                            {isDone ? (
                              <CircleCheck size={16} className="shrink-0 text-jade-bright" aria-hidden="true" />
                            ) : (
                              <Circle size={16} className="shrink-0 text-muted" aria-hidden="true" />
                            )}
                            <span className={`flex-1 ${isDone ? "text-muted" : "text-silver"}`}>{l.title}</span>
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                              <Clock size={12} aria-hidden="true" /> {l.minutes}m
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="rounded-xl border border-dashed border-line/60 px-4 py-3 text-sm text-muted">
                    Lessons on the roadmap — flashcards & randomized practice for this module are already in the bank.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
