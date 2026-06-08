/** Reusable kicker + title block. */
export default function SectionHeading({ kicker, title, id }) {
  return (
    <div className="mb-10">
      {kicker && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
          {kicker}
        </p>
      )}
      <h2 id={id} className="text-fluid-xl font-semibold leading-tight text-silver">
        {title}
      </h2>
    </div>
  );
}
