import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

// The one WebGL moment: a slowly breathing, domain-warped gradient in the
// brand palette, behind everything. Engineering rules (ROADMAP-ERA2 PR 4):
// lazy chunk (this file), dpr capped LOW (it's a soft gradient — render at
// half res and let CSS scale), mediump, low-power context, rAF stops when
// the tab hides, and any failure leaves the static CSS aurora untouched.

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

// Brand: ink #0F0B0D · rose #E25C72 · lavender #B49CE8 · coral #F2876B
const vec3 INK = vec3(0.059, 0.043, 0.051);
const vec3 ROSE = vec3(0.886, 0.361, 0.447);
const vec3 LAV = vec3(0.706, 0.612, 0.910);
const vec3 CORAL = vec3(0.949, 0.529, 0.420);

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.05; // glacial — ambience, not spectacle

  // two-octave sin-field domain warp: cheap "wind through colour"
  vec2 q = vec2(
    sin(uv.x * 2.1 + t) + sin(uv.y * 1.7 - t * 1.3),
    sin(uv.x * 1.3 - t * 0.8) + sin(uv.y * 2.3 + t)
  ) * 0.25;
  vec2 p = uv + q;

  float a = 0.5 + 0.5 * sin(p.x * 3.0 + t * 2.0);
  float b = 0.5 + 0.5 * sin(p.y * 2.4 - t * 1.6 + 1.7);

  vec3 col = INK;
  col = mix(col, ROSE, a * 0.20);
  col = mix(col, LAV, b * 0.14);
  col = mix(col, CORAL, (1.0 - a) * (1.0 - b) * 0.12);

  // vignette back to ink so edges stay calm
  float v = smoothstep(1.05, 0.45, distance(uv, vec2(0.5, 0.45)));
  col = mix(INK, col, v);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function AmbientGL() {
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
      uniforms: { uTime: { value: 0 } },
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
  }, []);

  // opacity blends the shader with the CSS aurora underneath (which is also
  // the no-WebGL / reduced-motion / load-failure experience).
  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0 opacity-60" />;
}
