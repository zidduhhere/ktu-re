interface PillsProps<T extends string | number> {
  label: string
  options: { id: T; label: string; ariaLabel?: string }[]
  active: T
  onChange: (id: T) => void
}

export function Pills<T extends string | number>({ label, options, active, onChange }: PillsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o.id}
          type="button"
          aria-pressed={active === o.id}
          aria-label={o.ariaLabel}
          onClick={() => onChange(o.id)}
          className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
            active === o.id ? 'bg-[var(--color-ink)] text-white' : 'bg-[var(--color-surface-accent)] text-[var(--color-ink)] hover:bg-[var(--color-surface-accent-hover)]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
