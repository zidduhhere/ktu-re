'use client'

import { Palette } from 'lucide-react'

const STORAGE_KEY = 'ktu-theme'

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement
    const next = root.dataset.theme === 'green' ? 'blue' : 'green'
    root.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable (private mode): the theme still applies for this visit
    }
  }

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title="Switch Primary Color"
      className="bg-[var(--color-primary-light)] rounded-full w-11 h-11 flex items-center justify-center hover:opacity-80 transition-opacity text-[var(--color-primary)] shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      <Palette size={18} strokeWidth={2.5} />
    </button>
  )
}
