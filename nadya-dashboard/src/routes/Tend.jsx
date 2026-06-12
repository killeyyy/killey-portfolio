import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { Flourish } from "../components/ui/Flourish.jsx";
import { Sheet } from "../components/ui/Sheet.jsx";
import { Chip } from "../components/ui/Chip.jsx";
import { Field, NumberStepper } from "../components/ui/Field.jsx";
import { TrackerCard } from "../components/tend/TrackerCard.jsx";
import { TrackerForm, PRESETS, trackerFromPreset } from "../components/tend/TrackerForm.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { COLOR_META } from "../data/defaults.js";
import { formatMinutes } from "../lib/format.js";
import { monthKeyOf, todayKey } from "../lib/dates.js";
import { categoryWeekMinutes, weekKeys } from "../lib/tend.js";
import { cn } from "../lib/cn.js";

/**
 * Tend — the little things cared for daily: custom trackers (water, sleep,
 * prayer, anything) plus this week's per-category intentions.
 */
export default function Tend() {
  const { settings, categories, months, ensureMonths, trackers, saveTrackers } = useStore();
  const today = todayKey();
  const weekStart = settings.weekStart ?? 1;
  const [form, setForm] = useState(null); // { tracker } | null
  const [intentionsOpen, setIntentionsOpen] = useState(false);

  // The intentions bars need this week's activity shards (week may span months).
  const wKeys = useMemo(() => weekKeys(today, weekStart), [today, weekStart]);
  useEffect(() => {
    ensureMonths([...new Set(wKeys.map(monthKeyOf))]);
  }, [ensureMonths, wKeys]);

  const active = trackers.filter((t) => !t.archivedAt);

  const saveTracker = (tracker) => {
    const exists = trackers.some((t) => t.id === tracker.id);
    saveTrackers(
      exists ? trackers.map((t) => (t.id === tracker.id ? tracker : t)) : [...trackers, tracker],
    );
    setForm(null);
  };

  const usedPresetNames = new Set(trackers.map((t) => t.name.toLowerCase()));
  const freshPresets = PRESETS.filter((p) => !usedPresetNames.has(p.name.toLowerCase()));

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Tend"
        sub="Little things, cared for daily"
        action={
          <button
            type="button"
            onClick={() => setForm({ tracker: null })}
            className="inline-flex items-center gap-1 rounded-xl bg-rose px-3 py-1.5 text-xs font-semibold text-ink active:scale-95"
          >
            <Plus size={14} aria-hidden="true" /> New
          </button>
        }
      />

      {active.length === 0 ? (
        <Tile>
          <div className="py-3 text-center">
            <Flourish />
            <p className="mx-auto max-w-xs text-sm text-muted">
              Some things aren't habits or hours — glasses of water, a night's sleep, a quiet
              prayer. Plant one and tend it a little each day.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {freshPresets.map((p) => (
                <Chip key={p.name} onClick={() => saveTrackers([...trackers, trackerFromPreset(p)])}>
                  {p.emoji} {p.name}
                </Chip>
              ))}
              <Chip onClick={() => setForm({ tracker: null })} className="border-dashed">
                Something else…
              </Chip>
            </div>
          </div>
        </Tile>
      ) : (
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {active.map((t) => (
            <TrackerCard key={t.id} tracker={t} onEdit={() => setForm({ tracker: t })} />
          ))}
        </div>
      )}

      {active.length > 0 && freshPresets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-muted">Plant another:</span>
          {freshPresets.map((p) => (
            <Chip
              key={p.name}
              onClick={() => saveTrackers([...trackers, trackerFromPreset(p)])}
              className="px-2.5 py-1.5 text-xs"
            >
              {p.emoji} {p.name}
            </Chip>
          ))}
        </div>
      )}

      <IntentionsTile
        categories={categories}
        months={months}
        today={today}
        weekStart={weekStart}
        onEdit={() => setIntentionsOpen(true)}
      />

      {form && (
        <TrackerForm tracker={form.tracker} onClose={() => setForm(null)} onSave={saveTracker} />
      )}
      {intentionsOpen && <IntentionsSheet onClose={() => setIntentionsOpen(false)} />}
    </div>
  );
}

/** This week's per-category minutes vs each category's weekly intention. */
function IntentionsTile({ categories, months, today, weekStart, onEdit }) {
  const weekMin = useMemo(
    () => categoryWeekMinutes(months, today, weekStart),
    [months, today, weekStart],
  );
  const withTargets = categories.filter((c) => !c.archived && (c.weeklyTarget || 0) > 0);

  return (
    <Tile
      title="This week's intentions"
      action={
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit intentions"
          className="rounded-lg p-1.5 text-muted hover:text-cream"
        >
          <Pencil size={14} />
        </button>
      }
    >
      {withTargets.length === 0 ? (
        <p className="text-sm text-muted">
          Give a category a weekly intention — "6h of study this week" — and watch it grow here.
          No deadlines, just direction.
        </p>
      ) : (
        <ul className="space-y-3">
          {withTargets.map((c) => {
            const done = weekMin[c.id] || 0;
            const met = done >= c.weeklyTarget;
            const hex = COLOR_META[c.color]?.hex || "#E25C72";
            return (
              <li key={c.id}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-cream">
                    <span
                      className={cn("h-2 w-2 rounded-full", COLOR_META[c.color]?.dot)}
                      aria-hidden="true"
                    />
                    {c.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      met ? "font-semibold text-mint" : "text-muted",
                    )}
                  >
                    {formatMinutes(done)} of {formatMinutes(c.weeklyTarget)}
                    {met && " · in bloom 🌿"}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(100, (done / c.weeklyTarget) * 100)}%`,
                      backgroundColor: met ? "#7ED4B2" : hex,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Tile>
  );
}

/** Set a weekly minutes intention per category (0 = off). */
function IntentionsSheet({ onClose }) {
  const { categories, saveCategories } = useStore();
  const activeCats = categories.filter((c) => !c.archived);

  const setTarget = (id, weeklyTarget) =>
    saveCategories(categories.map((c) => (c.id === id ? { ...c, weeklyTarget } : c)));

  return (
    <Sheet open onClose={onClose} title="Weekly intentions">
      <p className="mb-4 text-xs text-muted">
        A gentle weekly aim per category. Set one to 0 to let it rest.
      </p>
      <div className="space-y-4">
        {activeCats.map((c) => (
          <Field key={c.id} label={c.label}>
            <NumberStepper
              value={c.weeklyTarget || 0}
              onChange={(v) => setTarget(c.id, v)}
              step={30}
              min={0}
              max={4200}
              format={(v) => (v ? formatMinutes(v) : "off")}
            />
          </Field>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95"
        >
          Done
        </button>
      </div>
    </Sheet>
  );
}
