import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

// Private study vault. Two modes (docs/BMLA-BUSINESS-MODEL.md §5):
//   beta (default) — client passcode via env (fallback for local); combined
//     with the noindex headers in vercel.json + robots.txt the whole /bmla
//     area is private and unlisted.
//   codes (VITE_BMLA_MODE=codes) — server-verified access codes redeemed at
//     /api/bmla/redeem (httpOnly signed cookie). Falls back to the passcode
//     gate if the server reports unconfigured, so previews always work.
const PASS = import.meta.env.VITE_BMLA_PASSCODE || "killey-2026";
const CODES_MODE = import.meta.env.VITE_BMLA_MODE === "codes";

export default function BmlaGate({ children }) {
  const [ok, setOk] = useState(
    () => !CODES_MODE && typeof window !== "undefined" && sessionStorage.getItem("bmla:v1:unlock") === "1",
  );
  const [checking, setChecking] = useState(CODES_MODE);
  const [serverReady, setServerReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!CODES_MODE) return;
    fetch("/api/bmla/redeem")
      .then((r) => r.json())
      .then((d) => {
        setServerReady(Boolean(d.configured));
        if (d.authenticated) setOk(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (ok) return children;
  if (checking) return <main className="min-h-screen" aria-busy="true" />;

  const codes = CODES_MODE && serverReady;

  async function submit(e) {
    e.preventDefault();
    if (codes) {
      setBusy(true);
      try {
        const r = await fetch("/api/bmla/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: val }),
        });
        if (r.ok) setOk(true);
        else setErr(true);
      } catch {
        setErr(true);
      }
      setBusy(false);
      return;
    }
    if (val === PASS) {
      try { sessionStorage.setItem("bmla:v1:unlock", "1"); } catch { /* private mode */ }
      setOk(true);
    } else {
      setErr(true);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div aria-hidden="true" className="aurora absolute inset-0 opacity-30" />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-xl2 border border-line/70 bg-surface/70 p-8 backdrop-blur">
        <div className="mb-5 inline-flex rounded-lg border border-gold/40 p-2.5 text-gold">
          <Lock size={18} aria-hidden="true" />
        </div>
        <h1 className="font-serif text-fluid-lg font-semibold text-silver">
          {codes ? "BMLA Mastery" : "Private study vault"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {codes ? "Members only. Enter your access code." : "BMLA Mastery — for your eyes only. Enter your passcode."}
        </p>
        <label className="mt-5 block">
          <span className="sr-only">{codes ? "Access code" : "Passcode"}</span>
          <input
            type={codes ? "text" : "password"}
            autoFocus
            autoComplete="off"
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(false); }}
            placeholder={codes ? "BMLA-…" : "Passcode"}
            className="w-full rounded-lg border border-line/70 bg-ink px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-gold/60"
          />
        </label>
        {err && (
          <p className="mt-2 text-sm text-crimson-bright">
            {codes ? "That code isn't valid (or has expired)." : "Wrong passcode."}
          </p>
        )}
        <button type="submit" disabled={busy} className="mt-4 w-full rounded-full bg-crimson px-5 py-3 text-sm font-medium text-silver hover:bg-crimson/90 disabled:opacity-60">
          Unlock
        </button>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-muted hover:text-silver">
          <ArrowLeft size={14} aria-hidden="true" /> Back to site
        </Link>
      </form>
    </main>
  );
}
