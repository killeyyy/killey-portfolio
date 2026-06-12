import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Plus, Lock } from "lucide-react";
import Nav from "../../components/Nav.jsx";
import Footer from "../../components/Footer.jsx";
import Icon from "../../lib/icons.jsx";
import { resourceGroups } from "../../data/bmla/resources.js";

export default function BmlaResources() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-content px-6 py-12 md:py-16">
        <Link to="/bmla/learn" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-silver">
          <ArrowLeft size={15} aria-hidden="true" /> Dashboard
        </Link>

        <header className="mt-6 max-w-3xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            <Lock size={13} aria-hidden="true" /> Private locker
          </p>
          <h1 className="mt-2 font-serif text-fluid-2xl font-semibold text-silver">Your course materials, in one place.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your own copies of the book, lecture notes, assignments and past papers — linked from your
            access-controlled Drive so they stay private to you, right next to the lessons. To add one,
            paste your Drive "share" link into <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-gold">react-app/src/data/bmla/resources.js</code>.
          </p>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {resourceGroups.map((g) => (
            <section key={g.title} className="rounded-[18px] border border-line/70 bg-surface/50 p-6">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex rounded-lg border border-line/70 bg-ink/40 p-2 text-gold">
                  <Icon name={g.icon} size={16} aria-hidden="true" />
                </span>
                <h2 className="text-fluid-lg font-semibold text-silver">{g.title}</h2>
              </div>
              {g.note && <p className="mb-3 text-xs text-muted">{g.note}</p>}
              <ul className="space-y-1.5">
                {g.items.map((it) =>
                  it.href ? (
                    <li key={it.label}>
                      <a
                        href={it.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex items-center justify-between gap-2 rounded-lg border border-line/60 px-3 py-2 text-sm text-silver transition-colors hover:border-gold/50"
                      >
                        <span>{it.label}</span>
                        <ExternalLink size={13} className="shrink-0 text-muted group-hover:text-gold" aria-hidden="true" />
                      </a>
                    </li>
                  ) : (
                    <li key={it.label} className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-line/40 px-3 py-2 text-sm text-muted">
                      <span>{it.label}</span>
                      <span className="inline-flex items-center gap-1 text-[11px]"><Plus size={12} aria-hidden="true" /> add link</span>
                    </li>
                  ),
                )}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
