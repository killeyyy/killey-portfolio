// Themes are MOODS, not palette swaps: each carries its colour tokens
// (CSS, in index.css) AND its own ambient character — how the WebGL
// aurora breathes (speed/warp) — so switching theme changes how the app
// *behaves*, not just how it's painted. That's the differentiator.
export const THEMES = [
  {
    id: "rose",
    label: "Rosé",
    tagline: "warm dusk garden",
    // preview swatches: [bg, lead, glow]
    preview: ["#0F0B0D", "#E25C72", "#F2876B"],
    gl: { speed: 1.0, warp: 1.0 }, // gentle evening air
  },
  {
    id: "ocean",
    label: "Tide",
    tagline: "deep slow water",
    preview: ["#090D12", "#5BA8E8", "#56C8D8"],
    gl: { speed: 0.65, warp: 1.7 }, // long heavy swells
  },
  {
    id: "forest",
    label: "Moss",
    tagline: "wind through leaves",
    preview: ["#0B0F0B", "#5FBF8A", "#D9A95F"],
    gl: { speed: 1.45, warp: 0.8 }, // quick light breeze
  },
  {
    id: "mono",
    label: "Ink",
    tagline: "near-still fog",
    preview: ["#0C0C0E", "#C8C6C0", "#9A9892"],
    gl: { speed: 0.4, warp: 0.5 }, // barely moves
  },
];

export const DEFAULT_THEME = "rose";

export function themeById(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/** Apply a theme to the document (tokens via data attribute + browser chrome). */
export function applyTheme(id) {
  if (typeof document === "undefined") return;
  if (!id || id === DEFAULT_THEME) delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = id;
  // keep the browser/PWA chrome in step with the new ink
  const ink = getComputedStyle(document.documentElement).getPropertyValue("--c-ink").trim();
  if (ink) {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", `rgb(${ink.split(/\s+/).join(" ")})`);
  }
}
