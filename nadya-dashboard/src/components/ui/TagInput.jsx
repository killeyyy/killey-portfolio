import { useState } from "react";
import { X } from "lucide-react";

const normalize = (s) => s.trim().toLowerCase().replace(/^#/, "").slice(0, 20);

/**
 * Free-form tag row: picked tags (tap to remove), suggestions (tap to add),
 * inline input that commits on Enter, comma or blur.
 */
export function TagInput({ tags, onChange, suggestions = [], max = 5 }) {
  const [draft, setDraft] = useState("");

  const add = (raw) => {
    const tag = normalize(raw);
    if (!tag || tags.includes(tag) || tags.length >= max) return;
    onChange([...tags, tag]);
  };
  const commitDraft = () => {
    if (draft.trim()) add(draft);
    setDraft("");
  };
  const unpicked = suggestions.filter((t) => !tags.includes(t));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(tags.filter((x) => x !== t))}
          aria-label={`Remove tag ${t}`}
          className="inline-flex items-center gap-1 rounded-full bg-rose/15 px-2.5 py-1 text-xs font-medium text-rose-bright active:scale-95"
        >
          #{t}
          <X size={11} aria-hidden="true" />
        </button>
      ))}
      {unpicked.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => add(t)}
          disabled={tags.length >= max}
          className="rounded-full border border-line bg-surface2 px-2.5 py-1 text-xs text-muted active:scale-95 disabled:opacity-40"
        >
          #{t}
        </button>
      ))}
      {tags.length < max && (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commitDraft();
            }
          }}
          placeholder="+ tag"
          aria-label="Add tag"
          maxLength={21}
          className="w-16 bg-transparent px-1 py-1 text-xs text-cream placeholder:text-muted/60 focus:outline-none"
        />
      )}
    </div>
  );
}
