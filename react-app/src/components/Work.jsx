import { projects } from "../data/site.js";
import ProjectCard from "./ProjectCard.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Work() {
  const items = projects.filter((p) => p.client);
  return (
    <section id="work" className="mx-auto max-w-content px-6 py-20 md:py-28">
      <SectionHeading kicker="Selected work" title="Live, playable, real." />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <ProjectCard key={p.slug} project={p} featured={p.featured} />
        ))}
      </div>
    </section>
  );
}
