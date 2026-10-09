import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResultWithComputed } from '@/lib/types'

export function ResultTable({ results, sgpa }: { results: ResultWithComputed[], sgpa: number }) {
  // Count grade distribution
  const distribution = results.reduce((acc, r) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const maxCount = Math.max(...Object.values(distribution), 1)

  return (
    <div className="space-y-8">
      {/* Top Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* SGPA Summary */}
        <div className="bg-[var(--color-surface)]/50 rounded-3xl p-6 md:p-8 border border-[var(--color-border)] flex flex-col justify-center items-start shadow-sm">
          <span className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest mb-3">Semester GPA</span>
          <span className="text-6xl font-black text-[var(--color-primary)] tracking-tighter tabular-nums leading-none">
            {sgpa.toFixed(2)}
          </span>
          <p className="text-sm text-[var(--color-muted)] mt-4 font-medium">Performance for the current term</p>
        </div>

        {/* Grade Distribution Graph */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[var(--color-border)] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-widest mb-6 block">Grade Distribution</span>
          <div className="flex h-32 items-end gap-2 md:gap-4 w-full">
            {['S', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map(grade => {
              const count = distribution[grade] || 0
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
              const isZero = count === 0
              const isFail = grade === 'F'

              return (
                <div key={grade} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group cursor-default">
                  <span className={`text-xs font-bold transition-colors ${isZero ? 'text-transparent' : 'text-[var(--color-text)] group-hover:text-[var(--color-primary)]'}`}>
                    {count}
                  </span>
                  <div className="w-full flex justify-center h-full items-end">
                    <div 
                      className={`w-full max-w-[2.5rem] rounded-t-md transition-all duration-1000 ease-out ${
                        isZero ? 'bg-transparent' : 
                        isFail ? 'bg-red-500' : 'bg-[var(--color-primary)]/90 group-hover:bg-[var(--color-primary)]'
                      }`} 
                      style={{ height: `${pct}%`, minHeight: isZero ? '0' : '4px' }}
                    ></div>
                  </div>
                  <div className="text-sm font-bold text-[var(--color-muted)] group-hover:text-[var(--color-text)] transition-colors mt-1">
                    {grade}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Course Results</h3>
        <p className="text-sm text-[var(--color-muted)]">Detailed breakdown of your academic performance</p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[var(--color-surface)] border-b-[var(--color-border)] hover:bg-[var(--color-surface)]">
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-[var(--color-muted)] h-12 w-24">Code</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-[var(--color-muted)] h-12">Subject</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-[var(--color-muted)] h-12">Type</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-[var(--color-muted)] h-12 text-center w-16">Cr.</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-[var(--color-muted)] h-12 text-center w-24">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-[var(--color-muted)] font-medium">No results found for this semester.</TableCell>
              </TableRow>
            ) : (
              results.map((res, i) => {
                const isOutstanding = res.grade === 'S' || res.grade === 'A+' || res.grade === 'A'
                const isFail = ['F', 'FE', 'AB'].includes(res.grade)
                
                return (
                  <TableRow 
                    key={res.id} 
                    className="border-b-[var(--color-border)] last:border-none transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell className="font-mono text-sm text-[var(--color-muted)] font-medium">{res.subjectCode}</TableCell>
                    <TableCell className="font-medium text-[var(--color-text)]">{res.subject}</TableCell>
                    <TableCell>
                      {res.examType === 'supply' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                          Supply
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">{res.examType}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-[var(--color-muted)] font-medium">{res.credits}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-md font-bold text-sm ${isOutstanding ? 'bg-[var(--color-surface)] text-[var(--color-primary)]' : isFail ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-700'}`}>
                        {res.grade}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
