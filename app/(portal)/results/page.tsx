'use client'

import { useState, useEffect, useMemo } from 'react'
import { Printer } from 'lucide-react'
import { SemesterBars } from '@/components/results/SemesterBars'
import { GradeMix } from '@/components/results/GradeMix'
import { ResultTable } from '@/components/results/ResultTable'
import { ResultWithComputed, computeSgpa } from '@/lib/types'

export default function ResultsPage() {
  const [all, setAll] = useState<ResultWithComputed[] | null>(null)
  const [cgpa, setCgpa] = useState(0)
  const [activeSem, setActiveSem] = useState(0)

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then((data: { results?: ResultWithComputed[]; cgpa?: number }) => {
        const rows = data.results ?? []
        setAll(rows)
        setCgpa(data.cgpa ?? 0)
        const sems = rows.map(r => r.semester)
        setActiveSem(sems.length ? Math.max(...sems) : 0)
      })
      .catch(() => setAll([]))
  }, [])

  const { points, current, subjects, sgpa, credits, delta, previous } = useMemo(() => {
    const rows = all ?? []
    const sems = Array.from(new Set(rows.map(r => r.semester))).sort((a, b) => a - b)
    const pts = sems.map(s => ({ semester: s, sgpa: computeSgpa(rows.filter(r => r.semester === s)) }))
    const cur = rows.filter(r => r.semester === activeSem)
    const idx = pts.findIndex(p => p.semester === activeSem)
    const cs = idx >= 0 ? pts[idx].sgpa : 0
    const prev = idx > 0 ? pts[idx - 1] : undefined
    // A supply attempt replaces the regular attempt when counting subjects and credits
    const latest = new Map<string, ResultWithComputed>()
    for (const r of cur) if (!latest.has(r.subjectCode) || r.examType === 'supply') latest.set(r.subjectCode, r)
    return {
      points: pts,
      current: cur,
      subjects: latest.size,
      sgpa: cs,
      credits: Array.from(latest.values()).reduce((sum, r) => sum + r.credits, 0),
      previous: prev,
      delta: prev ? Math.round((cs - prev.sgpa) * 100) / 100 : null,
    }
  }, [all, activeSem])

  if (all === null) return null

  if (all.length === 0) {
    return (
      <div className="pb-24">
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-[var(--color-ink)]">Results</h1>
        <p className="mt-4 max-w-md rounded-[2rem] bg-[var(--color-surface-accent)] p-8 text-base text-[var(--color-text-muted)]">
          No results have been published yet. They will appear here, with your GPA, as soon as they are released.
        </p>
      </div>
    )
  }

  const trend =
    delta === null || !previous
      ? `Semester ${activeSem} SGPA is ${sgpa.toFixed(2)}.`
      : delta === 0
        ? `Semester ${activeSem} SGPA is ${sgpa.toFixed(2)}, the same as semester ${previous.semester}.`
        : `Semester ${activeSem} SGPA is ${sgpa.toFixed(2)}, ${delta > 0 ? 'up' : 'down'} ${Math.abs(delta).toFixed(2)} from semester ${previous.semester}.`

  return (
    <div className="min-w-0 space-y-8 pb-24">
      {/* CGPA + semester selector */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 print:hidden [&>*]:min-w-0">
        <section className="animate-wipe-in flex min-h-72 flex-col justify-between rounded-[2rem] bg-[var(--color-primary)] p-6 text-white md:p-8 lg:col-span-5">
          <h1 className="text-base font-medium text-white/90">Cumulative GPA</h1>
          <div>
            <p className="font-display text-[7rem] font-extrabold leading-[0.8] tracking-tighter tabular-nums xl:text-[8.5rem]">{cgpa.toFixed(2)}</p>
            <p className="mt-6 max-w-sm text-base text-white/90">{trend}</p>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-primary-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Printer size={16} aria-hidden /> Print transcript
            </button>
          </div>
        </section>
        <div className="lg:col-span-7">
          <SemesterBars data={points} active={activeSem} onChange={setActiveSem} />
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="mb-1 text-3xl font-bold">Official transcript</h1>
        <p className="text-gray-500">Cumulative GPA {cgpa.toFixed(2)}</p>
      </div>

      {/* Results for the selected semester */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12 [&>*]:min-w-0">
        <section aria-labelledby="sem-results" className="lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id="sem-results" className="font-display text-2xl font-bold text-[var(--color-ink)]">
              Semester {activeSem} results
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {subjects} {subjects === 1 ? 'subject' : 'subjects'}, {credits} credits, SGPA {sgpa.toFixed(2)}
            </p>
          </div>
          <ResultTable results={current} />
        </section>

        <div className="lg:col-span-4 print:hidden">
          <div className="lg:sticky lg:top-6">
            <GradeMix results={current} />
          </div>
        </div>
      </div>
    </div>
  )
}
