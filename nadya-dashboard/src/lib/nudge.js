// The gentle evening nudge — Era 2 PR 10's "reminders", in honest form:
// in-app only (no Notification permission, no push server, nothing leaves
// the device), opt-in, once per evening, and only when the page is still
// blank. A reminder should feel like a candle, not an alarm.
import * as storage from "./storage.js";
import { todayKey } from "./dates.js";
import { journalHasContent } from "./journey.js";

/** Pure decision — node-testable. */
export function shouldNudge({ nudgeHour, journal, today, hour, lastSeen }) {
  if (!nudgeHour) return false; // off by default
  if (hour < nudgeHour) return false; // not evening yet
  if (lastSeen === today) return false; // once per evening
  if (journalHasContent(journal[today])) return false; // page already written
  return true;
}

/**
 * Side-effecting wrapper for the app: checks, marks seen, returns whether
 * to show. `nadya:nudgeSeen` is device-local (excluded from sync/backups).
 */
export function takeNudge(settings, journal, now = new Date()) {
  const today = todayKey();
  const show = shouldNudge({
    nudgeHour: settings.nudgeHour || 0,
    journal,
    today,
    hour: now.getHours(),
    lastSeen: storage.get("nudgeSeen"),
  });
  if (show) storage.set("nudgeSeen", today);
  return show;
}
