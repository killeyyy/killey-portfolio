import { process } from "../data/site.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Process() {
  return (
    <section className="border-y border-line/50 bg-surface/30">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <SectionHeading kicker="How it works" title="From idea to live in three moves." />
        <div className="grid gap-10 md:grid-cols-3">
          {process.map((p) => (
            <div key={p.step}>
              <p className="font-serif text-fluid-2xl font-semibold text-crimson/80">{p.step}</p>
              <h3 className="mt-2 text-fluid-lg font-semibold text-silver">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
