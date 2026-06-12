import { useState } from "react";
import { Sheet } from "../ui/Sheet.jsx";
import { Chip } from "../ui/Chip.jsx";
import { Field, TextInput, NumberStepper } from "../ui/Field.jsx";
import { COLOR_META, COLOR_NAMES } from "../../data/defaults.js";
import { formatMinutes } from "../../lib/format.js";
import { uid } from "../../lib/uid.js";

// One-tap seeds for the empty garden; also selectable inside the form.
export const PRESETS = [
  { name: "Water", emoji: "💧", color: "sky", kind: "count", unit: "glasses", step: 1, target: 8 },
  { name: "Sleep", emoji: "🌙", color: "lavender", kind: "minutes", step: 30, target: 480 },
  { name: "Prayer", emoji: "🤲", color: "sand", kind: "count", unit: "prayers", step: 1, target: 5 },
  { name: "Reading", emoji: "📖", color: "coral", kind: "minutes", step: 15, target: 30 },
  { name: "Steps", emoji: "👟", color: "mint", kind: "count", unit: "steps", step: 1000, target: 8000 },
  { name: "Stretch", emoji: "🧘", color: "rose", kind: "check", weekTarget: 7 },
];

export function trackerFromPreset(p) {
  return {
    id: uid(),
    name: p.name,
    emoji: p.emoji,
    color: p.color,
    kind: p.kind,
    unit: p.unit || "",
    step: p.step || 1,
    target: p.kind === "check" ? 1 : p.target,
    weekTarget: p.kind === "check" ? p.weekTarget || 7 : 0,
    createdAt: Date.now(),
    archivedAt: null,
  };
}

const KINDS = [
  { id: "count", label: "Count things" },
  { id: "minutes", label: "Time" },
  { id: "check", label: "Done / not" },
];

const COUNT_STEPS = [1, 5, 10, 100, 500, 1000];

export function TrackerForm({ tracker, onClose, onSave }) {
  const [name, setName] = useState(tracker?.name || "");
  const [emoji, setEmoji] = useState(tracker?.emoji || "🌿");
  const [color, setColor] = useState(tracker?.color || "rose");
  const [kind, setKind] = useState(tracker?.kind || "count");
  const [unit, setUnit] = useState(tracker?.unit || "");
  const [step, setStep] = useState(tracker?.step || 1);
  const [target, setTarget] = useState(tracker?.target ?? (tracker?.kind === "minutes" ? 30 : 8));
  const [weekDays, setWeekDays] = useState(tracker?.weekTarget || 7);

  const save = () =>
    onSave({
      id: tracker?.id || uid(),
      name: name.trim(),
      emoji: emoji.trim() || "🌿",
      color,
      kind,
      unit: kind === "count" ? unit.trim() : "",
      step: kind === "minutes" ? (tracker?.kind === "minutes" && tracker.step) || 15 : kind === "count" ? step : 1,
      target: kind === "check" ? 1 : Math.max(0, target),
      weekTarget: kind === "check" ? weekDays : tracker?.kind === kind ? tracker?.weekTarget || 0 : 0,
      createdAt: tracker?.createdAt || Date.now(),
      archivedAt: tracker?.archivedAt || null,
    });

  return (
    <Sheet open onClose={onClose} title={tracker ? "Edit tracker" : "New tracker"}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Field label="Emoji">
            <TextInput
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={4}
              className="w-16 text-center"
              aria-label="Emoji"
            />
          </Field>
          <div className="flex-1">
            <Field label="Name">
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                autoFocus={!tracker}
                placeholder="Water, sleep, prayer…"
              />
            </Field>
          </div>
        </div>

        <Field label="What kind of thing is it?">
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <Chip key={k.id} selected={kind === k.id} onClick={() => setKind(k.id)}>
                {k.label}
              </Chip>
            ))}
          </div>
        </Field>

        {kind === "count" && (
          <>
            <Field label="Unit" hint="Shown after the number — glasses, pages, steps…">
              <TextInput value={unit} onChange={(e) => setUnit(e.target.value)} maxLength={16} />
            </Field>
            <Field label="Counts by">
              <div className="flex flex-wrap gap-2">
                {COUNT_STEPS.map((s) => (
                  <Chip key={s} selected={step === s} onClick={() => setStep(s)}>
                    +{s}
                  </Chip>
                ))}
              </div>
            </Field>
            <Field label="Daily intention" hint="A gentle aim, never a deadline.">
              <NumberStepper value={target} onChange={setTarget} step={step} min={0} max={50000} />
            </Field>
          </>
        )}

        {kind === "minutes" && (
          <Field label="Daily intention" hint="A gentle aim, never a deadline.">
            <NumberStepper value={target} onChange={setTarget} step={15} min={0} max={720} format={formatMinutes} />
          </Field>
        )}

        {kind === "check" && (
          <Field label="Days a week" hint="How often you'd love to tend it.">
            <NumberStepper value={weekDays} onChange={setWeekDays} step={1} min={1} max={7} />
          </Field>
        )}

        <Field label="Color">
          <div className="flex flex-wrap gap-2">
            {COLOR_NAMES.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full ${COLOR_META[c].dot} ${
                  color === c ? "ring-2 ring-cream ring-offset-2 ring-offset-surface2" : ""
                }`}
              />
            ))}
          </div>
        </Field>

        <div className="flex gap-2 pt-1">
          {tracker && (
            <button
              type="button"
              onClick={() => onSave({ ...tracker, archivedAt: Date.now() })}
              className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted active:scale-95"
            >
              Archive
            </button>
          )}
          <button
            type="button"
            disabled={!name.trim()}
            onClick={save}
            className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </Sheet>
  );
}
