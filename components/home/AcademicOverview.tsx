import { Card, CardContent } from '@/components/ui/card'

interface TrendData {
  semester: number
  sgpa: number
}

export function AcademicOverview({ data, currentSem, currentSgpa, cgpa }: { data: TrendData[], currentSem: number, currentSgpa: number, cgpa: number }) {
  const maxBars = 8
  const paddedData = [...data]
  while (paddedData.length < maxBars) {
    paddedData.push({ semester: paddedData.length + 1, sgpa: 0 })
  }

  return (
    <Card className="rounded-2xl border-none shadow-sm overflow-hidden bg-[var(--color-primary)] text-white">
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
        
        <div className="flex-1 space-y-6 w-full">
          <div>
            <h3 className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">Academic Standing</h3>
            <div className="flex items-baseline gap-4">
              <div className="text-5xl font-bold tracking-tighter">{cgpa > 0 ? cgpa.toFixed(2) : '-'}</div>
              <div className="text-white/80 font-medium">CGPA</div>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Current Sem (S{currentSem})</p>
              <p className="text-2xl font-bold">{currentSgpa > 0 ? currentSgpa.toFixed(2) : '-'}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Total Credits</p>
              <p className="text-2xl font-bold">120</p>
            </div>
          </div>
        </div>

        {/* Minimal Sparkline */}
        <div className="w-full md:w-64 h-32 relative flex items-end justify-between px-2">
          {paddedData.map((d) => {
            const heightPct = (d.sgpa / 10) * 100
            const isCurrent = d.semester === currentSem
            const hasData = d.sgpa > 0

            return (
              <div key={d.semester} className="flex flex-col items-center w-6 group relative">
                <div className="w-full h-full flex items-end justify-center h-24">
                  {hasData ? (
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 ${isCurrent ? 'bg-white' : 'bg-white/30 group-hover:bg-white/50'}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  ) : (
                    <div className="w-full h-1 bg-white/10 rounded-t-sm" />
                  )}
                </div>
                <span className={`text-[10px] mt-2 font-bold ${isCurrent ? 'text-white' : 'text-white/50'}`}>
                  S{d.semester}
                </span>
              </div>
            )
          })}
        </div>

      </CardContent>
    </Card>
  )
}
