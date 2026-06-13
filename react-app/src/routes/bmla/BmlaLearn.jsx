import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, Circle, ArrowRight, Clock, CalendarClock, Target, BookText, FolderLock } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import Footer from "../../components/Footer.jsx";
import Icon from "../../lib/icons.jsx";
import { cn } from "../../lib/cn.js";
import { ProgressRing, Heatmap, Counter, Tile } from "../../components/cockpit/viz.jsx";
import { curriculum, lessonIndex } from "../../data/bmla/index.js";
import { getProgress, activitySeries } from "../../lib/bmla/progress.js";
import { practiceAreas } from "../../lib/bmla/stats.js";
import { get, set } from "../../lib/bmla/storage.js";

export default function BmlaLearn() {
  const progress = useMemo(() => getProgress(), []);
  const series = useMemo(() => activitySeries(126), []);
  const weakSpots = useMemo(
    () => practiceAreas().filter((a) => a.attempts > 0 && a.lessonSlug).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3),
    [],
  );
  const doneCount = lessonIndex.filter((l) => progress.done[l.slug]).length;
  const pct = lessonIndex.length ? Math.round((doneCount / lessonIndex.length) * 100) : 0;
  const next = lessonIndex.find((l) => !progress.done[l.slug]);

  const [examDate, setExamDate] = useState(() => get("examDate", ""));
  const saveExam = (v) => {
    setExamDate(v);
    set("examDate", v);
  };
  const daysLeft = examDate
    ? Math.ceil((new Date(`${examDate}T00:00:00`).getTime() - Date.now()) / 86400000)
    : null;
  const remaining = lessonIndex.length - doneCount;
  const perDay = daysLeft && daysLeft > 0 && remaining > 0 ? Math.ceil(remaining / daysLeft) : null;

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">BMLA Mastery · Dashboard</p>
            <h1 className="mt-1 font-serif text-fluid-xl font-semibold text-silver">Your prep, at a glance.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/bmla/reference" className="inline-flex items-center gap-2 rounded-full border border-line/70 px-4 py-2 text-sm text-silver transition-colors hover:border-gold/50 hover:text-gold">
              <BookText size={15} aria-hidden="true" /> Formula sheet
            </Link>
            <Link to="/bmla/resources" className="inline-flex items-center gap-2 rounded-full border border-line/70 px-4 py-2 text-sm text-silver transition-colors hover:border-gold/50 hover:text-gold">
              <FolderLock size={15} aria-hidden="true" /> Materials locker
            </Link>
          </div>
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

        {/* exam countdown + weak spots */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Tile>
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
              <CalendarClock size={14} aria-hidden="true" /> Exam countdown
            </p>
            {daysLeft != null && daysLeft >= 0 ? (
              <p className="mt-1 font-serif text-[2.6rem] font-semibold leading-none text-crimson-bright">
                {daysLeft}<span className="text-fluid-base text-muted"> {daysLeft === 1 ? "day" : "days"} left</span>
              </p>
            ) : daysLeft != null ? (
              <p className="mt-2 text-sm text-muted">That date has passed — set a new one.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">Set your exam date to pace your prep.</p>
            )}
            {perDay && (
              <p className="mt-1 text-xs text-muted">
                ≈ {perDay} lesson{perDay > 1 ? "s" : ""}/day to finish the remaining {remaining}.
              </p>
            )}
            <label htmlFor="exam-date" className="sr-only">Exam date</label>
            <input
              id="exam-date"
              type="date"
              value={examDate}
              onChange={(e) => saveExam(e.target.value)}
              className="mt-3 rounded-lg border border-line/70 bg-ink/40 px-3 py-2 text-sm text-silver [color-scheme:dark]"
            />
          </Tile>

          <Tile>
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
              <Target size={14} aria-hidden="true" /> Weak spots
            </p>
            {weakSpots.length ? (
              <ul className="mt-3 space-y-2">
                {weakSpots.map((w) => (
                  <li key={w.label}>
                    <Link
                      to={`/bmla/lesson/${w.lessonSlug}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-line/70 bg-surface/50 px-3 py-2 text-sm transition-colors hover:border-gold/50"
                    >
                      <span className="flex-1 text-silver">{w.label}</span>
                      <span className={cn("font-mono text-xs", w.accuracy < 60 ? "text-crimson-bright" : w.accuracy < 80 ? "text-gold" : "text-jade-bright")}>
                        {w.accuracy}%
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">Take any practice set and the topics you miss most surface here — with a one-tap link back to the lesson.</p>
            )}
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
                            {l.lecture && (
                              <span className="hidden shrink-0 rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 font-mono text-[10px] text-violet-bright sm:inline">
                                Lec {l.lecture.n} · {l.lecture.date}
                              </span>
                            )}
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
