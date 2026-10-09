'use server'

import { db } from '@/lib/db'
import { students } from '@/lib/db/schema'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

export async function login(
  state: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const studentId = formData.get('studentId') as string
  const password = formData.get('password') as string

  if (!studentId || !password) {
    return { error: 'Both fields are required' }
  }

  const user = await db.select().from(students).where(eq(students.id, studentId)).get()

  if (!user) {
    return { error: 'Invalid credentials' }
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordValid) {
    return { error: 'Invalid credentials' }
  }

  await createSession({
    studentId: user.id,
    name: user.name,
  })

  redirect('/home')
}
