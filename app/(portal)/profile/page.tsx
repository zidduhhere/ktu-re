import { getSession } from '@/lib/auth'
import { Suspense } from 'react'
import PortalLoading from '../loading'
import { db } from '@/lib/db'
import { students } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { ChevronRight } from 'lucide-react'

function Field({ label, value, mono, onDark }: { label: string; value: string; mono?: boolean; onDark?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className={`text-sm ${onDark ? 'text-white/85' : 'text-[var(--color-text-muted)]'}`}>{label}</dt>
      <dd className={`mt-1 break-words text-lg font-semibold ${onDark ? 'text-white' : 'text-[var(--color-ink)]'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </dd>
    </div>
  )
}

async function ProfileContent() {
  const session = await getSession()
  if (!session) return null

  const student = await db.select().from(students).where(eq(students.id, session.studentId)).get()
  if (!student) return null

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-24">
      <header>
        <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-[var(--color-ink)] md:text-6xl">
          Your profile
        </h1>
        <p className="mt-3 text-base text-[var(--color-text-muted)]">Personal and academic details, and your account security.</p>
      </header>

      <section className="grid grid-cols-1 gap-2 lg:grid-cols-12">
        <div className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8 lg:col-span-7">
          <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">Personal details</h2>
          <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Full name" value={student.name} />
            <Field label="Register number" value={student.id} mono />
            <Field label="Phone" value={student.phone} />
            <Field label="Email" value={`${student.id.toLowerCase()}@ktu.edu.in`} />
          </dl>
        </div>

        <div className="rounded-[2rem] bg-[var(--color-primary)] p-6 text-white md:p-8 lg:col-span-5">
          <h2 className="font-display text-2xl font-bold">Academic details</h2>
          <dl className="mt-6 space-y-6">
            <Field onDark label="College" value={student.college} />
            <Field onDark label="Programme" value={`B.Tech ${student.branch}`} />
            <Field onDark label="Current semester" value={String(student.semester)} />
          </dl>
        </div>
      </section>

      <section className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold text-[var(--color-ink)]">Security</h2>
        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2">
          {[
            { title: 'Change password', body: 'Update the password you use to sign in.' },
            { title: 'Two-factor authentication', body: 'Add a second step when you sign in.' },
          ].map((a) => (
            <button
              key={a.title}
              type="button"
              className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white/70 p-5 text-left transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span>
                <span className="block text-base font-semibold text-[var(--color-ink)]">{a.title}</span>
                <span className="mt-1 block text-sm text-[var(--color-text-muted)]">{a.body}</span>
              </span>
              <ChevronRight size={20} className="shrink-0 text-[var(--color-text-muted)] transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<PortalLoading />}>
      <ProfileContent />
    </Suspense>
  )
}
