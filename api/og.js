import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

// Branded 1200x630 social share card in the "Garnet Aurora" palette.
// Written WITHOUT JSX (plain satori element objects) so it needs no tsconfig /
// react / TypeScript — only @vercel/og. Flexbox-only (every node display:flex).
//   /api/og                        -> default KILLEYYY card
//   /api/og?title=Shadow%20Kombat  -> per-page title
//   /api/og?title=...&kicker=Case%20study
const box = (style, children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

export default function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "I build cinematic games, sites & content with AI.").slice(0, 110);
  const kicker = (searchParams.get("kicker") || "KILLEYYY · Hassan Sardar Shah").slice(0, 80);

  const dot = (color, mr) => box({ width: 20, height: 20, borderRadius: 10, background: color, marginRight: mr });

  const element = box(
    {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "80px",
      background: "linear-gradient(135deg, #0E0E10 0%, #17171B 55%, #2A0E14 100%)",
      color: "#E8E6E1",
      fontFamily: "sans-serif",
    },
    [
      box({ alignItems: "center", color: "#C9A86A", fontSize: 32, letterSpacing: 4, textTransform: "uppercase" }, kicker),
      box({ fontSize: 76, fontWeight: 700, lineHeight: 1.06, color: "#E8E6E1", maxWidth: 1000 }, title),
      box({ alignItems: "center" }, [
        dot("#C8323C", 10),
        dot("#7C5CFF", 10),
        dot("#22D3EE", 18),
        { type: "span", props: { style: { display: "flex", fontSize: 30, color: "#A7A29A" }, children: "killey-portfolio.vercel.app" } },
      ]),
    ]
  );

  return new ImageResponse(element, { width: 1200, height: 630 });
}
