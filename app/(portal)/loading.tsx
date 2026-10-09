export default function PortalLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="h-9 w-64 rounded-xl bg-[var(--color-primary-light)]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 rounded-2xl bg-[var(--color-surface-accent)]" />
        <div className="h-28 rounded-2xl bg-[var(--color-surface-accent)]" />
        <div className="h-28 rounded-2xl bg-[var(--color-surface-accent)]" />
      </div>
      <div className="h-64 rounded-2xl bg-[var(--color-surface-accent)]" />
    </div>
  )
}
