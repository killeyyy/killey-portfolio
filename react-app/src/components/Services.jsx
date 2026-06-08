import { services } from "../data/site.js";
import SectionHeading from "./SectionHeading.jsx";
import Icon from "../lib/icons.jsx";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-content px-6 py-20 md:py-28">
      <SectionHeading kicker="What I do" title="Built with AI, end to end." />
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.title}
            className="group rounded-xl2 border border-line/70 bg-surface/60 p-6 transition-colors hover:border-crimson/40"
          >
            <div className="mb-4 inline-flex rounded-lg border border-line/70 p-2.5 text-gold transition-colors group-hover:text-crimson">
              <Icon name={s.icon} size={20} aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-fluid-lg font-semibold text-silver">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
