'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, LayoutDashboard, BarChart2, CalendarDays, Bell, User, ShieldAlert, type LucideIcon } from 'lucide-react'

type PageResult = {
  href: string
  title: string
  icon: LucideIcon
  meta: string
}

const PAGES: PageResult[] = [
  { href: '/home', title: 'Dashboard', icon: LayoutDashboard, meta: 'Overview, stats, and recent updates' },
  { href: '/results', title: 'Academic Results', icon: BarChart2, meta: 'Grades, SGPA, and cumulative performance' },
  { href: '/exams', title: 'Examinations', icon: CalendarDays, meta: 'Schedules, timetables, and hall tickets' },
  { href: '/notifications', title: 'Inbox & Updates', icon: Bell, meta: 'Official announcements and alerts' },
  { href: '/anti-ragging', title: 'Anti-ragging Report', icon: ShieldAlert, meta: 'Report an incident or call the helpline' },
  { href: '/profile', title: 'My Profile', icon: User, meta: 'Personal info, academic details, and security' },
]

export function SearchBar() {
  const router = useRouter()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const trimmed = query.trim().toLowerCase()
  const searchable = trimmed.length > 0

  const rows = searchable 
    ? PAGES.filter(p => p.title.toLowerCase().includes(trimmed) || p.meta.toLowerCase().includes(trimmed))
    : PAGES

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const typing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function go(row: PageResult) {
    setOpen(false)
    setQuery('')
    router.push(row.href)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      if (open) setOpen(false)
      else setQuery('')
      return
    }
    if (!rows.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % rows.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? rows.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      const row = rows[active >= 0 ? active : 0]
      if (row) {
        e.preventDefault()
        go(row)
      }
    }
  }

  const showPanel = open

  return (
    <div ref={containerRef} className="relative w-full sm:w-80">
      <div className="flex items-center rounded-full bg-[var(--color-surface-accent)] py-1 pl-6 pr-1 focus-within:ring-2 focus-within:ring-[var(--color-primary)]">
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-label="Search pages"
          placeholder="Search Pages... (Press '/')"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 border-none bg-transparent text-[15px] font-medium text-[var(--color-ink)] outline-none placeholder:font-normal placeholder:text-[var(--color-text-muted)] [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="button"
          aria-label="Open first match"
          disabled={!rows.length && searchable}
          onClick={() => rows[0] && go(rows[0])}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-ink)] text-white transition-colors hover:bg-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-default disabled:opacity-90"
        >
          <Search size={18} aria-hidden />
        </button>
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-14 z-40 max-h-96 overflow-y-auto rounded-[2rem] bg-white p-3">
          <ul id={listId} role="listbox" aria-label="Pages">
            <li role="presentation">
              <p className="px-3 pb-1 pt-1 text-sm font-semibold text-[var(--color-text-muted)]">Go to</p>
              <ul role="presentation">
                {rows.map((row, index) => {
                  const Icon = row.icon
                  const isActive = index === active
                  return (
                    <li
                      key={row.href}
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={isActive}
                      onPointerMove={() => setActive(index)}
                      onClick={() => go(row)}
                      className={`flex cursor-pointer items-center gap-3 rounded-full px-3 py-2 transition-colors ${isActive ? 'bg-[var(--color-surface-accent)]' : 'hover:bg-[var(--color-zebra)]'}`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-accent)] text-[var(--color-primary)]'}`}>
                        <Icon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[var(--color-ink)]">{row.title}</span>
                        <span className="block truncate text-xs text-[var(--color-text-muted)]">{row.meta}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
          {rows.length === 0 && <p className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">No pages found matching &ldquo;{trimmed}&rdquo;</p>}
        </div>
      )}
    </div>
  )
}
