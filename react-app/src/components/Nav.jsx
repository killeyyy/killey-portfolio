import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock, Command } from "lucide-react";
import { site } from "../data/site.js";
import { cn } from "../lib/cn.js";

const NAV = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/** Gradient reading-progress bar pinned above the nav. Writes transform
 *  directly (rAF-throttled) so scrolling never re-renders React. */
function ProgressBar() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[3px] origin-left"
      style={{
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, rgb(var(--c-crimson)), rgb(var(--c-gold)), rgb(var(--c-violet)), rgb(var(--c-cyan)))",
      }}
    />
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/75 backdrop-blur-md">
      <ProgressBar />
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-content items-center justify-between px-6 py-4"
      >
        <Link to="/" className="group font-serif text-lg font-semibold tracking-wide text-silver">
          {site.brand}
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-crimson align-middle transition-transform group-hover:scale-150" aria-hidden="true" />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-silver">
              {n.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("killey:cmdk"))}
            className="inline-flex items-center gap-1.5 rounded-md border border-line/70 px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-gold/50 hover:text-gold"
            aria-label="Open command palette"
          >
            <Command size={11} aria-hidden="true" /> K
          </button>
          <a
            href={`mailto:${site.email}`}
            className="rounded-full bg-crimson px-4 py-2 text-sm font-medium text-silver transition-colors hover:bg-crimson/90"
          >
            Let's talk
          </a>
          <Link to="/owner" aria-label="Owner login" className="text-muted transition-colors hover:text-gold">
            <Lock size={16} aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="text-silver md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      <div className={cn("border-t border-line/60 md:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-content flex-col gap-1 px-6 py-3">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-2 py-2 text-sm text-muted hover:bg-white/5 hover:text-silver"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
          <Link to="/owner" className="rounded-md px-2 py-2 text-sm text-muted hover:bg-white/5 hover:text-silver" onClick={() => setOpen(false)}>
            Owner
          </Link>
          <a href={`mailto:${site.email}`} className="mt-1 rounded-full bg-crimson px-4 py-2 text-center text-sm font-medium text-silver">
            Let's talk
          </a>
        </div>
      </div>
    </header>
  );
}
