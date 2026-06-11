import { projects } from "../data/site.js";
import ProjectCard from "./ProjectCard.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { Stagger, Item } from "../lib/motion.jsx";

export default function Work() {
  const items = projects.filter((p) => p.client);
  return (
    <section id="work" className="mx-auto max-w-content px-6 py-24 md:py-32">
      <SectionHeading kicker="Selected work" title="Live, playable, real." />
      <Stagger className="grid gap-5 sm:grid-cols-2" gap={0.1}>
        {items.map((p) => (
          <Item key={p.slug} className={p.featured ? "h-full sm:col-span-2" : "h-full"}>
            <ProjectCard project={p} featured={p.featured} />
          </Item>
        ))}
      </Stagger>
    </section>
  );
}
