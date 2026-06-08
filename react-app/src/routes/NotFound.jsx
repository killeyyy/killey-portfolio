import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">404</p>
      <h1 className="mt-3 font-serif text-fluid-2xl font-semibold text-silver">Nothing here.</h1>
      <p className="mt-3 text-muted">This page doesn't exist — but the work does.</p>
      <Link to="/" className="mt-8 rounded-full bg-crimson px-6 py-3 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
        Back home
      </Link>
    </main>
  );
}
