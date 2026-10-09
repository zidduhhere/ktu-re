import { db } from './index'
import { students, results, exams, notifications } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('Clearing old data...')
  db.delete(notifications).run()
  db.delete(exams).run()
  db.delete(results).run()
  db.delete(students).run()

  console.log('Seeding student TVE22CS001...')
  const passwordHash = await bcrypt.hash('student123', 10)

  db.insert(students).values({
    id: 'TVE22CS001',
    name: 'Aleena Jaison',
    branch: 'Computer Science and Engineering',
    semester: 5,
    college: 'TKM College of Engineering, Kollam',
    phone: '+91 9876543210',
    passwordHash,
  }).run()

  console.log('Seeding results...')
  const resultData = [
    { studentId: 'TVE22CS001', semester: 1, examType: 'regular', subject: 'Calculus', subjectCode: 'MA101', grade: 'S', credits: 4 },
    { studentId: 'TVE22CS001', semester: 1, examType: 'regular', subject: 'Physics', subjectCode: 'PH100', grade: 'A+', credits: 4 },
    { studentId: 'TVE22CS001', semester: 2, examType: 'regular', subject: 'Chemistry', subjectCode: 'CY100', grade: 'A', credits: 4 },
    { studentId: 'TVE22CS001', semester: 3, examType: 'regular', subject: 'Data Structures', subjectCode: 'CS300', grade: 'F', credits: 4 }, // Failed initially
    { studentId: 'TVE22CS001', semester: 3, examType: 'supply', subject: 'Data Structures', subjectCode: 'CS300', grade: 'B+', credits: 4 }, // Passed in supply
    { studentId: 'TVE22CS001', semester: 5, examType: 'regular', subject: 'Operating Systems', subjectCode: 'CS501', grade: 'A+', credits: 4 },
    { studentId: 'TVE22CS001', semester: 5, examType: 'regular', subject: 'Database Management', subjectCode: 'CS502', grade: 'S', credits: 4 },
  ]
  for (const r of resultData) {
    db.insert(results).values(r).run()
  }

  console.log('Seeding exams...')
  const examData = [
    { studentId: 'TVE22CS001', semester: 5, type: 'ese', subject: 'Operating Systems', subjectCode: 'CS501', date: '2026-11-12', time: '09:30 AM - 12:30 PM', venue: 'Main Hall', hallTicket: 'HT501' },
    { studentId: 'TVE22CS001', semester: 5, type: 'minor', subject: 'Web Programming', subjectCode: 'CS505', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '01:30 PM - 04:30 PM', venue: 'Lab 1', hallTicket: null }, // In 3 days
  ]
  for (const e of examData) {
    db.insert(exams).values(e).run()
  }

  console.log('Seeding notifications...')
  const now = new Date().toISOString()
  const notificationData = [
    { studentId: 'TVE22CS001', title: 'S4 Results Published', body: 'Your S4 B.Tech results are available.', type: 'result', read: false, createdAt: now },
    { studentId: 'TVE22CS001', title: 'Exam Registration', body: 'Register for S5 minor exams before Friday.', type: 'general', read: false, createdAt: now },
    { studentId: 'TVE22CS001', title: 'Hall Ticket Generated', body: 'Hall ticket for CS501 is ready for download.', type: 'exam', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ]
  for (const n of notificationData) {
    db.insert(notifications).values(n).run()
  }

  console.log('Seeding complete.')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
