import { ResultWithComputed } from '@/lib/types'

const ORDER = ['S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F']
const FAIL = ['F', 'FE', 'AB']

export function GradeMix({ results }: { results: ResultWithComputed[] }) {
  const counts = new Map<string, number>()
  for (const r of results) {
    const key = FAIL.includes(r.grade) ? 'F' : r.grade
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const rows = ORDER.filter(g => counts.has(g)).map(g => ({ grade: g, count: counts.get(g) ?? 0 }))
  const max = Math.max(1, ...rows.map(r => r.count))

  const ranked = [...results].filter(r => r.credits > 0).sort((a, b) => b.gradePoint - a.gradePoint)
  const best = ranked[0]
  const lowest = ranked.length > 1 ? ranked[ranked.length - 1] : undefined

  return (
    <aside aria-label="Grade summary" className="space-y-2">
      <section className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6">
        <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">Grade mix</h2>
        {rows.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">Grades will appear here once results are published.</p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {rows.map(r => (
              <li key={r.grade} className="grid grid-cols-[2rem_1fr_1.5rem] items-center gap-3">
                <span className={`font-display text-base font-extrabold ${r.grade === 'F' ? 'text-[#B42318]' : 'text-[var(--color-ink)]'}`}>{r.grade}</span>
                <span aria-hidden className="h-3 rounded-full bg-[var(--color-surface-accent-hover)]">
                  <span
                    className={`block h-3 rounded-full ${r.grade === 'F' ? 'bg-[#B42318]' : 'bg-[var(--color-primary)]'}`}
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </span>
                <span className="text-right text-sm font-semibold tabular-nums text-[var(--color-ink)]">
                  {r.count}
                  <span className="sr-only"> {r.count === 1 ? 'subject' : 'subjects'}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {best && (
        <section className="rounded-[2rem] bg-[var(--color-primary-light)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">Strongest result</h2>
          <p className="mt-1 text-base font-bold leading-snug text-[var(--color-ink)]">{best.subject}</p>
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
            <span className="font-mono">{best.subjectCode}</span>, grade {best.grade}
          </p>
        </section>
      )}
      {lowest && lowest.id !== best?.id && (
        <section className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">Lowest result</h2>
          <p className="mt-1 text-base font-bold leading-snug text-[var(--color-ink)]">{lowest.subject}</p>
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">
            <span className="font-mono">{lowest.subjectCode}</span>, grade {lowest.grade}
          </p>
        </section>
      )}
    </aside>
  )
}
