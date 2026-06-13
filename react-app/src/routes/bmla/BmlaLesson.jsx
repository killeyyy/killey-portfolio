import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleCheck, Clock, Loader2 } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import BmlaSubnav from "../../components/bmla/BmlaSubnav.jsx";
import Footer from "../../components/Footer.jsx";
import LessonRenderer from "../../components/bmla/LessonRenderer.jsx";
import ExamStyle from "../../components/bmla/ExamStyle.jsx";
import NotFound from "../NotFound.jsx";
import { loadLesson, lessonIndex, curriculum } from "../../data/bmla/index.js";
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
  const meta = idx >= 0 ? lessonIndex[idx] : null;
  const moduleTitle = meta ? curriculum.find((m) => m.slug === meta.moduleSlug)?.title : null;
  const prev = idx > 0 ? lessonIndex[idx - 1] : null;
  const next = idx >= 0 && idx < lessonIndex.length - 1 ? lessonIndex[idx + 1] : null;

  return (
    <>
      <Nav />
      <BmlaSubnav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link to="/bmla/learn" className="inline-flex items-center gap-1 transition-colors hover:text-silver">
            <ArrowLeft size={15} aria-hidden="true" /> Dashboard
          </Link>
          {moduleTitle && (<><span aria-hidden="true" className="text-line">/</span><span>{moduleTitle}</span></>)}
          {meta?.title && (<><span aria-hidden="true" className="text-line">/</span><span className="text-silver">{meta.title}</span></>)}
        </nav>

        {lesson === undefined ? (
          <div className="flex min-h-[40vh] items-center justify-center text-muted">
            <Loader2 size={22} className="animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <>
            <header className="mt-6 max-w-3xl">
              <p className="inline-flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                BMLA Mastery <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-muted"><Clock size={12} aria-hidden="true" /> {lesson.minutes} min</span>
                {meta?.lecture && (
                  <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] tracking-normal text-violet-bright">
                    Lecture {meta.lecture.n} · {meta.lecture.date}
                  </span>
                )}
              </p>
              <h1 className="mt-2 font-serif text-fluid-2xl font-semibold leading-tight text-silver">{lesson.title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-jade-bright">{lesson.objective}</p>
            </header>

            <article className="mt-10 max-w-3xl space-y-6">
              <LessonRenderer lesson={lesson} />
              <ExamStyle moduleSlug={lesson.moduleSlug} />
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
