import { site } from "../data/site.js";
import SectionHeading from "./SectionHeading.jsx";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-content px-6 py-20 md:py-28">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading kicker="About" title="An AI-first builder & creator." />
        <div className="space-y-4">
          {site.about.map((p, i) => (
            <p key={i} className="text-fluid-base leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
