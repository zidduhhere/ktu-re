import { NextResponse, type NextRequest } from 'next/server'
import { and, desc, eq, like, or, sql } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { results, exams, notifications } from '@/lib/db/schema'

const LIMIT = 5
const MIN_QUERY_LENGTH = 2

function containsPattern(q: string) {
  return `%${q.replace(/[\\%_]/g, '\\$&')}%`
}

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = (request.nextUrl.searchParams.get('q') ?? '').trim().slice(0, 100)
  if (q.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [], exams: [], notifications: [] })
  }

  const pattern = containsPattern(q)
  const ci = (col: Parameters<typeof like>[0]) => sql`${col} LIKE ${pattern} ESCAPE '\\'`

  const [resultRows, examRows, notificationRows] = await Promise.all([
    db.select({
      id: results.id,
      subject: results.subject,
      subjectCode: results.subjectCode,
      semester: results.semester,
      grade: results.grade,
      examType: results.examType,
    })
      .from(results)
      .where(and(eq(results.studentId, session.studentId), or(ci(results.subject), ci(results.subjectCode))))
      .orderBy(desc(results.semester))
      .limit(LIMIT)
      .all(),
    db.select({
      id: exams.id,
      subject: exams.subject,
      subjectCode: exams.subjectCode,
      type: exams.type,
      date: exams.date,
      time: exams.time,
    })
      .from(exams)
      .where(and(eq(exams.studentId, session.studentId), or(ci(exams.subject), ci(exams.subjectCode))))
      .orderBy(desc(exams.date))
      .limit(LIMIT)
      .all(),
    db.select({
      id: notifications.id,
      title: notifications.title,
      body: notifications.body,
      type: notifications.type,
      read: notifications.read,
      createdAt: notifications.createdAt,
    })
      .from(notifications)
      .where(and(eq(notifications.studentId, session.studentId), or(ci(notifications.title), ci(notifications.body))))
      .orderBy(desc(notifications.createdAt))
      .limit(LIMIT)
      .all(),
  ])

  return NextResponse.json({ results: resultRows, exams: examRows, notifications: notificationRows })
}
