/** Editable numeric matrix grid shared by the solver tools. */
export default function MatrixGrid({ grid, onCell, accent = [], ariaLabel = "matrix" }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(3rem, 1fr))` }}>
        {grid.map((row, r) =>
          row.map((v, c) => (
            <input
              key={`${r}-${c}`}
              value={v}
              inputMode="numeric"
              onChange={(e) => onCell(r, c, e.target.value)}
              aria-label={`${ariaLabel} row ${r + 1}, column ${c + 1}`}
              className={`w-16 rounded-md border bg-ink px-2 py-1.5 text-center font-mono text-sm text-silver focus:border-crimson/60 ${
                accent.includes(c) ? "border-gold/40" : "border-line/70"
              }`}
            />
          )),
        )}
      </div>
    </div>
  );
}
