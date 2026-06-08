import { cn } from "../lib/cn.js";

const STYLES = {
  Live: "text-jade border-jade/40 bg-jade/10",
  "In progress": "text-gold border-gold/40 bg-gold/10",
  Prototype: "text-muted border-line bg-white/5",
  Paused: "text-muted border-line bg-white/5",
};

/** Small status badge. Color is not the only signal (text label too). */
export default function StatusPill({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STYLES[status] || STYLES.Prototype,
        className,
      )}
    >
      {status === "Live" && (
        <span className="h-1.5 w-1.5 rounded-full bg-jade" aria-hidden="true" />
      )}
      {status}
    </span>
  );
}
