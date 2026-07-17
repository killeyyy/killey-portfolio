import { verifySession } from "./_lib/session.js";

// Latest deployments -> status pills. Live data is OWNER-ONLY:
//   - no VERCEL_TOKEN              -> public sample (no sensitive data)
//   - token set, no valid session -> 401 (never leak deploy metadata to the public)
//   - token set + valid session   -> live
// Gated on token presence + a valid session (NOT on isConfigured), so live
// deployment data is never exposed before secure auth is set up.
const SAMPLE = {
  source: "sample",
  deployments: [
    { uid: "dpl_sample", name: "killey-portfolio", url: "https://killey-portfolio.vercel.app", state: "READY", target: "production", created: 1749438000000, branch: "main", commitMsg: "ship portfolio" },
  ],
};

export default async function handler(req, res) {
  const TOKEN = process.env.VERCEL_TOKEN;
  const TEAM = process.env.VERCEL_TEAM_ID;
  const PROJ = process.env.VERCEL_PROJECT_ID;

  if (!TOKEN) {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    return res.status(200).json(SAMPLE);
  }
  if (verifySession(req)?.role !== "owner") {
    return res.status(401).json({ error: "auth" });
  }
  try {
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
    return res.status(200).json(SAMPLE);
  }
}
