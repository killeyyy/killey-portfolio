import { useState } from "react";
import { Chip } from "../ui/Chip.jsx";
import { TextInput, NumberStepper, Field } from "../ui/Field.jsx";
import { StreakPet } from "../journey/StreakPet.jsx";
import { useStore } from "../../store/StoreProvider.jsx";
import { formatMinutes } from "../../lib/format.js";
import { confettiBurst } from "../../lib/confetti.js";
import { SEED_PACKETS } from "../../data/packs.js";
import { planPacket } from "../../lib/seeds.js";
import { cn } from "../../lib/cn.js";

/** 3-step first-run welcome: name → rhythm → seed packets. */
export function Onboarding({ onDone }) {
  const { settings, updateSettings, categories, saveCategories, saveHabits, saveTrackers } =
    useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings.name);
  const [weekStart, setWeekStart] = useState(settings.weekStart);
  const [target, setTarget] = useState(settings.dailyTarget ?? 180);
  const [picked, setPicked] = useState(() => new Set(["soft-mornings"]));

  const finish = () => {
    updateSettings({ name: name.trim(), weekStart, dailyTarget: target });
    // Plant the chosen packets sequentially — planPacket dedupes against what
    // earlier packets already planted (shared items like "Stretch 5 minutes").
    let habits = [];
    let trackers = [];
    let cats = categories;
    for (const packet of SEED_PACKETS.filter((p) => picked.has(p.id))) {
      const plan = planPacket(packet, { habits, trackers, categories: cats });
      habits = [...habits, ...plan.newHabits];
      trackers = [...trackers, ...plan.newTrackers];
      if (plan.catPatches.length) {
        cats = cats.map((c) => {
          const patch = plan.catPatches.find((x) => x.id === c.id);
          return patch ? { ...c, weeklyTarget: patch.weeklyTarget } : c;
        });
      }
    }
    if (habits.length) saveHabits(habits);
    if (trackers.length) saveTrackers(trackers);
    if (cats !== categories) saveCategories(cats);
    confettiBurst();
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 25%, rgba(226,92,114,0.16), transparent 65%)" }}
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))]">
        <div className="flex justify-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300",
                s === step ? "w-6 bg-rose" : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div key={0} className="flex flex-1 animate-fade-up flex-col items-center justify-center text-center">
            <StreakPet streak={0} size={130} />
            <h1 className="mt-4 font-serif text-3xl font-bold text-cream">
              Welcome <span className="text-gradient-warm">🌹</span>
            </h1>
            <p className="mt-2 text-sm text-muted">
              This is your space — for your days, your habits, your little wins. Everything stays on
              this phone, just for you.
            </p>
            <div className="mt-6 w-full">
              <Field label="What should we call you?">
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={30}
                  className="text-center"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div key={1} className="flex flex-1 animate-fade-up flex-col justify-center">
            <h1 className="text-center font-serif text-2xl font-bold text-cream">Your rhythm</h1>
            <p className="mt-1 text-center text-sm text-muted">You can change all of this later.</p>
            <div className="mt-8 space-y-6">
              <Field label="My week starts on">
                <div className="flex gap-2">
                  <Chip selected={weekStart === 1} onClick={() => setWeekStart(1)} className="flex-1 justify-center">
                    Monday
                  </Chip>
                  <Chip selected={weekStart === 0} onClick={() => setWeekStart(0)} className="flex-1 justify-center">
                    Sunday
                  </Chip>
                </div>
              </Field>
              <Field label="A good day of focused time is" hint="This sets the rose ring on Today — gentle, not strict.">
                <div className="flex justify-center">
                  <NumberStepper value={target} onChange={setTarget} step={30} min={30} max={720} format={formatMinutes} />
                </div>
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div key={2} className="flex flex-1 animate-fade-up flex-col justify-center">
            <h1 className="text-center font-serif text-2xl font-bold text-cream">
              Plant a seed packet 🌱
            </h1>
            <p className="mt-1 text-center text-sm text-muted">
              Whole little routines — habits, trackers, gentle aims. Pick any, or none; your
              plant grows either way.
            </p>
            <div className="mt-6 grid max-h-[46vh] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
              {SEED_PACKETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={picked.has(p.id)}
                  onClick={() =>
                    setPicked((prev) => {
                      const next = new Set(prev);
                      next.has(p.id) ? next.delete(p.id) : next.add(p.id);
                      return next;
                    })
                  }
                  className={cn(
                    "rounded-2xl border p-3 text-left transition duration-150 ease-out active:scale-[0.98]",
                    picked.has(p.id) ? "border-rose bg-rose/10" : "border-line bg-surface2",
                  )}
                >
                  <span className="block text-sm font-semibold text-cream">
                    {p.emoji} {p.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{p.tagline}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-wide text-muted/80">
                    {p.items.length} seeds
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 mt-6 space-y-2">
          <button
            type="button"
            onClick={() => (step < 2 ? setStep(step + 1) : finish())}
            className="glow-rose w-full rounded-xl bg-gradient-to-r from-rose to-coral py-3 text-sm font-bold text-ink active:scale-95"
          >
            {step === 0 ? "Begin" : step === 1 ? "Next" : "Let's bloom 🌹"}
          </button>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="w-full py-2 text-sm font-semibold text-muted">
              Back
            </button>
          ) : (
            <button type="button" onClick={finish} className="w-full py-2 text-sm font-semibold text-muted">
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
