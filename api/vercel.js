import { verifySession, isConfigured } from "./_lib/session.js";

// Latest deployments -> status pills. Needs VERCEL_TOKEN (+ optional
// VERCEL_PROJECT_ID / VERCEL_TEAM_ID). Without a token -> sample. Deployment
// metadata is mildly sensitive, so once secure auth is configured this requires
// a valid owner session; before that (interim mode) it just returns sample.
export default async function handler(req, res) {
  const TOKEN = process.env.VERCEL_TOKEN;
  const TEAM = process.env.VERCEL_TEAM_ID;
  const PROJ = process.env.VERCEL_PROJECT_ID;

  if (isConfigured() && !verifySession(req)) {
    return res.status(401).json({ error: "auth" });
  }

  try {
    if (!TOKEN) throw new Error("no token");
    const qs = new URLSearchParams({ limit: "8" });
    if (PROJ) qs.set("projectId", PROJ);
    if (TEAM) qs.set("teamId", TEAM);
    const r = await fetch(`https://api.vercel.com/v6/deployments?${qs}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!r.ok) throw new Error(`vercel ${r.status}`);
    const { deployments } = await r.json();
    const data = (deployments || []).map((d) => ({
      uid: d.uid,
      name: d.name,
      url: d.url ? `https://${d.url}` : null,
      state: d.state || d.readyState,
      target: d.target,
      created: d.created,
      branch: d.meta?.githubCommitRef,
      commitMsg: d.meta?.githubCommitMessage,
    }));
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ source: "live", deployments: data });
  } catch {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    return res.status(200).json({
      source: "sample",
      deployments: [
        { uid: "dpl_sample", name: "killey-portfolio", url: "https://killey-portfolio.vercel.app", state: "READY", target: "production", created: 1749438000000, branch: "main", commitMsg: "ship portfolio" },
      ],
    });
  }
}
