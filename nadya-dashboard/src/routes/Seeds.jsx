import { useMemo } from "react";
import { Check, Sprout } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { useStore } from "../store/StoreProvider.jsx";
import { SEED_PACKETS, PROMPT_PACKS } from "../data/packs.js";
import { planPacket } from "../lib/seeds.js";
import { COLOR_META } from "../data/defaults.js";
import { formatMinutes } from "../lib/format.js";
import { buzz } from "../lib/celebrate.js";
import { cn } from "../lib/cn.js";

/**
 * Seed packets — preview a bundle, plant it in two taps. Planting only adds
 * what isn't already growing; nothing is ever duplicated or overwritten.
 */
export default function Seeds() {
  const {
    settings, updateSettings, categories, saveCategories,
    habits, saveHabits, trackers, saveTrackers,
  } = useStore();
  const toast = useToast();

  const plant = (packet) => {
    const plan = planPacket(packet, { habits, trackers, categories });
    if (!plan.planted) {
      toast.show("Already growing — everything in this packet is planted 🌿");
      return;
    }
    if (plan.newHabits.length) saveHabits([...habits, ...plan.newHabits]);
    if (plan.newTrackers.length) saveTrackers([...trackers, ...plan.newTrackers]);
    if (plan.catPatches.length) {
      saveCategories(
        categories.map((c) => {
          const p = plan.catPatches.find((x) => x.id === c.id);
          return p ? { ...c, weeklyTarget: p.weeklyTarget } : c;
        }),
      );
    }
    buzz();
    toast.show(
      `Planted ${plan.planted} seed${plan.planted === 1 ? "" : "s"} 🌱` +
        (plan.skipped ? ` (${plan.skipped} already growing)` : ""),
    );
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader title="Seed packets" sub="Whole little routines, planted in two taps" back action={null} />

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {SEED_PACKETS.map((packet) => (
          <Packet
            key={packet.id}
            packet={packet}
            habits={habits}
            trackers={trackers}
            categories={categories}
            onPlant={() => plant(packet)}
          />
        ))}
      </div>

      <Tile title="Nightly prompts" action={<span className="text-xs text-muted">for the journal</span>}>
        <p className="-mt-1 mb-3 text-xs text-muted">
          Pick a voice and the journal asks you one small question each night. Same day, same
          question — answer it or ignore it, both are fine.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PROMPT_PACKS.map((pack) => {
            const inUse = settings.promptPack === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => updateSettings({ promptPack: inUse ? null : pack.id })}
                aria-pressed={inUse}
                className={cn(
                  "rounded-2xl border p-3 text-left transition duration-150 ease-out active:scale-[0.98]",
                  inUse ? "border-rose bg-rose/10" : "border-line bg-surface2",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-cream">
                    {pack.emoji} {pack.name}
                  </span>
                  {inUse && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-bright">
                      <Check size={12} aria-hidden="true" /> in use
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-xs italic text-muted">“{pack.prompts[0]}”</span>
              </button>
            );
          })}
        </div>
      </Tile>
    </div>
  );
}

function Packet({ packet, habits, trackers, categories, onPlant }) {
  const plan = useMemo(
    () => planPacket(packet, { habits, trackers, categories }),
    [packet, habits, trackers, categories],
  );
  const allGrowing = plan.planted === 0;

  return (
    <Tile>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-cream">
            {packet.emoji} {packet.name}
          </p>
          <p className="text-xs text-muted">{packet.tagline}</p>
        </div>
        <button
          type="button"
          onClick={onPlant}
          disabled={allGrowing}
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold active:scale-95",
            allGrowing ? "border border-mint/40 text-mint" : "bg-rose text-ink",
          )}
        >
          {allGrowing ? (
            <>
              <Check size={13} aria-hidden="true" /> Growing
            </>
          ) : (
            <>
              <Sprout size={13} aria-hidden="true" /> Plant
            </>
          )}
        </button>
      </div>
      <ul className="mt-3 space-y-1.5">
        {packet.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted">
            <span
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", COLOR_META[item.color]?.dot || "bg-sand")}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-cream/90">
              {item.emoji} {item.kind === "intention" ? `${item.label} time` : item.name}
            </span>
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted/80">
              {item.kind === "habit" && "habit"}
              {item.kind === "tracker" && "tracker"}
              {item.kind === "intention" && `${formatMinutes(item.minutes)} / week`}
            </span>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
