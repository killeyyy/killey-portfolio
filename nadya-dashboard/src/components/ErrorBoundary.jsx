import { Component } from "react";
import { downloadExport } from "../lib/backup.js";

/**
 * Per-route error boundary. Catches render errors inside <Outlet /> and
 * shows a friendly recovery card without white-screening the shell.
 *
 * The "Export backup" escape hatch lets the user rescue their data even
 * if the route that errored was, say, Settings — where the normal export
 * button lives.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log for visibility in Vercel function logs / browser console.
    // Never send to an external analytics service.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Gradient frame — same pattern as Tile glow */}
          <div className="rounded-2xl bg-gradient-to-br from-rose/60 via-line/50 to-coral/45 p-px shadow-[0_16px_40px_-20px_rgb(0_0_0/0.6)]">
            <div className="rounded-[15px] bg-surface p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
              <p className="font-serif text-xl font-bold text-cream">
                Something went sideways
              </p>
              <p className="mt-2 text-sm text-muted">
                Your data is safe on this device — nothing was lost. Try
                reloading the page or exporting a backup as a precaution.
              </p>

              {/* Error detail (collapsed by default so it doesn't alarm) */}
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-muted hover:text-cream">
                  Technical details
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-surface2 p-3 text-[11px] text-muted">
                  {this.state.error?.message || String(this.state.error)}
                </pre>
              </details>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-full rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95"
                >
                  Reload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      downloadExport();
                    } catch {
                      alert(
                        "Could not create the export file. Your data is still in this browser's storage.",
                      );
                    }
                  }}
                  className="w-full rounded-xl border border-line py-2.5 text-sm font-semibold text-cream active:scale-95"
                >
                  Export backup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
