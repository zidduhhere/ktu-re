import { getSession } from '@/lib/auth'
import { getUnreadCount } from '@/lib/unread'

export async function UnreadDot() {
  const session = await getSession()
  if (!session) return null
  const count = await getUnreadCount(session.studentId)
  if (count === 0) return null

  return (
    <span
      role="status"
      aria-label={`${count} unread notification${count === 1 ? '' : 's'}`}
      className="block h-2.5 w-2.5 rounded-full border-2 border-[var(--color-ink)] bg-[#FF6B5A]"
    />
  )
}
