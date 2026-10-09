import Link from 'next/link'
import { NotificationRow } from '@/lib/types'

export function SidebarNotifications({ notifications }: { notifications: NotificationRow[] }) {
  if (notifications.length === 0) {
    return <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 text-sm text-[var(--color-text-muted)]">Nothing new. Updates from the university will show up here.</p>
  }

  return (
    <div>
      <ul className="space-y-1">
        {notifications.map((n) => (
          <li key={n.id} className="flex gap-3 rounded-2xl px-5 py-3 odd:bg-[var(--color-zebra)]">
            <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-[var(--color-primary)]'}`} />
            <div className="min-w-0">
              <p className={`truncate text-sm text-[var(--color-ink)] ${n.read ? 'font-medium' : 'font-bold'}`}>
                {n.read ? n.title : <><span className="sr-only">Unread: </span>{n.title}</>}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm text-[var(--color-text-muted)]">{n.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/notifications" className="mt-2 inline-block px-5 py-2 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]">
        See all updates
      </Link>
    </div>
  )
}
