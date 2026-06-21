import { Printer } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import BmlaSubnav from "../../components/bmla/BmlaSubnav.jsx";
import Footer from "../../components/Footer.jsx";
import MathTex from "../../components/bmla/Math.jsx";
import { Rich } from "../../components/bmla/blocks.jsx";
import { referenceSections } from "../../data/bmla/reference.js";

/** Printable one-page formula & theorem sheet — last-minute revision. */
export default function BmlaReference() {
  return (
    <>
      <div className="no-print">
        <Nav />
        <BmlaSubnav />
      </div>
      <main id="main" className="printable mx-auto max-w-content px-6 py-12 md:py-16">
        <div className="no-print mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-silver transition-colors hover:bg-crimson/90"
          >
            <Printer size={15} aria-hidden="true" /> Print / save PDF
          </button>
        </div>

        <header className="mb-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">BMLA · MTS 212</p>
          <h1 className="mt-1 font-serif text-fluid-xl font-semibold text-silver">Formula & theorem sheet</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Every definition, theorem and formula in the course, one page. Built for the night before — skim it,
            then drill the gaps in the lessons.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {referenceSections.map((s) => (
            <section key={s.id} className="ref-card break-inside-avoid rounded-[18px] border border-line/70 bg-surface/40 p-5">
              <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line/50 pb-2">
                <h2 className={`font-serif text-fluid-lg font-semibold ${s.accent}`}>{s.title}</h2>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{s.ref}</span>
              </div>
              <dl className="space-y-3">
                {s.items.map((it, i) => (
                  <div key={i}>
                    <dt className="text-sm font-semibold text-silver">{it.term}</dt>
                    {it.body && (
                      <dd className="mt-0.5 text-sm leading-relaxed text-muted">
                        <Rich text={it.body} />
                      </dd>
                    )}
                    {it.tex && (
                      <dd className="mt-1 overflow-x-auto">
                        <MathTex tex={it.tex} className="text-silver" />
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="no-print mt-8 text-center text-xs text-muted">
          Original wording grounded in the course materials — concepts and standard formulas, not reproduced text.
        </p>
      </main>
      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
