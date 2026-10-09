import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.update(notifications)
    .set({ read: true })
    .where(and(
      eq(notifications.studentId, session.studentId),
      eq(notifications.read, false)
    ))
    .run()

  return NextResponse.json({ ok: true })
}
