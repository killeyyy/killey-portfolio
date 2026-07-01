import { Link, useLocation } from "react-router-dom";
import { GraduationCap, LayoutDashboard, FileCheck2, Files, BookText, FolderLock, Sigma } from "lucide-react";

// Persistent wayfinding for the BMLA study area, with active-route highlighting.
const ITEMS = [
  { to: "/bmla", label: "Overview", Icon: GraduationCap, match: (p) => p === "/bmla" },
  { to: "/bmla/learn", label: "Dashboard", Icon: LayoutDashboard, match: (p) => p.startsWith("/bmla/learn") || p.startsWith("/bmla/lesson") },
  { to: "/bmla/exam", label: "Mock exam", Icon: FileCheck2, match: (p) => p.startsWith("/bmla/exam") },
  { to: "/bmla/papers", label: "Past papers", Icon: Files, match: (p) => p.startsWith("/bmla/papers") },
  { to: "/bmla/reference", label: "Formula sheet", Icon: BookText, match: (p) => p.startsWith("/bmla/reference") },
  { to: "/bmla/resources", label: "Locker", Icon: FolderLock, match: (p) => p.startsWith("/bmla/resources") },
  { to: "/calc", label: "Calculus", Icon: Sigma, match: (p) => p === "/calc" || p.startsWith("/calc/") },
];

export default function BmlaSubnav() {
  const { pathname } = useLocation();
  return (
    <div className="border-b border-line/60 bg-ink/60">
      <nav aria-label="BMLA sections" className="mx-auto flex max-w-content items-center gap-1 overflow-x-auto px-6 py-2.5">
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
