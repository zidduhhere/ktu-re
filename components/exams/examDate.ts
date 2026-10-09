/** Parse a stored "YYYY-MM-DD" exam date as a local calendar date (avoids UTC off-by-one). */
export function parseExamDate(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntil(value: string, from: Date = new Date()): number {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
  return Math.round((parseExamDate(value).getTime() - start) / 86_400_000)
}

export function countdownLabel(days: number): string {
  if (days < 0) return 'Completed'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}
