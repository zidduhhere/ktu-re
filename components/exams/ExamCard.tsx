import { ExamRow } from '@/lib/types'
import { Clock, Hash } from 'lucide-react'
import { parseExamDate, daysUntil, countdownLabel } from './examDate'

const TYPE_LABEL: Record<string, string> = {
  ese: 'End semester',
  minor: 'Minor',
  major: 'Major',
  supply: 'Supplementary',
}

export function ExamCard({ exam, nested }: { exam: ExamRow; nested?: boolean }) {
  const date = parseExamDate(exam.date)
  const days = daysUntil(exam.date)
  const isPast = days < 0
  const isSoon = days >= 0 && days <= 7

  const tone = nested ? 'bg-white/70' : isPast ? 'bg-transparent' : isSoon ? 'bg-[var(--color-primary-soft)]' : 'bg-[var(--color-surface-accent)]'

  return (
    <div className={`flex items-center gap-4 rounded-3xl px-4 py-3 ${tone} ${isPast && !nested ? 'opacity-75' : ''}`}>
      <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl ${isPast ? 'bg-[var(--color-surface-accent)] text-[var(--color-text-muted)]' : 'bg-[var(--color-ink)] text-white'}`}>
        <span className="font-display text-xl font-extrabold leading-none">{date.getDate()}</span>
        <span className="mt-0.5 text-xs font-medium">{date.toLocaleDateString('en-GB', { month: 'short' })}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <h3 className="text-base font-bold leading-snug text-[var(--color-ink)]">{exam.subject}</h3>
          <span className="font-mono text-xs text-[var(--color-text-muted)]">{exam.subjectCode}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${exam.type === 'supply' ? 'bg-[#B42318] text-white' : 'bg-white/70 text-[var(--color-ink)]'}`}>
            {TYPE_LABEL[exam.type] ?? exam.type}
          </span>
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-sm text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Clock size={13} aria-hidden /> {exam.time}
          </span>
          {exam.hallTicket && (
            <span className="inline-flex items-center gap-1 font-mono">
              <Hash size={13} aria-hidden /> {exam.hallTicket}
              <span className="sr-only"> hall ticket</span>
            </span>
          )}
        </p>
      </div>

      <p className={`hidden shrink-0 text-right text-sm font-bold sm:block ${isPast ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-ink)]'}`}>
        {countdownLabel(days)}
        <span className="block text-xs font-medium text-[var(--color-text-muted)]">{date.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
      </p>
    </div>
  )
}
