import { ExamRow } from '@/lib/types'
import { parseExamDate, daysUntil } from './examDate'

const DAY = 86_400_000

function shortDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** A date track for one semester: each paper is a bead, with today marked and the breaks between papers readable at a glance. */
export function ExamRunway({ exams, semester }: { exams: ExamRow[]; semester: number }) {
  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date))

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-72 flex-col justify-between rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">Semester {semester} at a glance</h2>
        <p className="max-w-sm text-base text-[var(--color-text-muted)]">
          Nothing is scheduled for this view yet. Papers will appear on this track as soon as dates are published.
        </p>
      </div>
    )
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const times = sorted.map(e => parseExamDate(e.date).getTime())
  const start = Math.min(today, times[0]) - 3 * DAY
  const end = Math.max(today, times[times.length - 1]) + 3 * DAY
  const span = Math.max(end - start, 7 * DAY)
  const pct = (t: number) => ((t - start) / span) * 100

  const upcoming = sorted.filter(e => daysUntil(e.date) >= 0)
  const nextId = upcoming[0]?.id
  let longestBreak = 0
  for (let i = 1; i < upcoming.length; i++) {
    const gap = Math.round((parseExamDate(upcoming[i].date).getTime() - parseExamDate(upcoming[i - 1].date).getTime()) / DAY) - 1
    longestBreak = Math.max(longestBreak, gap)
  }
  const last = parseExamDate(sorted[sorted.length - 1].date)
  const first = parseExamDate(sorted[0].date)

  const stats = [
    { value: upcoming.length, label: upcoming.length === 1 ? 'paper left' : 'papers left' },
    { value: longestBreak, label: longestBreak === 1 ? 'day, longest break' : 'days, longest break' },
    { value: shortDate(last), label: 'last paper', small: true },
  ]

  return (
    <section aria-labelledby="runway-title" className="flex min-h-72 min-w-0 flex-col justify-between gap-6 rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
      <div>
        <h2 id="runway-title" className="font-display text-2xl font-bold text-[var(--color-ink)]">
          Semester {semester} at a glance
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {sorted.length} {sorted.length === 1 ? 'paper' : 'papers'}, {shortDate(first)} to {shortDate(last)}
        </p>
      </div>

      <div className="-mx-2 overflow-x-auto px-2 pb-1">
        <ol aria-label="Exam dates" className="relative h-36 min-w-[640px]">
          {/* track */}
          <li aria-hidden className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 list-none rounded-full bg-[var(--color-surface-accent-hover)]" />
          <li
            aria-hidden
            className="absolute left-0 top-1/2 h-2 -translate-y-1/2 list-none rounded-full bg-[var(--color-primary-soft)]"
            style={{ width: `${pct(today)}%` }}
          />
          {/* today */}
          <li aria-label="Today" className="absolute top-0 list-none" style={{ left: `${pct(today)}%` }}>
            <span className="absolute left-0 top-0 -translate-x-1/2 rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-xs font-semibold text-white">Today</span>
            <span aria-hidden className="absolute left-0 top-6 h-12 w-0.5 -translate-x-1/2 rounded-full bg-[var(--color-ink)]" />
          </li>
          {/* long breaks between upcoming papers */}
          {upcoming.slice(1).map((exam, i) => {
            const prevTime = parseExamDate(upcoming[i].date).getTime()
            const days = Math.round((parseExamDate(exam.date).getTime() - prevTime) / DAY) - 1
            if (days < 7) return null
            const mid = (prevTime + parseExamDate(exam.date).getTime()) / 2
            return (
              <li key={`gap-${exam.id}`} className="absolute top-1/2 z-10 list-none" style={{ left: `${pct(mid)}%` }}>
                <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                  {days} days to prepare
                </span>
              </li>
            )
          })}
          {/* papers */}
          {sorted.map((exam, i) => {
            const t = times[i]
            const isPast = daysUntil(exam.date) < 0
            const isNext = exam.id === nextId
            const above = i % 2 === 1
            return (
              <li key={exam.id} className="absolute top-1/2 list-none" style={{ left: `${pct(t)}%` }}>
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    isNext
                      ? 'h-6 w-6 bg-[var(--color-primary)] ring-4 ring-[var(--color-primary-soft)]'
                      : isPast
                        ? 'h-3.5 w-3.5 bg-[var(--color-text-muted)]'
                        : 'h-4 w-4 bg-[var(--color-ink)]'
                  }`}
                />
                <span
                  className={`absolute left-0 w-24 -translate-x-1/2 text-center leading-tight ${above ? 'bottom-5' : 'top-5'}`}
                >
                  <span className={`block font-mono text-xs ${isNext ? 'font-bold text-[var(--color-primary)]' : 'text-[var(--color-ink)]'}`}>{exam.subjectCode}</span>
                  <span className="block text-xs text-[var(--color-text-muted)]">
                    {shortDate(parseExamDate(exam.date))}
                    <span className="sr-only">, {exam.subject}</span>
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <dl className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label}>
            <dd className={`font-display font-extrabold leading-none tracking-tight text-[var(--color-ink)] ${s.small ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>{s.value}</dd>
            <dt className="mt-1.5 text-sm text-[var(--color-text-muted)]">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
