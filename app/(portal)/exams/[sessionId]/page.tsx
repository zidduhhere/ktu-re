import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { eq, asc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { exams } from '@/lib/db/schema'
import { EXAM_SESSIONS, KIND_LABEL } from '@/lib/exam-sessions'
import { ExamCard } from '@/components/exams/ExamCard'
import { SessionActions } from '@/components/exams/SessionActions'

export default async function ExamSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  const session = await getSession()
  if (!session) return null

  const exam = EXAM_SESSIONS.find(s => s.id === sessionId)
  if (!exam) notFound()

  const rows = await db.select().from(exams).where(eq(exams.studentId, session.studentId)).orderBy(asc(exams.date)).all()
  const schedule = rows.filter(e => exam.semesters.includes(e.semester) && exam.examTypes.includes(e.type))

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      <Link
        href="/exams"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <ArrowLeft size={16} aria-hidden /> All exams
      </Link>

      <header className="rounded-[2rem] bg-[var(--color-primary)] p-6 text-white md:p-8">
        <p className="inline-block rounded-full bg-white/15 px-3.5 py-1 text-sm font-semibold">{KIND_LABEL[exam.kind]}</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{exam.title}</h1>
        <p className="mt-2 text-base text-white/90">
          {exam.scheme} &middot; {exam.year}
        </p>
      </header>

      <SessionActions session={exam} />

      <section aria-labelledby="time-table">
        <h2 id="time-table" className="mb-4 font-display text-2xl font-bold text-[var(--color-ink)]">
          Time table
        </h2>
        {schedule.length === 0 ? (
          <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-8 text-base text-[var(--color-text-muted)]">No time table has been published for this exam yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {schedule.map(e => (
              <li key={e.id}>
                <ExamCard exam={e} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
