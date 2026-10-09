import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NotificationList } from '@/components/notifications/NotificationList'

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session) return null

  const notifs = await db.select().from(notifications)
    .where(eq(notifications.studentId, session.studentId))
    .orderBy(desc(notifications.createdAt))
    .all()

  return (
    <div className="mx-auto max-w-4xl pb-24">
      <NotificationList initialNotifications={notifs} />
    </div>
  )
}
