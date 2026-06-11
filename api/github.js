// Recent repos + public push activity for the cockpit. Works WITHOUT a token
// (public GitHub API, 60 req/hr) so the cockpit shows REAL data out of the box;
// set GITHUB_TOKEN (5,000/hr) for headroom. Maps to a whitelist of safe fields.
// Any error / rate-limit -> HTTP 200 with sample data so the panel never breaks.
// Public, read-only data only (already visible on github.com) — no session gate.
export default async function handler(req, res) {
  const USER = process.env.GITHUB_USER || "killeyyy";
  const TOKEN = process.env.GITHUB_TOKEN;
  const H = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "killeyyy-cockpit",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
  try {
    const [repoRes, evtRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&direction=desc&per_page=6&type=owner`, { headers: H }),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, { headers: H }),
    ]);
    if (!repoRes.ok || !evtRes.ok) throw new Error(`gh ${repoRes.status}/${evtRes.status}`);

    const repos = (await repoRes.json()).map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      pushedAt: r.pushed_at,
      stars: r.stargazers_count,
      language: r.language,
      fork: r.fork,
    }));

    const rawEvents = await evtRes.json();
    const events = rawEvents
      .filter((e) => ["PushEvent", "CreateEvent", "ReleaseEvent", "PullRequestEvent"].includes(e.type))
      .slice(0, 8)
      .map((e) => ({
        type: e.type,
        repo: e.repo?.name,
        createdAt: e.created_at,
        commits: e.type === "PushEvent" ? (e.payload?.commits || []).map((c) => c.message).slice(0, 3) : [],
      }));

    // 8-week contribution-ish heatmap derived from push event days (truthful: it
    // reflects public push activity, not GitHub's private contribution graph).
    const days = 56;
    const counts = new Array(days).fill(0);
    const now = Date.now();
    for (const e of rawEvents) {
      if (e.type !== "PushEvent") continue;
      const ageDays = Math.floor((now - new Date(e.created_at).getTime()) / 86400000);
      if (ageDays >= 0 && ageDays < days) counts[days - 1 - ageDays] += (e.payload?.commits?.length || 1);
    }

    res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json({ source: "live", user: USER, repos, events, heatmap: counts });
  } catch {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    return res.status(200).json(SAMPLE);
  }
}

const SAMPLE = {
  source: "sample",
  user: "killeyyy",
  repos: [
    { name: "killey-portfolio", url: "https://github.com/killeyyy/killey-portfolio", description: "Cinematic portfolio + owner cockpit", pushedAt: "2026-06-09T03:00:00Z", stars: 0, language: "JavaScript", fork: false },
    { name: "shadow-kombat", url: "https://github.com/killeyyy/shadow-kombat", description: "Original 2D fighter in Godot", pushedAt: "2026-06-01T12:00:00Z", stars: 0, language: "GDScript", fork: false },
  ],
  events: [
    { type: "PushEvent", repo: "killeyyy/killey-portfolio", createdAt: "2026-06-09T03:00:00Z", commits: ["perf: LazyMotion + code-split", "feat: rich case studies"] },
  ],
  heatmap: Array.from({ length: 56 }, (_, i) => (i % 9 === 0 ? 3 : i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0)),
};
