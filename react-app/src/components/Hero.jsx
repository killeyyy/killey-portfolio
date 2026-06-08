import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useReducedMotion } from "../lib/useReducedMotion.js";
import Magnetic from "../lib/Magnetic.jsx";
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

const EASE = [0.22, 1, 0.36, 1];
const WORD = "KILLEYYY".split("");

export default function Hero() {
  const reduced = useReducedMotion();
  const [shader, setShader] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (!supportsWebGL()) return;
    if (window.matchMedia("(max-width: 640px)").matches) return;
    setShader(true);
  }, [reduced]);

  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <StaticHero />
        {shader && (
          <Suspense fallback={null}>
            <ShaderHero />
          </Suspense>
        )}
        <div className="aurora absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/50 to-ink" />
      </div>

      <div className="mx-auto flex min-h-[92vh] max-w-content flex-col justify-center px-6 pb-20 pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-gold"
        >
          <Sparkles size={14} aria-hidden="true" /> {site.brand} · AI-first builder &amp; creator
        </motion.p>

        {/* Oversized kinetic wordmark with per-letter reveal */}
        <h1 className="font-serif leading-[0.86]">
          <span className="sr-only">{site.brand}</span>
          <motion.span
            aria-hidden="true"
            className="text-gradient block text-fluid-hero font-semibold"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          >
            {WORD.map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: "0.5em", rotateX: -40 },
                  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE } },
                }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="mt-6 max-w-2xl font-serif text-fluid-lg leading-snug text-silver"
        >
          I build <span className="text-gradient-warm">cinematic</span> games, sites &amp; content with{" "}
          <span className="text-gradient-warm">AI</span>.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.62 }}
          className="mt-5 max-w-xl text-fluid-base leading-relaxed text-muted"
        >
          {site.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.74 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Magnetic>
            <a
              href="#work"
              className="glow-card inline-flex items-center gap-2 rounded-full bg-crimson px-7 py-3.5 text-sm font-medium text-silver transition-transform hover:scale-[1.03]"
            >
              View work <ArrowRight size={16} aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-silver transition-colors hover:border-gold/60 hover:text-gold"
            >
              Start a project
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
