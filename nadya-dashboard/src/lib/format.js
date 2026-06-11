import { parseKey, todayKey, yesterdayKey } from "./dates.js";

/** 135 → "2h 15m", 45 → "45m", 120 → "2h". */
export function formatMinutes(min) {
  const m = Math.max(0, Math.round(min || 0));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

/** 1500000 → "Rp 1.500.000" (whole units; per-currency via settings). */
export function formatMoney(amount, currency = "IDR", locale = "id-ID") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `${currency} ${Math.round(amount || 0)}`;
  }
}

/** "2026-06-11" → "Wed, 11 Jun" (or "Today"/"Yesterday"). */
export function formatDayLabel(key, { relative = true } = {}) {
  if (relative && key === todayKey()) return "Today";
  if (relative && key === yesterdayKey()) return "Yesterday";
  return parseKey(key).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** "2026-06" → "June 2026". */
export function formatMonthLabel(mKey) {
  const [y, m] = mKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/** "2026-06" → "Jun". */
export function formatMonthShort(mKey) {
  const [y, m] = mKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short" });
}

/** Epoch ms → "14:05". */
export function formatTime(ms) {
  return new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Full date for headers: "Wednesday, 11 June". */
export function formatFullDate(d = new Date()) {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
