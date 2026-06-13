import { useState } from "react";
import { Lightbulb, AlertTriangle, Info, ShieldCheck, BookMarked, BadgeCheck, Eye, ChevronRight } from "lucide-react";
import Math from "./Math.jsx";

/** Markdown-lite: **bold**, *italic* and `code` (our content is authored, not user input). */
export function Rich({ text, className = "" }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i} className="font-semibold text-silver">{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
          return <em key={i} className="text-silver/95">{p.slice(1, -1)}</em>;
        if (p.startsWith("`") && p.endsWith("`"))
          return <code key={i} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.9em] text-gold">{p.slice(1, -1)}</code>;
        return p;
      })}
    </span>
  );
}

const TONES = {
  note: { icon: Info, cls: "border-azure/40 bg-azure/10", iconCls: "text-cyan" },
  tip: { icon: Lightbulb, cls: "border-gold/40 bg-gold/10", iconCls: "text-gold" },
  warn: { icon: AlertTriangle, cls: "border-crimson/40 bg-crimson/10", iconCls: "text-crimson-bright" },
  integrity: { icon: ShieldCheck, cls: "border-jade/40 bg-jade/10", iconCls: "text-jade-bright" },
};

export function CalloutBlock({ block }) {
  const tone = TONES[block.tone] || TONES.note;
  const Icon = tone.icon;
  return (
    <aside className={`flex gap-3 rounded-xl border p-4 ${tone.cls}`} role="note">
      <Icon size={18} className={`mt-0.5 shrink-0 ${tone.iconCls}`} aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {block.title && <p className="mb-1 font-semibold text-silver">{block.title}</p>}
        <Rich text={block.text} className="text-silver/90" />
      </div>
    </aside>
  );
}

/** Section divider — gives the lesson visible structure (Khan-style segmenting). */
export function HeadingBlock({ block }) {
  return (
    <div className="pt-4">
      {block.eyebrow && (
        <p className={`font-mono text-[11px] uppercase tracking-[0.22em] ${block.accent || "text-gold"}`}>{block.eyebrow}</p>
      )}
      <h2 className="mt-1 border-b border-line/50 pb-2 font-serif text-fluid-lg font-semibold text-silver">{block.title}</h2>
    </div>
  );
}

/** Distinct definition card. */
export function DefinitionBlock({ block }) {
  return (
    <aside className="rounded-xl border border-violet/40 bg-violet/10 p-4">
      <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-bright">
        <BookMarked size={13} aria-hidden="true" /> Definition
      </p>
      <p className="mt-1.5 font-semibold text-silver">{block.term}</p>
      {block.text && <p className="mt-1 text-sm leading-relaxed text-silver/90"><Rich text={block.text} /></p>}
      {block.tex && <div className="mt-2"><Math tex={block.tex} className="text-silver" /></div>}
    </aside>
  );
}

/** Distinct theorem card. */
export function TheoremBlock({ block }) {
  return (
    <aside className="rounded-xl border border-gold/40 bg-gold/10 p-4">
      <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
        <BadgeCheck size={13} aria-hidden="true" /> Theorem{block.name ? ` · ${block.name}` : ""}
      </p>
      {block.text && <p className="mt-1.5 text-sm leading-relaxed text-silver/90"><Rich text={block.text} /></p>}
      {block.tex && <div className="mt-2"><Math tex={block.tex} className="text-silver" /></div>}
    </aside>
  );
}

/** Worked example with progressive step reveal (active recall, Khan-style). */
export function ExampleBlock({ block }) {
  const ex = block.example || {};
  const steps = ex.steps || [];
  const [shown, setShown] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const allShown = shown >= steps.length;

  return (
    <section className="rounded-xl2 border border-crimson/30 bg-surface/50 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-crimson-bright">
        {block.title || "Worked example"}
      </p>
      <p className="text-sm text-silver"><Rich text={ex.prompt} /></p>

      {steps.length > 0 && (
        <ol className="mt-3 space-y-2 border-l border-crimson/30 pl-4">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i} className="text-sm text-muted">
              {s.text && <Rich text={s.text} />}
              {s.tex && <Math tex={s.tex} />}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!allShown && (
          <button type="button" onClick={() => setShown(shown + 1)} className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-1.5 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
            <ChevronRight size={14} aria-hidden="true" /> Show step {shown + 1}
          </button>
        )}
        {!allShown && steps.length > 1 && (
          <button type="button" onClick={() => setShown(steps.length)} className="rounded-full border border-line/70 px-4 py-1.5 text-sm text-muted transition-colors hover:text-silver">
            Show all steps
          </button>
        )}
        {allShown && ex.answerTex && !showAns && (
          <button type="button" onClick={() => setShowAns(true)} className="inline-flex items-center gap-1.5 rounded-full border border-jade/50 px-4 py-1.5 text-sm font-medium text-jade-bright transition-colors hover:bg-jade/10">
            <Eye size={14} aria-hidden="true" /> Reveal answer
          </button>
        )}
      </div>

      {ex.answerTex && (showAns || (allShown && steps.length === 0)) && (
        <div className="mt-4 rounded-lg border border-jade/40 bg-jade/10 p-3">
          <Math tex={ex.answerTex} className="text-silver" />
        </div>
      )}
    </section>
  );
}
