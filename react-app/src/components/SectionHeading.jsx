import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Reusable kicker + title block with a scroll reveal. */
export default function SectionHeading({ kicker, title, id }) {
  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {kicker && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">{kicker}</p>
      )}
      <h2 id={id} className="max-w-3xl text-fluid-xl font-semibold leading-tight text-silver">
        {title}
      </h2>
    </motion.div>
  );
}
