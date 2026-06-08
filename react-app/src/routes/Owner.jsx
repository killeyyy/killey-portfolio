import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CalendarDays, Link2, LogOut, Lock,
  ArrowLeft, ExternalLink, CircleCheck, Circle, ShieldAlert,
} from "lucide-react";
import { site, projects, pipeline, links } from "../data/site.js";
import Icon from "../lib/icons.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { Counter, Sparkline, ProgressRing, Heatmap, StatusBadge, Tile } from "../components/cockpit/viz.jsx";
import { cn } from "../lib/cn.js";

// INTERIM gate only. Replaced in Phase 4 by a Vercel serverless signed-cookie
// login (ADR-007); this app is not yet the production deploy.
const INTERIM_PASSCODE = import.meta.env.VITE_OWNER_PASSCODE || "killey-2026";

function Gate({ onPass }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  function submit(e) {
    e.preventDefault();
    if (val === INTERIM_PASSCODE) {
      sessionStorage.setItem("owner_ok", "1");
      onPass();
    } else setErr(true);
  }
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl2 border border-line/70 bg-surface/60 p-8">
        <div className="mb-5 inline-flex rounded-lg border border-line/70 p-2.5 text-gold"><Lock size={18} aria-hidden="true" /></div>
        <h1 className="font-serif text-fluid-lg font-semibold text-silver">Owner access</h1>
        <p className="mt-1 text-sm text-muted">Private cockpit for {site.fullName}.</p>
        <label className="mt-5 block">
          <span className="sr-only">Passcode</span>
          <input
            type="password" autoFocus value={val}
            onChange={(e) => { setVal(e.target.value); setErr(false); }}
            placeholder="Passcode"
            className="w-full rounded-lg border border-line/70 bg-ink px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-crimson/60"
          />
        </label>
        {err && <p className="mt-2 text-sm text-crimson">Incorrect passcode.</p>}
        <button type="submit" className="mt-4 w-full rounded-full bg-crimson px-5 py-3 text-sm font-medium text-silver hover:bg-crimson/90">Enter</button>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-muted hover:text-silver">
          <ArrowLeft size={14} aria-hidden="true" /> Back to site
        </Link>
      </form>
    </main>
  );
}

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "pipeline", label: "Pipeline", icon: CalendarDays },
  { id: "links", label: "Quick links", icon: Link2 },
];

export default function Owner() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("owner_ok") === "1");
  const [section, setSection] = useState("overview");
  if (!authed) return <Gate onPass={() => setAuthed(true)} />;

  const live = projects.filter((p) => p.status === "Live").length;
  const wip = projects.filter((p) => p.status === "In progress").length;
  const todos = pipeline.filter((p) => !p.done).length;

  function signOut() { sessionStorage.removeItem("owner_ok"); setAuthed(false); }

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line/60 md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-serif font-semibold text-silver">{site.brand} · Cockpit</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col" aria-label="Cockpit sections">
          {NAV.map((n) => (
            <button
              key={n.id} onClick={() => setSection(n.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                section === n.id ? "bg-crimson/15 text-crimson" : "text-muted hover:bg-white/5 hover:text-silver",
              )}
            >
              <n.icon size={16} aria-hidden="true" /> {n.label}
            </button>
          ))}
          <button onClick={signOut} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-silver md:mt-auto">
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </nav>
      </aside>

      <main className="flex-1 px-5 py-6 md:px-8">
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">
          <ShieldAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>Interim local gate + sample data. Secure serverless login and live GitHub/Vercel/Notion/Drive feeds land in Phase 4.</span>
        </div>

        {section === "overview" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="font-serif text-fluid-xl font-semibold text-silver">Overview</h1>
              <StatusBadge state="sample" />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Tile glow className="col-span-2">
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Projects</p>
                <p className="mt-1 font-serif text-[3rem] font-semibold leading-none text-silver">
                  <Counter to={projects.length} />
                </p>
                <p className="mt-1 text-sm text-muted">{live} live · {wip} in progress</p>
                <div className="mt-4 text-crimson-bright">
                  <Sparkline data={[3, 5, 4, 6, 7, 6, 8, 9]} />
                </div>
              </Tile>
              <Tile>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Live now</p>
                <p className="mt-1 font-serif text-[3rem] font-semibold leading-none text-jade-bright">
                  <Counter to={live} />
                </p>
                <p className="mt-3"><StatusBadge state="live" /></p>
              </Tile>
              <Tile className="flex flex-col items-center justify-center text-center">
                <ProgressRing value={72} label="72%" />
                <p className="mt-3 text-sm text-muted">Portfolio v2</p>
              </Tile>
              <Tile glow className="col-span-2 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">Build activity</p>
                  <StatusBadge state="sample" />
                </div>
                <Heatmap />
              </Tile>
              <Tile>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">Open tasks</p>
                <p className="mt-1 font-serif text-[3rem] font-semibold leading-none text-gold">
                  <Counter to={todos} />
                </p>
                <p className="mt-2 text-sm text-muted">in pipeline</p>
              </Tile>
            </div>
          </section>
        )}

        {section === "projects" && (
          <section>
            <h1 className="mb-5 font-serif text-fluid-xl font-semibold text-silver">Projects</h1>
            <div className="overflow-x-auto rounded-xl2 border border-line/70">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line/70 text-xs uppercase tracking-wider text-muted">
                  <tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Public</th></tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.slug} className="border-b border-line/40 last:border-0">
                      <td className="px-4 py-3 text-silver">{p.name}</td>
                      <td className="px-4 py-3 text-muted">{p.type}</td>
                      <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                      <td className="px-4 py-3 text-muted">{p.client ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "pipeline" && (
          <section>
            <h1 className="mb-5 font-serif text-fluid-xl font-semibold text-silver">Pipeline</h1>
            <ul className="space-y-2">
              {pipeline.map((t) => (
                <li key={t.title} className="flex items-center gap-3 rounded-lg border border-line/70 bg-surface/50 px-4 py-3 text-sm">
                  {t.done ? <CircleCheck size={16} className="text-jade" aria-hidden="true" /> : <Circle size={16} className="text-muted" aria-hidden="true" />}
                  <span className={cn("flex-1", t.done ? "text-muted line-through" : "text-silver")}>{t.title}</span>
                  <span className="text-xs text-muted">{t.due}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {section === "links" && (
          <section>
            <h1 className="mb-5 font-serif text-fluid-xl font-semibold text-silver">Quick links</h1>
            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between rounded-xl2 border border-line/70 bg-surface/50 px-4 py-3 text-sm text-silver transition-colors hover:border-crimson/40">
                  <span className="inline-flex items-center gap-2"><Icon name={l.icon} size={16} aria-hidden="true" className="text-gold" /> {l.label}</span>
                  <ExternalLink size={14} className="text-muted" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
