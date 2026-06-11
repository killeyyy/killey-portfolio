import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Lazy-loaded fullscreen "Garnet Aurora" fragment shader: warm garnet/crimson
 * folded with a cool violet/cyan field over ink, plus a soft glow that follows
 * the pointer. Budget-safe: DPR capped, rAF paused offscreen/hidden, GL context
 * released on unmount. Mounted by <Hero> only when motion + WebGL + desktop.
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
  uniform vec2 uMouse;
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

    float warm = fbm(p * 2.2 + vec2(t, t * 0.6)) + 0.4 * fbm(p * 4.0 - vec2(t * 0.8, 0.0));
    float cool = fbm(p * 1.8 - vec2(t * 0.5, t * 0.3));

    vec3 ink     = vec3(0.055, 0.055, 0.063);
    vec3 garnet  = vec3(0.482, 0.118, 0.169);
    vec3 crimson = vec3(0.784, 0.196, 0.235);
    vec3 violet  = vec3(0.486, 0.361, 1.0);
    vec3 cyan    = vec3(0.133, 0.827, 0.933);

    vec3 col = mix(ink, garnet, smoothstep(0.20, 0.92, warm));
    col = mix(col, crimson, smoothstep(0.62, 1.0, warm) * 0.55);
    // cool aurora woven in, kept subtle so it reads premium not rainbow
    col = mix(col, violet, smoothstep(0.55, 1.0, cool) * 0.22);
    col = mix(col, cyan, smoothstep(0.75, 1.0, cool) * 0.10);

    // pointer glow
    float md = distance(uv, uMouse);
    col += crimson * smoothstep(0.45, 0.0, md) * 0.18;
    col += violet * smoothstep(0.30, 0.0, md) * 0.10;

    float d = distance(uv, vec2(0.5, 0.2));
    col *= 1.0 - 0.5 * d;
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
      renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.75) });
    } catch {
      return;
    }

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.cssText = "width:100%;height:100%;display:block";
    mount.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: { uTime: { value: 0 }, uRes: { value: [1, 1] }, uMouse: { value: [0.5, 0.5] } },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let raf = 0;
    let running = true;
    const target = [0.5, 0.5];

    const resize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      target[0] = e.clientX / window.innerWidth;
      target[1] = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = (t) => {
      if (!running) return;
      const m = program.uniforms.uMouse.value;
      m[0] += (target[0] - m[0]) * 0.06;
      m[1] += (target[1] - m[1]) * 0.06;
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
    const io = new IntersectionObserver((entries) => setRunning(entries[0].isIntersecting), { threshold: 0.01 });
    io.observe(mount);
    const onVis = () => setRunning(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
