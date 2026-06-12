/** Tiny rose sprig for empty states — so no screen ever reads like an error. */
export function Flourish({ size = 36 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" className="mx-auto mb-2 opacity-80">
      <path d="M24 42 C 24 32, 23 26, 24 18" fill="none" stroke="#1F6F5C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 32 q -8 -1 -11 -7 q 8 0 11 4 z" fill="#7ED4B2" opacity="0.8" />
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle
            key={a}
            cx={24 + 5.2 * Math.cos((a * Math.PI) / 180)}
            cy={14 + 5.2 * Math.sin((a * Math.PI) / 180)}
            r="4.4"
            fill="#E25C72"
          />
        ))}
        <circle cx="24" cy="14" r="3.6" fill="#F78DA3" />
        <circle cx="24" cy="14" r="1.7" fill="#C9A86A" />
      </g>
    </svg>
  );
}
