import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { NotificationRow } from '@/lib/types'
import { FileText, CalendarDays, Bell } from 'lucide-react'

export function NotificationStrip({ notifications }: { notifications: NotificationRow[] }) {
  if (notifications.length === 0) return null

  return (
    <Card className="rounded-2xl border-none shadow-sm overflow-hidden flex items-center bg-white">
      <div className="flex-1 flex overflow-hidden">
        {notifications.map((notif) => {
          const Icon = notif.type === 'result' ? FileText : notif.type === 'exam' ? CalendarDays : Bell
          return (
            <div 
              key={notif.id} 
              className={`flex-1 flex items-center gap-3 px-6 py-4 border-r border-[var(--color-border)] last:border-none`}
            >
              <div className={`p-2 rounded-full ${notif.read ? 'bg-gray-50 text-[var(--color-muted)]' : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'}`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm truncate ${notif.read ? 'text-[var(--color-text)] font-medium' : 'text-[var(--color-text)] font-bold'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-[var(--color-muted)] truncate">{notif.body}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="px-6 py-4 bg-gray-50 border-l border-[var(--color-border)] shrink-0">
        <Link href="/notifications" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
          View all →
        </Link>
      </div>
    </Card>
  )
}
