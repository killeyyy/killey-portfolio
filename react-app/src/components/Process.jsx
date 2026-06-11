import { process } from "../data/site.js";
import SectionHeading from "./SectionHeading.jsx";
import { Stagger, Item } from "../lib/motion.jsx";

export default function Process() {
  return (
    <section className="relative border-y border-line/50 bg-surface/30">
      <div className="aurora absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-content px-6 py-24 md:py-32">
        <SectionHeading kicker="How it works" title="From idea to live in three moves." />
        <Stagger className="grid gap-10 md:grid-cols-3">
          {process.map((p) => (
            <Item key={p.step}>
              <p className="text-gradient font-serif text-fluid-2xl font-semibold">{p.step}</p>
              <h3 className="mt-2 text-fluid-lg font-semibold text-silver">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
