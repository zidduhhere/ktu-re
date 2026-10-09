'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { House, BarChart2, CalendarDays, Bell, LogOut, User } from 'lucide-react'

const NAV = [
  { href: '/home', icon: House, label: 'Dashboard' },
  { href: '/results', icon: BarChart2, label: 'Results' },
  { href: '/exams', icon: CalendarDays, label: 'Exams' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
]

const ITEM =
  'relative flex h-10 w-full items-center gap-3 overflow-hidden rounded-full px-2.5 transition-colors duration-200'
const LABEL =
  'whitespace-nowrap text-sm opacity-0 transition-opacity duration-200 group-hover/sb:opacity-100 group-hover/sb:delay-100 group-focus-within/sb:opacity-100 group-focus-within/sb:delay-100'

function itemTone(active: boolean) {
  return active
    ? 'bg-[var(--color-primary)] text-white font-semibold'
    : 'text-white/75 hover:bg-white/10 hover:text-white'
}

export function AppSidebar({ badges = {} }: { badges?: Record<string, React.ReactNode> }) {
  const activePath = usePathname()

  return (
    <aside className="group/sb fixed left-6 top-1/2 z-50 flex w-16 -translate-y-1/2 flex-col overflow-hidden rounded-[2rem] bg-[var(--color-ink)] px-3 py-4 transition-[width] duration-300 ease-out hover:w-52 focus-within:w-52 motion-reduce:transition-none">
      {/* Logo */}
      <div className="mb-4 flex h-10 items-center gap-3 overflow-hidden pl-1">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white overflow-hidden">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-full w-full object-cover" />
        </span>
        <span className={`${LABEL} font-display text-base font-bold tracking-tight text-white`}>KTU Portal</span>
      </div>

      {/* Main Nav */}
      <nav className="flex w-full flex-col gap-1">
        {NAV.map((item) => {
          const isActive = activePath.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`${ITEM} ${itemTone(isActive)} focus-visible:outline-2 focus-visible:outline-white`}
            >
              <Icon size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
              <span className={LABEL}>{item.label}</span>
              {badges[item.href] && <div className="absolute left-[26px] top-1.5">{badges[item.href]}</div>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="mt-3 flex w-full flex-col gap-1 border-t border-white/15 pt-3">
        <Link
          href="/profile"
          aria-label="Profile"
          aria-current={activePath.startsWith('/profile') ? 'page' : undefined}
          className={`${ITEM} ${itemTone(activePath.startsWith('/profile'))} focus-visible:outline-2 focus-visible:outline-white`}
        >
          <User size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
          <span className={LABEL}>Profile</span>
        </Link>

        <form action="/api/auth/logout" method="POST" className="w-full">
          <button
            type="submit"
            aria-label="Logout"
            className={`${ITEM} cursor-pointer text-left text-white/75 hover:bg-white/10 hover:text-[#FFB4A8] focus-visible:outline-2 focus-visible:outline-[#FFB4A8]`}
          >
            <LogOut size={20} strokeWidth={1.75} className="shrink-0" aria-hidden />
            <span className={LABEL}>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
