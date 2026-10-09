'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Lock, Send } from 'lucide-react'
import { submitRaggingReport } from '@/app/actions/ragging'
import { RAGGING_CATEGORIES, type ReportField } from '@/lib/ragging'

const FIELD =
  'w-full rounded-2xl bg-[var(--color-surface-accent)] px-4 py-3 text-base text-[var(--color-ink)] outline-none placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#B42318]'
const LABEL = 'mb-1.5 block text-sm font-semibold text-[var(--color-ink)]'
const HINT = 'mt-1.5 text-sm text-[var(--color-text-muted)]'
const ERROR = 'mt-1.5 text-sm font-medium text-[#B42318]'

const FIELD_LABEL: Record<ReportField, string> = {
  category: 'What happened',
  incidentDate: 'Date',
  location: 'Where it happened',
  description: 'What happened, in your words',
  peopleInvolved: 'People involved',
}

function Form({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(submitRaggingReport, undefined)
  const [count, setCount] = useState(0)

  if (state?.ok) {
    return (
      <div role="status" className="rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
          <CheckCircle2 size={24} aria-hidden />
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-[var(--color-ink)]">Report received</h2>
        <p className="mt-2 max-w-md text-base text-[var(--color-text-muted)]">
          Keep this reference number. You will need it to follow up on your report.
        </p>
        <p className="mt-5 inline-block rounded-2xl bg-white/70 px-5 py-3 font-mono text-2xl font-bold tracking-wide text-[var(--color-ink)]">
          {state.reference}
        </p>
        <p className="mt-5 max-w-md text-sm text-[var(--color-text-muted)]">
          {state.anonymous
            ? 'This report was saved without your name.'
            : 'This report was saved with your register number so you can be contacted.'}{' '}
          This is a demo portal: reports stay in this app and are not forwarded to a college or authority. In a real
          emergency, call the helpline.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Submit another report
          </button>
          <Link
            href="/home"
            className="rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const errors = state && !state.ok ? state.errors : {}
  const values = state && !state.ok ? state.values : {}
  const errorKeys = Object.keys(errors) as ReportField[]

  return (
    <form action={action} noValidate className="space-y-8 rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
      {errorKeys.length > 0 && (
        <div role="alert" className="rounded-2xl bg-[#F3DEDB] p-4 text-sm text-[#7A1A10]">
          <p className="font-semibold">Check {errorKeys.length === 1 ? 'one thing' : `${errorKeys.length} things`} before sending:</p>
          <ul className="mt-1 list-disc pl-5">
            {errorKeys.map(k => (
              <li key={k}>
                <a href={`#${k}`} className="underline underline-offset-2">
                  {FIELD_LABEL[k]}
                </a>
                : {errors[k]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset aria-describedby={errors.category ? 'category-error' : undefined}>
        <legend className={LABEL}>What happened?</legend>
        <div id="category" tabIndex={-1} className="flex flex-wrap gap-2">
          {RAGGING_CATEGORIES.map(c => (
            <label key={c.id} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={c.id}
                defaultChecked={values.category === c.id}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-white peer-checked:bg-[var(--color-ink)] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-primary)]">
                {c.label}
              </span>
            </label>
          ))}
        </div>
        {errors.category && (
          <p id="category-error" className={ERROR}>
            {errors.category}
          </p>
        )}
      </fieldset>

      <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
        <div>
          <label htmlFor="incidentDate" className={LABEL}>
            Date
          </label>
          <input
            id="incidentDate"
            name="incidentDate"
            type="date"
            max={new Date().toLocaleDateString('en-CA')}
            suppressHydrationWarning
            defaultValue={values.incidentDate}
            aria-invalid={!!errors.incidentDate}
            aria-describedby={errors.incidentDate ? 'incidentDate-error' : undefined}
            className={FIELD}
          />
          {errors.incidentDate && (
            <p id="incidentDate-error" className={ERROR}>
              {errors.incidentDate}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="location" className={LABEL}>
            Where it happened
          </label>
          <input
            id="location"
            name="location"
            type="text"
            maxLength={120}
            placeholder="Hostel block, classroom, bus, online group…"
            defaultValue={values.location}
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
            className={FIELD}
          />
          {errors.location && (
            <p id="location-error" className={ERROR}>
              {errors.location}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={LABEL}>
          What happened, in your words
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          maxLength={2000}
          placeholder="What was said or done, how often it has happened, and how it affected you."
          defaultValue={values.description}
          onChange={e => setCount(e.target.value.length)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : 'description-hint'}
          className={`${FIELD} resize-y`}
        />
        {errors.description ? (
          <p id="description-error" className={ERROR}>
            {errors.description}
          </p>
        ) : (
          <p id="description-hint" className={HINT}>
            At least 20 characters. {count > 0 && `${count}/2000`}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="peopleInvolved" className={LABEL}>
          People involved <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
        </label>
        <textarea
          id="peopleInvolved"
          name="peopleInvolved"
          rows={2}
          maxLength={500}
          placeholder="Names, year or branch, if you know them."
          defaultValue={values.peopleInvolved}
          aria-invalid={!!errors.peopleInvolved}
          aria-describedby={errors.peopleInvolved ? 'peopleInvolved-error' : undefined}
          className={`${FIELD} resize-y`}
        />
        {errors.peopleInvolved && (
          <p id="peopleInvolved-error" className={ERROR}>
            {errors.peopleInvolved}
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white/70 p-4">
        <input
          type="checkbox"
          name="anonymous"
          defaultChecked={values.anonymous === 'on'}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-primary)]"
        />
        <span>
          <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
            <Lock size={14} aria-hidden /> Send without my name
          </span>
          <span className="mt-0.5 block text-sm text-[var(--color-text-muted)]">
            Your register number is not saved with the report. If you leave this off, it is saved so you can be contacted.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-primary)] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-70"
        >
          <Send size={18} aria-hidden /> {pending ? 'Sending…' : 'Submit report'}
        </button>
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
          Demo portal: reports are saved in this app only and are not sent to a college or authority.
        </p>
      </div>
    </form>
  )
}

export function ReportForm() {
  const [formKey, setFormKey] = useState(0)
  return <Form key={formKey} onReset={() => setFormKey(k => k + 1)} />
}
