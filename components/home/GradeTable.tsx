import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ResultWithComputed } from '@/lib/types'

export function GradeTable({ results }: { results: ResultWithComputed[] }) {
  return (
    <Card className="rounded-2xl border-none shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-[var(--color-primary-light)]">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="font-semibold text-[var(--color-primary)]">Code</TableHead>
            <TableHead className="font-semibold text-[var(--color-primary)]">Subject</TableHead>
            <TableHead className="font-semibold text-[var(--color-primary)]">Type</TableHead>
            <TableHead className="font-semibold text-[var(--color-primary)] text-center">Cr.</TableHead>
            <TableHead className="font-semibold text-[var(--color-primary)] text-center">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-[var(--color-muted)]">
                No results published for the current semester.
              </TableCell>
            </TableRow>
          ) : (
            results.map((res) => {
              const isOutstanding = res.grade === 'S' || res.grade === 'A+'
              const isFail = ['F', 'FE', 'AB'].includes(res.grade)
              
              return (
                <TableRow key={res.id} className="border-b-[var(--color-border)] last:border-none hover:bg-gray-50/50">
                  <TableCell className="font-mono text-sm text-[var(--color-muted)]">{res.subjectCode}</TableCell>
                  <TableCell className="font-medium text-[var(--color-text)]">{res.subject}</TableCell>
                  <TableCell>
                    {res.examType === 'supply' ? (
                      <Badge variant="outline" className="text-[var(--color-destructive)] border-[var(--color-destructive)] bg-red-50 text-[10px] font-bold">
                        SUPPLY
                      </Badge>
                    ) : (
                      <span className="text-xs text-[var(--color-muted)] uppercase">{res.examType}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-[var(--color-muted)]">{res.credits}</TableCell>
                  <TableCell className="text-center font-bold">
                    <span className={isOutstanding ? 'text-[var(--color-primary)]' : isFail ? 'text-[var(--color-destructive)]' : 'text-[var(--color-text)]'}>
                      {res.grade}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
