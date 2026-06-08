import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "../lib/useReducedMotion.js";
import { site } from "../data/site.js";
import StaticHero from "./hero/StaticHero.jsx";

const ShaderHero = lazy(() => import("./hero/ShaderHero.jsx"));

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export default function Hero() {
  const reduced = useReducedMotion();
  const [shader, setShader] = useState(false);

  useEffect(() => {
    if (reduced) return; // honor reduced-motion: keep the static hero
    if (!supportsWebGL()) return;
    if (window.matchMedia("(max-width: 640px)").matches) return; // keep phones light
    setShader(true);
  }, [reduced]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <StaticHero />
        {shader && (
          <Suspense fallback={null}>
            <ShaderHero />
          </Suspense>
        )}
        {/* scrim ensures text clears WCAG AA contrast over the shader */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-ink" />
      </div>

      <div className="mx-auto max-w-content px-6 pb-24 pt-28 md:pb-36 md:pt-40">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-gold">
          {site.brand} · AI-first builder &amp; creator
        </p>
        <h1 className="max-w-4xl font-serif text-fluid-2xl font-semibold leading-[0.98] text-silver">
          {site.headline}
        </h1>
        <p className="mt-6 max-w-xl text-fluid-base leading-relaxed text-muted">{site.subhead}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#work" className="inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-medium text-silver transition-colors hover:bg-crimson/90">
            View work <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-silver transition-colors hover:border-gold/60 hover:text-gold">
            Start a project
          </a>
        </div>
      </div>
    </section>
  );
}
