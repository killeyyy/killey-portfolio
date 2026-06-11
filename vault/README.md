# KILLEYYY Vault

This folder is your **second brain** — an [Obsidian](https://obsidian.md)-compatible
markdown vault that lives inside this repo and syncs through GitHub. One place for
everything: clients, business, projects, personal, memory, standing instructions,
and daily notes — so you stop switching tools and forgetting things.

## Folders

| Folder | What goes here |
|---|---|
| `memory/` | Long-term facts/context you want Claude, Codex and the site to know. |
| `instructions/` | Your standing instructions / rules for how AI should work with you. |
| `projects/` | One note per project — ideas, decisions, todos, links. |
| `clients/` | One note per client — scope, contacts, status, money. |
| `business/` | Business/brand strategy, offers, finances, plans. |
| `personal/` | Personal goals, notes, anything private. |
| `daily/` | Daily notes (`YYYY-MM-DD.md`). |

## Set up Obsidian sync (one-time, ~5 minutes)

1. Install **Obsidian** (free) → obsidian.md.
2. Clone this repo to your computer (or use the existing clone).
3. In Obsidian: **Open folder as vault** → choose this `vault/` folder.
4. Install the community plugin **Obsidian Git** (Settings → Community plugins →
   Browse → "Obsidian Git" → Install → Enable).
5. In Obsidian Git settings, enable **auto-pull on startup** and **auto-commit-and-push**
   on an interval (e.g. every 10 min). Now edits in Obsidian sync to GitHub, and
   anything the owner cockpit writes shows up in Obsidian.

> Git is the single source of truth. If you edit the same note in Obsidian and the
> cockpit at once, commit in Obsidian first to avoid a conflict.
