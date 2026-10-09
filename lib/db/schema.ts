import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const students = sqliteTable('students', {
  id: text('id').primaryKey(), // e.g. "TVE22CS001"
  name: text('name').notNull(),
  branch: text('branch').notNull(),
  semester: integer('semester').notNull(), // current active semester
  college: text('college').notNull(),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
})

export const results = sqliteTable('results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: text('student_id').notNull().references(() => students.id),
  semester: integer('semester').notNull(),
  examType: text('exam_type').notNull(), // "regular" | "supply"
  subject: text('subject').notNull(),
  subjectCode: text('subject_code').notNull(),
  grade: text('grade').notNull(), // S, A+, A, B+, B, C, D, F, FE, AB
  credits: real('credits').notNull(),
})

export const exams = sqliteTable('exams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: text('student_id').notNull().references(() => students.id),
  semester: integer('semester').notNull(),
  type: text('type').notNull(), // "ese" | "minor" | "major" | "supply"
  subject: text('subject').notNull(),
  subjectCode: text('subject_code').notNull(),
  date: text('date').notNull(), // ISO string
  time: text('time').notNull(),
  hallTicket: text('hall_ticket'),
})

export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: text('student_id').notNull().references(() => students.id),
  title: text('title').notNull(),
  body: text('body').notNull(),
  type: text('type').notNull(), // "result" | "exam" | "general"
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(), // ISO string
})

export const raggingReports = sqliteTable('ragging_reports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  reference: text('reference').notNull().unique(), // e.g. "AR-2026-K7M2QX"
  studentId: text('student_id').references(() => students.id), // null when reported anonymously
  category: text('category').notNull(),
  incidentDate: text('incident_date').notNull(), // YYYY-MM-DD
  location: text('location').notNull(),
  description: text('description').notNull(),
  peopleInvolved: text('people_involved'),
  anonymous: integer('anonymous', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('submitted'),
  createdAt: text('created_at').notNull(), // ISO string
})
