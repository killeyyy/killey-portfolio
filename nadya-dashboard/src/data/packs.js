// Seed packets — curated starter bundles you preview and plant in two taps.
// A packet can mix habits, trackers and weekly intentions; planting never
// duplicates what's already growing and never overwrites an existing
// intention (see lib/seeds.js). Prompt packs feed the nightly journal prompt.

export const SEED_PACKETS = [
  {
    id: "soft-mornings",
    emoji: "🌅",
    name: "Soft mornings",
    tagline: "Begin the day on your own side.",
    items: [
      { kind: "habit", name: "Sunlight first", emoji: "☀️", color: "sand" },
      { kind: "habit", name: "Make the bed", emoji: "🛏️", color: "sky" },
      { kind: "habit", name: "Stretch 5 minutes", emoji: "🧘", color: "rose" },
      { kind: "tracker", name: "Water", emoji: "💧", color: "sky", trackerKind: "count", unit: "glasses", step: 1, target: 8 },
    ],
  },
  {
    id: "deep-focus",
    emoji: "🎯",
    name: "Deep focus",
    tagline: "For study and work seasons.",
    items: [
      { kind: "habit", name: "Plan tomorrow", emoji: "📝", color: "lavender" },
      { kind: "habit", name: "Phone-away hour", emoji: "📵", color: "mauve" },
      { kind: "tracker", name: "Reading", emoji: "📖", color: "coral", trackerKind: "minutes", step: 15, target: 30 },
      { kind: "intention", categoryId: "study", label: "Study", minutes: 360 },
    ],
  },
  {
    id: "gentle-evenings",
    emoji: "🌙",
    name: "Gentle evenings",
    tagline: "Wind down like you mean it.",
    items: [
      { kind: "habit", name: "Evening pages", emoji: "🕯️", color: "lavender" },
      { kind: "habit", name: "Screens off by 11", emoji: "🌑", color: "mauve" },
      { kind: "tracker", name: "Sleep", emoji: "🌙", color: "lavender", trackerKind: "minutes", step: 30, target: 480 },
    ],
  },
  {
    id: "body-kind",
    emoji: "🌿",
    name: "Body kind",
    tagline: "Care, never punishment.",
    items: [
      { kind: "habit", name: "Morning walk", emoji: "🚶‍♀️", color: "mint" },
      { kind: "habit", name: "Stretch 5 minutes", emoji: "🧘", color: "rose" },
      { kind: "tracker", name: "Steps", emoji: "👟", color: "mint", trackerKind: "count", unit: "steps", step: 1000, target: 8000 },
    ],
  },
  {
    id: "stillness",
    emoji: "🕊️",
    name: "Stillness",
    tagline: "A few quiet minutes, kept.",
    items: [
      { kind: "habit", name: "Quiet practice", emoji: "🕊️", color: "sand" },
      { kind: "habit", name: "Gratitude pause", emoji: "💗", color: "rose" },
      { kind: "tracker", name: "Prayer", emoji: "🤲", color: "sand", trackerKind: "count", unit: "prayers", step: 1, target: 5 },
    ],
  },
  {
    id: "tidy-nest",
    emoji: "🧺",
    name: "Tidy nest",
    tagline: "Home feels lighter, head follows.",
    items: [
      { kind: "habit", name: "10-minute tidy", emoji: "🧺", color: "sand" },
      { kind: "habit", name: "Dishes before bed", emoji: "🍽️", color: "sky" },
      { kind: "intention", categoryId: "chores", label: "Chores", minutes: 120 },
    ],
  },
];

export const PROMPT_PACKS = [
  {
    id: "soft-reflections",
    emoji: "🌸",
    name: "Soft reflections",
    prompts: [
      "What felt gentle today?",
      "Who made you smile, even briefly?",
      "What did you do just for you?",
      "What's one thing you handled well?",
      "Where did you feel most at ease?",
      "What would you tell this morning's you?",
    ],
  },
  {
    id: "tiny-brave",
    emoji: "🦁",
    name: "Tiny brave things",
    prompts: [
      "What did you do today that was a little brave?",
      "What almost stopped you — and didn't?",
      "What's something you said no to?",
      "Where did you surprise yourself?",
      "What feels 1% easier than last week?",
      "What would brave-you do tomorrow?",
    ],
  },
  {
    id: "gratitude-deeper",
    emoji: "💗",
    name: "Gratitude, deeper",
    prompts: [
      "Name something ordinary that quietly works for you.",
      "Who helped you long ago in a way that still matters?",
      "What part of your body worked hard for you today?",
      "What's a comfort you usually overlook?",
      "What made today different from yesterday?",
      "What do you have now that you once wished for?",
    ],
  },
  {
    id: "unwind",
    emoji: "🌙",
    name: "Unwind",
    prompts: [
      "What can wait until tomorrow?",
      "What was today's softest moment?",
      "What's one worry you can set down tonight?",
      "How does your body feel right now?",
      "What are you looking forward to?",
      "What made you laugh, or almost?",
    ],
  },
];
