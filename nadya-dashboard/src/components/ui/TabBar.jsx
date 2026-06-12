import { NavLink } from "react-router-dom";
import { BarChart3, Home, NotebookPen, Plus, Sprout } from "lucide-react";
import { cn } from "../../lib/cn.js";

const LEFT = [
  { to: "/", icon: Home, label: "Today" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
];
const RIGHT = [
  { to: "/journey", icon: Sprout, label: "Journey" },
  { to: "/journal", icon: NotebookPen, label: "Journal" },
];

function Tab({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      viewTransition
      className={({ isActive }) =>
        cn(
          "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
          "transition-transform duration-150 ease-out active:scale-[0.92]",
          isActive ? "text-rose-bright" : "text-muted",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={20} aria-hidden="true" className={isActive ? "animate-pop" : undefined} />
          {label}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -bottom-0.5 h-1 w-1 rounded-full bg-rose-bright transition-opacity",
              isActive ? "animate-pop opacity-100" : "opacity-0",
            )}
          />
        </>
      )}
    </NavLink>
  );
}

/** Fixed bottom nav: 4 tabs + raised center "+" that opens the quick log. */
export function TabBar({ onPlus }) {
  return (
    <nav
      aria-label="Main"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-line/60 bg-ink/80 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex w-full max-w-md items-stretch px-2">
        {LEFT.map((t) => (
          <Tab key={t.to} {...t} />
        ))}
        <div className="flex flex-1 items-center justify-center">
          <span className="relative -mt-5 grid place-items-center">
            <span
              aria-hidden="true"
              className="absolute h-14 w-14 animate-halo rounded-full bg-rose/60"
            />
            {/* Slow light sweep around the FAB — hidden under reduced motion. */}
            <span
              aria-hidden="true"
              className="absolute h-[60px] w-[60px] animate-spin rounded-full opacity-60 [animation-duration:7s] motion-reduce:hidden"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgb(255 255 255 / 0.5) 28deg, transparent 70deg)",
                WebkitMask: "radial-gradient(closest-side, transparent 87%, black 88%)",
                mask: "radial-gradient(closest-side, transparent 87%, black 88%)",
              }}
            />
            <button
              type="button"
              onClick={onPlus}
              aria-label="Log an activity"
              className={cn(
                "relative grid h-14 w-14 place-items-center rounded-full text-ink",
                "bg-gradient-to-br from-rose to-coral",
                "shadow-lg shadow-rose/30 transition-transform duration-150 active:scale-90",
              )}
            >
              <Plus size={26} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </span>
        </div>
        {RIGHT.map((t) => (
          <Tab key={t.to} {...t} />
        ))}
      </div>
    </nav>
  );
}
