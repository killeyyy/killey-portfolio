import { m } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Scroll-into-view reveal. Respects reduced-motion via the app's
 *  <MotionConfig reducedMotion="user">. */
export function Reveal({ children, className, delay = 0, y = 24, once = true }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </m.div>
  );
}

/** Stagger container — children using <Item> animate in sequence. */
export function Stagger({ children, className, gap = 0.08, once = true }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </m.div>
  );
}

export function Item({ children, className, y = 24 }) {
  return (
    <m.div
      className={className}
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
    >
      {children}
    </m.div>
  );
}
