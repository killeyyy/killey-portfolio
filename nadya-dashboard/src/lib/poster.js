// Client-side share poster: 1080×1920 canvas → Web Share API (files) with a
// download fallback. No deps; fonts are awaited before drawing (lazy-loaded
// webfonts otherwise silently fall back in fillText).
import { parseKey } from "./dates.js";

const W = 1080;
const H = 1920;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const fmt = (k) => parseKey(k).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** Draws the weekly poster and returns a PNG blob. */
export async function renderPoster({ name, start, end, persona, stats }) {
  await Promise.all([
    document.fonts.load('800 120px "Baloo 2"'),
    document.fonts.load('700 64px "Baloo 2"'),
    document.fonts.load('500 40px "Figtree"'),
  ]).catch(() => {});

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // ink base + soft aurora tints
  ctx.fillStyle = "#0F0B0D";
  ctx.fillRect(0, 0, W, H);
  let g = ctx.createRadialGradient(W * 0.2, H * 0.12, 60, W * 0.2, H * 0.12, 700);
  g.addColorStop(0, "rgba(226,92,114,0.22)");
  g.addColorStop(1, "rgba(226,92,114,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  g = ctx.createRadialGradient(W * 0.85, H * 0.8, 60, W * 0.85, H * 0.8, 800);
  g.addColorStop(0, "rgba(242,135,107,0.16)");
  g.addColorStop(1, "rgba(242,135,107,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // header
  ctx.fillStyle = "#A9989F";
  ctx.font = '500 40px "Figtree", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("RUANG NADYA · WEEK WRAPPED", W / 2, 150);
  ctx.fillStyle = "#F4EDEA";
  ctx.font = '700 64px "Baloo 2", sans-serif';
  ctx.fillText(`${fmt(start)} – ${fmt(end)}`, W / 2, 240);

  // persona
  ctx.font = "160px serif";
  ctx.fillText(persona.emoji, W / 2, 480);
  const grad = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
  grad.addColorStop(0, "#F78DA3");
  grad.addColorStop(1, "#F2876B");
  ctx.fillStyle = grad;
  ctx.font = '800 96px "Baloo 2", sans-serif';
  ctx.fillText(persona.name, W / 2, 620);
  ctx.fillStyle = "#A9989F";
  ctx.font = '500 40px "Figtree", sans-serif';
  ctx.fillText(persona.desc, W / 2, 690);

  // stat blocks (2×2)
  const bw = 440;
  const bh = 300;
  const gap = 40;
  const x0 = (W - bw * 2 - gap) / 2;
  const y0 = 800;
  stats.slice(0, 4).forEach((s, i) => {
    const x = x0 + (i % 2) * (bw + gap);
    const y = y0 + Math.floor(i / 2) * (bh + gap);
    ctx.fillStyle = "rgba(36,27,33,0.9)";
    roundRect(ctx, x, y, bw, bh, 36);
    ctx.fill();
    ctx.strokeStyle = "rgba(226,92,114,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = s.hex || "#F78DA3";
    ctx.font = '800 88px "Baloo 2", sans-serif';
    ctx.fillText(s.value, x + bw / 2, y + 150);
    ctx.fillStyle = "#A9989F";
    ctx.font = '500 36px "Figtree", sans-serif';
    ctx.fillText(s.label, x + bw / 2, y + 225);
  });

  // footer
  ctx.fillStyle = "#F4EDEA";
  ctx.font = '700 52px "Baloo 2", sans-serif';
  ctx.fillText(`One week. All ${name}. 🌹`, W / 2, 1640);
  ctx.fillStyle = "#A9989F";
  ctx.font = '500 34px "Figtree", sans-serif';
  ctx.fillText("ruang-nadya.vercel.app", W / 2, 1710);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/** Share the poster via the native sheet, else download it. */
export async function sharePoster(opts) {
  const blob = await renderPoster(opts);
  if (!blob) return false;
  const file = new File([blob], `week-wrapped-${opts.start}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "My week, wrapped" });
      return true;
    } catch {
      /* user cancelled — fall through to download */
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return true;
}
