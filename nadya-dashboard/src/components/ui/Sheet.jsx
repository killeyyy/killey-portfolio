import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn.js";

/** Bottom-sheet modal — the app's only modal primitive. */
export function Sheet({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink/70"
      />
      {/* Mobile: bottom sheet. Desktop (sm+): centered modal. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto w-full max-w-md animate-sheet-up",
          "rounded-t-3xl border-t border-line bg-surface2 px-4 pt-2",
          "pb-[max(1rem,env(safe-area-inset-bottom))]",
          "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:animate-modal-in",
          "sm:rounded-3xl sm:border sm:px-6 sm:pb-6 sm:pt-4 sm:shadow-2xl sm:shadow-ink/60",
          className,
        )}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="font-serif text-lg font-semibold text-cream">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted hover:text-cream"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70dvh] overflow-y-auto pb-1">{children}</div>
      </div>
    </div>
  );
}
