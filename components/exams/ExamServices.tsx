import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { KIND_LABEL, type ExamSession } from '@/lib/exam-sessions'

export function ExamServices({ sessions }: { sessions: ExamSession[] }) {
  if (sessions.length === 0) {
    return (
      <section aria-labelledby="exam-services">
        <h2 id="exam-services" className="font-display text-2xl font-bold text-[var(--color-ink)]">
          Exam services
        </h2>
        <p className="mt-3 rounded-[2rem] bg-[var(--color-surface-accent)] p-6 text-sm text-[var(--color-text-muted)]">
          No exam sessions are open for this semester and type.
        </p>
      </section>
    )
  }

  return (
    <section aria-labelledby="exam-services">
      <h2 id="exam-services" className="font-display text-2xl font-bold text-[var(--color-ink)]">
        Exam services
      </h2>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">Register, check eligibility or ask for a review.</p>
      <ul className="mt-4 space-y-2">
        {sessions.map(session => (
          <li key={session.id}>
            <Link
              href={`/exams/${session.id}`}
              className="group block rounded-3xl bg-[var(--color-surface-accent)] p-5 transition-colors hover:bg-[var(--color-surface-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  session.kind === 'supply' ? 'bg-[#B42318] text-white' : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                }`}
              >
                {KIND_LABEL[session.kind]}
              </span>
              <span className="mt-2 block text-base font-bold leading-snug text-[var(--color-ink)]">{session.title}</span>
              <span className="mt-1 flex items-center justify-between gap-3 text-sm text-[var(--color-text-muted)]">
                <span>
                  {session.scheme}, {session.year}
                </span>
                <span className="flex shrink-0 items-center gap-1 font-semibold text-[var(--color-primary)]">
                  {session.actions.length} services
                  <ChevronRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
