// Lazily-loaded Framer Motion feature pack for <LazyMotion>.
// `domAnimation` (~15KB) covers animations, variants, gestures, exit —
// everything this site uses — and loads in its own async chunk AFTER first
// paint, keeping the initial bundle lean. Use `domMax` only if we ever add
// layout/drag. See docs/PLAYBOOK.md Recipe 3.1.
import { domAnimation } from "framer-motion";
export default domAnimation;
