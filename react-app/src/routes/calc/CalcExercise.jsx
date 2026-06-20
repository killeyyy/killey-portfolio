import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, BookOpen, Clock } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import CalcSubnav from "../../components/calc/CalcSubnav.jsx";
import Footer from "../../components/Footer.jsx";
import Seo from "../../components/Seo.jsx";
import SolvedProblem from "../../components/calc/SolvedProblem.jsx";
import NotFound from "../NotFound.jsx";
import { loadExercise, exerciseIndex } from "../../data/calc/index.js";
import { calcExercises } from "../../data/calc/curriculum.js";

export default function CalcExercise() {
  const { slug } = useParams();
  const [exercise, setExercise] = useState(undefined); // undefined=loading, null=missing

  useEffect(() => {
    let alive = true;
    setExercise(undefined);
    loadExercise(slug).then((ex) => {
      if (alive) setExercise(ex);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (exercise === null) return <NotFound />;

  const meta = calcExercises.find((e) => e.slug === slug);
  const idx = exerciseIndex.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? exerciseIndex[idx - 1] : null;
  const next = idx >= 0 && idx < exerciseIndex.length - 1 ? exerciseIndex[idx + 1] : null;

  const numbers = meta?.numbers || [];
  const solved = exercise?.problems ? [...exercise.problems].sort((a, b) => a.num - b.num) : [];
  const solvedNums = new Set(solved.map((p) => p.num));
  const queued = numbers.filter((n) => !solvedNums.has(n));

  return (
    <>
      <Seo
        title={`Ex ${meta?.section ?? ""} ${meta?.title ?? "Exercise"} — Calculus Solved | KILLEYYY`}
        description={`Worked solutions for Exercise ${meta?.section ?? ""}.`}
        canonical={`/calc/exercise/${slug}`}
      />
      <Nav />
      <CalcSubnav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link to="/calc" className="inline-flex items-center gap-1 transition-colors hover:text-silver">
            <ArrowLeft size={15} aria-hidden="true" /> All exercises
          </Link>
          {meta && (<><span aria-hidden="true" className="text-line">/</span><span className="text-silver">Ex {meta.section}</span></>)}
        </nav>

        {exercise === undefined ? (
          <div className="flex min-h-[40vh] items-center justify-center text-muted">
            <Loader2 size={22} className="animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <>
            <header className="mt-6 max-w-3xl">
              <p className="inline-flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Calculus · Solved <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-muted"><BookOpen size={12} aria-hidden="true" /> Ex {meta?.section}</span>
              </p>
              <h1 className="mt-2 font-serif text-fluid-2xl font-semibold leading-tight text-silver">{meta?.title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {solved.length} of {numbers.length} solved · {exercise?.source}
              </p>
            </header>

            <section className="mt-10 max-w-3xl space-y-5">
              {solved.length === 0 ? (
                <div className="flex items-start gap-3 rounded-xl2 border border-line/70 bg-surface/40 p-6 text-sm leading-relaxed text-muted">
                  <Clock size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <p>
                    Solutions for this exercise are being added one at a time from the source book.
                    <span className="text-silver"> {numbers.length} problems queued.</span>
                  </p>
                </div>
              ) : (
                solved.map((p) => <SolvedProblem key={p.num} problem={p} problemId={`${slug}:${p.num}`} />)
              )}

              {queued.length > 0 && (
                <div className="rounded-xl border border-line/60 bg-surface/30 p-4">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Queued</p>
                  <div className="flex flex-wrap gap-1.5">
                    {queued.map((n) => (
                      <span key={n} className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-line/70 px-2 font-mono text-xs text-muted">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <div className="mt-12 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t border-line/50 pt-6">
              {prev ? (
                <Link to={`/calc/exercise/${prev.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line/70 px-4 py-2.5 text-sm text-muted hover:text-silver">
                  <ArrowLeft size={14} aria-hidden="true" /> Ex {prev.section}
                </Link>
              ) : <span />}
              {next && (
                <Link to={`/calc/exercise/${next.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line/70 px-4 py-2.5 text-sm text-silver hover:border-gold/50 hover:text-gold">
                  Ex {next.section} · {next.title} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
