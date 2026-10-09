import { Trophy, TrendingUp, GraduationCap, AlertCircle, CheckCircle2, type LucideIcon } from 'lucide-react'

interface DashboardStatsProps {
  totalCredits: number
  cgpa: number
  sgpa: number
  backlogs: number
}

const REQUIRED_CREDITS = 160

function Stat({ label, value, note, alert, icon: Icon }: { label: string; value: string | number; note: string; alert?: boolean; icon: LucideIcon }) {
  return (
    <div className="flex min-h-36 flex-col justify-between rounded-[2rem] bg-[var(--color-surface-accent)] p-6 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
        <div className={`p-2 rounded-xl ${alert ? 'bg-[#B42318]/10 text-[#B42318]' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>
      <div>
        <span className={`font-display text-5xl font-extrabold leading-none tracking-tight ${alert ? 'text-[#B42318]' : 'text-[var(--color-ink)]'}`}>
          {value}
        </span>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{note}</p>
      </div>
    </div>
  )
}

export function DashboardStats({ totalCredits, cgpa, sgpa, backlogs }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Stat label="Cumulative GPA" value={cgpa > 0 ? cgpa.toFixed(2) : '-'} note="Overall performance" icon={Trophy} />
      <Stat label="Current SGPA" value={sgpa > 0 ? sgpa.toFixed(2) : '-'} note="This semester" icon={TrendingUp} />
      <Stat label="Credits Earned" value={totalCredits} note={`of ${REQUIRED_CREDITS} required`} icon={GraduationCap} />
      <Stat
        label="Backlogs"
        value={backlogs}
        note={backlogs === 0 ? 'None pending' : 'Clear these first'}
        alert={backlogs > 0}
        icon={backlogs > 0 ? AlertCircle : CheckCircle2}
      />
    </div>
  )
}
