import { Tile } from "../ui/Tile.jsx";

/**
 * Habits whose days read brighter in her own mood data. Observation, not
 * judgement: only positive links are ever shown (lib/correlations.js), and
 * with too little data the tile gently explains how patterns appear.
 */
export function MoodLinks({ links, moodDayCount }) {
  if (!links.length && moodDayCount < 5) return null;
  return (
    <Tile title="What lifts you">
      {links.length === 0 ? (
        <p className="text-sm text-muted">
          Keep tapping a mood now and then — after a few weeks, the habits that brighten your
          days show up here.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {links.map(({ habit, lift, days }) => (
            <li key={habit.id} className="flex items-center gap-2 text-sm text-cream">
              <span className="min-w-0 flex-1 truncate">
                {habit.emoji && <span className="mr-1">{habit.emoji}</span>}
                Days with <span className="font-semibold">{habit.name}</span> read brighter
              </span>
              <span className="shrink-0 rounded-full bg-mint/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-mint">
                +{lift} mood
              </span>
              <span className="shrink-0 text-[10px] tabular-nums text-muted">{days}d</span>
            </li>
          ))}
        </ul>
      )}
    </Tile>
  );
}
