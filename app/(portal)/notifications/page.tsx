import { getSession } from '@/lib/auth'
import { Suspense } from 'react'
import PortalLoading from '../loading'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NotificationList } from '@/components/notifications/NotificationList'

async function NotificationsContent() {
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

export default function NotificationsPage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <NotificationsContent />
    </Suspense>
  )
}
