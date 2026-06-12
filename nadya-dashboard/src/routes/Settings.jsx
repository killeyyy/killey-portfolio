import { useMemo, useRef, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download, Plus, Upload } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { Sheet } from "../components/ui/Sheet.jsx";
import { Chip } from "../components/ui/Chip.jsx";
import { Field, TextInput, Select, NumberStepper } from "../components/ui/Field.jsx";
import { formatMinutes } from "../lib/format.js";
import { useToast } from "../components/ui/Toast.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { COLOR_META, COLOR_NAMES, CURRENCIES } from "../data/defaults.js";
import { THEMES } from "../data/themes.js";
import { applyImport, downloadExport, parseImport } from "../lib/backup.js";
import { uid } from "../lib/uid.js";
import { cn } from "../lib/cn.js";

const APP_VERSION = "2.0.0"; // Era 2: 3D, accounts + sync, Money, Tend, wishes
const NUDGE_AFTER_DAYS = 14;

// Lazy: keeps all auth/cloud code out of the main bundle until Settings shows.
const AccountTile = lazy(() => import("../components/cloud/AccountTile.jsx"));

export default function Settings() {
  const { settings, updateSettings, categories, saveCategories, meta, patchMeta } = useStore();
  const toast = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState(settings.name);
  const [petName, setPetName] = useState(settings.petName ?? "");
  const [catSheet, setCatSheet] = useState(null); // { category } | { category: null }

  const backupAgeDays = useMemo(() => {
    const since = meta.lastBackupAt || meta.createdAt || Date.now();
    return Math.floor((Date.now() - since) / 86400000);
  }, [meta]);

  const onImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const payload = parseImport(await file.text());
      const ok = window.confirm(
        "Replace everything on this device with this backup? This can't be undone.",
      );
      if (!ok) return;
      applyImport(payload);
      window.location.reload();
    } catch (err) {
      toast.show(err.message || "Import failed.");
    }
  };

  const saveCategory = (category) => {
    const exists = categories.some((c) => c.id === category.id);
    saveCategories(
      exists ? categories.map((c) => (c.id === category.id ? category : c)) : [...categories, category],
    );
    setCatSheet(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" back action={null} />

      {backupAgeDays > NUDGE_AFTER_DAYS && (
        <div className="rounded-2xl border border-sand/40 bg-sand/10 px-4 py-3 text-sm text-sand">
          {meta.lastBackupAt
            ? `Last backup ${backupAgeDays} days ago — export a fresh one below.`
            : "No backup yet — export one below so your data is safe."}
        </div>
      )}

      <Tile title="You">
        <div className="space-y-3">
          <Field label="Name">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => name.trim() && updateSettings({ name: name.trim() })}
              maxLength={30}
            />
          </Field>
          <Field label="Currency">
            <Select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
            />
          </Field>
          <Field label="Week starts on">
            <Select
              value={String(settings.weekStart)}
              onChange={(e) => updateSettings({ weekStart: Number(e.target.value) })}
              options={[
                { value: "1", label: "Monday" },
                { value: "0", label: "Sunday" },
              ]}
            />
          </Field>
          <Field label="Daily productive goal" hint="Drives the rose ring on Today.">
            <NumberStepper
              value={settings.dailyTarget ?? 180}
              onChange={(v) => updateSettings({ dailyTarget: v })}
              step={15}
              min={30}
              max={720}
              format={formatMinutes}
            />
          </Field>
          <Field label="Your plant's name" hint="The little companion growing on Journey.">
            <TextInput
              value={petName}
              placeholder="Name your plant"
              onChange={(e) => setPetName(e.target.value)}
              onBlur={() => updateSettings({ petName: petName.trim() })}
              maxLength={20}
            />
          </Field>
        </div>
      </Tile>

      <Tile title="Mood" action={<span className="text-xs text-muted">colours + how the air moves</span>}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => updateSettings({ theme: t.id })}
              aria-pressed={(settings.theme ?? "rose") === t.id}
              className={cn(
                "rounded-2xl border p-3 text-left transition duration-150 ease-out",
                (settings.theme ?? "rose") === t.id
                  ? "border-rose bg-rose/10"
                  : "border-line bg-surface2",
              )}
              style={{ backgroundColor: t.preview[0] }}
            >
              <span className="flex gap-1.5" aria-hidden="true">
                {t.preview.slice(1).map((hex) => (
                  <span key={hex} className="h-4 w-4 rounded-full" style={{ backgroundColor: hex }} />
                ))}
              </span>
              <span className="mt-2 block text-sm font-semibold text-cream">{t.label}</span>
              <span className="block text-[11px] text-muted">{t.tagline}</span>
            </button>
          ))}
        </div>
      </Tile>

      <Tile
        title="Categories"
        action={
          <button
            type="button"
            onClick={() => setCatSheet({ category: null })}
            className="inline-flex items-center gap-1 rounded-xl bg-rose px-3 py-1.5 text-xs font-semibold text-ink active:scale-95"
          >
            <Plus size={14} aria-hidden="true" /> Add
          </button>
        }
      >
        <ul className="divide-y divide-line/60">
          {categories
            .filter((c) => !c.archived)
            .map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCatSheet({ category: c })}
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <span
                    className={cn("h-2.5 w-2.5 shrink-0 rounded-full", COLOR_META[c.color]?.dot)}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-cream">{c.label}</span>
                  {c.productive && (
                    <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-semibold text-mint">
                      productive
                    </span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </Tile>

      <Tile>
        <Link to="/habits" viewTransition className="flex items-center justify-between text-sm font-medium text-cream">
          Manage habits
          <ChevronRight size={16} className="text-muted" aria-hidden="true" />
        </Link>
      </Tile>

      <Tile title="Backup">
        <p className="mb-3 text-xs text-muted">
          Everything lives on this phone. Export a backup now and then (and after big months) —
          it's the only copy.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              downloadExport();
              patchMeta({ lastBackupAt: Date.now() });
              toast.show("Backup downloaded ✓");
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95"
          >
            <Download size={15} aria-hidden="true" /> Export
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-sm font-semibold text-cream active:scale-95"
          >
            <Upload size={15} aria-hidden="true" /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={onImportFile}
            className="hidden"
          />
        </div>
      </Tile>

      <Suspense fallback={null}>
        <AccountTile />
      </Suspense>

      <Tile title="Evening reminder">
        <p className="mb-3 text-xs text-muted">
          A soft nudge inside the app when you open it in the evening and tonight's page is
          still blank. No notifications, nothing leaves your phone.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 0, label: "Off" },
            { value: 19, label: "7 pm" },
            { value: 20, label: "8 pm" },
            { value: 21, label: "9 pm" },
            { value: 22, label: "10 pm" },
          ].map((o) => (
            <Chip
              key={o.value}
              selected={(settings.nudgeHour || 0) === o.value}
              onClick={() => updateSettings({ nudgeHour: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </Tile>

      <p className="px-1 text-center text-xs text-muted">
        Tip: open the browser menu and <span className="font-semibold">Add to Home Screen</span> —
        it feels like a real app and keeps your data safer.
        <br />
        Petalfall v{APP_VERSION}
      </p>

      {catSheet && (
        <CategorySheet
          category={catSheet.category}
          onClose={() => setCatSheet(null)}
          onSave={saveCategory}
        />
      )}
    </div>
  );
}

function CategorySheet({ category, onClose, onSave }) {
  const [label, setLabel] = useState(category?.label || "");
  const [color, setColor] = useState(category?.color || "rose");
  const [productive, setProductive] = useState(category?.productive || false);

  return (
    <Sheet open onClose={onClose} title={category ? "Edit category" : "New category"}>
      <div className="space-y-4">
        <Field label="Name">
          <TextInput
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={30}
            autoFocus={!category}
          />
        </Field>
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
        <Chip selected={productive} onClick={() => setProductive((v) => !v)} className="w-full justify-center">
          Counts as productive time
        </Chip>
        <div className="flex gap-2 pt-1">
          {category && (
            <button
              type="button"
              onClick={() => onSave({ ...category, archived: true })}
              className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted active:scale-95"
            >
              Archive
            </button>
          )}
          <button
            type="button"
            disabled={!label.trim()}
            onClick={() =>
              onSave({
                id: category?.id || uid(),
                label: label.trim(),
                color,
                productive,
                archived: category?.archived || false,
              })
            }
            className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </Sheet>
  );
}
