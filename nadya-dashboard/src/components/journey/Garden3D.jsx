// The 3D garden — her whole history as a small living diorama. One plant
// per week on a fogged meadow: quiet weeks sprout, full weeks bloom, the
// current week glows. Wind moves through it; the light follows her clock
// and her theme. Reduced-motion / no-WebGL / any failure → the SVG meadow.
import { useEffect, useRef, useState } from "react";
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from "ogl";
import { Garden } from "./Garden.jsx";
import { COLOR_META } from "../../data/defaults.js";

const PER_ROW = 8;
const ROW_DEPTH = 0.85;
const HEIGHT = 288; // px — matches h-72

function jitter(seed, salt) {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function cssVec3(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const p = raw.split(/\s+/).map((n) => Number(n) / 255);
  return p.length === 3 && p.every((n) => !Number.isNaN(n)) ? p : fallback;
}

function hexVec3(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const PLANT_VERT = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPos;
attribute float iScale;
attribute vec3 iHue;
attribute vec2 iMeta;  /* x: stars, y: phase */
attribute float iCur;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform float uTime;
varying vec2 vUv;
varying vec3 vHue;
varying vec3 vMeta; /* stars, phase, current */
varying float vDepth;
void main() {
  vUv = uv;
  vHue = iHue;
  vMeta = vec3(iMeta, iCur);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  /* wind: bend grows toward the top of the quad */
  float sway = sin(uTime * 1.3 + iMeta.y * 6.2831) * 0.07 * uv.y;
  vec3 wpos = iPos
    + right * (position.x + sway) * iScale
    + up * (position.y + 0.5) * iScale;
  vec4 mv = modelViewMatrix * vec4(wpos, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const PLANT_FRAG = /* glsl */ `
precision mediump float;
varying vec2 vUv;
varying vec3 vHue;
varying vec3 vMeta;
varying float vDepth;
/* highp: must match the vertex stage or ANGLE refuses to link */
uniform highp float uTime;
uniform vec3 uFog;
uniform float uFogNear;
uniform float uFogFar;

float seg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  /* plant space: x centered, y 0 (soil) → 1 (top) */
  vec2 p = vec2(vUv.x - 0.5, vUv.y);
  float stars = vMeta.x;
  float bloomY = 0.58 + 0.06 * stars;
  float col = 0.0;
  vec3 rgb = vec3(0.0);
  float alpha = 0.0;

  /* stem */
  float curve = sin(p.y * 3.1416) * 0.03;
  float dStem = seg(vec2(p.x - curve, p.y), vec2(0.0, 0.02), vec2(0.0, bloomY));
  float stem = 1.0 - smoothstep(0.012, 0.03, dStem);
  rgb = mix(rgb, vec3(0.12, 0.44, 0.36), stem);
  alpha = max(alpha, stem * step(p.y, bloomY));

  /* leaf */
  vec2 lp = (p - vec2(0.0, bloomY * 0.5)) * vec2(1.0, 2.2);
  lp.x -= 0.07;
  float leaf = 1.0 - smoothstep(0.05, 0.085, length(lp));
  rgb = mix(rgb, vec3(0.49, 0.83, 0.70), leaf * 0.9);
  alpha = max(alpha, leaf * 0.9);

  if (stars < 0.5) {
    /* sprout: a small bud of leaf-green */
    float bud = 1.0 - smoothstep(0.045, 0.08, length((p - vec2(0.0, bloomY)) * vec2(1.0, 1.25)));
    rgb = mix(rgb, vec3(0.49, 0.83, 0.70), bud);
    alpha = max(alpha, bud);
  } else {
    /* bloom: petal rosette, petal count grows with stars */
    vec2 bp = p - vec2(0.0, bloomY);
    float ang = atan(bp.y, bp.x);
    float petals = stars >= 3.0 ? 6.0 : 5.0;
    float r = (0.085 + 0.035 * stars) * (0.62 + 0.38 * pow(abs(cos(ang * petals * 0.5)), 1.3));
    float bloom = 1.0 - smoothstep(r - 0.015, r + 0.012, length(bp));
    rgb = mix(rgb, vHue, bloom);
    alpha = max(alpha, bloom);
    float core = 1.0 - smoothstep(0.02, 0.04, length(bp));
    rgb = mix(rgb, vec3(1.0, 0.92, 0.75), core);
  }

  /* current week: soft pulsing halo */
  if (vMeta.z > 0.5) {
    vec2 hp = p - vec2(0.0, bloomY);
    float pulse = 0.5 + 0.5 * sin(uTime * 2.2);
    float halo = (1.0 - smoothstep(0.12, 0.3, length(hp))) * 0.25 * pulse;
    rgb += vHue * halo;
    alpha = max(alpha, halo);
  }

  if (alpha < 0.02) discard;

  /* top light + depth fog */
  rgb *= 0.82 + 0.18 * vUv.y;
  float fog = smoothstep(uFogNear, uFogFar, vDepth);
  rgb = mix(rgb, uFog, fog * 0.85);
  gl_FragColor = vec4(rgb, alpha * (1.0 - fog * 0.6));
}
`;

const MOTE_VERT = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPos;
attribute float iPhase;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform float uTime;
varying vec2 vUv;
varying float vPhase;
varying float vDepth;
void main() {
  vUv = uv;
  vPhase = iPhase;
  /* slow figure-eight drift, unique per mote */
  vec3 drift = vec3(
    sin(uTime * 0.27 + iPhase * 6.2831) * 0.45,
    sin(uTime * 0.21 + iPhase * 9.4) * 0.16,
    sin(uTime * 0.16 + iPhase * 4.7) * 0.3
  );
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wpos = iPos + drift + (right * position.x + up * position.y) * 0.075;
  vec4 mv = modelViewMatrix * vec4(wpos, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const MOTE_FRAG = /* glsl */ `
precision mediump float;
varying vec2 vUv;
varying float vPhase;
varying float vDepth;
/* highp: must match the vertex stage or ANGLE refuses to link */
uniform highp float uTime;
uniform vec3 uGlow;
uniform vec3 uFog;
uniform float uFogNear;
uniform float uFogFar;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a *= a * a; /* tight soft core */
  /* slow individual twinkle */
  a *= 0.22 + 0.3 * (0.5 + 0.5 * sin(uTime * 1.4 + vPhase * 6.2831));
  float fog = smoothstep(uFogNear, uFogFar, vDepth);
  if (a * (1.0 - fog) < 0.01) discard;
  vec3 rgb = mix(uGlow, vec3(1.0, 0.95, 0.85), 0.35);
  rgb = mix(rgb, uFog, fog * 0.8);
  gl_FragColor = vec4(rgb, a * (1.0 - fog * 0.7));
}
`;

const GROUND_VERT = /* glsl */ `
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec3 vPos;
varying float vDepth;
void main() {
  vPos = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const GROUND_FRAG = /* glsl */ `
precision mediump float;
varying vec3 vPos;
varying float vDepth;
uniform vec3 uSoilA;
uniform vec3 uSoilB;
uniform vec3 uFog;
uniform float uFogNear;
uniform float uFogFar;
void main() {
  /* soil rows: soft bands along depth */
  float row = 0.5 + 0.5 * sin(vPos.z * 7.4);
  vec3 rgb = mix(uSoilA, uSoilB, row * 0.35);
  float fog = smoothstep(uFogNear, uFogFar, vDepth);
  rgb = mix(rgb, uFog, fog);
  gl_FragColor = vec4(rgb, 1.0);
}
`;

export default function Garden3D({ plots }) {
  const hostRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (failed || reduced) return undefined;
    const host = hostRef.current;
    if (!host || !plots.length) return undefined;

    let renderer, gl;
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        alpha: false,
        antialias: false,
        depth: true,
        powerPreference: "low-power",
      });
      gl = renderer.gl;
      if (!gl) throw new Error("no gl");
    } catch {
      setFailed(true);
      return undefined;
    }
    host.appendChild(gl.canvas);
    gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // theme-lit dusk: sky/fog from live tokens, warmer at dawn/dusk
    const ink = cssVec3("--c-ink", [0.06, 0.04, 0.05]);
    const lead = cssVec3("--c-rose", [0.886, 0.361, 0.447]);
    const hour = new Date().getHours();
    const warm = hour >= 16 || hour < 7 ? 0.2 : 0.1;
    const fog = ink.map((v, i) => v + (lead[i] - v) * warm + 0.03);
    gl.clearColor(fog[0], fog[1], fog[2], 1);

    const scene = new Transform();
    const camera = new Camera(gl, { fov: 38, near: 0.1, far: 60 });

    const rows = Math.ceil(plots.length / PER_ROW);

    // ground plane
    const gz0 = 1.4;
    const gz1 = -(rows * ROW_DEPTH + 4);
    const groundGeo = new Geometry(gl, {
      position: {
        size: 3,
        data: new Float32Array([-7, 0, gz0, 7, 0, gz0, -7, 0, gz1, 7, 0, gz1]),
      },
      index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
    });
    const groundProg = new Program(gl, {
      vertex: GROUND_VERT,
      fragment: GROUND_FRAG,
      uniforms: {
        uSoilA: { value: ink.map((v) => v * 1.45 + 0.015) },
        uSoilB: { value: ink.map((v) => v * 1.9 + 0.03) },
        uFog: { value: fog },
        uFogNear: { value: 3.5 },
        uFogFar: { value: rows * ROW_DEPTH + 5 },
      },
    });
    new Mesh(gl, { geometry: groundGeo, program: groundProg }).setParent(scene);

    // instanced plants — newest week closest to camera
    const n = plots.length;
    const iPos = new Float32Array(n * 3);
    const iScale = new Float32Array(n);
    const iHue = new Float32Array(n * 3);
    const iMeta = new Float32Array(n * 2);
    const iCur = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      const p = plots[n - 1 - k]; // reverse: k=0 → newest, front row
      const col = k % PER_ROW;
      const row = Math.floor(k / PER_ROW);
      const seed = Number(p.start.replaceAll("-", "")) % 9973;
      iPos[k * 3] = (col - (PER_ROW - 1) / 2) * 0.62 + (jitter(seed, 1) - 0.5) * 0.3;
      iPos[k * 3 + 1] = 0;
      iPos[k * 3 + 2] = -row * ROW_DEPTH - (jitter(seed, 2) * 0.4);
      iScale[k] = (0.5 + p.stars * 0.16) * (0.85 + jitter(seed, 3) * 0.3);
      const hex = (COLOR_META[p.color] || COLOR_META.rose).hex;
      const [r, g, b] = hexVec3(hex);
      iHue[k * 3] = r; iHue[k * 3 + 1] = g; iHue[k * 3 + 2] = b;
      iMeta[k * 2] = p.stars;
      iMeta[k * 2 + 1] = jitter(seed, 4);
      iCur[k] = p.isCurrent ? 1 : 0;
    }
    const quad = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) },
      index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
      iPos: { instanced: 1, size: 3, data: iPos },
      iScale: { instanced: 1, size: 1, data: iScale },
      iHue: { instanced: 1, size: 3, data: iHue },
      iMeta: { instanced: 1, size: 2, data: iMeta },
      iCur: { instanced: 1, size: 1, data: iCur },
    });
    const plantProg = new Program(gl, {
      vertex: PLANT_VERT,
      fragment: PLANT_FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uFog: { value: fog },
        uFogNear: { value: 3.5 },
        uFogFar: { value: rows * ROW_DEPTH + 5 },
      },
    });
    new Mesh(gl, { geometry: quad, program: plantProg }).setParent(scene);

    // fireflies — tiny glowing motes drifting through the dusk air
    const M = 22;
    const mPos = new Float32Array(M * 3);
    const mPhase = new Float32Array(M);
    for (let k = 0; k < M; k++) {
      mPos[k * 3] = (jitter(k + 31, 11) - 0.5) * 6.5;
      mPos[k * 3 + 1] = 0.25 + jitter(k + 31, 12) * 1.2;
      mPos[k * 3 + 2] = -jitter(k + 31, 13) * (rows * ROW_DEPTH + 2.5);
      mPhase[k] = jitter(k + 31, 14);
    }
    const moteGeo = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) },
      index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
      iPos: { instanced: 1, size: 3, data: mPos },
      iPhase: { instanced: 1, size: 1, data: mPhase },
    });
    const moteProg = new Program(gl, {
      vertex: MOTE_VERT,
      fragment: MOTE_FRAG,
      transparent: true,
      depthWrite: false, // glow never occludes the flowers
      uniforms: {
        uTime: { value: 0 },
        uGlow: { value: lead },
        uFog: { value: fog },
        uFogNear: { value: 3.5 },
        uFogFar: { value: rows * ROW_DEPTH + 5 },
      },
    });
    new Mesh(gl, { geometry: moteGeo, program: moteProg }).setParent(scene);

    // camera: gentle drift + pointer parallax (lerped)
    const lookY = 0.4;
    const lookZ = -Math.min(rows * ROW_DEPTH * 0.4, 2.5);
    let px = 0, tx = 0;
    const onPointer = (e) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
    };
    host.addEventListener("pointermove", onPointer);
    const onLeave = () => { tx = 0; };
    host.addEventListener("pointerleave", onLeave);

    const resize = () => {
      renderer.setSize(host.clientWidth, HEIGHT);
      camera.perspective({ aspect: host.clientWidth / HEIGHT });
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0, running = false;
    const t0 = performance.now();
    const loop = (t) => {
      const s = (t - t0) / 1000;
      px += (tx - px) * 0.05;
      plantProg.uniforms.uTime.value = s;
      moteProg.uniforms.uTime.value = s;
      camera.position.set(px + Math.sin(s * 0.12) * 0.12, 1.35, 2.5);
      camera.lookAt([0, lookY, lookZ]);
      renderer.render({ scene, camera });
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // battery rules: stop when hidden OR scrolled out of view
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 },
    );
    io.observe(host);
    const onLost = (e) => { e.preventDefault(); stop(); setFailed(true); };
    gl.canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      gl.canvas.removeEventListener("webglcontextlost", onLost);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [plots, failed, reduced]);

  if (failed || reduced) return <Garden plots={plots} />;
  return (
    <div
      ref={hostRef}
      className="relative h-72 w-full overflow-hidden rounded-xl"
      role="img"
      aria-label={`Garden of ${plots.length} weeks — ${plots.filter((p) => p.stars > 0).length} in bloom`}
    />
  );
}
