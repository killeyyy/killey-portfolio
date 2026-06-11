import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CalendarDays, Link2, LogOut, Lock, Activity,
  ArrowLeft, ExternalLink, CircleCheck, Circle, ShieldAlert, ShieldCheck, Github, Rocket, Star, Loader2,
} from "lucide-react";
import { site, projects, pipeline, links } from "../data/site.js";
import Icon from "../lib/icons.jsx";
import StatusPill from "../components/StatusPill.jsx";
import { Counter, Sparkline, ProgressRing, Heatmap, StatusBadge, Tile } from "../components/cockpit/viz.jsx";
import { cn } from "../lib/cn.js";

// Interim passcode is used ONLY until secure serverless auth is configured
// (set SESSION_SECRET + OWNER_PASSWORD_HASH in Vercel — see docs/SETUP-ENV.md).
// When those env vars exist, /api/auth/session reports configured:true and this
// gate is replaced by the real signed-cookie login.
const INTERIM_PASSCODE = import.meta.env.VITE_OWNER_PASSCODE || "killey-2026";

function relativeTime(iso) {
  if (!iso) return "";
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  const s = Math.max(0, (Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const EVENT_VERB = {
  PushEvent: "Pushed to", CreateEvent: "Created", ReleaseEvent: "Released", PullRequestEvent: "PR on",
};
const DEPLOY_COLOR = {
  READY: "text-jade-bright", BUILDING: "text-gold", ERROR: "text-crimson-bright", QUEUED: "text-muted",
};

function useCockpitData(enabled) {
  const [gh, setGh] = useState(null);
  const [vc, setVc] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const grab = (url, set) =>
      fetch(url, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => alive && d && set(d))
        .catch(() => {});
    grab("/api/github", setGh);
    grab("/api/vercel", setVc);
    return () => { alive = false; };
  }, [enabled]);
  return { gh, vc };
}

function Gate({ mode, onPass }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (mode === "interim") {
      if (val === INTERIM_PASSCODE) {
        sessionStorage.setItem("owner_ok", "1");
        onPass();
      } else setErr("Incorrect passcode.");
      return;
    }
    // secure mode -> real serverless login
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: val }),
      });
      if (r.ok) onPass();
      else if (r.status === 401) setErr("Incorrect password.");
      else if (r.status === 503) setErr("Secure login isn't configured yet.");
      else setErr("Couldn't sign in. Try again.");
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const secure = mode === "secure";
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl2 border border-line/70 bg-surface/60 p-8">
        <div className={cn("mb-5 inline-flex rounded-lg border p-2.5", secure ? "border-jade/40 text-jade-bright" : "border-gold/40 text-gold")}>
          {secure ? <ShieldCheck size={18} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
        </div>
        <h1 className="font-serif text-fluid-lg font-semibold text-silver">Owner access</h1>
        <p className="mt-1 text-sm text-muted">
          {secure ? "Secure login for " : "Private cockpit for "}{site.fullName}.
        </p>
        <label className="mt-5 block">
          <span className="sr-only">{secure ? "Password" : "Passcode"}</span>
          <input
            type="password" autoFocus value={val}
            onChange={(e) => { setVal(e.target.value); setErr(""); }}
            placeholder={secure ? "Password" : "Passcode"}
            className="w-full rounded-lg border border-line/70 bg-ink px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-crimson/60"
          />
        </label>
        {err && <p className="mt-2 text-sm text-crimson-bright">{err}</p>}
        <button type="submit" disabled={busy} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-crimson px-5 py-3 text-sm font-medium text-silver hover:bg-crimson/90 disabled:opacity-60">
          {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />} Enter
        </button>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-muted hover:text-silver">
          <ArrowLeft size={14} aria-hidden="true" /> Back to site
        </Link>
      </form>
    </main>
  );
}

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "pipeline", label: "Pipeline", icon: CalendarDays },
  { id: "links", label: "Quick links", icon: Link2 },
];

export default function Owner() {
  const [auth, setAuth] = useState({ loading: true, configured: false, authenticated: false });
  const [interimOk, setInterimOk] = useState(() => sessionStorage.getItem("owner_ok") === "1");
  const [section, setSection] = useState("overview");

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => alive && setAuth({ loading: false, configured: !!d?.configured, authenticated: !!d?.authenticated }))
      .catch(() => alive && setAuth({ loading: false, configured: false, authenticated: false }));
    return () => { alive = false; };
  }, []);

  const authed = auth.configured ? auth.authenticated : interimOk;
  const { gh, vc } = useCockpitData(authed);

  if (auth.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">
        <Loader2 size={22} className="animate-spin" aria-hidden="true" />
      </main>
    );
  }
  if (!authed) {
    return (
      <Gate
        mode={auth.configured ? "secure" : "interim"}
        onPass={() => (auth.configured ? setAuth((a) => ({ ...a, authenticated: true })) : setInterimOk(true))}
      />
    );
  }

  const live = projects.filter((p) => p.status === "Live").length;
  const wip = projects.filter((p) => p.status === "In progress").length;
  const todos = pipeline.filter((p) => !p.done).length;
  const ghState = gh?.source === "live" ? "live" : "sample";
  const vcState = vc?.source === "live" ? "live" : "sample";

  async function signOut() {
    if (auth.configured) {
      try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
      setAuth((a) => ({ ...a, authenticated: false }));
    } else {
      sessionStorage.removeItem("owner_ok");
      setInterimOk(false);
    }
  }

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
        {auth.configured ? (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-jade/30 bg-jade/10 px-4 py-3 text-xs text-jade-bright">
            <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>Secure serverless login active. Live feeds show a truthful Live/Sample badge per source.</span>
          </div>
        ) : (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold">
            <ShieldAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>Interim passcode gate. Add SESSION_SECRET + OWNER_PASSWORD_HASH in Vercel for the secure login (docs/SETUP-ENV.md). GitHub data below is already live.</span>
          </div>
        )}

        {section === "overview" && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="font-serif text-fluid-xl font-semibold text-silver">Overview</h1>
              <StatusBadge state={ghState} />
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
                  <p className="font-mono text-xs uppercase tracking-wider text-muted">Build activity (GitHub)</p>
                  <StatusBadge state={ghState} />
                </div>
                <Heatmap data={gh?.heatmap} days={7} />
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

        {section === "activity" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-fluid-xl font-semibold text-silver">Activity</h1>
            </div>

            <Tile>
              <div className="mb-4 flex items-center justify-between">
                <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted"><Github size={14} aria-hidden="true" /> Recent pushes</p>
                <StatusBadge state={ghState} />
              </div>
              {gh?.events?.length ? (
                <ul className="space-y-3">
                  {gh.events.map((e, i) => (
                    <li key={i} className="border-b border-line/40 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm text-silver">
                        <span className="text-gold">{EVENT_VERB[e.type] || e.type}</span> {e.repo}
                        <span className="ml-2 text-xs text-muted">{relativeTime(e.createdAt)}</span>
                      </p>
                      {e.commits?.length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                          {e.commits.map((c, j) => (
                            <li key={j} className="truncate text-xs text-muted">— {c}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">No recent public activity to show.</p>
              )}
            </Tile>

            <div className="grid gap-4 lg:grid-cols-2">
              <Tile>
                <div className="mb-4 flex items-center justify-between">
                  <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted"><Github size={14} aria-hidden="true" /> Repositories</p>
                  <StatusBadge state={ghState} />
                </div>
                <ul className="space-y-3">
                  {(gh?.repos || []).map((r) => (
                    <li key={r.name}>
                      <a href={r.url} target="_blank" rel="noreferrer noopener" className="group flex items-center justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-silver group-hover:text-crimson">{r.name}</span>
                          {r.description && <span className="block truncate text-xs text-muted">{r.description}</span>}
                        </span>
                        <span className="flex shrink-0 items-center gap-2 text-xs text-muted">
                          {r.language && <span>{r.language}</span>}
                          {r.stars > 0 && <span className="inline-flex items-center gap-0.5"><Star size={11} aria-hidden="true" /> {r.stars}</span>}
                        </span>
                      </a>
                    </li>
                  ))}
                  {!gh?.repos?.length && <li className="text-sm text-muted">Connecting…</li>}
                </ul>
              </Tile>

              <Tile>
                <div className="mb-4 flex items-center justify-between">
                  <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted"><Rocket size={14} aria-hidden="true" /> Deployments</p>
                  <StatusBadge state={vcState} />
                </div>
                <ul className="space-y-3">
                  {(vc?.deployments || []).map((d) => (
                    <li key={d.uid} className="flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-silver">{d.commitMsg || d.name}</span>
                        <span className="block truncate text-xs text-muted">{d.branch || d.target} · {relativeTime(typeof d.created === "number" ? new Date(d.created).toISOString() : d.created)}</span>
                      </span>
                      <span className={cn("shrink-0 text-xs font-medium", DEPLOY_COLOR[d.state] || "text-muted")}>{d.state}</span>
                    </li>
                  ))}
                  {!vc?.deployments?.length && <li className="text-sm text-muted">Set VERCEL_TOKEN for live deployments.</li>}
                </ul>
                {vcState === "sample" && <p className="mt-3 text-[11px] text-muted">Sample until VERCEL_TOKEN is set (docs/SETUP-ENV.md).</p>}
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
