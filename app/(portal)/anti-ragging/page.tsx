import { Phone, ShieldCheck } from 'lucide-react'
import { ReportForm } from '@/components/anti-ragging/ReportForm'
import { HELPLINE } from '@/lib/ragging'

export const metadata = { title: 'Anti-ragging report' }

const WHAT_COUNTS = [
  'Teasing, name-calling or humiliation that makes someone feel unsafe',
  'Forcing someone to do something against their will',
  'Demanding money, belongings or favours',
  'Harassment in group chats or on social media',
]

const NEXT_STEPS = [
  'Your report gets a reference number.',
  'The college anti-ragging committee reviews it.',
  'You are contacted, unless you reported without your name.',
]

export default function AntiRaggingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-24">
      <header className="max-w-2xl">
        <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-[var(--color-ink)] md:text-6xl">
          Report ragging
        </h1>
        <p className="mt-3 text-base text-[var(--color-text-muted)]">
          Ragging is a crime, and you do not have to put up with it. Tell us what happened. You can send the report
          without your name.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ReportForm />
        </div>

        <aside className="space-y-2 lg:col-span-4">
          <section className="rounded-[2rem] bg-[var(--color-primary)] p-6 text-white md:p-7">
            <p className="text-base font-medium text-white/90">Need help right now?</p>
            <a
              href={HELPLINE.tel}
              className="mt-3 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 font-display text-2xl font-extrabold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Phone size={22} aria-hidden /> {HELPLINE.display}
            </a>
            <p className="mt-4 text-sm text-white/90">Free national anti-ragging helpline, open 24 hours.</p>
            <p className="mt-1 text-sm text-white/90">
              Email: <span className="font-semibold">{HELPLINE.email}</span>
            </p>
            <p className="mt-3 text-sm text-white/90">If someone is in immediate danger, call 112.</p>
          </section>

          <section className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-7">
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">What counts as ragging</h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink)]">
              {WHAT_COUNTS.map(t => (
                <li key={t} className="flex gap-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-7">
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">What happens next</h2>
            <ol className="mt-3 space-y-2 text-sm text-[var(--color-ink)]">
              {NEXT_STEPS.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  )
}
