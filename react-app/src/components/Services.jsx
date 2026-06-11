import { services } from "../data/site.js";
import SectionHeading from "./SectionHeading.jsx";
import Icon from "../lib/icons.jsx";
import Tilt from "../lib/Tilt.jsx";
import { Stagger, Item } from "../lib/motion.jsx";

// Literal classes (so Tailwind keeps them) — rotate a colorful accent per card.
const ACCENTS = ["text-crimson-bright", "text-violet-bright", "text-cyan", "text-gold"];

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-content px-6 py-24 md:py-32">
      <SectionHeading kicker="What I do" title="Built with AI, end to end." />
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {services.map((s, i) => (
          <Item key={s.title} className="h-full">
            <Tilt className="h-full" max={7}>
              <div className="glow-card group h-full rounded-[18px] border border-line/70 bg-surface/60 p-7">
                <div className={`mb-5 inline-flex rounded-xl border border-line/70 bg-ink/40 p-3 ${ACCENTS[i % ACCENTS.length]}`}>
                  <Icon name={s.icon} size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-fluid-lg font-semibold text-silver">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </Tilt>
          </Item>
        ))}
      </Stagger>
    </section>
  );
}
