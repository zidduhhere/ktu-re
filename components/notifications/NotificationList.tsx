'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NotificationRow } from '@/lib/types'
import { FileText, CalendarDays, Bell, CheckCheck } from 'lucide-react'

type Filter = 'all' | 'unread' | 'result' | 'exam' | 'general'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'result', label: 'Results' },
  { id: 'exam', label: 'Exams' },
  { id: 'general', label: 'General' },
]

function dayLabel(date: Date) {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
}

export function NotificationList({ initialNotifications }: { initialNotifications: NotificationRow[] }) {
  const router = useRouter()
  const [notifs, setNotifs] = useState(initialNotifications)
  const [filter, setFilter] = useState<Filter>('all')

  const unreadCount = notifs.filter(n => !n.read).length
  const unreadBy = (type: string) => notifs.filter(n => !n.read && n.type === type).length

  const markAsRead = async (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    router.refresh()
  }

  const markAllRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    await fetch('/api/notifications/read-all', { method: 'PATCH' })
    router.refresh()
  }

  const groups = useMemo(() => {
    const visible = notifs.filter(n => (filter === 'all' ? true : filter === 'unread' ? !n.read : n.type === filter))
    const out: { label: string; items: NotificationRow[] }[] = []
    for (const n of visible) {
      const label = dayLabel(new Date(n.createdAt))
      const last = out[out.length - 1]
      if (last && last.label === label) last.items.push(n)
      else out.push({ label, items: [n] })
    }
    return out
  }, [notifs, filter])

  const summary = [
    { label: 'Results', count: unreadBy('result') },
    { label: 'Exams', count: unreadBy('exam') },
    { label: 'General', count: unreadBy('general') },
  ]

  return (
    <div className="space-y-10">
      {/* Summary */}
      <section className="animate-wipe-in flex min-h-64 flex-col justify-between rounded-[2rem] bg-[var(--color-primary)] p-6 text-white md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-base font-medium text-white/90">Notifications</h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <CheckCheck size={16} aria-hidden /> Mark all as read
            </button>
          )}
        </div>
        <div>
          <div className="flex items-end gap-4">
            <span className="font-display text-[8rem] font-extrabold leading-[0.8] tracking-tighter md:text-[10rem]">{unreadCount}</span>
            <span className="pb-2 font-display text-2xl font-bold leading-tight">
              unread
              <br />
              <span className="text-lg font-medium text-white/90">{unreadCount === 0 ? 'You are all caught up' : 'waiting for you'}</span>
            </span>
          </div>
          {unreadCount > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {summary.filter(s => s.count > 0).map(s => (
                <li key={s.label} className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
                  {s.count} {s.label.toLowerCase()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Filters */}
      <div role="group" aria-label="Filter notifications" className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
              filter === f.id ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-surface-accent)] text-[var(--color-ink)] hover:bg-[var(--color-surface-accent-hover)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {notifs.length === 0 ? (
        <div className="rounded-[2rem] bg-[var(--color-surface-accent)] p-8 md:p-10">
          <p className="font-display text-3xl font-extrabold leading-tight text-[var(--color-ink)]">Nothing here yet</p>
          <p className="mt-2 max-w-md text-base text-[var(--color-text-muted)]">
            New results, exam schedules and announcements from the university will show up here.
          </p>
        </div>
      ) : groups.length === 0 ? (
        <p className="rounded-[2rem] bg-[var(--color-surface-accent)] p-8 text-base text-[var(--color-text-muted)]">No notifications match this filter.</p>
      ) : (
        <div className="space-y-10">
          {groups.map(group => (
            <section key={group.label}>
              <h2 suppressHydrationWarning className="mb-3 font-display text-2xl font-bold text-[var(--color-ink)]">{group.label}</h2>
              <ul className="space-y-1">
                {group.items.map(notif => {
                  const Icon = notif.type === 'result' ? FileText : notif.type === 'exam' ? CalendarDays : Bell
                  const isUnread = !notif.read
                  const time = new Date(notif.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  const row = (
                    <>
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isUnread ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-surface-accent)] text-[var(--color-text-muted)]'}`}>
                        <Icon size={18} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-lg leading-snug text-[var(--color-ink)] ${isUnread ? 'font-bold' : 'font-medium'}`}>
                          {isUnread && <span className="sr-only">Unread: </span>}
                          {notif.title}
                        </span>
                        <span className="mt-0.5 block text-base text-[var(--color-text-muted)]">{notif.body}</span>
                      </span>
                      <span suppressHydrationWarning className="flex shrink-0 items-center gap-3 pt-1 text-sm text-[var(--color-text-muted)]">
                        {time}
                        <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${isUnread ? 'bg-[var(--color-primary)]' : 'bg-transparent'}`} />
                      </span>
                    </>
                  )
                  const base = 'flex w-full items-start gap-4 rounded-[2rem] px-5 py-4 text-left'
                  return (
                    <li key={notif.id}>
                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => markAsRead(notif.id)}
                          title="Mark as read"
                          className={`${base} cursor-pointer bg-[var(--color-surface-accent)] transition-colors hover:bg-[var(--color-surface-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]`}
                        >
                          {row}
                        </button>
                      ) : (
                        <div className={base}>{row}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
