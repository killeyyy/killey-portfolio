import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "../../lib/cn.js";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

/**
 * Single-toast host above the tab bar.
 * show(message, actions?) — actions: [{ label, onClick }] (e.g. Undo).
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback((message, actions = []) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message, actions });
    timer.current = setTimeout(() => setToast(null), 6000);
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      {toast && (
        <div
          role="status"
          className={cn(
            "fixed inset-x-4 z-[60] mx-auto max-w-md animate-toast-in",
            "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]",
            "flex items-center justify-between gap-3 rounded-2xl border border-line",
            "bg-surface2 px-4 py-3 text-sm text-cream shadow-lg shadow-ink/60",
          )}
        >
          <span className="min-w-0 truncate">{toast.message}</span>
          {toast.actions.length > 0 && (
            <span className="flex shrink-0 gap-3">
              {toast.actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => {
                    a.onClick();
                    dismiss();
                  }}
                  className="font-semibold text-rose-bright"
                >
                  {a.label}
                </button>
              ))}
            </span>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
}
