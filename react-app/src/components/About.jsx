import { m } from "framer-motion";
import { site } from "../data/site.js";
import { Stagger, Item } from "../lib/motion.jsx";

const EASE = [0.22, 1, 0.36, 1];
const QUOTE = "The work is live. The method is AI. The taste is mine.".split(" ");

// Truthful method descriptors — how he actually works, not invented claims.
const PRINCIPLES = ["AI-directed, human-decided", "Live > slideware", "Cinematic by default", "Ship fast, iterate"];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-line/50">
      <div aria-hidden="true" className="aurora absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-content px-6 py-24 md:py-32">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-gold">About</p>

        {/* word-staggered editorial pull quote */}
        <h2 className="max-w-4xl font-serif text-fluid-2xl font-semibold leading-[1.05]">
          <span className="sr-only">{QUOTE.join(" ")}</span>
          <m.span
            aria-hidden="true"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {QUOTE.map((w, i) => (
              <m.span
                key={i}
                className={`mr-[0.28em] inline-block ${w === "AI." || w === "live." ? "text-gradient-warm" : "text-silver"}`}
                variants={{
                  hidden: { opacity: 0, y: "0.4em" },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                }}
              >
                {w}
              </m.span>
            ))}
          </m.span>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {site.about.map((p, i) => (
              <p key={i} className="max-w-2xl text-fluid-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <Stagger className="flex h-fit flex-wrap content-start gap-2.5" gap={0.07}>
            {PRINCIPLES.map((p, i) => (
              <Item key={p}>
                <span
                  className={`inline-block rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                    ["border-crimson/40 text-crimson-bright hover:bg-crimson/10",
                     "border-violet/40 text-violet-bright hover:bg-violet/10",
                     "border-cyan/40 text-cyan hover:bg-cyan/10",
                     "border-gold/40 text-gold hover:bg-gold/10"][i % 4]
                  }`}
                >
                  {p}
                </span>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
