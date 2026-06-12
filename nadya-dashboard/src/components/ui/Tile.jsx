import { cn } from "../../lib/cn.js";

/**
 * Card shell; optional display-font title + right-side action.
 * `glow` wraps it in a 1px rose→coral gradient frame with an inset top
 * highlight and a desktop hover lift — for hero cards only.
 */
export function Tile({ title, action, children, className, glow = false }) {
  const body = (
    <section
      className={cn(
        glow
          ? "rounded-[15px] bg-surface p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]"
          : "rounded-2xl border border-line bg-surface p-4",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="font-serif text-base font-bold text-cream">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );

  if (!glow) return body;
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-rose/40 via-line/60 to-coral/30 p-px",
        "transition-transform duration-200 ease-soft lg:hover:-translate-y-0.5",
      )}
    >
      {body}
    </div>
  );
}
