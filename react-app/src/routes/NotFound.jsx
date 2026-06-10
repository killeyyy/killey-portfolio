import { Link } from "react-router-dom";
import Magnetic from "../lib/Magnetic.jsx";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden="true" className="aurora absolute inset-0 opacity-40" />
      <div aria-hidden="true" className="grain absolute inset-0" />

      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Lost in the ink</p>
        <h1
          className="text-gradient mt-2 select-none font-serif font-semibold leading-none"
          style={{ fontSize: "clamp(7rem, 28vw, 18rem)" }}
        >
          404
        </h1>
        <p className="mx-auto mt-4 max-w-md text-fluid-base text-muted">
          This page doesn't exist — but the work does, and it's playable.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <Link to="/" className="glow-card inline-block rounded-full bg-crimson px-7 py-3.5 text-sm font-medium text-silver transition-transform hover:scale-[1.03]">
              Back home
            </Link>
          </Magnetic>
          <Magnetic>
            <a href="/#work" className="inline-block rounded-full border border-line px-7 py-3.5 text-sm font-medium text-silver transition-colors hover:border-gold/60 hover:text-gold">
              See the work
            </a>
          </Magnetic>
        </div>
      </div>
    </main>
  );
}
