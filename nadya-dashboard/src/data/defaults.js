export const DEFAULT_SETTINGS = {
  name: "Nadya",
  currency: "IDR",
  locale: "id-ID",
  weekStart: 1, // 1 = Monday, 0 = Sunday
};

// Editable in Settings; `productive` drives the productivity stats.
export const DEFAULT_CATEGORIES = [
  { id: "work", label: "Work", color: "rose", productive: true, archived: false },
  { id: "study", label: "Study", color: "lavender", productive: true, archived: false },
  { id: "entertainment", label: "Entertainment", color: "coral", productive: false, archived: false },
  { id: "social", label: "Social", color: "sky", productive: false, archived: false },
  { id: "rest", label: "Rest", color: "mint", productive: false, archived: false },
  { id: "chores", label: "Chores", color: "sand", productive: false, archived: false },
  { id: "procrastination", label: "Procrastination", color: "mauve", productive: false, archived: false },
];

// Tailwind can't build dynamic class names, so every usable color is mapped
// statically. `hex` feeds SVG charts directly.
export const COLOR_META = {
  rose: { hex: "#E25C72", dot: "bg-rose", text: "text-rose-bright" },
  coral: { hex: "#F2876B", dot: "bg-coral", text: "text-coral" },
  sand: { hex: "#DDBC8E", dot: "bg-sand", text: "text-sand" },
  mint: { hex: "#7ED4B2", dot: "bg-mint", text: "text-mint" },
  sky: { hex: "#85B8E3", dot: "bg-sky", text: "text-sky" },
  lavender: { hex: "#B49CE8", dot: "bg-lavender", text: "text-lavender" },
  mauve: { hex: "#9A7B8C", dot: "bg-mauve", text: "text-mauve" },
};

export const COLOR_NAMES = Object.keys(COLOR_META);

export const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

export const CURRENCIES = ["IDR", "USD", "EUR", "SGD", "MYR"];
