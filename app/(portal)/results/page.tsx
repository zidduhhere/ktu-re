'use client'

import { useState, useEffect } from 'react'
import { SemesterTabs } from '@/components/results/SemesterTabs'
import { ResultTable } from '@/components/results/ResultTable'
import { ResultWithComputed } from '@/lib/types'
import { Printer, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ResultsPage() {
  const [semesters, setSemesters] = useState<number[]>([])
  const [activeSem, setActiveSem] = useState<number>(1)
  const [results, setResults] = useState<ResultWithComputed[]>([])
  const [sgpa, setSgpa] = useState<number>(0)
  const [cgpa, setCgpa] = useState<number>(0)
  const [loadedSem, setLoadedSem] = useState<number | null>(null)

  // Fetch unique semesters once on mount
  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        const sems = Array.from(new Set((data.results as { semester: number }[]).map(r => r.semester))).sort((a, b) => a - b)
        if (sems.length > 0) {
          setSemesters(sems)
          setActiveSem(sems[sems.length - 1]) // Default to latest
        }
      })
  }, [])

  // Fetch data when active semester changes
  useEffect(() => {
    if (activeSem) {
      fetch(`/api/results?semester=${activeSem}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results)
          setSgpa(data.sgpa)
          setCgpa(data.cgpa)
          setLoadedSem(activeSem)
        })
    }
  }, [activeSem])

  if (semesters.length === 0) return null

  const loading = loadedSem !== activeSem

  return (
    <div className="pb-24 max-w-5xl mx-auto animate-fade-up">
      {/* Hero Section */}
      <div className="py-8 md:py-12 flex flex-col md:flex-row md:items-end justify-between gap-8 print:hidden mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text)]">Academic Record</h1>
          <p className="text-[var(--color-muted)] text-base md:text-lg max-w-md leading-relaxed">
            Your complete academic history, including semester grades and overall performance.
          </p>
          <div className="pt-2 flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="rounded-xl border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] transition-colors h-11 px-5"
            >
              <Printer className="mr-2" size={16} /> Print Transcript
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end bg-[var(--color-surface)]/50 p-8 rounded-3xl border border-[var(--color-border)] min-w-[240px]">
          <span className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-2">Cumulative GPA</span>
          <span className="text-6xl md:text-7xl font-black text-[var(--color-primary)] tracking-tighter tabular-nums leading-none">
            {cgpa.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="print:hidden">
        <SemesterTabs semesters={semesters} activeSem={activeSem} onChange={setActiveSem} />
      </div>

      <div className={loading ? 'opacity-40 transition-opacity duration-300' : 'transition-opacity duration-500'}>
        <ResultTable results={results} sgpa={sgpa} />
      </div>

      {/* Print only header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold mb-2">Official Transcript</h1>
        <p className="text-gray-500 mb-4">Cumulative GPA: {cgpa.toFixed(2)}</p>
      </div>
    </div>
  )
}
