import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import Footer from "../../components/Footer.jsx";
import SectionHeading from "../../components/SectionHeading.jsx";
import Magnetic from "../../lib/Magnetic.jsx";
import Icon from "../../lib/icons.jsx";
import { Stagger, Item } from "../../lib/motion.jsx";
import { Counter } from "../../components/cockpit/viz.jsx";
import { curriculum, product, lessonIndex } from "../../data/bmla/index.js";
import { questMcqs, questFlashcards } from "../../data/bmla/quest-import.js";
import { textbooks, freeResources, sourcesNote } from "../../data/bmla/sources.js";
import EmailCapture from "../../components/bmla/EmailCapture.jsx";

const LEVEL_CLS = {
  intro: "text-jade-bright border-jade/40 bg-jade/10",
  core: "text-gold border-gold/40 bg-gold/10",
  advanced: "text-crimson-bright border-crimson/40 bg-crimson/10",
};

// Truthful, derived from the actual data — never hand-typed.
const STATS = [
  { value: curriculum.length, label: "exam modules mapped" },
  { value: lessonIndex.length, label: "lessons live (beta)" },
  { value: questMcqs.length, label: "practice questions" },
  { value: questFlashcards.length, label: "flashcards" },
];

const TOOLS_SHOWCASE = [
  { title: "Row-reduction solver", body: "Type any system, watch every elementary row operation, step by step.", accent: "text-crimson-bright" },
  { title: "Randomized practice", body: "MCQ drills that reshuffle every attempt — skill, not memorized answers.", accent: "text-violet-bright" },
  { title: "Spaced-repetition cards", body: "Leitner flashcards that bring back exactly what you keep missing.", accent: "text-cyan" },
  { title: "Break-even explorer", body: "Drag the sliders, watch the crossover move. Business math you can feel.", accent: "text-gold" },
];

export default function Bmla() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* hero */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden="true" className="aurora absolute inset-0 opacity-50" />
          <div aria-hidden="true" className="grain absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/60 to-ink" aria-hidden="true" />
          <div className="relative mx-auto max-w-content px-6 pb-20 pt-24 md:pb-28 md:pt-32">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-jade/40 bg-jade/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-jade-bright">
              <Sparkles size={13} aria-hidden="true" /> Free during beta
            </p>
            <h1 className="max-w-3xl font-serif text-fluid-2xl font-semibold leading-[1.02] text-silver">
              <span className="text-gradient">{product.name}</span> — {product.tagline}
            </h1>
            <p className="mt-5 max-w-2xl text-fluid-base leading-relaxed text-muted">{product.promise}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Magnetic>
                <Link to="/bmla/learn" className="glow-card inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 text-sm font-medium text-silver transition-transform hover:scale-[1.03]">
                  Start learning — free <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Magnetic>
              <a href="#curriculum" className="inline-flex items-center rounded-full border border-line px-7 py-3.5 text-sm font-medium text-silver transition-colors hover:border-gold/60 hover:text-gold">
                See the curriculum
              </a>
            </div>
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line/50 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="font-serif text-fluid-lg font-semibold text-gradient-warm"><Counter to={s.value} /></span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* curriculum */}
        <section id="curriculum" className="mx-auto max-w-content px-6 py-20 md:py-24">
          <SectionHeading kicker="Curriculum" title="Mapped to the real exam, module by module." />
          <Stagger className="grid gap-4 sm:grid-cols-2" gap={0.06}>
            {curriculum.map((mod, mi) => {
              const live = mod.lessonSlugs.length > 0;
              const num = String(mi + 1).padStart(2, "0");
              return (
                <Item key={mod.slug} className="h-full">
                  <div className={`h-full rounded-[18px] border border-line/70 bg-surface/50 p-6 ${live ? "glow-card" : "opacity-80"}`}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className={`inline-flex rounded-xl border border-line/70 bg-ink/40 p-2.5 ${mod.accent}`}>
                        <Icon name={mod.icon} size={20} aria-hidden="true" />
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${LEVEL_CLS[mod.level]}`}>
                        {mod.level}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      Module {num}{mod.ref ? ` · ${mod.ref}` : ""}
                    </p>
                    <h3 className="mt-1 text-fluid-lg font-semibold text-silver">{mod.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{mod.summary}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {mod.topics.slice(0, 4).map((t, ti) => (
                        <li key={t} className="rounded-full border border-line/60 px-2.5 py-0.5 text-[11px] text-muted">
                          <span className={mod.accent}>{num}.{ti + 1}</span> {t}
                        </li>
                      ))}
                      {mod.topics.length > 4 && (
                        <li className="px-1 text-[11px] text-muted">+{mod.topics.length - 4} more</li>
                      )}
                    </ul>
                    <p className="mt-4 text-xs font-medium">
                      {live ? (
                        <Link to="/bmla/learn" className="text-jade-bright underline-offset-4 hover:underline">
                          {mod.lessonSlugs.length} lesson{mod.lessonSlugs.length > 1 ? "s" : ""} live → start now
                        </Link>
                      ) : (
                        <span className="text-gold">On the roadmap — practice & flashcards already available</span>
                      )}
                    </p>
                  </div>
                </Item>
              );
            })}
          </Stagger>
        </section>

        {/* tools showcase */}
        <section className="relative border-y border-line/50 bg-surface/30">
          <div aria-hidden="true" className="aurora absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-content px-6 py-20 md:py-24">
            <SectionHeading kicker="Not just notes" title="Tools that make it click." />
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.07}>
              {TOOLS_SHOWCASE.map((t) => (
                <Item key={t.title} className="h-full">
                  <div className="h-full rounded-[18px] border border-line/70 bg-ink/40 p-5">
                    <h3 className={`text-sm font-semibold ${t.accent}`}>{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
        </section>

        {/* integrity + sources */}
        <section className="mx-auto max-w-content px-6 py-20 md:py-24">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[18px] border border-jade/40 bg-jade/10 p-6">
              <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-jade-bright">
                <ShieldCheck size={14} aria-hidden="true" /> The integrity promise
              </p>
              <p className="mt-3 text-sm leading-relaxed text-silver/90">
                Everything here is <strong className="text-silver">original</strong> — lessons written from scratch,
                practice that randomizes every attempt. You will never find answers to live, graded coursework here.
                This makes you better at the exam; it doesn't do the exam for you.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Sources & further reading</p>
              <p className="mt-2 text-sm text-muted">{sourcesNote}</p>
              <ul className="mt-4 space-y-2">
                {[...textbooks, ...freeResources].map((r) => (
                  <li key={r.href}>
                    <a href={r.href} target="_blank" rel="noreferrer noopener" className="group inline-flex items-start gap-2 text-sm text-silver underline-offset-4 hover:text-cyan hover:underline">
                      <ExternalLink size={13} className="mt-1 shrink-0 text-muted group-hover:text-cyan" aria-hidden="true" />
                      <span>{r.title} <span className="text-muted">· {r.by}</span></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* pricing (honest beta framing) */}
        <section className="relative overflow-hidden border-t border-line/50">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-crimson/15 blur-3xl" />
          <div className="relative mx-auto max-w-content px-6 py-20 text-center md:py-24">
            <h2 className="font-serif text-fluid-xl font-semibold text-silver">
              Free while in beta. <span className="text-gradient-warm">Founding members keep the best deal.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Full access costs nothing right now — you're helping shape it. When paid plans launch
              (monthly & full-semester), early beta users get founding-member pricing first.
            </p>
            <Magnetic className="mt-8 inline-block">
              <Link to="/bmla/learn" className="glow-card inline-flex items-center gap-2 rounded-full bg-crimson px-8 py-4 text-sm font-medium text-silver transition-transform hover:scale-[1.03]">
                Claim free beta access <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Magnetic>
            <EmailCapture />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
