import { SearchBar } from '@/components/home/SearchBar'
import { MessageSquare, Bell } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { students } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUnreadCount } from '@/lib/unread'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export async function TopHeader() {
  const session = await getSession()
  if (!session) return null

  const student = await db.select().from(students).where(eq(students.id, session.studentId)).get()
  if (!student) return null

  const unreadCount = await getUnreadCount(session.studentId)

  const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      <div className="flex-1 hidden md:block">
        {/* Placeholder for future breadcrumbs or page title */}
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
         <div className="flex-1 md:flex-none">
           <SearchBar />
         </div>
         <ThemeToggle />
         <button aria-label="Messages" className="bg-[var(--color-surface-accent)] rounded-full w-11 h-11 flex items-center justify-center hover:bg-[var(--color-surface-accent-hover)] transition-colors text-[var(--color-ink)] shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">
           <MessageSquare size={16} strokeWidth={2.5} />
         </button>
         <Link
           href="/notifications"
           aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
           className="bg-[var(--color-surface-accent)] rounded-full w-11 h-11 flex items-center justify-center hover:bg-[var(--color-surface-accent-hover)] transition-colors text-[var(--color-ink)] relative shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
         >
           <Bell size={16} strokeWidth={2.5} />
           {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#B42318] text-white text-xs font-bold leading-none flex items-center justify-center border-2 border-[var(--color-surface)]">
               {unreadCount > 9 ? '9+' : unreadCount}
             </span>
           )}
         </Link>
         {/* Profile Avatar */}
         <Link href="/profile" aria-label="Your profile" className="w-11 h-11 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center text-sm font-bold tracking-tight shrink-0 cursor-pointer ml-1 hover:bg-[var(--color-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]">
           {initials}
         </Link>
      </div>
    </header>
  )
}
