import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

// The one WebGL moment: a slowly breathing, domain-warped gradient behind
// everything. THEME-AWARE: colours are read from the live CSS tokens and
// each theme passes its own mood (speed/warp) — Tide swells, Moss gusts,
// Ink barely moves. Engineering rules (ROADMAP-ERA2 PR 4): lazy chunk,
// dpr capped LOW, mediump, low-power, rAF stops when hidden, any failure
// leaves the static CSS aurora untouched.

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;
uniform float uWarp;
uniform vec3 uInk;
uniform vec3 uA; /* lead accent */
uniform vec3 uB; /* cool counterpoint */
uniform vec3 uC; /* secondary accent */

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.05 * uSpeed; // glacial — ambience, not spectacle

  // two-octave sin-field domain warp: cheap "wind through colour"
  vec2 q = vec2(
    sin(uv.x * 2.1 + t) + sin(uv.y * 1.7 - t * 1.3),
    sin(uv.x * 1.3 - t * 0.8) + sin(uv.y * 2.3 + t)
  ) * 0.25 * uWarp;
  vec2 p = uv + q;

  float a = 0.5 + 0.5 * sin(p.x * 3.0 + t * 2.0);
  float b = 0.5 + 0.5 * sin(p.y * 2.4 - t * 1.6 + 1.7);

  vec3 col = uInk;
  col = mix(col, uA, a * 0.30);
  col = mix(col, uB, b * 0.20);
  col = mix(col, uC, (1.0 - a) * (1.0 - b) * 0.18);

  // vignette back to ink so edges stay calm
  float v = smoothstep(1.05, 0.45, distance(uv, vec2(0.5, 0.45)));
  col = mix(uInk, col, v);

  gl_FragColor = vec4(col, 1.0);
}
`;

/** Read a `R G B` CSS token into a normalized vec3. */
function cssVec3(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.split(/\s+/).map((n) => Number(n) / 255);
  return parts.length === 3 && parts.every((n) => !Number.isNaN(n)) ? parts : fallback;
}

export default function AmbientGL({ speed = 1, warp = 1 }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    let gl;
    try {
      renderer = new Renderer({
        dpr: 0.5, // half-res: fill-rate is the killer on mid-range Android
        alpha: false,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
      });
      gl = renderer.gl;
    } catch {
      return undefined; // no WebGL → CSS aurora carries the scene
    }
    if (!gl) return undefined;

    host.appendChild(gl.canvas);
    gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uWarp: { value: warp },
        uInk: { value: cssVec3("--c-ink", [0.059, 0.043, 0.051]) },
        uA: { value: cssVec3("--c-rose", [0.886, 0.361, 0.447]) },
        uB: { value: cssVec3("--c-lavender", [0.706, 0.612, 0.91]) },
        uC: { value: cssVec3("--c-coral", [0.949, 0.529, 0.42]) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => renderer.setSize(host.clientWidth, host.clientHeight);
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const loop = (t) => {
      program.uniforms.uTime.value = (t - t0) / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // battery rule: provably stop when not watched
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    const onLost = (e) => {
      e.preventDefault();
      stop();
    };
    gl.canvas.addEventListener("webglcontextlost", onLost);

    start();
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.canvas.removeEventListener("webglcontextlost", onLost);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [speed, warp]);

  // opacity blends the shader with the CSS aurora underneath (which is also
  // the no-WebGL / reduced-motion / load-failure experience).
  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0 opacity-75" />;
}
