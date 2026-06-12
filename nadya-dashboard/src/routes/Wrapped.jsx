import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, X } from "lucide-react";
import { useStore } from "../store/StoreProvider.jsx";
import { useReducedMotion } from "../lib/useReducedMotion.js";
import { computeWrapped, weeklyPersona, funEquivalent } from "../lib/wrapped.js";
import { sharePoster } from "../lib/poster.js";
import { formatDayLabel, formatMinutes, formatMoney } from "../lib/format.js";
import { parseKey } from "../lib/dates.js";
import { MOODS } from "../components/today/JournalCard.jsx";
import { cn } from "../lib/cn.js";

const CARD_MS = 7000;

// One accent per card (research: one giant stat on flat color, alternating).
const ACCENTS = [
  { text: "text-rose-bright", hex: "#F78DA3", tint: "rgba(226,92,114,0.16)" },
  { text: "text-coral", hex: "#F2876B", tint: "rgba(242,135,107,0.14)" },
  { text: "text-lavender", hex: "#B49CE8", tint: "rgba(180,156,232,0.14)" },
  { text: "text-mint", hex: "#7ED4B2", tint: "rgba(126,212,178,0.12)" },
  { text: "text-sand", hex: "#DDBC8E", tint: "rgba(221,188,142,0.14)" },
];

/* Two-beat card: setup line arrives, payoff lands ~800ms later. */
function Setup({ children }) {
  return <p className="animate-fade-up font-serif text-xl font-semibold text-cream/90">{children}</p>;
}
function Payoff({ children, className, delay = 800 }) {
  return (
    <div className={cn("animate-fade-up", className)} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
function Big({ children, className }) {
  return (
    <p className={cn("font-serif text-6xl font-bold leading-tight sm:text-7xl", className)}>
      {children}
    </p>
  );
}
function Sub({ children, delay = 1200 }) {
  return (
    <p className="animate-fade-up mt-3 text-sm text-muted" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </p>
  );
}

const fmtShort = (k) => parseKey(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export default function Wrapped() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { settings, categories, habits, habitLog, journal, savings, months } = useStore();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef(null);

  const w = useMemo(
    () =>
      computeWrapped({
        categories, habits, habitLog, journal, savings,
        weekStart: settings.weekStart,
      }),
    [categories, habits, habitLog, journal, savings, settings.weekStart, months],
  );
  const persona = useMemo(() => weeklyPersona(w), [w]);
  const money = (v) => formatMoney(v, settings.currency, settings.locale);
  const equivalent = w.topCategory && funEquivalent(w.topCategory.minutes);

  // Build the arc, skipping cards with nothing to say (peak-end preserved:
  // warmth ~2/3, persona after it, share card last).
  const cards = useMemo(() => {
    const list = [];
    list.push(
      <div key="open">
        <Setup>Hey {settings.name}.</Setup>
        <Payoff>
          <Big className="text-cream">
            Another week
            <br />
            in the books.
          </Big>
        </Payoff>
        <Sub>Let's see what you built. Tap to continue →</Sub>
      </div>,
    );
    if (w.totals.total > 0) {
      list.push(
        <div key="time">
          <Setup>You logged</Setup>
          <Payoff>
            <Big className="text-rose-bright">{formatMinutes(w.totals.total)}</Big>
          </Payoff>
          {w.topCategory?.category && (
            <Sub>
              Most of it? <span className="font-semibold text-cream">{w.topCategory.category.label}</span>
              {equivalent ? ` — ${equivalent}.` : "."}
            </Sub>
          )}
        </div>,
      );
    } else {
      list.push(
        <div key="quiet">
          <Setup>A quiet week.</Setup>
          <Payoff>
            <Big className="text-cream">Rest counts too.</Big>
          </Payoff>
          <Sub>This one's a fresh page — and it's already open.</Sub>
        </div>,
      );
    }
    if (w.share !== null) {
      list.push(
        <div key="share">
          <Setup>Of everything you tracked…</Setup>
          <Payoff>
            <Big className="text-coral">{w.share}%</Big>
          </Payoff>
          <Sub>was time well spent. {w.share >= 50 ? "That's real momentum." : "And it all counted."}</Sub>
        </div>,
      );
    }
    if (w.ticks > 0) {
      list.push(
        <div key="habits">
          <Setup>Promises to yourself, kept:</Setup>
          <Payoff>
            <Big className="text-mint">{w.ticks}</Big>
          </Payoff>
          {w.champion && (
            <Sub>
              "{w.champion.habit.name}" was your rock — {w.champion.adherence.pct}% held. Showing up
              is kind of your thing.
            </Sub>
          )}
        </div>,
      );
    }
    if (w.moodAvg || w.gratitudes > 0) {
      list.push(
        <div key="mood">
          <Setup>Your week felt like</Setup>
          <Payoff>
            <Big className="text-lavender">
              {w.moodAvg ? MOODS[Math.round(w.moodAvg) - 1].emoji : "💗"}{" "}
              {w.moodAvg ? `${w.moodAvg.toFixed(1)}/5` : ""}
            </Big>
          </Payoff>
          {w.gratitudes > 0 && (
            <Sub>
              …and you still found{" "}
              <span className="font-semibold text-cream">{w.gratitudes} things</span> to be grateful
              for.
            </Sub>
          )}
        </div>,
      );
    }
    if (w.saved > 0) {
      list.push(
        <div key="saved">
          <Setup>You tucked away</Setup>
          <Payoff>
            <Big className="text-sand">{money(w.saved)}</Big>
          </Payoff>
          <Sub>Future you just smiled.</Sub>
        </div>,
      );
    }
    list.push(
      <div key="persona">
        <Setup>This week, you were…</Setup>
        <Payoff>
          <p className="text-6xl">{persona.emoji}</p>
          <Big className="text-gradient-warm mt-2">{persona.name}</Big>
        </Payoff>
        <Sub>{persona.desc}</Sub>
      </div>,
    );
    if (w.xp > 0) {
      list.push(
        <div key="xp">
          <Setup>The garden grew:</Setup>
          <Payoff>
            <Big className="text-rose-bright">+{w.xp} XP</Big>
          </Payoff>
          {w.bestDay && (
            <Sub>
              {formatDayLabel(w.bestDay.key, { relative: false })} was your power day —{" "}
              {formatMinutes(w.bestDay.total)} strong.
            </Sub>
          )}
        </div>,
      );
    }
    list.push(
      <div key="end">
        <Setup>One week. All you.</Setup>
        <Payoff>
          <Big className="text-cream">
            Save it,
            <br />
            then start the next one. 🌹
          </Big>
        </Payoff>
        <Payoff delay={1200} className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sharePoster({
                name: settings.name,
                start: w.start,
                end: w.end,
                persona,
                stats: [
                  { value: formatMinutes(w.totals.total), label: "logged", hex: "#F78DA3" },
                  { value: w.share === null ? "—" : `${w.share}%`, label: "productive", hex: "#F2876B" },
                  { value: String(w.ticks), label: "habits kept", hex: "#7ED4B2" },
                  { value: String(w.gratitudes), label: "gratitudes", hex: "#B49CE8" },
                ],
              });
            }}
            className="glow-rose mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose to-coral px-6 py-3 text-sm font-bold text-ink active:scale-95"
          >
            <Download size={16} aria-hidden="true" /> Save my week poster
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/", { viewTransition: true });
            }}
            className="mx-auto rounded-xl px-6 py-2 text-sm font-semibold text-muted"
          >
            Mulai minggu baru →
          </button>
        </Payoff>
      </div>,
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, persona, settings.name]);

  const accent = ACCENTS[index % ACCENTS.length];
  const next = () => setIndex((i) => Math.min(i + 1, cards.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  // Hold-to-pause (stories grammar): a quick tap advances, a press pauses.
  const onDown = () => {
    holdTimer.current = setTimeout(() => setHeld(true), 180);
  };
  const onUp = (e) => {
    clearTimeout(holdTimer.current);
    if (held) {
      setHeld(false);
      return;
    }
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    if (x < window.innerWidth / 3) prev();
    else next();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-ink [view-transition-name:wrapped]"
      onPointerDown={onDown}
      onPointerUp={onUp}
      role="region"
      aria-label="Weekly wrapped story"
    >
      {/* per-card radial tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-500"
        style={{ background: `radial-gradient(circle at 50% 30%, ${accent.tint}, transparent 70%)` }}
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* segmented progress (the fill's animation end advances the story) */}
      <div className="relative z-10 flex gap-1 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        {cards.map((_, i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            {i < index && <span className="block h-full w-full bg-cream/80" />}
            {i === index && !reduced && (
              <span
                key={index}
                className="block h-full origin-left bg-cream/90"
                style={{
                  animation: `bar-fill ${CARD_MS}ms linear forwards`,
                  animationPlayState: held ? "paused" : "running",
                }}
                onAnimationEnd={() =>
                  setIndex((i2) => (i2 < cards.length - 1 ? i2 + 1 : i2))
                }
              />
            )}
            {i === index && reduced && <span className="block h-full w-full bg-cream/90" />}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between px-4 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {fmtShort(w.start)} – {fmtShort(w.end)} · wrapped
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(-1, { viewTransition: true });
          }}
          aria-label="Close"
          className="rounded-lg p-2 text-muted hover:text-cream"
        >
          <X size={20} />
        </button>
      </div>

      {/* the card — keyed so each one re-runs its entrance choreography */}
      <div key={index} className="relative z-10 flex flex-1 select-none flex-col justify-center px-8 pb-24 text-center sm:px-16">
        <div className={accent.text}>{cards[index]}</div>
      </div>
    </div>
  );
}
