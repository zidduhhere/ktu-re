import { ResultWithComputed } from '@/lib/types'

const FAIL = ['F', 'FE', 'AB']

export function RecentResultsList({ results }: { results: ResultWithComputed[] }) {
  if (results.length === 0) {
    return <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 text-sm text-[var(--color-text-muted)]">No results are published for this semester yet.</p>
  }

  return (
    <ul className="space-y-1">
      {results.map((res) => {
        const tone = res.grade === 'S' || res.grade === 'A+' ? 'text-[var(--color-primary)]' : FAIL.includes(res.grade) ? 'text-[#B42318]' : 'text-[var(--color-ink)]'
        return (
          <li key={res.id} className="grid grid-cols-[1fr_auto_3.5rem] items-center gap-4 rounded-2xl px-5 py-3 odd:bg-[var(--color-zebra)]">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{res.subject}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                <span className="font-mono">{res.subjectCode}</span>
                {res.examType === 'supply' && <span className="ml-2 rounded-full bg-[#B42318] px-2 py-0.5 text-[11px] font-semibold text-white">Supply</span>}
              </p>
            </div>
            <span className="text-sm text-[var(--color-text-muted)]">{res.credits} cr</span>
            <span className={`font-display text-right text-2xl font-extrabold ${tone}`}>{res.grade}</span>
          </li>
        )
      })}
    </ul>
  )
}
