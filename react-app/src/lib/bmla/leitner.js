// 5-box Leitner spaced repetition (pure logic; persistence handled by caller).
// Box review intervals in days; box 0 = relearn now.
export const INTERVALS = [0, 1, 2, 4, 7];

const day = 24 * 60 * 60 * 1000;

/** state: { [cardId]: { box: 0..4, due: epoch-ms } } */
export function gradeCard(state, cardId, correct, now = Date.now()) {
  const cur = state[cardId] || { box: 0, due: 0 };
  const box = correct ? Math.min(cur.box + 1, INTERVALS.length - 1) : 0;
  return { ...state, [cardId]: { box, due: now + INTERVALS[box] * day } };
}

/** Cards due now first, then lowest box; cap at `limit`. */
export function pickSession(cards, state, limit = 12, now = Date.now()) {
  const scored = cards.map((c) => {
    const s = state[c.id] || { box: 0, due: 0 };
    return { card: c, due: s.due <= now, box: s.box };
  });
  scored.sort((a, b) => (a.due === b.due ? a.box - b.box : a.due ? -1 : 1));
  return scored.slice(0, limit).map((s) => s.card);
}
