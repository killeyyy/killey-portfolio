# SETUP — environment variables (what to paste into Vercel, when ready)

> You only need these when we turn on the **secure login** and the **live cockpit data**.
> The site works without them (the cockpit shows tasteful **sample** data until then).
> **Rule:** these are secrets — they live ONLY in Vercel, never in the code or git. Never
> prefix a secret with `VITE_` (that would bake it into the public bundle).

**Where to paste:** Vercel → your project → **Settings → Environment Variables** → add each
Name/Value (scope: Production + Preview) → redeploy.

---

## 1. Secure owner login (unlocks `/owner` real auth)

| Name | What it is | How to get the value |
|---|---|---|
| `SESSION_SECRET` | random key that signs your login cookie | run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and paste the output |
| `OWNER_PASSWORD_HASH` | a hash of your owner password (the password itself is never stored) | run the one-liner below with your chosen password |

Generate the password hash (replace `YOUR-PASSWORD`):
```bash
node -e "const c=require('crypto');const s=c.randomBytes(16);const h=c.scryptSync('YOUR-PASSWORD',s,64);console.log(s.toString('hex')+':'+h.toString('hex'))"
```
Paste the printed `salt:hash` string as `OWNER_PASSWORD_HASH`. (Change your password later by
re-running this and updating the value.)

---

## 2. Live cockpit data (each is optional; a missing one just shows "sample")

| Name | Unlocks | How to get it |
|---|---|---|
| `GITHUB_TOKEN` | GitHub repos / activity / contribution heatmap | github.com → Settings → Developer settings → **Fine-grained PAT** (read-only, public repos) |
| `VERCEL_TOKEN` | latest deployments + statuses | vercel.com → Account Settings → **Tokens** → create |
| `NOTION_TOKEN` + `NOTION_DB_ID` | leads / clients / pipeline from Notion | notion.so/my-integrations → new integration → copy the secret; share your DB with it; `NOTION_DB_ID` = the database id from its URL |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` + `GOOGLE_REFRESH_TOKEN` | recent Google Drive files | Google Cloud console → OAuth credentials (Drive **read-only** scope), then a one-time refresh-token exchange |

> Note: the **GitHub** feed is already **live with no token** (public data). `VERCEL_TOKEN`,
> `NOTION_*` and `GOOGLE_*` add their feeds. Live **Vercel/Notion/Drive** data is owner-only, so it
> only turns on once you've also set up the **secure login** above (§1) — set `SESSION_SECRET` +
> `OWNER_PASSWORD_HASH` first, then add these. Each tile shows a truthful **Live**/**Sample** badge.

---

## 3. Custom domain (optional, recommended before launch)
When you point a real domain (e.g. `killeyyy.com`) at the Vercel project, update the absolute
URLs in `react-app/index.html` (JSON-LD `url`, OG/canonical), `react-app/public/sitemap.xml`,
and `robots.txt` to that domain so SEO + share cards are correct.
