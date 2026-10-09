'use client'

import { useState, useEffect, useMemo } from 'react'
import { ExamTypeFilter } from '@/components/exams/ExamTypeFilter'
import { ExamCard } from '@/components/exams/ExamCard'
import { ExamServices } from '@/components/exams/ExamServices'
import { Pills } from '@/components/exams/Pills'
import { parseExamDate, daysUntil } from '@/components/exams/examDate'
import { EXAM_SESSIONS } from '@/lib/exam-sessions'
import { ExamRow } from '@/lib/types'

export default function ExamsPage() {
  const [semesters, setSemesters] = useState<number[]>([])
  const [activeSem, setActiveSem] = useState<number>(0)
  const [activeType, setActiveType] = useState<string>('all')
  const [exams, setExams] = useState<ExamRow[]>([])
  const [loadedKey, setLoadedKey] = useState('')

  // Semesters that have results, falling back to S1-S8
  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then((data: { results?: { semester: number }[] }) => {
        const sems = data.results?.length
          ? Array.from(new Set(data.results.map(r => r.semester))).sort((a, b) => a - b)
          : [1, 2, 3, 4, 5, 6, 7, 8]
        setSemesters(sems)
        setActiveSem(sems[sems.length - 1] || 1)
      })
  }, [])

  useEffect(() => {
    if (!activeSem) return
    const key = `${activeSem}-${activeType}`
    const url = new URL('/api/exams', window.location.origin)
    url.searchParams.set('semester', activeSem.toString())
    if (activeType !== 'all') url.searchParams.set('type', activeType)

    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setExams(data.exams)
        setLoadedKey(key)
      })
  }, [activeSem, activeType])

  const { next, upcoming, completed, groups } = useMemo(() => {
    const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date))
    const future = sorted.filter(e => daysUntil(e.date) >= 0)
    const past = sorted.filter(e => daysUntil(e.date) < 0)
    const out: { label: string; items: ExamRow[] }[] = []
    for (const e of [...future, ...past.reverse()]) {
      const label = parseExamDate(e.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
      const last = out[out.length - 1]
      if (last && last.label === label) last.items.push(e)
      else out.push({ label, items: [e] })
    }
    return { next: future[0], upcoming: future.length, completed: past.length, groups: out }
  }, [exams])

  if (semesters.length === 0) return null

  const nextDays = next ? daysUntil(next.date) : null
  const loading = loadedKey !== `${activeSem}-${activeType}`
  const sessions = EXAM_SESSIONS.filter(
    s => s.semesters.includes(activeSem) && (activeType === 'all' || s.examTypes.includes(activeType)),
  )

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-24">
      {/* Countdown */}
      <section
        className={`animate-wipe-in flex min-h-64 flex-col justify-between rounded-[2rem] p-6 md:p-8 ${next ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-accent)] text-[var(--color-ink)]'}`}
      >
        <h1 className={`text-base font-medium ${next ? 'text-white/90' : 'text-[var(--color-text-muted)]'}`}>Exams &middot; Semester {activeSem}</h1>
        {next && nextDays !== null ? (
          <div>
            <div className="flex items-end gap-4">
              <span className="font-display text-[8rem] font-extrabold leading-[0.8] tracking-tighter md:text-[10rem]">{nextDays}</span>
              <span className="pb-2 font-display text-2xl font-bold leading-tight">
                {nextDays === 0 ? 'Exam day' : nextDays === 1 ? 'day to go' : 'days to go'}
                <br />
                <span className="text-lg font-medium text-white/90">{next.subject}</span>
              </span>
            </div>
            <p className="mt-5 text-base text-white/90">
              {parseExamDate(next.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} &middot; {next.time}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              <li className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">{upcoming} upcoming</li>
              {completed > 0 && <li className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">{completed} completed</li>}
            </ul>
          </div>
        ) : (
          <div>
            <p className="font-display text-4xl font-extrabold leading-tight md:text-5xl">No upcoming exams</p>
            <p className="mt-2 text-base text-[var(--color-text-muted)]">
              {completed > 0 ? `${completed} completed in this view.` : 'Nothing is scheduled for this view yet.'}
            </p>
          </div>
        )}
      </section>

      {/* Filters */}
      <div className="space-y-3">
        <Pills
          label="Semester"
          options={semesters.map(s => ({ id: s, label: `Semester ${s}` }))}
          active={activeSem}
          onChange={setActiveSem}
        />
        <ExamTypeFilter active={activeType} onChange={setActiveType} />
      </div>

      {/* Exam services (register, eligibility, revaluation, review) */}
      <ExamServices sessions={sessions} />

      {/* Time table */}
      <section aria-labelledby="time-table" aria-busy={loading} className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        <h2 id="time-table" className="mb-4 font-display text-2xl font-bold text-[var(--color-ink)]">
          Time table
        </h2>
        {groups.length === 0 ? (
          <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-8 text-base text-[var(--color-text-muted)]">
            No time table has been published for this view. Try another semester or exam type.
          </p>
        ) : (
          <div className="space-y-6">
            {groups.map(group => (
              <div key={group.label}>
                <h3 className="mb-2 text-base font-semibold text-[var(--color-text-muted)]">{group.label}</h3>
                <ul className="space-y-1.5">
                  {group.items.map(exam => (
                    <li key={exam.id}>
                      <ExamCard exam={exam} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
