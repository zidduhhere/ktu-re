'use client'

import { Fragment, useState, useEffect, useMemo } from 'react'
import { ExamTypeFilter } from '@/components/exams/ExamTypeFilter'
import { ExamCard } from '@/components/exams/ExamCard'
import { ExamRunway } from '@/components/exams/ExamRunway'
import { ExamServices } from '@/components/exams/ExamServices'
import { Pills } from '@/components/exams/Pills'
import { parseExamDate, daysUntil } from '@/components/exams/examDate'
import { EXAM_SESSIONS } from '@/lib/exam-sessions'
import { ExamRow } from '@/lib/types'

const DAY = 86_400_000

/** Whole days free between two consecutive papers (0 when they are on back-to-back days). */
function daysBetween(a: ExamRow, b: ExamRow) {
  return Math.max(0, Math.round((parseExamDate(b.date).getTime() - parseExamDate(a.date).getTime()) / DAY) - 1)
}

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
    <div className="min-w-0 space-y-8 pb-24">
      {/* Countdown + semester runway */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 [&>*]:min-w-0">
        <section
          className={`animate-wipe-in flex min-h-72 flex-col justify-between rounded-[2rem] p-6 md:p-8 lg:col-span-5 ${next ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-accent)] text-[var(--color-ink)]'}`}
        >
          <h1 className={`text-base font-medium ${next ? 'text-white/90' : 'text-[var(--color-text-muted)]'}`}>Next exam</h1>
          {next && nextDays !== null ? (
            <div>
              <div className="flex items-end gap-4">
                <span className="font-display text-[8rem] font-extrabold leading-[0.8] tracking-tighter xl:text-[9rem]">{nextDays}</span>
                <span className="pb-2 font-display text-2xl font-bold leading-tight">{nextDays === 0 ? 'Exam day' : nextDays === 1 ? 'day to go' : 'days to go'}</span>
              </div>
              <p className="mt-5 font-display text-xl font-bold leading-snug">{next.subject}</p>
              <p className="mt-1 text-base text-white/90">
                {parseExamDate(next.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}, {next.time}
              </p>
              <p className="mt-4 text-sm font-semibold text-white/90">
                {upcoming} upcoming{completed > 0 ? `, ${completed} completed` : ''}
              </p>
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
        <div className="min-w-0 lg:col-span-7">
          <ExamRunway exams={exams} semester={activeSem} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <Pills
          label="Semester"
          options={semesters.map(s => ({ id: s, label: `S${s}`, ariaLabel: `Semester ${s}` }))}
          active={activeSem}
          onChange={setActiveSem}
        />
        <ExamTypeFilter active={activeType} onChange={setActiveType} />
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12">
        {/* Time table */}
        <section
          aria-labelledby="time-table"
          aria-busy={loading}
          className={`min-w-0 lg:col-span-8 ${loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}`}
        >
          <h2 id="time-table" className="mb-4 font-display text-2xl font-bold text-[var(--color-ink)]">
            Time table
          </h2>
          {groups.length === 0 ? (
            <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-8 text-base text-[var(--color-text-muted)]">
              No time table has been published for this view. Try another semester or exam type.
            </p>
          ) : (
            <div className="space-y-8">
              {groups.map(group => (
                <div key={group.label}>
                  <h3 className="mb-2 text-base font-semibold text-[var(--color-text-muted)]">{group.label}</h3>
                  <ul className="space-y-1.5">
                    {group.items.map((exam, i) => {
                      const prev = group.items[i - 1]
                      const gap = prev && daysUntil(exam.date) >= 0 && daysUntil(prev.date) >= 0 ? daysBetween(prev, exam) : null
                      return (
                        <Fragment key={exam.id}>
                          {gap !== null && (
                            <li aria-hidden className="pl-6 text-xs text-[var(--color-text-muted)]">
                              {gap === 0 ? 'Back to back' : `${gap} ${gap === 1 ? 'day' : 'days'} to prepare`}
                            </li>
                          )}
                          <li>
                            <ExamCard exam={exam} />
                          </li>
                        </Fragment>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Services rail */}
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <ExamServices sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  )
}
