'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Bot, Construction, SendHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatbotLauncher() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
      <div
        id={panelId}
        role="dialog"
        aria-label="AI assistant"
        className={cn(
          "w-[min(22rem,calc(100vw-3rem))] overflow-hidden rounded-[2rem] bg-[var(--color-surface-accent)] shadow-2xl transition-all duration-300 origin-bottom-right",
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between bg-[var(--color-primary)] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Bot size={18} aria-hidden />
            </span>
            <p className="font-display text-base font-bold">AI assistant</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setOpen(false)
              buttonRef.current?.focus()
            }}
            aria-label="Close assistant"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="px-6 py-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Construction size={26} aria-hidden />
          </span>
          <p className="mt-4 font-display text-2xl font-extrabold leading-tight text-[var(--color-ink)]">Under construction</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            The assistant isn&apos;t ready yet. Soon you&apos;ll be able to ask about your results, exams and deadlines here.
          </p>
        </div>

        <div className="px-4 pb-4">
          <div aria-disabled="true" className="flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-5 pr-1.5 opacity-70">
            <input
              type="text"
              disabled
              aria-label="Message the assistant (not available yet)"
              placeholder="Ask about results, exams…"
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
              <SendHorizontal size={16} aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <div className={cn("absolute transition-all duration-300", open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")}>
          <Bot size={24} aria-hidden />
        </div>
        <div className={cn("absolute transition-all duration-300", open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")}>
          <X size={22} aria-hidden />
        </div>
      </button>
    </div>
  )
}
