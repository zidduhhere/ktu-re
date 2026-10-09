import { Card, CardContent } from '@/components/ui/card'

interface TrendData {
  semester: number
  sgpa: number
}

export function SgpaTrendChart({ data, currentSem }: { data: TrendData[]; currentSem: number }) {
  const maxBars = 8
  const paddedData = [...data]
  while (paddedData.length < maxBars) {
    paddedData.push({ semester: paddedData.length + 1, sgpa: 0 })
  }

  return (
    <Card className="rounded-2xl border-none shadow-sm h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <h3 className="font-semibold text-lg mb-6 text-[var(--color-text)]">Performance Trend</h3>
        
        <div className="flex-1 relative mt-auto h-40">
          {/* Y-axis gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-dashed border-[var(--color-border)] w-full"></div>
            <div className="border-t border-dashed border-[var(--color-border)] w-full"></div>
            <div className="border-t border-[var(--color-border)] w-full"></div>
          </div>
          
          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-[1px]">
            {paddedData.map((d) => {
              const heightPct = (d.sgpa / 10) * 100
              const isCurrent = d.semester === currentSem
              const hasData = d.sgpa > 0

              return (
                <div key={d.semester} className="flex flex-col items-center w-8 group">
                  <div className="relative w-full h-32 flex items-end">
                    {hasData && (
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 ease-out cursor-pointer
                          ${isCurrent ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)] opacity-40 group-hover:opacity-60'}
                        `}
                        style={{ height: `${heightPct}%` }}
                        title={`S${d.semester}: ${d.sgpa.toFixed(2)}`}
                      />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>
                    S{d.semester}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
