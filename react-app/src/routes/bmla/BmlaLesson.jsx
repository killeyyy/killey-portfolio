import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheck, Clock, Loader2 } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import Footer from "../../components/Footer.jsx";
import LessonRenderer from "../../components/bmla/LessonRenderer.jsx";
import NotFound from "../NotFound.jsx";
import { loadLesson, lessonIndex } from "../../data/bmla/index.js";
import { getProgress, markLessonDone } from "../../lib/bmla/progress.js";

export default function BmlaLesson() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState(undefined); // undefined=loading, null=missing
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    setLesson(undefined);
    loadLesson(slug).then((l) => {
      if (!alive) return;
      setLesson(l);
      setDone(!!getProgress().done[slug]);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (lesson === null) return <NotFound />;

  const idx = lessonIndex.findIndex((l) => l.slug === slug);
  const prev = idx > 0 ? lessonIndex[idx - 1] : null;
  const next = idx >= 0 && idx < lessonIndex.length - 1 ? lessonIndex[idx + 1] : null;

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        <Link to="/bmla/learn" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver">
          <ArrowLeft size={15} aria-hidden="true" /> Dashboard
        </Link>

        {lesson === undefined ? (
          <div className="flex min-h-[40vh] items-center justify-center text-muted">
            <Loader2 size={22} className="animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <>
            <header className="mt-6 max-w-3xl">
              <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                BMLA Mastery <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-muted"><Clock size={12} aria-hidden="true" /> {lesson.minutes} min</span>
              </p>
              <h1 className="mt-2 font-serif text-fluid-2xl font-semibold leading-tight text-silver">{lesson.title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-jade-bright">{lesson.objective}</p>
            </header>

            <article className="mt-10 max-w-3xl">
              <LessonRenderer lesson={lesson} />
            </article>

            <div className="mt-12 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t border-line/50 pt-6">
              <button
                type="button"
                onClick={() => {
                  markLessonDone(lesson.slug, lesson.minutes);
                  setDone(true);
                }}
                disabled={done}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                  done ? "border border-jade/50 text-jade-bright" : "bg-crimson text-silver hover:bg-crimson/90"
                }`}
              >
                <CircleCheck size={16} aria-hidden="true" /> {done ? "Completed" : "Mark as complete"}
              </button>
              <div className="flex gap-3">
                {prev && (
                  <Link to={`/bmla/lesson/${prev.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line/70 px-4 py-2.5 text-sm text-muted hover:text-silver">
                    <ArrowLeft size={14} aria-hidden="true" /> {prev.title}
                  </Link>
                )}
                {next && (
                  <Link to={`/bmla/lesson/${next.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line/70 px-4 py-2.5 text-sm text-silver hover:border-gold/50 hover:text-gold">
                    {next.title} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
