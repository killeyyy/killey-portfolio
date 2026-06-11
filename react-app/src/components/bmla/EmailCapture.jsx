import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";

/** Optional, never-blocking beta signup. Posts to /api/bmla-signup (graceful
 *  always-200 endpoint); success is stored so we don't re-ask. */
export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("bmla:v1:signup") ? "done" : "idle",
  );
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setState("busy");
    try {
      const r = await fetch("/api/bmla-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (r.ok) {
        try { localStorage.setItem("bmla:v1:signup", email); } catch { /* private mode */ }
        setState("done");
      } else {
        setErr("That email doesn't look right — try again?");
        setState("idle");
      }
    } catch {
      setErr("Network hiccup — try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-jade/40 bg-jade/10 px-5 py-2.5 text-sm text-jade-bright" role="status">
        <Check size={15} aria-hidden="true" /> You're on the founding-member list.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
      <label className="flex-1">
        <span className="sr-only">Email for founding-member updates</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          placeholder="you@email.com — founding-member updates"
          className="w-full rounded-full border border-line/70 bg-ink px-5 py-3 text-sm text-silver placeholder:text-muted focus:border-gold/60"
        />
      </label>
      <button
        type="submit"
        disabled={state === "busy"}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 px-6 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/10 disabled:opacity-60"
      >
        {state === "busy" ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Mail size={15} aria-hidden="true" />}
        Keep me posted
      </button>
      {err && <p className="text-sm text-crimson-bright sm:basis-full" role="alert">{err}</p>}
    </form>
  );
}
