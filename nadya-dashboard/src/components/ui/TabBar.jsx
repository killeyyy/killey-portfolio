import { NavLink } from "react-router-dom";
import { BarChart3, Home, NotebookPen, PiggyBank, Plus } from "lucide-react";
import { cn } from "../../lib/cn.js";

const LEFT = [
  { to: "/", icon: Home, label: "Today" },
  { to: "/stats", icon: BarChart3, label: "Stats" },
];
const RIGHT = [
  { to: "/savings", icon: PiggyBank, label: "Savings" },
  { to: "/journal", icon: NotebookPen, label: "Journal" },
];

function Tab({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
          isActive ? "text-rose-bright" : "text-muted",
        )
      }
    >
      <Icon size={20} aria-hidden="true" />
      {label}
    </NavLink>
  );
}

/** Fixed bottom nav: 4 tabs + raised center "+" that opens the quick log. */
export function TabBar({ onPlus }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex w-full max-w-md items-stretch px-2">
        {LEFT.map((t) => (
          <Tab key={t.to} {...t} />
        ))}
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={onPlus}
            aria-label="Log an activity"
            className={cn(
              "-mt-5 grid h-14 w-14 place-items-center rounded-full bg-rose text-ink",
              "shadow-lg shadow-rose/30 transition-transform duration-150 active:scale-95",
            )}
          >
            <Plus size={26} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
        {RIGHT.map((t) => (
          <Tab key={t.to} {...t} />
        ))}
      </div>
    </nav>
  );
}
