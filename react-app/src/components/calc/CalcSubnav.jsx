import { Link, useLocation } from "react-router-dom";
import { Sigma, GraduationCap } from "lucide-react";

// Persistent wayfinding for the Calculus study area, with active-route
// highlighting. Mirrors BmlaSubnav for a symmetric feel across the two vaults.
const ITEMS = [
  { to: "/calc", label: "Calculus", Icon: Sigma, match: (p) => p === "/calc" || p.startsWith("/calc/exercise") },
  { to: "/bmla", label: "BMLA vault", Icon: GraduationCap, match: (p) => p.startsWith("/bmla") },
];

export default function CalcSubnav() {
  const { pathname } = useLocation();
  return (
    <div className="border-b border-line/60 bg-ink/60">
      <nav aria-label="Calculus sections" className="mx-auto flex max-w-content items-center gap-1 overflow-x-auto px-6 py-2.5">
        {ITEMS.map(({ to, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-crimson/15 text-crimson-bright" : "text-muted hover:text-silver"
              }`}
            >
              <Icon size={14} aria-hidden="true" /> {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
