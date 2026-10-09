import { Pills } from './Pills'

interface ExamTypeFilterProps {
  active: string
  onChange: (t: string) => void
}

const TYPES = [
  { id: 'all', label: 'All exams' },
  { id: 'ese', label: 'End semester' },
  { id: 'minor', label: 'Minor' },
  { id: 'major', label: 'Major' },
  { id: 'supply', label: 'Supplementary' },
]

export function ExamTypeFilter({ active, onChange }: ExamTypeFilterProps) {
  return <Pills label="Exam type" options={TYPES} active={active} onChange={onChange} />
}
