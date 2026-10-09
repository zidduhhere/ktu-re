import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { results } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { computeSgpa, gradeToPoints } from '@/lib/types'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const semesterParam = searchParams.get('semester')

  // Fetch all results to compute CGPA
  const allResults = await db.select().from(results)
    .where(eq(results.studentId, session.studentId)).all()

  const cgpa = computeSgpa(allResults)

  // Filter for requested semester
  const filtered = semesterParam 
    ? allResults.filter(r => r.semester === Number(semesterParam))
    : allResults

  const withComputed = filtered.map(r => ({
    ...r,
    gradePoint: gradeToPoints(r.grade)
  }))

  const sgpa = computeSgpa(withComputed)

  return NextResponse.json({
    results: withComputed,
    sgpa,
    cgpa,
  })
}
