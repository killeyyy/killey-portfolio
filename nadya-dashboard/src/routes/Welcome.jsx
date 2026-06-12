/**
 * /welcome — public landing page (code-split lazy chunk).
 *
 * Rules:
 * - No fabricated stats, testimonials, or logos.
 * - Mobile-first, design tokens only (no new CSS classes beyond what
 *   tailwind.config.js + index.css already define).
 * - prefers-reduced-motion: animate-fade-up already respects it via
 *   the global @media kill-switch in index.css.
 * - Install CTA explains Add to Home Screen — truthful, no store links.
 */

import { Link } from "react-router-dom";
import { BookOpen, Check, Flame, Leaf, PiggyBank, Sprout } from "lucide-react";
import { PRO } from "../data/pro.js";

const FEATURES = [
  {
    icon: Flame,
    title: "Activities & habits",
    body: "Log what you did, tick daily habits, and watch your streak plant grow — one day at a time.",
    color: "text-rose",
  },
  {
    icon: BookOpen,
    title: "Journal & mood",
    body: "A quiet space to write your highlight, three things you're grateful for, and how the day felt.",
    color: "text-lavender",
  },
  {
    icon: PiggyBank,
    title: "Money tracker",
    body: "Set a savings goal, log contributions, and see your months as a simple bar chart.",
    color: "text-sand",
  },
  {
    icon: Leaf,
    title: "Your garden",
    body: "Every week you show up plants something. Full weeks bloom — quiet ones still grow a sprout.",
    color: "text-mint",
  },
];

/** Gradient tile frame — mirrors the Tile glow pattern exactly. */
function FeatureTile({ icon: Icon, title, body, color }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose/60 via-line/50 to-coral/45 p-px shadow-[0_8px_24px_-12px_rgb(0_0_0/0.5)]">
      <div className="rounded-[15px] bg-surface p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
        <Icon size={20} className={`mb-2 ${color}`} aria-hidden="true" />
        <h3 className="font-serif text-base font-bold text-cream">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

export default function Welcome() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-16 pt-[max(3rem,env(safe-area-inset-top))]">

      {/* Hero */}
      <div className="animate-fade-up text-center">
        {/* Wordmark */}
        <div className="mb-2 inline-flex items-center gap-2">
          <Sprout size={28} className="text-rose" aria-hidden="true" />
          <span className="font-serif text-2xl font-bold text-cream">Ruang</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          your quiet space
        </p>

        <h1 className="mt-6 font-serif text-3xl font-bold leading-snug text-cream">
          A life tracker that{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(100deg, #F78DA3, #F2876B)" }}
          >
            feels like home
          </span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Activities, habits, money, journal, and a garden that grows from your
          real days — all local-first, all yours.
        </p>
      </div>

      {/* Feature highlights */}
      <div
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
        style={{ animationDelay: "60ms" }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="animate-fade-up"
            style={{ animationDelay: `${80 + i * 40}ms` }}
          >
            <FeatureTile {...f} />
          </div>
        ))}
      </div>

      {/* Install CTA */}
      <div
        className="mt-8 animate-fade-up rounded-2xl border border-line/70 bg-surface p-5"
        style={{ animationDelay: "260ms" }}
      >
        <h2 className="font-serif text-base font-bold text-cream">
          Install as an app
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Ruang is a Progressive Web App — no app store needed. In your browser
          menu, tap{" "}
          <span className="font-semibold text-cream">Add to Home Screen</span>{" "}
          (or <span className="font-semibold text-cream">Install app</span> on
          Chrome). It opens full-screen and works offline, just like a native
          app.
        </p>
      </div>

      {/* Pricing */}
      <div
        className="mt-6 animate-fade-up rounded-2xl bg-gradient-to-br from-rose/60 via-line/50 to-coral/45 p-px"
        style={{ animationDelay: "280ms" }}
      >
        <div className="rounded-[15px] bg-surface p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-serif text-base font-bold text-cream">
              Free forever. Pro when you want it.
            </h2>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Everything you saw above is free, on your device, no account needed.
            Ruang Pro is{" "}
            <span className="font-semibold text-cream">
              {PRO.price} — {PRO.period}
            </span>
            :
          </p>
          <ul className="mt-3 space-y-1.5">
            {PRO.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-cream">
                <Check size={15} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>
          {PRO.checkoutUrl ? (
            <a
              href={PRO.checkoutUrl}
              className="mt-4 block w-full rounded-xl bg-gradient-to-r from-rose to-coral py-3 text-center text-sm font-bold text-ink active:scale-95"
            >
              Get Ruang Pro · {PRO.price}
            </a>
          ) : (
            <p className="mt-4 rounded-xl bg-mint/10 px-3 py-2.5 text-center text-xs font-semibold text-mint">
              Founding window: Pro checkout opens in days — until then, sync is free for
              everyone who signs in. Early birds keep it.
            </p>
          )}
        </div>
      </div>

      {/* Open CTA */}
      <div
        className="mt-6 animate-fade-up space-y-3 text-center"
        style={{ animationDelay: "300ms" }}
      >
        <Link
          to="/"
          viewTransition
          className="block w-full rounded-xl bg-gradient-to-r from-rose to-coral py-3 text-sm font-bold text-ink shadow-[0_8px_24px_-8px_rgb(226_92_114/0.5)] active:scale-95"
        >
          Open Ruang
        </Link>
        <Link
          to="/privacy"
          viewTransition
          className="block py-2 text-xs text-muted underline-offset-2 hover:text-cream hover:underline"
        >
          Privacy policy
        </Link>
      </div>
    </div>
  );
}
