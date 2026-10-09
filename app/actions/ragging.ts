'use server'

import { randomBytes } from 'node:crypto'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { raggingReports } from '@/lib/db/schema'
import { RAGGING_CATEGORIES, type ReportField, type ReportState } from '@/lib/ragging'

function newReference() {
  const code = randomBytes(5).toString('base64url').replace(/[^A-Za-z0-9]/g, '').slice(0, 6).toUpperCase().padEnd(6, '7')
  return `AR-${new Date().getFullYear()}-${code}`
}

export async function submitRaggingReport(_prev: ReportState, formData: FormData): Promise<ReportState> {
  const session = await getSession()
  if (!session) redirect('/login')

  const read = (key: string) => String(formData.get(key) ?? '').trim()
  const values = {
    category: read('category'),
    incidentDate: read('incidentDate'),
    location: read('location'),
    description: read('description'),
    peopleInvolved: read('peopleInvolved'),
    anonymous: formData.get('anonymous') === 'on' ? 'on' : '',
  }

  const errors: Partial<Record<ReportField, string>> = {}

  if (!RAGGING_CATEGORIES.some(c => c.id === values.category)) {
    errors.category = 'Choose what best describes the incident.'
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(values.incidentDate) ? new Date(`${values.incidentDate}T00:00:00`) : null
  if (!date || Number.isNaN(date.getTime())) {
    errors.incidentDate = 'Enter the date it happened.'
  } else if (date.getTime() > Date.now()) {
    errors.incidentDate = 'The date cannot be in the future.'
  }

  if (values.location.length < 2) errors.location = 'Say where it happened, for example the hostel block or classroom.'
  else if (values.location.length > 120) errors.location = 'Keep the location under 120 characters.'

  if (values.description.length < 20) errors.description = 'Describe what happened in at least 20 characters.'
  else if (values.description.length > 2000) errors.description = 'Keep the description under 2000 characters.'

  if (values.peopleInvolved.length > 500) errors.peopleInvolved = 'Keep this under 500 characters.'

  if (Object.keys(errors).length > 0) return { errors, values }

  const anonymous = values.anonymous === 'on'
  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = newReference()
    try {
      db.insert(raggingReports)
        .values({
          reference,
          studentId: anonymous ? null : session.studentId,
          category: values.category,
          incidentDate: values.incidentDate,
          location: values.location,
          description: values.description,
          peopleInvolved: values.peopleInvolved || null,
          anonymous,
          createdAt: new Date().toISOString(),
        })
        .run()
      return { ok: true, reference, anonymous }
    } catch (error) {
      const unique = error instanceof Error && /UNIQUE/i.test(error.message)
      if (!unique || attempt === 2) throw error
    }
  }
  return { errors: {}, values }
}
