import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notifs = await db.select().from(notifications)
    .where(eq(notifications.studentId, session.studentId))
    .orderBy(desc(notifications.createdAt))
    .all()

  return NextResponse.json({ notifications: notifs })
}
