// LOCAL-date utilities. ALL day keys ("YYYY-MM-DD") in the app must come from
// this module. Never derive a day key from toISOString() — that returns UTC,
// which shifts dates for anyone east of Greenwich (Nadya is UTC+7: anything
// logged before 07:00 her time would land on yesterday).

const pad = (n) => String(n).padStart(2, "0");

/** Date → local "YYYY-MM-DD". */
export function toDateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

/** "YYYY-MM-DD" → local Date at midnight. */
export function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Day key shifted by n days. */
export function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

export function yesterdayKey() {
  return addDays(todayKey(), -1);
}

/** Inclusive list of day keys from start to end. */
export function rangeKeys(startKey, endKey) {
  const keys = [];
  let k = startKey;
  while (k <= endKey) {
    keys.push(k);
    k = addDays(k, 1);
  }
  return keys;
}

/** Date → local "YYYY-MM". */
export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

/** Day key → its "YYYY-MM" month key. */
export function monthKeyOf(dayKey) {
  return dayKey.slice(0, 7);
}

/** Month key shifted by n months. */
export function addMonths(mKey, n) {
  const [y, m] = mKey.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + n, 1));
}

export function daysInMonth(mKey) {
  const [y, m] = mKey.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

/** All day keys of a month, in order. */
export function monthDayKeys(mKey) {
  const n = daysInMonth(mKey);
  const keys = [];
  for (let d = 1; d <= n; d++) keys.push(`${mKey}-${pad(d)}`);
  return keys;
}

/** Start-of-week day key for the week containing dayKey. weekStart: 0=Sun, 1=Mon. */
export function weekStartKey(dayKey, weekStart = 1) {
  const d = parseKey(dayKey);
  const diff = (d.getDay() - weekStart + 7) % 7;
  d.setDate(d.getDate() - diff);
  return toDateKey(d);
}

/** True between 00:00 and 03:59 — when "today" probably still means yesterday. */
export function isSmallHours(d = new Date()) {
  return d.getHours() < 4;
}
