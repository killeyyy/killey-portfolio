import { cn } from "../../lib/cn.js";

/** Small segmented control (e.g. Week | Month). options: [{ value, label }] */
export function Segmented({ value, onChange, options, className }) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex rounded-xl border border-line bg-surface2 p-1", className)}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150",
            value === opt.value ? "bg-rose text-ink" : "text-muted",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
