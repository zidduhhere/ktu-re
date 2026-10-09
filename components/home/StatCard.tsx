import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  sub?: string
  accent?: boolean
}

export function StatCard({ title, value, sub, accent }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-none shadow-sm transition-transform duration-150 hover:scale-[1.02]">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-[var(--color-muted)] mb-2">{title}</h3>
        <div className={`text-3xl font-bold ${accent ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
          {value}
        </div>
        {sub && <p className="text-xs mt-1 font-medium text-[var(--color-muted)]">{sub}</p>}
      </CardContent>
    </Card>
  )
}
