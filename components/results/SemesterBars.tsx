export interface SemesterPoint {
  semester: number
  sgpa: number
}

/** SGPA per semester. The bars double as the semester selector. */
export function SemesterBars({ data, active, onChange }: { data: SemesterPoint[]; active: number; onChange: (sem: number) => void }) {
  return (
    <section aria-labelledby="sem-bars" className="flex min-w-0 flex-col justify-between gap-6 rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
      <div>
        <h2 id="sem-bars" className="font-display text-2xl font-bold text-[var(--color-ink)]">
          Semester by semester
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">SGPA, with the scale running from 5 to 10. Select a semester to see its results.</p>
      </div>

      <div role="group" aria-label="Semester" className="flex h-64 items-stretch gap-2 md:gap-3">
        {data.map(point => {
          const isActive = point.semester === active
          return (
            <button
              key={point.semester}
              type="button"
              aria-pressed={isActive}
              aria-label={`Semester ${point.semester}, SGPA ${point.sgpa.toFixed(2)}`}
              onClick={() => onChange(point.semester)}
              className="group flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-end gap-2 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span className="flex w-full flex-1 flex-col items-center justify-end gap-1.5">
                <span className={`text-sm font-bold tabular-nums ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)]'}`}>{point.sgpa.toFixed(2)}</span>
                <span
                  className={`block w-full rounded-t-2xl rounded-b-md transition-colors ${
                    isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary-soft)] group-hover:bg-[var(--color-primary-glow)]'
                  }`}
                  style={{ height: `${Math.max(0.5, Math.min(1, (point.sgpa - 5) / 5)) * 11}rem` }}
                />
              </span>
              <span className={`text-sm font-semibold ${isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-text-muted)]'}`}>S{point.semester}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
