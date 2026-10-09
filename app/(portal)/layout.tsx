import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import { TopHeader } from '@/components/layout/TopHeader'
import { UnreadDot } from '@/components/layout/UnreadDot'
import { ChatbotLauncher } from '@/components/layout/ChatbotLauncher'

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Suspense fallback={<SidebarFallback />}>
        <AppSidebar
          badges={{
            '/notifications': (
              <Suspense fallback={null}>
                <UnreadDot />
              </Suspense>
            ),
          }}
        />
      </Suspense>
      <main className="ml-28 flex-1 p-6 relative max-w-7xl mx-auto flex flex-col">
        <Suspense fallback={<PageSkeleton />}>
          <SessionGate>
            <TopHeader />
            {children}
          </SessionGate>
        </Suspense>
      </main>
      <ChatbotLauncher />
    </div>
  )
}

function SidebarFallback() {
  return (
    <aside
      aria-hidden
      className="fixed left-6 top-1/2 z-50 flex h-[22rem] w-16 -translate-y-1/2 flex-col rounded-[2rem] bg-[var(--color-ink)]"
    />
  )
}

async function SessionGate({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  return <>{children}</>
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="h-9 w-64 rounded-xl bg-[var(--color-primary-light)]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 rounded-2xl bg-white" />
        <div className="h-28 rounded-2xl bg-white" />
        <div className="h-28 rounded-2xl bg-white" />
      </div>
      <div className="h-64 rounded-2xl bg-white" />
    </div>
  )
}
