import 'server-only'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'

export async function getUnreadCount(studentId: string): Promise<number> {
  const row = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.studentId, studentId), eq(notifications.read, false)))
    .get()
  return row?.count ?? 0
}
