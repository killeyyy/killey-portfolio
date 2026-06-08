import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Maximize2, ArrowUpRight } from "lucide-react";
import StatusPill from "./StatusPill.jsx";

/**
 * Project card with click-to-launch playable embed.
 * Live games/apps are HIS OWN deployments on separate Vercel origins
 * (cross-origin to the portfolio), so allow-same-origin here is safe — it
 * only grants the frame its own origin, not the parent's. Lazy iframe keeps
 * the grid fast; the poster shows until the visitor opts in.
 */
export default function ProjectCard({ project, featured }) {
  const [launched, setLaunched] = useState(false);
  const playable = !!project.embed;

  return (
    <article className="group relative flex h-full flex-col rounded-[18px] border border-line/70 bg-surface/50 transition-all duration-300 hover:-translate-y-1 hover:border-crimson/40 hover:shadow-[0_24px_70px_-24px_rgba(200,50,60,0.5)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[18px] bg-ink">
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
            aria-label={playable ? `Play ${project.name} in the browser` : `${project.name} preview`}
          >
            <span className="relative z-10 px-6 text-center">
              <span className="block font-serif text-fluid-lg text-silver/90">{project.name}</span>
              {playable ? (
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-gold">
                  <Play size={16} aria-hidden="true" /> Play in browser
                </span>
              ) : (
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-muted">In development</span>
              )}
            </span>
          </button>
        )}

        {playable && launched && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer noopener"
            className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-md bg-ink/70 px-2 py-1 text-xs text-silver backdrop-blur transition-colors hover:text-gold"
            aria-label={`Open ${project.name} fullscreen in a new tab`}
          >
            <Maximize2 size={13} aria-hidden="true" /> Fullscreen
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            {project.type} · {project.year}
          </span>
          <StatusPill status={project.status} />
        </div>
        <h3 className="text-fluid-lg font-semibold text-silver">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.blurb}</p>
        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-muted">{project.metric}</span>
          <Link
            to={`/work/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm text-silver transition-colors hover:text-crimson"
          >
            Case study <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
