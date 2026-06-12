// Ambient backdrop for the public pages (/welcome, /privacy), which render
// outside the app Shell and therefore get none of its atmosphere. Pure CSS:
// the aurora blobs, the petalfield and the film grain — no WebGL, so the
// marketing page stays instant on first visit.
import { Petalfield } from "./Petalfield.jsx";

export function PublicBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-rose/[0.13] blur-[120px]" />
      <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-lavender/[0.1] blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[380px] w-[380px] rounded-full bg-coral/[0.09] blur-[120px]" />
      <Petalfield />
      <div className="grain absolute inset-0" />
    </div>
  );
}
