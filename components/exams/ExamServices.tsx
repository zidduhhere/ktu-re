import Link from 'next/link'
import { FileText, CheckCircle, SearchCode } from 'lucide-react'
import { KIND_LABEL, type ExamSession } from '@/lib/exam-sessions'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ExamServices({ sessions }: { sessions: ExamSession[] }) {
  if (sessions.length === 0) return null

  return (
    <section aria-labelledby="exam-services" className="space-y-4">
      <h2 id="exam-services" className="font-display text-2xl font-bold text-[var(--color-ink)]">
        Exam services
      </h2>
      <Accordion className="w-full space-y-3">
        {sessions.map(session => (
          <AccordionItem key={session.id} value={session.id} className="rounded-3xl border border-[var(--color-border)] bg-white px-5 shadow-sm border-b">
            <AccordionTrigger className="hover:no-underline py-4 group">
              <div className="flex flex-col items-start gap-1.5 text-left">
                <span className="block text-base font-bold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary)]">{session.title}</span>
                <span className="flex flex-wrap items-center gap-x-2 text-sm text-[var(--color-text-muted)] font-normal">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${session.kind === 'supply' ? 'bg-[#B42318]/10 text-[#B42318]' : 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'}`}>
                    {KIND_LABEL[session.kind]}
                  </span>
                  {session.scheme} &middot; {session.year}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Link
                  href={`/exams/${session.id}/register`}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:text-[var(--color-ink)] group/link"
                >
                  <FileText size={24} className="text-[var(--color-primary)] group-hover/link:text-[var(--color-ink)] transition-colors" />
                  <span className="font-semibold text-sm">Register</span>
                </Link>
                <Link
                  href={`/exams/${session.id}/eligibility`}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:text-[var(--color-ink)] group/link"
                >
                  <CheckCircle size={24} className="text-[var(--color-primary)] group-hover/link:text-[var(--color-ink)] transition-colors" />
                  <span className="font-semibold text-sm">Eligibility</span>
                </Link>
                <Link
                  href={`/exams/${session.id}/review`}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:text-[var(--color-ink)] group/link"
                >
                  <SearchCode size={24} className="text-[var(--color-primary)] group-hover/link:text-[var(--color-ink)] transition-colors" />
                  <span className="font-semibold text-sm text-center">Revaluation / Review</span>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
