import { ResultWithComputed } from '@/lib/types'

const FAIL = ['F', 'FE', 'AB']

export function ResultTable({ results }: { results: ResultWithComputed[] }) {
  if (results.length === 0) {
    return <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-8 text-base text-[var(--color-text-muted)]">No results are published for this semester yet.</p>
  }

  return (
    <ul className="space-y-1.5">
      {results.map(res => {
        const isTop = res.grade === 'S' || res.grade === 'A+'
        const isFail = FAIL.includes(res.grade)
        return (
          <li
            key={res.id}
            className="grid grid-cols-[1fr_auto_4rem] items-center gap-4 rounded-3xl bg-[var(--color-surface-accent)] px-5 py-3.5 print:bg-transparent"
          >
            <div className="min-w-0">
              <p className="text-base font-bold leading-snug text-[var(--color-ink)]">{res.subject}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-[var(--color-text-muted)]">
                <span className="font-mono">{res.subjectCode}</span>
                {res.examType === 'supply' && <span className="rounded-full bg-[#B42318] px-2.5 py-0.5 text-xs font-semibold text-white">Supply</span>}
              </p>
            </div>
            <p className="text-right text-sm text-[var(--color-text-muted)]">
              {res.credits} {res.credits === 1 ? 'credit' : 'credits'}
              <span className="block text-xs">{res.gradePoint} points</span>
            </p>
            <p
              className={`text-right font-display text-3xl font-extrabold leading-none ${
                isFail ? 'text-[#B42318]' : isTop ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)]'
              }`}
            >
              <span className="sr-only">Grade </span>
              {res.grade}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
