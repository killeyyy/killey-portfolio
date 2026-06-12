// Pure planting logic for seed packets (data/packs.js) — node-testable.
// Rules: never duplicate something already growing (matched by name,
// case-insensitive, archived things don't block replanting), never overwrite
// an existing weekly intention, and report what was skipped so the UI can
// say "already growing" instead of failing.
import { uid } from "./uid.js";

export function planPacket(packet, { habits = [], trackers = [], categories = [] }) {
  const habitNames = new Set(
    habits.filter((h) => !h.archivedAt).map((h) => h.name.toLowerCase()),
  );
  const trackerNames = new Set(
    trackers.filter((t) => !t.archivedAt).map((t) => t.name.toLowerCase()),
  );

  const newHabits = [];
  const newTrackers = [];
  const catPatches = []; // [{ id, weeklyTarget }]
  let skipped = 0;

  for (const item of packet.items) {
    if (item.kind === "habit") {
      if (habitNames.has(item.name.toLowerCase())) {
        skipped += 1;
      } else {
        newHabits.push({
          id: uid(),
          name: item.name,
          emoji: item.emoji,
          color: item.color,
          createdAt: Date.now(),
          archivedAt: null,
        });
      }
    } else if (item.kind === "tracker") {
      if (trackerNames.has(item.name.toLowerCase())) {
        skipped += 1;
      } else {
        newTrackers.push({
          id: uid(),
          name: item.name,
          emoji: item.emoji,
          color: item.color,
          kind: item.trackerKind,
          unit: item.unit || "",
          step: item.step || 1,
          target: item.trackerKind === "check" ? 1 : item.target || 0,
          weekTarget: item.trackerKind === "check" ? item.weekTarget || 7 : 0,
          createdAt: Date.now(),
          archivedAt: null,
        });
      }
    } else if (item.kind === "intention") {
      const cat = categories.find((c) => c.id === item.categoryId && !c.archived);
      if (cat && !(cat.weeklyTarget > 0)) {
        catPatches.push({ id: cat.id, weeklyTarget: item.minutes });
      } else {
        skipped += 1;
      }
    }
  }

  return { newHabits, newTrackers, catPatches, skipped, planted: newHabits.length + newTrackers.length + catPatches.length };
}

/** Tonight's prompt from a pack — same day, same prompt (local day key). */
export function promptForDay(pack, dateKey) {
  if (!pack?.prompts?.length) return null;
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) | 0;
  return pack.prompts[Math.abs(h) % pack.prompts.length];
}
