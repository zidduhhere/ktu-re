// ─── Session ──────────────────────────────────────────────────────────────────
export type SessionPayload = {
  studentId: string
  name: string
  expiresAt: string // ISO string
}

// ─── Grade utilities ──────────────────────────────────────────────────────────
const GRADE_POINTS: Record<string, number> = {
  S: 10,
  'A+': 9,
  A: 8.5,
  'B+': 8,
  B: 7,
  C: 6,
  D: 5,
}

/** KTU grade → grade point. Unlisted grades (F, FE, AB, etc.) → 0 */
export function gradeToPoints(grade: string): number {
  return GRADE_POINTS[grade] ?? 0
}

/** Compute SGPA from result rows. Guards against zero-credit edge case. */
export function computeSgpa(rows: { grade: string; credits: number }[]): number {
  const totalCredits = rows.reduce((sum, r) => sum + r.credits, 0)
  if (totalCredits === 0) return 0
  const weightedSum = rows.reduce((sum, r) => sum + gradeToPoints(r.grade) * r.credits, 0)
  return Math.round((weightedSum / totalCredits) * 100) / 100
}

// ─── Row types (aligned with Drizzle schema) ─────────────────────────────────
export type ResultRow = {
  id: number
  studentId: string
  semester: number
  examType: string
  subject: string
  subjectCode: string
  grade: string
  credits: number
}

export type ResultWithComputed = ResultRow & {
  gradePoint: number
}

export type ExamRow = {
  id: number
  studentId: string
  semester: number
  type: string
  subject: string
  subjectCode: string
  date: string
  time: string
  venue: string
  hallTicket: string | null
}

export type NotificationRow = {
  id: number
  studentId: string
  title: string
  body: string
  type: string
  read: boolean
  createdAt: string
}

export type StudentRow = {
  id: string
  name: string
  branch: string
  semester: number
  college: string
  phone: string
}
