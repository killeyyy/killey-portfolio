import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/cn.js";

/** Labeled form row. */
export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-cream " +
  "placeholder:text-muted/60 focus:border-rose focus:outline-none";

export function TextInput({ className, ...props }) {
  return <input className={cn(inputCls, className)} {...props} />;
}

export function TextArea({ className, rows = 2, ...props }) {
  return <textarea rows={rows} className={cn(inputCls, "resize-none", className)} {...props} />;
}

export function Select({ options, className, ...props }) {
  return (
    <select className={cn(inputCls, "appearance-none", className)} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** ± stepper for minutes/amounts. */
export function NumberStepper({ value, onChange, step = 5, min = 5, max = 720, format }) {
  const clamp = (v) => Math.min(max, Math.max(min, v));
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(clamp(value - step))}
        className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-cream active:scale-95"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-[4.5rem] text-center text-base font-semibold tabular-nums text-cream">
        {format ? format(value) : value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(clamp(value + step))}
        className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-cream active:scale-95"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
