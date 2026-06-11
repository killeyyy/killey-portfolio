import { cn } from "../../lib/cn.js";

/** Compact card shell; optional serif title + right-side action. */
export function Tile({ title, action, children, className }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-surface p-4", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="font-serif text-base font-semibold text-cream">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
