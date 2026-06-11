import { Lightbulb, AlertTriangle, Info, ShieldCheck } from "lucide-react";
import Math from "./Math.jsx";

/** Markdown-lite: **bold** and `code` only (our content is authored, not user input). */
export function Rich({ text, className = "" }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i} className="font-semibold text-silver">{p.slice(2, -2)}</strong>;
        if (p.startsWith("`") && p.endsWith("`"))
          return <code key={i} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.9em] text-gold">{p.slice(1, -1)}</code>;
        return p;
      })}
    </span>
  );
}

const TONES = {
  note: { icon: Info, cls: "border-azure/40 bg-azure/10 text-silver", iconCls: "text-cyan" },
  tip: { icon: Lightbulb, cls: "border-gold/40 bg-gold/10 text-silver", iconCls: "text-gold" },
  warn: { icon: AlertTriangle, cls: "border-crimson/40 bg-crimson/10 text-silver", iconCls: "text-crimson-bright" },
  integrity: { icon: ShieldCheck, cls: "border-jade/40 bg-jade/10 text-silver", iconCls: "text-jade-bright" },
};

export function CalloutBlock({ block }) {
  const tone = TONES[block.tone] || TONES.note;
  const Icon = tone.icon;
  return (
    <aside className={`flex gap-3 rounded-xl border p-4 ${tone.cls}`} role="note">
      <Icon size={18} className={`mt-0.5 shrink-0 ${tone.iconCls}`} aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {block.title && <p className="mb-1 font-semibold">{block.title}</p>}
        <Rich text={block.text} className="text-silver/90" />
      </div>
    </aside>
  );
}

export function ExampleBlock({ block }) {
  const ex = block.example || {};
  return (
    <section className="rounded-xl2 border border-line/70 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
        {block.title || "Worked example"}
      </p>
      <p className="text-sm text-silver"><Rich text={ex.prompt} /></p>
      <ol className="mt-3 space-y-2 border-l border-line/60 pl-4">
        {(ex.steps || []).map((s, i) => (
          <li key={i} className="text-sm text-muted">
            {s.text && <Rich text={s.text} />}
            {s.tex && <Math tex={s.tex} />}
          </li>
        ))}
      </ol>
      {ex.answerTex && (
        <div className="mt-4 rounded-lg border border-jade/40 bg-jade/10 p-3">
          <Math tex={ex.answerTex} />
        </div>
      )}
    </section>
  );
}
