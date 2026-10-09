import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SemesterTabsProps {
  semesters: number[]
  activeSem: number
  onChange: (n: number) => void
}

export function SemesterTabs({ semesters, activeSem, onChange }: SemesterTabsProps) {
  return (
    <Tabs value={activeSem.toString()} onValueChange={(v) => onChange(Number(v))} className="w-full mb-8">
      <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-6 justify-start border-b border-[var(--color-border)] w-full rounded-none">
        {semesters.map(sem => (
          <TabsTrigger 
            key={sem} 
            value={sem.toString()}
            className="rounded-none border-b-2 border-transparent px-2 py-4 text-sm font-semibold text-[var(--color-muted)] data-[state=active]:border-[var(--color-primary)] data-[state=active]:text-[var(--color-text)] data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-[var(--color-text)] transition-colors focus-visible:ring-0 focus-visible:outline-none"
          >
            Semester {sem}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
