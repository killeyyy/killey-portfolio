import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Sigma } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import CalcSubnav from "../../components/calc/CalcSubnav.jsx";
import Footer from "../../components/Footer.jsx";
import Seo from "../../components/Seo.jsx";
import { Stagger, Item } from "../../lib/motion.jsx";
import { Counter } from "../../components/cockpit/viz.jsx";
import { calcProduct, totalProblems } from "../../data/calc/curriculum.js";
import { exerciseIndex, loadExercise } from "../../data/calc/index.js";

export default function Calc() {
  // Authored-solution counts per exercise (code-split files), summed for the
  // hero progress. Tiny dynamic chunks — fine for a private vault.
  const [solved, setSolved] = useState({});

  useEffect(() => {
    let alive = true;
    Promise.all(
      exerciseIndex.map((e) => loadExercise(e.slug).then((ex) => [e.slug, ex?.problems?.length || 0])),
    ).then((pairs) => {
      if (alive) setSolved(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, []);

  const solvedTotal = Object.values(solved).reduce((a, b) => a + b, 0);

  return (
    <>
      <Seo title={`${calcProduct.name} | KILLEYYY`} description={calcProduct.promise} canonical="/calc" />
      <Nav />
      <CalcSubnav />
      <main id="main">
        {/* hero */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="aurora absolute inset-0 opacity-50" />
          <div aria-hidden="true" className="grain absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/60 to-ink" aria-hidden="true" />
          <div className="relative mx-auto max-w-content px-6 pb-16 pt-24 md:pb-20 md:pt-32">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-jade/40 bg-jade/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-jade-bright">
              <Sparkles size={13} aria-hidden="true" /> Your private study vault
            </p>
            <h1 className="max-w-3xl font-serif text-fluid-2xl font-semibold leading-[1.02] text-silver">
              {calcProduct.name}
            </h1>
            <p className="mt-4 max-w-2xl text-fluid-base leading-relaxed text-muted">{calcProduct.promise}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="font-serif text-3xl font-semibold text-silver">
                <Counter to={solvedTotal} /> <span className="text-muted">/ {totalProblems}</span>
                <span className="ml-2 align-middle font-mono text-xs uppercase tracking-[0.2em] text-gold">solved</span>
              </p>
              <p className="font-serif text-3xl font-semibold text-silver">
                <Counter to={exerciseIndex.length} />
                <span className="ml-2 align-middle font-mono text-xs uppercase tracking-[0.2em] text-gold">exercises</span>
              </p>
            </div>
          </div>
        </section>

        {/* exercises */}
        <section className="mx-auto max-w-content px-6 py-14 md:py-20">
          <div className="mb-8 flex items-center gap-2">
            <Sigma size={18} className="text-crimson-bright" aria-hidden="true" />
            <h2 className="font-serif text-fluid-lg font-semibold text-silver">Exercises</h2>
          </div>

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exerciseIndex.map((e) => {
              const done = solved[e.slug] || 0;
              const pct = e.total ? Math.round((done / e.total) * 100) : 0;
              return (
                <Item key={e.slug}>
                  <Link
                    to={`/calc/exercise/${e.slug}`}
                    className="group flex h-full flex-col rounded-xl2 border border-line/70 bg-surface/50 p-5 transition-colors hover:border-gold/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Ex {e.section}</span>
                      <span className="font-mono text-xs text-muted">{done}/{e.total}</span>
                    </div>
                    <p className="mt-2 flex-1 font-serif text-lg font-semibold leading-snug text-silver">{e.title}</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line/60" aria-hidden="true">
                      <div className="h-full rounded-full bg-gradient-to-r from-crimson to-gold transition-[width]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-muted transition-colors group-hover:text-gold">
                      Open <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </Link>
                </Item>
              );
            })}
          </Stagger>

          <aside className="mt-10 flex gap-3 rounded-xl border border-jade/40 bg-jade/10 p-4" role="note">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-jade-bright" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-silver/90">
              Private revision archive — these are my own worked solutions to the assigned problems, kept for study.
              Each one is written out step by step so the method sticks, not just the answer.
            </p>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
