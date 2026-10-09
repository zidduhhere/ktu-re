import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { students, results, exams, notifications } from '@/lib/db/schema'
import { eq, and, desc, sql, asc } from 'drizzle-orm'
import { computeSgpa, gradeToPoints } from '@/lib/types'

import { DashboardStats } from '@/components/home/DashboardStats'
import { RecentResultsList } from '@/components/home/RecentResultsList'
import { CalendarWidget } from '@/components/home/CalendarWidget'
import { SidebarNotifications } from '@/components/home/SidebarNotifications'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getSession()
  if (!session) return null

  // 1. Fetch Student Details
  const student = await db.select().from(students).where(eq(students.id, session.studentId)).get()
  if (!student) return null

  // 2. Fetch all results to compute SGPA trend and current semester SGPA
  const allResults = await db.select().from(results).where(eq(results.studentId, session.studentId)).all()

  const semGroups = allResults.reduce((acc, r) => {
    if (!acc[r.semester]) acc[r.semester] = []
    acc[r.semester].push({ grade: r.grade, credits: r.credits })
    return acc
  }, {} as Record<number, { grade: string, credits: number }[]>)

  const trendData = Object.entries(semGroups).map(([sem, rows]) => ({
    semester: Number(sem),
    sgpa: computeSgpa(rows)
  })).sort((a, b) => a.semester - b.semester)

  const currentSgpa = trendData.find(t => t.semester === student.semester)?.sgpa || 0
  const cgpa = computeSgpa(allResults)

  // Calculate earned credits and backlogs
  // Note: A real app would check if a backlog was cleared in a later sem. 
  // Here we simplify by checking if the latest result for a subject is a fail grade.
  const latestResultsMap = new Map<string, typeof allResults[0]>()
  allResults.forEach(r => latestResultsMap.set(r.subjectCode, r))

  let earnedCredits = 0
  let backlogs = 0
  latestResultsMap.forEach(r => {
    if (['F', 'FE', 'AB'].includes(r.grade)) {
      backlogs++
    } else {
      earnedCredits += r.credits
    }
  })

  // Current semester results
  const currentResults = allResults
    .filter(r => r.semester === student.semester)
    .map(r => ({ ...r, gradePoint: gradeToPoints(r.grade) }))

  // 3. Fetch exams
  const allExams = await db.select().from(exams).where(eq(exams.studentId, session.studentId)).orderBy(asc(exams.date)).all()
  const todayIso = new Date().toISOString().split('T')[0]
  const nextExam = allExams.find(e => e.date >= todayIso)
  const daysToExam = nextExam
    ? Math.round((new Date(nextExam.date.slice(0, 10)).getTime() - new Date(todayIso).getTime()) / 86_400_000)
    : null
  const examDate = nextExam ? new Date(nextExam.date) : null

  // 4. Fetch notifications
  const notifs = await db.select().from(notifications)
    .where(eq(notifications.studentId, session.studentId))
    .orderBy(desc(notifications.createdAt))
    .limit(3)
    .all()

  const unreadCountRow = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.studentId, session.studentId), eq(notifications.read, false)))
    .get()
  const unreadCount = unreadCountRow?.count || 0

  const facts = [
    { label: 'Register number', value: student.id, mono: true },
    { label: 'College', value: student.college },
    { label: 'Semester', value: String(student.semester) },
    { label: 'Phone', value: student.phone },
  ]

  return (
    <div className="mx-auto max-w-[1400px] space-y-10">
      {/* Identity */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-[var(--color-ink)] md:text-6xl">
              Hi, {student.name}
            </h1>
            <p className="mt-3 text-base text-[var(--color-text-muted)]">B.Tech {student.branch}</p>
          </div>
          <Link
            href="/profile"
            className="group inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:self-auto"
          >
            View details
            <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="text-sm text-[var(--color-text-muted)]">{f.label}</dt>
              <dd className={`mt-0.5 truncate text-base font-semibold text-[var(--color-ink)] ${f.mono ? 'font-mono' : ''}`} title={f.value}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Next exam + standing */}
      <section className="grid grid-cols-1 gap-2 lg:grid-cols-12">
        {nextExam && examDate ? (
          <Link
            href="/exams"
            className="animate-wipe-in group flex min-h-72 flex-col justify-between rounded-[2rem] bg-[var(--color-primary)] p-6 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ink)] lg:col-span-5 md:p-8"
          >
            <p className="text-base font-medium text-white/90">Next exam</p>
            <div>
              <div className="flex items-end gap-3">
                <span className="font-display text-[8rem] font-extrabold leading-[0.8] tracking-tighter md:text-[10rem]">
                  {examDate.getDate()}
                </span>
                <span className="pb-2 font-display text-2xl font-bold leading-tight">
                  {examDate.toLocaleDateString('en-GB', { month: 'short' })}
                  <br />
                  <span className="text-lg font-medium text-white/90">{examDate.toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                </span>
              </div>
              <p className="mt-6 text-xl font-bold leading-snug">{nextExam.subject}</p>
              <p className="mt-1 text-base text-white/90">
                <span className="font-mono">{nextExam.subjectCode}</span> &middot; {nextExam.type.toUpperCase()} &middot; {nextExam.time}
              </p>
              <p className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-[var(--color-ink)]">
                {daysToExam === 0 ? 'Today' : daysToExam === 1 ? 'Tomorrow' : `In ${daysToExam} days`}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex min-h-72 flex-col justify-between rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8 lg:col-span-5">
            <p className="text-base font-medium text-[var(--color-text-muted)]">Next exam</p>
            <div>
              <p className="font-display text-4xl font-extrabold leading-tight text-[var(--color-ink)]">No exams scheduled</p>
              <Link href="/exams" className="mt-3 inline-block text-sm font-semibold text-[var(--color-primary)] underline underline-offset-4">
                Check the exam timetable
              </Link>
            </div>
          </div>
        )}
        <div className="lg:col-span-7">
          <DashboardStats totalCredits={earnedCredits} cgpa={cgpa} sgpa={currentSgpa} backlogs={backlogs} />
        </div>
      </section>

      {/* Results + calendar + updates */}
      <section className="grid grid-cols-1 gap-10 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">Semester {student.semester} results</h2>
            <Link href="/results" className="text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">
              All results
            </Link>
          </div>
          <RecentResultsList results={currentResults} />
        </div>

        <div className="space-y-10 xl:col-span-5">
          <div>
            <h2 className="mb-3 font-display text-2xl font-bold text-[var(--color-ink)]">Calendar</h2>
            <CalendarWidget exams={allExams} />
          </div>
          <div>
            <h2 className="mb-3 flex items-center gap-3 font-display text-2xl font-bold text-[var(--color-ink)]">
              Updates
              {unreadCount > 0 && <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 font-sans text-sm font-semibold text-white">{unreadCount} new</span>}
            </h2>
            <SidebarNotifications notifications={notifs} />
          </div>
        </div>
      </section>
    </div>
  )
}
