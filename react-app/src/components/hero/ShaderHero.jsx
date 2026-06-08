import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Lazy-loaded fullscreen fragment-shader background — a slow flowing
 * garnet→crimson nebula over ink. Budget-safe: DPR capped, rAF paused when
 * offscreen or tab hidden, GL context released on unmount. Only mounted by
 * <Hero> when motion is allowed, WebGL is supported, and not on small screens.
 */
const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  varying vec2 vUv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  void main(){
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.04;
    float n = fbm(p * 2.2 + vec2(t, t * 0.6));
    n += 0.4 * fbm(p * 4.0 - vec2(t * 0.8, 0.0));
    vec3 ink     = vec3(0.055, 0.055, 0.063);
    vec3 garnet  = vec3(0.482, 0.118, 0.169);
    vec3 crimson = vec3(0.784, 0.196, 0.235);
    vec3 col = mix(ink, garnet, smoothstep(0.20, 0.92, n));
    col = mix(col, crimson, smoothstep(0.62, 1.0, n) * 0.55);
    float d = distance(uv, vec2(0.5, 0.2));
    col *= 1.0 - 0.55 * d;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderHero() {
  const ref = useRef(null);

  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.75),
      });
    } catch {
      return; // WebGL unavailable — Hero keeps the static fallback
    }

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] } },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let raf = 0;
    let running = true;

    const resize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = (t) => {
      if (!running) return;
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const setRunning = (v) => {
      if (v && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!v && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(
      (entries) => setRunning(entries[0].isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(mount);
    const onVis = () => setRunning(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
