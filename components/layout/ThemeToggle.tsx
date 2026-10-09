'use client'

import { Palette } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState('blue')

  useEffect(() => {
    const saved = localStorage.getItem('ktu-theme') || 'blue'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'blue' ? 'green' : 'blue'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('ktu-theme', newTheme)
  }

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle Theme" 
      title="Switch Primary Color"
      className="bg-[var(--color-primary-light)] rounded-full w-11 h-11 flex items-center justify-center hover:opacity-80 transition-opacity text-[var(--color-primary)] shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
    >
      <Palette size={18} strokeWidth={2.5} />
    </button>
  )
}
