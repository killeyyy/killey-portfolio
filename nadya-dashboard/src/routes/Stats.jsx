import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Segmented } from "../components/ui/Segmented.jsx";
import { Tile } from "../components/ui/Tile.jsx";
import { StackedBars } from "../components/charts/StackedBars.jsx";
import { Donut } from "../components/charts/Donut.jsx";
import { TrendLine } from "../components/charts/TrendLine.jsx";
import { Ring } from "../components/charts/Ring.jsx";
import { YearHeatmap } from "../components/charts/YearHeatmap.jsx";
import { TimeOfDay } from "../components/stats/TimeOfDay.jsx";
import { MoodLinks } from "../components/stats/MoodLinks.jsx";
import { MonthRecap } from "../components/stats/MonthRecap.jsx";
import { Hero3D } from "../components/fx/Hero3D.jsx";
import { TagTimes } from "../components/stats/TagTimes.jsx";
import { tagMinutes } from "../lib/tend.js";
import { useStore } from "../store/StoreProvider.jsx";
import { COLOR_META } from "../data/defaults.js";
import { cn } from "../lib/cn.js";
import {
  addDays, addMonths, monthDayKeys, monthKey, monthKeyOf, parseKey, rangeKeys,
  todayKey, weekStartKey,
} from "../lib/dates.js";
import { formatDayLabel, formatMinutes, formatMonthLabel } from "../lib/format.js";
import {
  buildInsights, categoryShare, dailyTotals, habitAdherence, habitStreaks,
  moodPoints, periodTotals, productiveShare, savingsForMonth, weekdayProfile,
} from "../lib/insights.js";
import { MOODS } from "../components/today/JournalCard.jsx";
import { monthRecap, moodHabitLinks, timeOfDay } from "../lib/correlations.js";

function weekLabel(startKey) {
  const fmt = (k) => parseKey(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(startKey)} – ${fmt(addDays(startKey, 6))}`;
}

/** Signed minutes delta pill text: +45m / −30m. */
function deltaLabel(delta) {
  if (!delta) return null;
  return `${delta > 0 ? "+" : "−"}${formatMinutes(Math.abs(delta))}`;
}

export default function Stats() {
  const { settings, categories, months, ensureMonths, habits, habitLog, savings, journal,
    trackers, trackerLog } = useStore();
  const today = todayKey();
  const [mode, setMode] = useState("week");
  const [weekAnchor, setWeekAnchor] = useState(() => weekStartKey(todayKey(), settings.weekStart));
  const [monthAnchor, setMonthAnchor] = useState(() => monthKey());
  const [selectedDay, setSelectedDay] = useState(null);

  const isWeek = mode === "week";
  const dayKeys = useMemo(
    () => (isWeek ? rangeKeys(weekAnchor, addDays(weekAnchor, 6)) : monthDayKeys(monthAnchor)),
    [isWeek, weekAnchor, monthAnchor],
  );
  const prevDayKeys = useMemo(
    () =>
      isWeek
        ? rangeKeys(addDays(weekAnchor, -7), addDays(weekAnchor, -1))
        : monthDayKeys(addMonths(monthAnchor, -1)),
    [isWeek, weekAnchor, monthAnchor],
  );
  // Trend window: 8 weeks of days (week mode) or 6 months (month mode).
  const trendDayKeys = useMemo(() => {
    if (isWeek) return rangeKeys(addDays(weekAnchor, -49), addDays(weekAnchor, 6));
    return monthDayKeys(addMonths(monthAnchor, -5)).concat(
      ...[-4, -3, -2, -1, 0].map((n) => monthDayKeys(addMonths(monthAnchor, n))),
    );
  }, [isWeek, weekAnchor, monthAnchor]);

  // Month view also shows the trailing-year heatmap.
  const yearDayKeys = useMemo(
    () => (isWeek ? [] : rangeKeys(weekStartKey(addDays(today, -364), settings.weekStart), today)),
    [isWeek, today, settings.weekStart],
  );

  useEffect(() => {
    const keys = new Set([...dayKeys, ...prevDayKeys, ...trendDayKeys, ...yearDayKeys].map(monthKeyOf));
    ensureMonths([...keys]);
  }, [dayKeys, prevDayKeys, trendDayKeys, yearDayKeys, ensureMonths]);

  const days = useMemo(() => dailyTotals(months, dayKeys, categories), [months, dayKeys, categories]);
  const prevDays = useMemo(
    () => dailyTotals(months, prevDayKeys, categories),
    [months, prevDayKeys, categories],
  );
  const totals = useMemo(() => periodTotals(days), [days]);
  const prevTotals = useMemo(() => periodTotals(prevDays), [prevDays]);
  const share = productiveShare(totals);
  const prevShare = productiveShare(prevTotals);
  const slices = useMemo(
    () => categoryShare(totals.byCategory, categories, totals.total),
    [totals, categories],
  );

  // "Watch this": the non-productive category that grew the most vs last period.
  const watchId = useMemo(() => {
    let best = null;
    for (const s of slices) {
      if (s.category.productive) continue;
      const delta = s.minutes - (prevTotals.byCategory[s.category.id] || 0);
      if (delta > 0 && (!best || delta > best.delta)) best = { id: s.category.id, delta };
    }
    return best?.id || null;
  }, [slices, prevTotals]);

  // Trend: weekly productive minutes (8 points) or monthly productive share (6 points).
  const trend = useMemo(() => {
    if (isWeek) {
      const points = [];
      for (let w = -7; w <= 0; w++) {
        const start = addDays(weekAnchor, w * 7);
        const ds = dailyTotals(months, rangeKeys(start, addDays(start, 6)), categories);
        points.push(periodTotals(ds).productive);
      }
      return { points, caption: "Productive time per week, last 8 weeks" };
    }
    const points = [];
    for (let n = -5; n <= 0; n++) {
      const ds = dailyTotals(months, monthDayKeys(addMonths(monthAnchor, n)), categories);
      points.push(productiveShare(periodTotals(ds)) ?? 0);
    }
    return { points, caption: "Productive share per month, last 6 months" };
  }, [isWeek, weekAnchor, monthAnchor, months, categories]);

  const trendDays = useMemo(
    () => dailyTotals(months, trendDayKeys, categories),
    [months, trendDayKeys, categories],
  );
  const insights = useMemo(
    () =>
      buildInsights({
        trendDays, days, totals, prevTotals, habits, habitLog, journal, today,
        trackers, trackerLog,
      }),
    [trendDays, days, totals, prevTotals, habits, habitLog, journal, today, trackers, trackerLog],
  );
  const moods = useMemo(() => moodPoints(journal, dayKeys), [journal, dayKeys]);
  const weekdays = useMemo(
    () => weekdayProfile(trendDays, settings.weekStart),
    [trendDays, settings.weekStart],
  );
  // Richer stats (lib/correlations.js): time-of-day uses the visible period;
  // mood×habit links need the 8-week window for honest sample sizes.
  const dayProfile = useMemo(() => timeOfDay(months, dayKeys), [months, dayKeys]);
  const links = useMemo(
    () => moodHabitLinks({ habits, habitLog, journal, dayKeys: trendDayKeys }),
    [habits, habitLog, journal, trendDayKeys],
  );
  const moodDayCount = useMemo(
    () => trendDayKeys.filter((k) => journal[k]?.mood).length,
    [trendDayKeys, journal],
  );
  const recap = useMemo(
    () => monthRecap({ days, categories, habitLog, journal, today }),
    [days, categories, habitLog, journal, today],
  );
  const tagRows = useMemo(() => tagMinutes(months, dayKeys), [months, dayKeys]);

  const atCurrent = isWeek
    ? weekAnchor >= weekStartKey(today, settings.weekStart)
    : monthAnchor >= monthKey();
  const page = (dir) => {
    setSelectedDay(null);
    if (isWeek) setWeekAnchor((a) => addDays(a, dir * 7));
    else setMonthAnchor((a) => addMonths(a, dir));
  };

  const barDays = useMemo(
    () =>
      days.map((d) => ({
        key: d.key,
        label: formatDayLabel(d.key, { relative: false }).slice(0, 2),
        total: d.total,
        segments: slices
          .map((s) => ({
            hex: COLOR_META[s.category.color]?.hex || "#E25C72",
            minutes: d.byCategory[s.category.id] || 0,
          }))
          .filter((seg) => seg.minutes > 0),
      })),
    [days, slices],
  );

  const selected = selectedDay && days.find((d) => d.key === selectedDay);
  const activeHabits = habits.filter((h) => !h.archivedAt);
  const habitRows = activeHabits.map((h) => ({
    habit: h,
    adherence: habitAdherence(habitLog, h, dayKeys, today),
    streak: habitStreaks(habitLog, h.id, today),
  }));
  const overall = (() => {
    const eligible = habitRows.reduce((s, r) => s + r.adherence.eligible, 0);
    const ticked = habitRows.reduce((s, r) => s + r.adherence.ticked, 0);
    return eligible ? Math.round((ticked / eligible) * 100) : null;
  })();
  const monthSavings = savingsForMonth(savings, monthKey());

  const empty = totals.total === 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Stats" sub={isWeek ? weekLabel(weekAnchor) : formatMonthLabel(monthAnchor)} />

      <div className="flex items-center justify-between gap-2">
        <Segmented
          value={mode}
          onChange={(m) => {
            setMode(m);
            setSelectedDay(null);
            setWeekAnchor(weekStartKey(todayKey(), settings.weekStart));
            setMonthAnchor(monthKey());
          }}
          options={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => page(-1)}
            aria-label="Previous period"
            className="rounded-xl border border-line bg-surface2 p-2 text-muted active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atCurrent}
            aria-label="Next period"
            className="rounded-xl border border-line bg-surface2 p-2 text-muted active:scale-95 disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Tile>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Logged</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-cream">
            {formatMinutes(totals.total)}
          </p>
          {deltaLabel(totals.total - prevTotals.total) && (
            <p className="mt-0.5 text-xs tabular-nums text-muted">
              {deltaLabel(totals.total - prevTotals.total)} vs previous
            </p>
          )}
        </Tile>
        <Tile>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Productive</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-cream">
            {share === null ? "—" : `${share}%`}
          </p>
          {share !== null && prevShare !== null && share !== prevShare && (
            <p className="mt-0.5 text-xs tabular-nums text-muted">
              {share > prevShare ? "+" : "−"}
              {Math.abs(share - prevShare)}% vs previous
            </p>
          )}
        </Tile>
      </div>

      {insights.length > 0 && (
        <Tile className="border-rose/25">
          <ul className="space-y-2">
            {insights.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-cream">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-sand" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </Tile>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
      <Tile title="Time per day">
        {empty ? (
          <EmptyNote />
        ) : (
          <>
            <StackedBars
              days={barDays}
              onSelect={(k) => setSelectedDay((s) => (s === k ? null : k))}
              selectedKey={selectedDay}
            />
            {selected && (
              <p className="mt-2 text-xs text-muted">
                <span className="font-semibold text-cream">{formatDayLabel(selected.key)}</span> —{" "}
                {formatMinutes(selected.total)}
                {selected.total > 0 &&
                  " · " +
                    Object.entries(selected.byCategory)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(
                        ([id, min]) =>
                          `${categories.find((c) => c.id === id)?.label || "?"} ${formatMinutes(min)}`,
                      )
                      .join(", ")}
              </p>
            )}
          </>
        )}
      </Tile>

      <Hero3D max={4}>
        <h2 className="mb-3 font-serif text-base font-bold text-cream">Where time went</h2>
        {empty ? (
          <EmptyNote />
        ) : (
          <div className="flex items-center gap-4 [transform-style:preserve-3d]">
            <div className="[transform:translateZ(36px)]">
              <Donut
                slices={slices.map((s) => ({
                  hex: COLOR_META[s.category.color]?.hex || "#E25C72",
                  value: s.minutes,
                }))}
                size={132}
                thickness={14}
                glow
                centerLabel={formatMinutes(totals.total)}
                centerSub="total"
              />
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5 [transform:translateZ(16px)]">
              {slices.map((s) => {
                const delta = s.minutes - (prevTotals.byCategory[s.category.id] || 0);
                return (
                  <li key={s.category.id} className="flex items-center gap-2 text-xs">
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", COLOR_META[s.category.color]?.dot)}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-cream">{s.category.label}</span>
                    {watchId === s.category.id && (
                      <span className="flex items-center gap-0.5 rounded-full bg-coral/15 px-1.5 py-0.5 text-[10px] font-semibold text-coral">
                        <Eye size={10} aria-hidden="true" /> watch
                      </span>
                    )}
                    <span className="shrink-0 tabular-nums text-muted">
                      {formatMinutes(s.minutes)} · {s.pct}%
                      {deltaLabel(delta) && (
                        <span className={delta > 0 ? " text-coral" : " text-mint"}>
                          {" "}
                          {deltaLabel(delta)}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Hero3D>

      <Tile title="Productivity trend">
        {trend.points.every((p) => !p) ? (
          <EmptyNote />
        ) : (
          <>
            <TrendLine data={trend.points} height={56} className="text-rose-bright" />
            <p className="mt-1 text-xs text-muted">{trend.caption}</p>
          </>
        )}
      </Tile>

      <Tile title="Habit consistency">
        {habitRows.length === 0 ? (
          <p className="text-sm text-muted">
            No habits yet —{" "}
            <Link to="/habits" viewTransition className="font-semibold text-rose-bright">
              add one
            </Link>
            .
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <Ring value={overall ?? 0} size={96} className="text-mint" label={overall === null ? "—" : `${overall}%`} sub="kept" />
            <ul className="min-w-0 flex-1 space-y-2">
              {habitRows.map(({ habit, adherence, streak }) => (
                <li key={habit.id} className="flex items-center gap-2 text-xs">
                  <span className="min-w-0 flex-1 truncate text-cream">
                    {habit.emoji && <span className="mr-1">{habit.emoji}</span>}
                    {habit.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {adherence.pct === null ? "—" : `${adherence.pct}%`} · 🔥{streak.current}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Tile>

      <Tile title="Mood">
        {moods.length < 3 ? (
          <p className="text-sm text-muted">
            Tap a mood on the Today screen for a few days and your trend appears here.
          </p>
        ) : (
          <>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                {MOODS[Math.round(moods.reduce((a, b) => a + b, 0) / moods.length) - 1].emoji}
              </span>
              <span className="text-xs text-muted">
                average across {moods.length} day{moods.length === 1 ? "" : "s"}
              </span>
            </div>
            <TrendLine data={moods} height={44} className="text-lavender" />
          </>
        )}
      </Tile>

      <MoodLinks links={links} moodDayCount={moodDayCount} />

      <Tile title="Your rhythm">
        <div className="flex items-end gap-2" style={{ height: 96 }} aria-hidden="true">
          {weekdays.map((d, i) => {
            const max = Math.max(...weekdays.map((x) => x.avg), 1);
            return (
              <div key={d.label} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className="animate-rise rounded-t bg-rose/70"
                  style={{
                    height: `${(d.avg / max) * 100}%`,
                    animationDelay: `${i * 40}ms`,
                    transformOrigin: "bottom",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-1 flex gap-2">
          {weekdays.map((d) => (
            <span key={d.label} className="flex-1 text-center text-[10px] text-muted">
              {d.label}
            </span>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">Average time logged per weekday</p>
      </Tile>

      <TimeOfDay profile={dayProfile} />

      <TagTimes rows={tagRows} />

      {!isWeek && <MonthRecap recap={recap} />}

      {!isWeek && (
        <Tile title="Your year" className="lg:col-span-2">
          <YearHeatmap
            values={dailyTotals(months, yearDayKeys, categories).map((d) => d.total)}
          />
          <p className="mt-1.5 text-xs text-muted">
            Every day you've logged, the last 12 months — darker rose = fuller day.
          </p>
        </Tile>
      )}

      <Tile title="Savings this month">
        <Link to="/savings" viewTransition className="flex items-center gap-4">
          <Ring
            value={monthSavings.goal ? Math.min(100, (monthSavings.saved / monthSavings.goal) * 100) : 0}
            size={84}
            className="text-sand"
          />
          <span className="text-sm text-muted">
            {monthSavings.goal
              ? "Tap to see goal, entries and history."
              : "No goal set yet — tap to set one."}
          </span>
        </Link>
      </Tile>
      </div>
    </div>
  );
}

function EmptyNote() {
  return <p className="text-sm text-muted">Nothing logged in this period yet.</p>;
}
