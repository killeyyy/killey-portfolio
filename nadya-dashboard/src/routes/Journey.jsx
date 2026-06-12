import { Suspense, lazy, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clapperboard, Flame, Lock, Star } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { CountUp } from "../components/ui/CountUp.jsx";
import { StreakPet, petCopy, petStage } from "../components/journey/StreakPet.jsx";
import { Garden } from "../components/journey/Garden.jsx";
import { Wishes } from "../components/journey/Wishes.jsx";
import { Hero3D } from "../components/fx/Hero3D.jsx";
import { cn } from "../lib/cn.js";
import { useStore } from "../store/StoreProvider.jsx";
import { computeJourney, weeklyGarden } from "../lib/journey.js";
import { addDays, parseKey } from "../lib/dates.js";

// The 3D meadow rides the same lazy ogl chunk as the ambient; the SVG
// meadow renders while it loads and stays for reduced-motion / no-WebGL.
const Garden3D = lazy(() => import("../components/journey/Garden3D.jsx"));

function weekLabel(start) {
  const fmt = (k) => parseKey(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(addDays(start, 6))}`;
}

export default function Journey() {
  const { settings, categories, months, habits, habitLog, journal, savings } = useStore();
  const journey = useMemo(
    () =>
      computeJourney({
        habits, habitLog, journal, savings,
        dailyTarget: settings.dailyTarget ?? 180,
        categories,
      }),
    // `months` is the reactive signal that activity data changed.
    [habits, habitLog, journal, savings, settings.dailyTarget, categories, months],
  );
  const garden = useMemo(
    () =>
      weeklyGarden({
        habits, habitLog, journal, categories,
        weekStart: settings.weekStart,
      }),
    [habits, habitLog, journal, categories, settings.weekStart, months],
  );
  const bloomed = garden.filter((p) => p.stars > 0).length;
  const pct = Math.round(
    ((journey.xp - journey.levelFloor) / (journey.nextFloor - journey.levelFloor)) * 100,
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader title="Journey" sub={`Level ${journey.levelIndex + 1} — ${journey.levelName}`} />

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        <div className="space-y-4 lg:space-y-6">
          {/* The pet — floats out of the card on its own Z plane */}
          <Hero3D className="animate-fade-up">
            <div className="flex items-center gap-4 [transform-style:preserve-3d]">
              <div className="[transform:translateZ(44px)]">
                <StreakPet streak={journey.streak} size={150} />
              </div>
              <div className="min-w-0 flex-1 [transform:translateZ(18px)]">
                <p className="font-serif text-xl font-bold text-cream">{settings.petName || "Your plant"}</p>
                {journey.streak > 0 && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-coral">
                    <Flame size={15} aria-hidden="true" />
                    <CountUp value={journey.streak} className="tabular-nums" /> day
                    {journey.streak === 1 ? "" : "s"} showing up
                  </p>
                )}
                <p className="mt-2 text-sm text-muted">{petCopy(petStage(journey.streak), settings.petName || "your plant")}</p>
              </div>
            </div>
          </Hero3D>

          {/* Level + XP */}
          <Hero3D max={4}>
            <h2 className="mb-3 font-serif text-base font-bold text-cream">
              Level {journey.levelIndex + 1} — {journey.levelName}
            </h2>
            <div className="mb-2 flex items-end justify-between [transform-style:preserve-3d]">
              <p className="font-serif text-3xl font-bold [transform:translateZ(30px)]">
                <CountUp value={journey.xp} className="text-gradient-warm tabular-nums" />
                <span className="ml-1 text-base text-muted">XP</span>
              </p>
              <p className="text-xs tabular-nums text-muted">
                {journey.nextFloor - journey.xp} XP to {journey.nextName}
              </p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5" aria-hidden="true">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-soft"
                style={{
                  width: `${Math.max(3, pct)}%`,
                  backgroundImage: "linear-gradient(90deg, #E25C72, #F2876B)",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Everything you've ever logged counts — activities, habits, journal, savings.
            </p>
          </Hero3D>

          {/* Garden wishes — gentle weekly quests */}
          <Wishes />

          <Link
            to="/wrapped"
            viewTransition
            className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-medium text-cream transition-colors duration-150 hover:border-rose/40 [view-transition-name:wrapped]"
          >
            <span className="flex items-center gap-3">
              <Clapperboard size={18} className="text-rose-bright" aria-hidden="true" />
              Last week, wrapped
            </span>
            <span className="text-xs text-muted">the story →</span>
          </Link>

          {/* Achievements */}
          <Tile title={`Achievements · ${journey.earnedCount}/${journey.achievements.length}`}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {journey.achievements.map((a) => (
                <div
                  key={a.id}
                  title={a.desc}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center",
                    a.earned ? "border-rose/40 bg-rose/10" : "border-line bg-surface2 opacity-50",
                  )}
                >
                  {!a.earned && (
                    <Lock size={10} className="absolute right-1.5 top-1.5 text-muted" aria-hidden="true" />
                  )}
                  <span className={cn("text-2xl", !a.earned && "grayscale")}>{a.emoji}</span>
                  <span className="text-[10px] font-semibold leading-tight text-cream">{a.title}</span>
                  <span className="text-[9px] leading-tight text-muted">{a.desc}</span>
                </div>
              ))}
            </div>
          </Tile>
        </div>

        <div className="space-y-4 lg:space-y-6">
        {/* Mawar's Garden — every recorded week, planted */}
        {garden.length > 0 && (
          <Tile title={settings.petName ? `${settings.petName}'s garden` : "Your garden"}>
            <p className="-mt-1 mb-3 text-xs text-muted">
              Every week you finish plants something — quiet weeks grow a sprout,
              full weeks bloom. {bloomed} of {garden.length} week
              {garden.length === 1 ? "" : "s"} in flower so far.
            </p>
            <Suspense fallback={<Garden plots={garden} />}>
              <Garden3D plots={garden} />
            </Suspense>
          </Tile>
        )}

        {/* Weekly star path */}
        <Tile title="Your path">
          <p className="mb-4 -mt-1 text-xs text-muted">
            One step per week — stars for logging, habits and journaling.
          </p>
          <ol className="relative space-y-3">
            <span className="absolute bottom-4 left-[18px] top-4 w-px bg-line" aria-hidden="true" />
            {[...journey.weeks].reverse().map((w, i) => (
              <li
                key={w.start}
                className={cn("relative flex items-center gap-3", i % 2 === 1 && "sm:ml-6")}
              >
                <span
                  className={cn(
                    "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-bold",
                    w.stars === 3
                      ? "border-rose bg-rose text-ink"
                      : w.stars > 0
                        ? "border-rose/50 bg-rose/15 text-rose-bright"
                        : "border-line bg-surface2 text-muted",
                  )}
                >
                  {w.isCurrent ? "•" : w.stars}
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-line/60 bg-surface2/60 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-cream">
                      {w.isCurrent ? "This week" : weekLabel(w.start)}
                    </p>
                    <span className="flex gap-0.5" aria-label={`${w.stars} of 3 stars`}>
                      {[0, 1, 2].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s < w.stars ? "fill-sand text-sand" : "text-line"}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {w.loggedDays}d logged · {w.tickDays}d habits · {w.journaled}d journaled
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Tile>
        </div>
      </div>
    </div>
  );
}
