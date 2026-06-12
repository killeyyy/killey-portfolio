import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Settings } from "lucide-react";

/**
 * Route header. Default right action is the Settings gear;
 * `back` swaps the left side for a back button (sub-screens).
 */
export function PageHeader({ title, sub, back = false, action }) {
  const navigate = useNavigate();
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-1.5">
        {back && (
          <button
            type="button"
            onClick={() => navigate(-1, { viewTransition: true })}
            aria-label="Back"
            className="-ml-2 mt-0.5 rounded-lg p-1.5 text-muted hover:text-cream"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="font-serif text-xl font-semibold text-cream">{title}</h1>
          {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
        </div>
      </div>
      {action !== undefined ? (
        action
      ) : (
        <Link
          to="/settings"
          aria-label="Settings"
          viewTransition
          className="rounded-lg p-1.5 text-muted hover:text-cream"
        >
          <Settings size={20} />
        </Link>
      )}
    </header>
  );
}
