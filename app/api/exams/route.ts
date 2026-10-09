import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { exams } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const semesterParam = searchParams.get('semester')
  const typeParam = searchParams.get('type')

  const query = db.select().from(exams).where(eq(exams.studentId, session.studentId)).$dynamic()

  const allExams = await query.orderBy(asc(exams.date)).all()

  let filtered = allExams
  if (semesterParam) filtered = filtered.filter(e => e.semester === Number(semesterParam))
  if (typeParam && typeParam !== 'all') filtered = filtered.filter(e => e.type === typeParam)

  // Sort: upcoming first, then past
  const now = new Date().toISOString().split('T')[0]
  filtered.sort((a, b) => {
    const aIsPast = a.date < now
    const bIsPast = b.date < now
    if (aIsPast === bIsPast) {
      // Both past or both future: sort by date asc
      return a.date.localeCompare(b.date)
    }
    // Future before past
    return aIsPast ? 1 : -1
  })

  return NextResponse.json({
    exams: filtered,
  })
}
