'use client'

import { useState } from 'react'
import { ACTION_GROUPS, ACTION_LABEL, type ExamSession, type SessionAction } from '@/lib/exam-sessions'

const BUTTON =
  'cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]'

function tone(action: SessionAction) {
  if (action === 'courses') return 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-hover)]'
  if (action === 'revaluation-status') return 'bg-[#F3E3C3] text-[#5A3E00] hover:bg-[#EDD7A8]'
  return 'bg-white/70 text-[var(--color-ink)] hover:bg-white'
}

export function SessionActions({ session }: { session: ExamSession }) {
  const [notice, setNotice] = useState<string | null>(null)

  return (
    <div className="space-y-5 rounded-[2rem] bg-[var(--color-surface-accent)] p-6 md:p-8">
      {ACTION_GROUPS.map(group => {
        const actions = group.actions.filter(a => session.actions.includes(a))
        if (actions.length === 0) return null
        return (
          <div key={group.label}>
            <h2 className="mb-3 font-display text-xl font-bold text-[var(--color-ink)]">{group.label}</h2>
            <div className="flex flex-wrap gap-2">
              {actions.map(action => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setNotice(`${ACTION_LABEL[action]} isn't connected to this portal yet.`)}
                  className={`${BUTTON} ${tone(action)}`}
                >
                  {ACTION_LABEL[action]}
                </button>
              ))}
            </div>
          </div>
        )
      })}
      {notice && (
        <p role="status" className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-[var(--color-ink)]">
          {notice}
        </p>
      )}
    </div>
  )
}
