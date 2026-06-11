import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { m, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Maximize2, Play, Check } from "lucide-react";
import { projects, caseStudies } from "../data/site.js";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import StatusPill from "../components/StatusPill.jsx";
import Tilt from "../lib/Tilt.jsx";
import NotFound from "./NotFound.jsx";

function Section({ kicker, title, children }) {
  return (
    <section>
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">{kicker}</p>
      <h2 className="font-serif text-fluid-lg font-semibold text-silver">{title}</h2>
      <div className="mt-3 text-fluid-base leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function Chips({ items, accent = "text-silver" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => (
        <li key={it} className={`rounded-full border border-line/70 bg-white/5 px-3 py-1 text-xs ${accent}`}>
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const [launched, setLaunched] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  if (!project) return <NotFound />;

  const cs = caseStudies[slug] || {};
  const playable = !!project.embed;
  const related = projects.filter((p) => p.client && p.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Reading progress — transform-only, reduced-motion safe (it just tracks scroll). */}
      <m.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-crimson via-violet to-cyan"
      />
      <Nav />
      <main id="main" className="mx-auto max-w-content px-6 py-16 md:py-24">
        <Link
          to="/#work"
          viewTransition
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to work
        </Link>

        <header className="mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-gold">
              {project.type} · {project.year}
            </span>
            <StatusPill status={project.status} />
          </div>
          <h1 className="font-serif text-fluid-2xl font-semibold leading-[1.05] text-silver">{project.name}</h1>
          {cs.tagline && (
            <p className="mt-4 max-w-2xl font-serif text-fluid-lg leading-snug text-silver/90">{cs.tagline}</p>
          )}
          <p className="mt-3 max-w-2xl text-fluid-base leading-relaxed text-muted">{project.blurb}</p>
        </header>

        {/* Playable embed — tilt+sheen on the poster, plain interactive iframe once launched. */}
        <div className="mt-8">
          {playable && launched ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl2 border border-line/70 bg-ink">
              <iframe
                src={project.embed}
                title={`${project.name} — playable demo`}
                loading="lazy"
                className="h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
                allow="fullscreen; gamepad; autoplay"
              />
            </div>
          ) : (
            <Tilt className="w-full">
              <button
                type="button"
                onClick={() => playable && setLaunched(true)}
                disabled={!playable}
                className="grain relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl2 border border-line/70 disabled:cursor-default"
                style={{ background: "radial-gradient(70% 70% at 50% 30%, rgba(200,50,60,0.20), transparent), #121214" }}
                aria-label={playable ? `Play ${project.name} in the browser` : `${project.name} is in development`}
              >
                <span className="relative z-10 text-center">
                  <span className="block font-serif text-fluid-xl text-silver/95">{project.name}</span>
                  {playable ? (
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-gold">
                      <Play size={16} aria-hidden="true" /> Play in browser
                    </span>
                  ) : (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm text-muted">In development</span>
                  )}
                </span>
              </button>
            </Tilt>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="glow-card inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-silver transition-colors hover:bg-crimson/90"
            >
              Open live <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {playable && launched && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-silver hover:border-gold/60 hover:text-gold"
            >
              <Maximize2 size={15} aria-hidden="true" /> Fullscreen
            </a>
          )}
        </div>

        {/* Body: narrative + aside */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-12">
            {cs.intent && (
              <Section kicker="The intent" title="What it's for">
                <p>{cs.intent}</p>
              </Section>
            )}
            {Array.isArray(cs.approach) && cs.approach.length > 0 && (
              <Section kicker="The build" title="How it came together">
                <ol className="mt-1 space-y-6">
                  {cs.approach.map((a, i) => (
                    <li key={a.t} className="flex gap-4">
                      <span className="text-gradient shrink-0 font-serif text-2xl font-semibold leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-serif text-fluid-base font-semibold text-silver">{a.t}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{a.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            )}
            {cs.outcome && (
              <Section kicker="The result" title="What shipped">
                <p>{cs.outcome}</p>
              </Section>
            )}
          </div>

          <aside className="space-y-8 lg:border-l lg:border-line/50 lg:pl-8">
            {Array.isArray(cs.highlights) && cs.highlights.length > 0 && (
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">Highlights</p>
                <ul className="space-y-2">
                  {cs.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-silver/90">
                      <Check size={15} className="mt-0.5 shrink-0 text-jade-bright" aria-hidden="true" /> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(cs.stack) && cs.stack.length > 0 && (
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">Stack &amp; approach</p>
                <Chips items={cs.stack} />
              </div>
            )}
            {cs.role && (
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">Role</p>
                <p className="text-sm leading-relaxed text-muted">{cs.role}</p>
              </div>
            )}
          </aside>
        </div>

        {/* Related work */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-line/50 pt-12">
            <h2 className="mb-6 font-serif text-fluid-lg font-semibold text-silver">More work</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/work/${p.slug}`}
                  viewTransition
                  className="group rounded-xl2 border border-line/70 bg-surface/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{p.type}</span>
                    <StatusPill status={p.status} />
                  </div>
                  <h3 className="font-serif text-fluid-base font-semibold text-silver group-hover:text-crimson">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{p.blurb}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-silver transition-colors group-hover:text-crimson">
                    Case study <ArrowUpRight size={13} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
