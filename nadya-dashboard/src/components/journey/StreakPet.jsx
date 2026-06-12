// Mawar 🌹 — the streak pet. She only ever GROWS with the day-streak;
// there is no wilt/decay state by design (no failure-shaming).
import { useId } from "react";

const STAGES = [
  { min: 30, key: "radiant" },
  { min: 14, key: "double" },
  { min: 7, key: "bloom" },
  { min: 3, key: "bud" },
  { min: 1, key: "sprout" },
  { min: 0, key: "seed" },
];

export function petStage(streak) {
  return STAGES.find((s) => streak >= s.min).key;
}

/** Stage copy, personalised with the pet's (nameable) name. */
export function petCopy(stage, name = "your plant") {
  return {
    seed: `${name} is a tiny seed — log anything today and she'll wake up.`,
    sprout: `${name} just sprouted! Come back tomorrow and she'll keep growing.`,
    bud: `${name} has her first bud — she loves your consistency.`,
    bloom: `${name} is blooming! A full week of showing up.`,
    double: `${name} is flourishing — two weeks strong.`,
    radiant: `${name} is radiant. A month of showing up for yourself. 🌟`,
  }[stage];
}

const Flower = ({ cx, cy, r, petalFill }) => (
  <g>
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <circle
        key={a}
        cx={cx + r * 0.85 * Math.cos((a * Math.PI) / 180)}
        cy={cy + r * 0.85 * Math.sin((a * Math.PI) / 180)}
        r={r * 0.62}
        fill={petalFill}
      />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.62} fill="#F78DA3" />
    <circle cx={cx} cy={cy} r={r * 0.3} fill="#C9A86A" />
  </g>
);

const Face = ({ cx, cy }) => (
  <g fill="#0F0B0D">
    <g className="blink">
      <circle cx={cx - 5} cy={cy - 2} r={1.6} />
      <circle cx={cx + 5} cy={cy - 2} r={1.6} />
    </g>
    <path d={`M ${cx - 4} ${cy + 3} Q ${cx} ${cy + 6.5} ${cx + 4} ${cy + 3}`} fill="none" stroke="#0F0B0D" strokeWidth="1.6" strokeLinecap="round" />
  </g>
);

const Butterfly = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-12)`}>
    <ellipse cx="-3" cy="0" rx="3.4" ry="2.3" fill="#B49CE8" />
    <ellipse cx="3" cy="0" rx="3.4" ry="2.3" fill="#85B8E3" />
    <rect x="-0.7" y="-2.6" width="1.4" height="5.2" rx="0.7" fill="#0F0B0D" />
  </g>
);

const Leaf = ({ x, y, flip = false }) => (
  <path
    d={`M ${x} ${y} q ${flip ? -14 : 14} -4 ${flip ? -16 : 16} -12 q ${flip ? 4 : -4} 12 ${flip ? 16 : -16} 12 z`}
    fill="#7ED4B2"
  />
);

/** size ≈ rendered px height. */
export function StreakPet({ streak = 0, size = 150 }) {
  const stage = petStage(streak);
  const gradId = useId();
  const petalFill = `url(#${gradId})`;
  return (
    <svg
      viewBox="0 0 120 140"
      width={size * 0.86}
      height={size}
      aria-label={`Your streak plant, ${stage} stage`}
      role="img"
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F78DA3" />
          <stop offset="100%" stopColor="#C8323C" />
        </radialGradient>
      </defs>
      {/* plant sways; pot stays still */}
      <g className="sway">
        {stage !== "seed" && (
          <path d="M60 104 C 60 84, 58 72, 60 52" fill="none" stroke="#1F6F5C" strokeWidth="4" strokeLinecap="round" />
        )}
        {stage === "seed" && <ellipse cx="60" cy="100" rx="5" ry="6.5" fill="#C9A86A" />}
        {stage !== "seed" && <Leaf x={60} y={88} />}
        {["bud", "bloom", "double", "radiant"].includes(stage) && <Leaf x={60} y={74} flip />}

        {stage === "sprout" && (
          <g>
            <Leaf x={60} y={58} />
            <Leaf x={60} y={58} flip />
          </g>
        )}
        {stage === "bud" && <ellipse cx="60" cy="48" rx="9" ry="12" fill="#C8323C" />}
        {["bloom", "double", "radiant"].includes(stage) && (
          <g>
            <Flower cx={60} cy={42} r={15} petalFill={petalFill} />
            <Face cx={60} cy={42} />
          </g>
        )}
        {["double", "radiant"].includes(stage) && (
          <g>
            <path d="M60 70 q -16 -2 -24 -14" fill="none" stroke="#1F6F5C" strokeWidth="3" strokeLinecap="round" />
            <Flower cx={33} cy={52} r={9} petalFill={petalFill} />
          </g>
        )}
        {stage === "radiant" && (
          <g fill="#C9A86A" className="animate-pulse">
            <path d="M88 28 l 2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2 z" />
            <path d="M24 22 l 1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8 z" />
            <circle cx="92" cy="60" r="2" />
          </g>
        )}
        {stage === "radiant" && <Butterfly x={90} y={44} />}
      </g>

      {/* pot + soil */}
      <ellipse cx="60" cy="104" rx="20" ry="3.5" fill="#3A2620" />
      <path d="M40 104 L 80 104 L 74 132 L 46 132 Z" fill="#7B4A3A" />
      <rect x="44" y="114" width="32" height="3" rx="1.5" fill="#94604C" opacity="0.6" />
      <rect x="36" y="100" width="48" height="8" rx="4" fill="#94604C" />
    </svg>
  );
}
