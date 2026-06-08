import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock } from "lucide-react";
import { site } from "../data/site.js";
import { cn } from "../lib/cn.js";

const NAV = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-content items-center justify-between px-6 py-4"
      >
        <Link to="/" className="font-serif text-lg font-semibold tracking-wide text-silver">
          {site.brand}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-muted transition-colors hover:text-silver">
              {n.label}
            </a>
          ))}
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
