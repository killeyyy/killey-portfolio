import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

// Branded 1200x630 social share card in the "Garnet Aurora" palette.
// @vercel/og is flexbox-only (every container needs display:flex). Usage:
//   /api/og                              -> default KILLEYYY card
//   /api/og?title=Shadow%20Kombat        -> per-page title
//   /api/og?title=...&kicker=Case%20study
export default function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "I build cinematic games, sites & content with AI.").slice(0, 110);
  const kicker = (searchParams.get("kicker") || "KILLEYYY · Hassan Sardar Shah").slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0E0E10 0%, #17171B 55%, #2A0E14 100%)",
          color: "#E8E6E1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#C9A86A", fontSize: 32, letterSpacing: 4, textTransform: "uppercase" }}>
          {kicker}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.06, color: "#E8E6E1", maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 20, height: 20, borderRadius: 10, background: "#C8323C" }} />
          <div style={{ display: "flex", width: 20, height: 20, borderRadius: 10, background: "#7C5CFF" }} />
          <div style={{ display: "flex", width: 20, height: 20, borderRadius: 10, background: "#22D3EE" }} />
          <span style={{ display: "flex", fontSize: 30, color: "#A7A29A", marginLeft: 8 }}>killey-portfolio.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
