import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import { projects } from "../data/site.js";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import StatusPill from "../components/StatusPill.jsx";
import NotFound from "./NotFound.jsx";

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const [launched, setLaunched] = useState(false);

  if (!project) return <NotFound />;
  const playable = !!project.embed;

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-content px-6 py-16 md:py-24">
        <Link to="/#work" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver">
          <ArrowLeft size={15} aria-hidden="true" /> Back to work
        </Link>

        <header className="mt-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-gold">
              {project.type} · {project.year}
            </span>
            <StatusPill status={project.status} />
          </div>
          <h1 className="font-serif text-fluid-2xl font-semibold leading-tight text-silver">{project.name}</h1>
          <p className="mt-4 max-w-2xl text-fluid-base leading-relaxed text-muted">{project.blurb}</p>
        </header>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl2 border border-line/70 bg-ink">
          {playable && launched ? (
            <iframe
              src={project.embed}
              title={`${project.name} — playable demo`}
              loading="lazy"
              className="h-full w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
              allow="fullscreen; gamepad; autoplay"
            />
          ) : (
            <button
              type="button"
              onClick={() => playable && setLaunched(true)}
              disabled={!playable}
              className="grain relative flex h-full w-full items-center justify-center disabled:cursor-default"
              style={{ background: "radial-gradient(70% 70% at 50% 30%, rgba(200,50,60,0.18), transparent), #121214" }}
              aria-label={playable ? `Play ${project.name}` : `${project.name} is in development`}
            >
              <span className="relative z-10 text-center">
                <span className="block font-serif text-fluid-lg text-silver/90">
                  {playable ? "Play in browser" : "In development"}
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
              Open live <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          {playable && launched && (
            <a href={project.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-silver hover:border-gold/60 hover:text-gold">
              <Maximize2 size={15} aria-hidden="true" /> Fullscreen
            </a>
          )}
        </div>

        <section className="mt-12 max-w-2xl space-y-6">
          <div>
            <h2 className="font-serif text-fluid-lg font-semibold text-silver">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.blurb}</p>
          </div>
          <div>
            <h2 className="font-serif text-fluid-lg font-semibold text-silver">How it was built</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Designed and built with an AI-first workflow — directing AI tools through design,
              implementation and iteration, then shipping to the browser. {project.status === "Live" ? "It's live now — play it above." : "It's in active development."}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
