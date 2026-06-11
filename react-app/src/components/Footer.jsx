import { Link } from "react-router-dom";
import { Instagram, Linkedin, Github, ArrowUp } from "lucide-react";
import { site, socials, projects } from "../data/site.js";

const LIVE = projects.filter((p) => p.client && p.status === "Live");

export default function Footer() {
  const year = new Date().getFullYear();

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <footer className="relative overflow-hidden border-t border-line/60">
      <div aria-hidden="true" className="aurora absolute inset-0 opacity-25" />
      <div aria-hidden="true" className="grain absolute inset-0" />

      <div className="relative mx-auto max-w-content px-6 pb-10 pt-16">
        {/* oversized wordmark */}
        <p
          aria-hidden="true"
          className="text-gradient select-none text-center font-serif font-semibold leading-none tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
        >
          {site.brand}
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          <nav aria-label="Footer — explore">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/#work" className="text-muted transition-colors hover:text-silver">Work</a></li>
              <li><Link to="/bmla" className="text-muted transition-colors hover:text-silver">BMLA Mastery</Link></li>
              <li><a href="/#about" className="text-muted transition-colors hover:text-silver">About</a></li>
              <li><a href="/#contact" className="text-muted transition-colors hover:text-silver">Contact</a></li>
              <li><Link to="/owner" className="text-muted transition-colors hover:text-silver">Owner cockpit</Link></li>
            </ul>
          </nav>

          <nav aria-label="Footer — live projects">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Live now</p>
            <ul className="space-y-2 text-sm">
              {LIVE.map((p) => (
                <li key={p.slug}>
                  <Link to={`/work/${p.slug}`} className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-silver">
                    <span className="h-1.5 w-1.5 rounded-full bg-jade-bright transition-transform group-hover:scale-150" aria-hidden="true" />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Connect</p>
            <ul className="space-y-2 text-sm">
              {site.emails.map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`} className="break-all text-muted underline-offset-4 transition-colors hover:text-silver hover:underline">
                    {e}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-4">
              <a href={socials.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="text-muted transition-colors hover:text-crimson-bright">
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="text-muted transition-colors hover:text-cyan">
                <Linkedin size={18} aria-hidden="true" />
              </a>
              <a href={socials.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="text-muted transition-colors hover:text-violet-bright">
                <Github size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line/50 pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {year} {site.fullName} · Designed &amp; built by directing AI — every project here is real.
          </p>
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 rounded-full border border-line/70 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-gold/50 hover:text-gold"
          >
            <ArrowUp size={13} aria-hidden="true" /> Top
          </button>
        </div>
      </div>
    </footer>
  );
}
