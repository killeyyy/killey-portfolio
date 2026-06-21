import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

// Private study vault — owner only. Same passcode as the BMLA vault (one code
// unlocks both); separate session key. Combined with the noindex headers in
// vercel.json + robots.txt, the whole /calc area is private and unlisted.
const PASS = import.meta.env.VITE_BMLA_PASSCODE || "killey-2026";

export default function CalcGate({ children }) {
  const [ok, setOk] = useState(
    () =>
      typeof window !== "undefined" &&
      (sessionStorage.getItem("calc:v1:unlock") === "1" ||
        sessionStorage.getItem("bmla:v1:unlock") === "1"),
  );
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  if (ok) return children;

  function submit(e) {
    e.preventDefault();
    if (val === PASS) {
      try { sessionStorage.setItem("calc:v1:unlock", "1"); } catch { /* private mode */ }
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
        <h1 className="font-serif text-fluid-lg font-semibold text-silver">Private study vault</h1>
        <p className="mt-1 text-sm text-muted">Calculus — Solved. For your eyes only. Enter your passcode.</p>
        <label className="mt-5 block">
          <span className="sr-only">Passcode</span>
          <input
            type="password"
            autoFocus
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(false); }}
            placeholder="Passcode"
            className="w-full rounded-lg border border-line/70 bg-ink px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-gold/60"
          />
        </label>
        {err && <p className="mt-2 text-sm text-crimson-bright">Wrong passcode.</p>}
        <button type="submit" className="mt-4 w-full rounded-full bg-crimson px-5 py-3 text-sm font-medium text-silver hover:bg-crimson/90">
          Unlock
        </button>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-muted hover:text-silver">
          <ArrowLeft size={14} aria-hidden="true" /> Back to site
        </Link>
      </form>
    </main>
  );
}
